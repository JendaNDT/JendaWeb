# RT Asistent on jenda.cool

Standalone offline application at **https://jenda.cool/rt-asistent/**, imported from RT Asistent Sites commit `eb76458efdc47a6b83b86bf0952ce16a89223e62` (6 September 2026). Calculation logic and the nomogram-first layout are preserved.

## Development and release

Run from this directory with Node.js 22+:

```sh
npm ci
npm test
npm run build
```

Commit the source changes, generated sibling `../rt-asistent/`, and `../vercel.json`. Pushing the repository's production branch deploys the checked-in static files through the existing Vercel integration. The portfolio needs no new build step. `server/worker.js` remains only for historical security tests; it is not deployed or used by the static application.

The build uses `/rt-asistent/` as its base, generates a content-versioned worker, manifest, local assets, CSP and release metadata. It replaces only the sibling output directory. Vercel grants the versioned worker scope `/rt-asistent/`. Keep that trailing slash in shared links. No database, runtime API, login, external fonts or cloud synchronization is used by the RT application.

## Offline use and updates

Open once online and wait for **Aplikace připravena offline**. Install through the browser's app menu if desired. Subsequent launches and calculations use the downloaded copy. Updates require the explicit button in **Offline a zálohy**, then closing all application tabs so the new version can activate. The portfolio's root worker and RT worker keep separate cache prefixes; both must preserve the other's caches.

Jobs, history and CR measurements stay in this browser's local storage. Regularly export JSON backups. Browser storage cleanup, changing browsers or devices can remove or separate local data.

## Moving data from the original address

On the old Sites address, open **Offline a zálohy** and export a JSON backup. On this address import the file, review the preview, and confirm restore. Origins cannot share browser storage; no automatic migration or upload is performed. The original installation is left intact.

The portfolio application card is maintained in `public.apps` in the existing JendaWeb CMS, with an offline fallback in root `data.js`. That listing metadata has no connection to the RT application's local records.
