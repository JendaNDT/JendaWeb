# Deployment verification — 6 September 2026

Application release: `cce72fbb32a4eed7`, at `https://jenda.cool/rt-asistent/`.

- 63 automated tests passed: calculations, validation, local storage, backup/restore, keyboard interaction, offline lifecycle, subdirectory registration and portfolio cache isolation.
- Production responses for all 11 released files matched the local SHA-256 values byte for byte. Canonical redirect, application CSP, immutable worker headers and `/rt-asistent/` worker scope passed. Application source is excluded from public hosting.
- Tested from a fresh Chrome profile on the real domain, after opening the portfolio first: root and child workers coexist and retain separate caches. Original website remains available.
- With network disabled: reload, new job and calculation history, CR measurement, JSON export, duplicate restore and additive import passed. All 16 observed application responses came from the offline worker; no runtime worker network requests occurred. These tests used synthetic records in an isolated browser profile.
- An additional local production test stopped the web server and completely restarted Chrome before opening the app offline. Jobs, imported records, CR library and history remained available.
- Manual update check passed on the real domain. Chrome reported no installation errors. Mobile view had no horizontal overflow; the checked data panel had no axe WCAG A/AA violations; no application JavaScript errors occurred.
- Desktop appearance retained the visible nomogram and collapsed geometry diagram.

This verifies the hosting migration. It does not expand the calculation validation scope recorded in the existing source and audit documents. User data on the previous Sites origin requires manual JSON transfer, as described in the README.
