ALTER TABLE public.apps DROP CONSTRAINT apps_platform_check;
ALTER TABLE public.apps ADD CONSTRAINT apps_platform_check
  CHECK (platform IN ('PWA', 'Android', 'Windows'));
