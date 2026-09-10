ALTER TABLE public.apps DROP CONSTRAINT apps_platform_check;
ALTER TABLE public.apps ADD CONSTRAINT apps_platform_check
  CHECK (platform IN ('PWA', 'Android', 'Windows', 'macOS', 'Windows / macOS'));
ALTER TABLE public.apps ADD COLUMN downloads jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.apps ADD CONSTRAINT apps_downloads_array_check
  CHECK (jsonb_typeof(downloads) = 'array');
