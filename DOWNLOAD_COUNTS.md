# Catalog download starts

Measurement starts on 10 September 2026. No reliable historical download events were available, so no history was estimated or imported. The displayed total counts file-download activations through the catalog, aggregated across an app's installer and archive variants. It does not claim completed downloads, installations or unique people; repeated clicks and automated requests can contribute.

`public.apps.download_count` is persistent. The `record_app_download` RPC atomically increments by one only for an existing, live, non-PWA app and its registered downloadable URL. Anonymous visitors cannot set an arbitrary total or edit the catalog through this RPC. It stores no visitor identifiers or private event log. The client sends one request per download activation, with no retry after an ambiguous response. File navigation does not wait for the counter and remains functional during a counter outage. Multipart APK downloads count once per activation, not once per part.

Installable app cards show the count; PWAs and concepts do not. Missing data displays a dash. The tooltip explains the metric and its start date. BomberMan's two primary Windows/Mac choices and secondary portable/ZIP links appear only in its expanded detail.

Fyzika pastelkou is last among live apps and displays “Alfa verze” / “Alpha version” on its card and detail. Its existing database row was updated only in `sort` (21, after the previous maximum) and `release_stage` (`alpha`). Other live apps retain their relative order; installer URLs and app text were preserved. The fallback catalog uses the same placement and badge. Content cache v2 avoids briefly restoring the old cached order or missing stage; shell files use jw-v107.

## Verification

- `node tests/download-counts.cjs`: exercises the shipped card/detail/variant/APK handlers, one request per activation, multipart handling, PWA exclusion, no count on detail opening, and file navigation during a counter failure.
- Site and admin JSX compilation and existing gallery-input checks pass.
- Anonymous-role SQL checks in a rolled-back transaction: valid registered variants increment; PWA and unrelated URLs do not; direct anonymous catalog update affects no rows.
- Eight concurrent anonymous HTTP RPC requests returned eight distinct consecutive totals; an independent API read confirmed all eight persisted. Exactly eight QA starts were subtracted afterward, preserving any unrelated starts.
- Database comparison confirms only Fyzika's order and release stage changed; other app content and relative order are preserved.

Supabase's security advisor reports the new function as intentionally executable by anonymous and authenticated users because it is `SECURITY DEFINER`. This is required for the public counter without giving visitors table-update permissions. Its empty `search_path`, fixed table, registered URL check and increment-only interface constrain that access. See the [advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable). Existing unrelated advisor findings were not changed. This is a public start counter, not authenticated or abuse-proof analytics.

The game and installer binaries are unchanged by this website update.
