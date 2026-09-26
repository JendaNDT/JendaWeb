-- Browser games need not be installable/offline PWAs. Preserve all existing values.
alter table public.apps
  drop constraint apps_platform_check,
  add constraint apps_platform_check check (
    platform = any (array['PWA'::text, 'Android'::text, 'Windows'::text,
      'macOS'::text, 'Windows / macOS'::text, 'Web'::text])
  );
