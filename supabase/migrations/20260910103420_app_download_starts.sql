ALTER TABLE public.apps
  ADD COLUMN download_count bigint NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  ADD COLUMN download_count_started_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN release_stage text CHECK (release_stage IN ('alpha', 'beta', 'stable'));

COMMENT ON COLUMN public.apps.download_count IS 'Recorded download starts through the catalog, summed across file variants. No historical backfill or completion/installation claim.';
COMMENT ON COLUMN public.apps.download_count_started_at IS 'New measurement start; no personal data or per-visitor identifiers are collected.';

CREATE FUNCTION public.record_app_download(p_app_id bigint, p_download_url text)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  UPDATE public.apps AS a
  SET download_count = a.download_count + 1
  WHERE a.id = p_app_id
    AND a.platform <> 'PWA'
    AND a.link IS NOT NULL AND a.link <> '#'
    AND (
      a.link = p_download_url
      OR EXISTS (
        SELECT 1 FROM jsonb_array_elements(a.downloads) AS d
        WHERE d->>'url' = p_download_url
      )
    )
    AND (
      p_download_url ~* '\.(apk|zip|dmg|exe|tar\.gz|ipa|pkg)([?#].*)?$'
      OR p_download_url LIKE '%/storage/v1/object/public/binaries/%'
      OR (p_download_url LIKE '[%' AND p_download_url LIKE '%]' AND p_download_url LIKE '%/binaries/%')
    )
  RETURNING a.download_count;
$function$;

REVOKE ALL ON FUNCTION public.record_app_download(bigint, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_app_download(bigint, text) TO anon, authenticated;
COMMENT ON FUNCTION public.record_app_download(bigint, text) IS 'Intentionally public, narrowly scoped atomic increment for a registered installer URL. No arbitrary value, catalog edit or personal analytics access.';
