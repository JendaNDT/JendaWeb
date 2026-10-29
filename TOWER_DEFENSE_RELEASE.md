# Ostrov v oblacích (Tower Defense) – webová hra

Veřejná adresa: `/tower-defense/`. Aktuální verze: `/tower-defense/releases/1.2.0-web.1/` (předchozí `1.1.0-web.1` a `1.0.0-web.1` zůstávají ve složce beze změny).
Hra je 3D izometrická obrana věží (Godot 4.7.2, režim Kompatibilita, bez vláken) se dvěma prostředími (Ostrov v oblacích, sci-fi Vesmírná stanice) a třemi velkými mapami s více branami, rozcestími a kopci. Texty jsou česky,
grafika, zvuk i hudba vznikají v kódu, takže stránka nepotřebuje žádné další soubory. Zdroj hry je v
repozitáři `JendaNDT/Tower-Defense`; sem patří jen výsledný export.

`node tests/tower-defense.cjs` ověří hashe všech souborů, gzipovaný WebAssembly, stálou vstupní stránku,
pravidla ve `vercel.json` (přepis na verzi, wasm jako gzip s typem `application/wasm`, neměnné ukládání verzí),
záznam v katalogu a že service worker portfolia hru nekešuje. Nasazení zajišťuje Vercel z Gitu, žádný
server, placená služba ani izolace mezi původy se nepoužívá.

První načtení je asi 11 MB (zabalený wasm 10,1 MB, data 0,5 MB). Verzované soubory se ukládají neměnně,
stálá stránka `/tower-defense/` se vždy ověřuje znovu. Nová verze = nová složka v `releases/`, přepis ve
`vercel.json` a nový záznam v katalogu; starou složku nemazat ani neměnit.

## Oddělené úložiště (důležité)
Lost Signal i tahle hra běží na stejném původu a oba ukládají do databáze prohlížeče `/userfs`. Emscripten
při ukládání do databáze maže záznamy, které v dané záložce nejsou, takže by při souběžném hraní ve dvou
záložkách jedna hra mohla smazat uložení druhé. Proto má tahle hra vlastní složku
(`config/custom_user_dir_name="OstrovVOblacich"` v projektu hry) a vlastní trvalou cestu v konfiguraci
stránky (`"persistentPaths":["/userfs/OstrovVOblacich"]` v `index.html`) – ukládá se do samostatné databáze
`/userfs/OstrovVOblacich`. Ověřeno v prohlížeči: po uložení voleb existuje jen tato databáze a volby
(režim, obtížnost) přežijí obnovení stránky. Při přípravě nové verze se musí `persistentPaths` do
`index.html` znovu doplnit (export ho nevytváří) a `<base href>` nastavit na novou složku.

## Jak vznikla verze 1.2.0-web.1 (stejně jako dřívější)
1. V repozitáři hry: `godot --headless --export-release Web` (export do `docs/`), Godot 4.7.2.
2. Do `tower-defense/releases/1.2.0-web.1/` zkopírovat `index.js`, `index.pck`, `index.audio*.js`,
   `index.icon.png`, `index.apple-touch-icon.png`, `index.png` a `index.wasm` zabalit `gzip -9 -n` jako
   `index.wasm.gz`. `index.html` upravit: za `<meta charset>` vložit `<base href="/tower-defense/releases/1.2.0-web.1/">`
   a do `GODOT_CONFIG` přidat `"persistentPaths":["/userfs/OstrovVOblacich"]`; stejný soubor je i
   `tower-defense/index.html`.
3. `manifest.json` s velikostmi a SHA-256 všech souborů a hashem rozbaleného wasm.

## Ovládání a omezení
Myš a klávesnice na počítači; na telefonu na šířku dotykem (jeden prst posouvá, dva přibližují a otáčejí,
stavba se potvrzuje tlačítkem, na výšku se hra pozastaví a vyzve k otočení). Hra automaticky sníží kvalitu na
mobilech a omezí rozlišení plátna na dvojnásobek CSS pixelů. Zkoušeno v Chromiu (emulace telefonu, dotykové
události) na Godotu 4.7.2 i 4.6.3. **Nezkoušeno:** skutečný telefon, Safari/iPhone, Firefox.

Záznam v katalogu je `tower-defense/catalog.json` (platforma `Web`, id 36, řazení −5 = nahoře) a stejný řádek je
v `data.js` jako záložní data. Do databáze Supabase se vkládá až po nasazení a ověření adresy.

## Publikace
Nasazeno přes PR #20 (sloučeno jako `47346bca25bcf91a4e669c66e4f2498b2d494ac1`), produkční nasazení Vercelu
bylo READY a alias `jenda.cool` na něj míří. Na živé adrese ověřeno: `/tower-defense` (přesměrování na
`/tower-defense/`), stálá stránka (HTTP 200, `must-revalidate`, `<base>` i `persistentPaths`), `manifest.json`
verze (HTTP 200, neměnné ukládání). Samotný `index.wasm` (gzip, `application/wasm`) jsem na živém webu
neověřil (nástroj by vracel jeho binární obsah); stejné pravidlo jako u Lost Signal, které je ověřené, a
v prohlížeči jsem ho zkoušel nad lokálním serverem s pravidly z `vercel.json`. Záznam `apps` id 36 byl do
databáze vložen až po ověření adresy (počet řádků 32 → 33, ostatní řádky beze změny).

### Verze 1.1.0-web.1
Nasazeno přes PR #22 (sloučeno jako `5df0038c405a382ba6dbaadce7d9d5ff58fb426a`). Náhled větve i produkční nasazení
Vercelu byly READY a alias `jenda.cool` míří na produkční. Na živé adrese ověřeno: `/tower-defense` (přesměrování
na `/tower-defense/`, výsledek HTTP 200), stálá stránka (`must-revalidate`, `<base>` na `releases/1.1.0-web.1/`,
`persistentPaths`), `releases/1.1.0-web.1/manifest.json` (HTTP 200, `immutable`, hash rozbaleného wasm
`fc74679e…` shodný s lokálním). Samotný `index.wasm` na živém webu neověřen z téhož důvodu jako u 1.0.0-web.1;
v prohlížeči byl zkoušen nad lokálním serverem s pravidly z `vercel.json` (hra naběhla z nové verze, vznikla jen
databáze `/userfs/OstrovVOblacich`, volby přežily obnovení stránky, karta je v katalogu). Řádek `apps` id 36
v Supabase aktualizován (text, ikona, čtyři snímky; počet řádků 33, ostatní beze změny). Rekordy ze starých map
zůstávají v prohlížeči nevyužité, nové mapy mají vlastní sekci. Stará složka `1.0.0-web.1` zůstává.

### Verze 1.2.0-web.1
Nově pohled shora (klávesa V, tlačítko; plynulý přechod na sklon 90° se zarovnáním na čtvercovou síť), výraznější
mřížka polí (světlá čára s tmavým lemem) a její trvalé zapnutí (klávesa G, tlačítko). Stejný engine (Godot 4.7.2),
`index.wasm` je beze změny (stejný hash `fc74679e…`), mění se `index.pck` a `index.html`. Nová složka
`releases/1.2.0-web.1/`, přepisy ve `vercel.json`, katalog (text, ikona, pět snímků v `screenshots/tower-defense-web.3/`),
`data.js`, popisky v `apps-music.jsx` a testy ukazují na novou verzi. Řádek `apps` id 36 v Supabase se upravuje až po
sloučení a ověření živé adresy (viz níže, oddíl publikace této verze).
