# Paperlings publication

The author requested publishing both music builds among the applications on jenda.cool.
Version 1.0.0-rc2 is a prerelease. Native Windows and Android device testing remains pending.

- Catalog record: public.apps id 34; matching fallback seed in data.js.
- Detail: https://jenda.cool/#app=paperlings
- Installation page: https://jenda.cool/paperlings/
- Assets: binaries/paperlings-1.0.0-rc2/ with manifest, checksums, licenses and instructions.
- Android installs independently as cool.jenda.paperlings and does not import old progress.
- Both installers were recovered from Lemmings-2026 commit 223105d47a0996e6783085868701b8c6d8068b1b and match the manifest checksums.

## Publication state

Prepared locally; production verification pending. Publish the live catalog record only after
both complete downloads from jenda.cool match the release SHA-256 values. A successful Git
push or a READY deployment alone does not prove that the downloads work.

## Recovery

The source distribution is in JendaNDT/Lemmings-2026 branch downloads/android-1.0.0-rc2.
It holds both installers and web/JendaWeb-Paperlings-rc2.patch. The patch provides the original
installation page and metadata. This publication additionally integrates the normal catalog card.
