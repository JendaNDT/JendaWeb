# Ostrov v oblacích (Tower Defense) – webová hra

Veřejná adresa: `/tower-defense/`. Verzované soubory: `/tower-defense/releases/1.0.0-web.1/`.
Hra je 3D izometrická obrana věží (Godot 4.7.2, režim Kompatibilita, bez vláken). Texty jsou česky,
grafika, zvuk i hudba vznikají v kódu, takže stránka nepotřebuje žádné další soubory. Zdroj hry je v
repozitáři `JendaNDT/Tower-Defense`; sem patří jen výsledný export.

`node tests/tower-defense.cjs` ověří hashe všech souborů, gzipovaný WebAssembly, stálou vstupní stránku,
pravidla ve `vercel.json` (přepis na verzi, wasm jako gzip s typem `application/wasm`, neměnné ukládání verzí),
záznam v katalogu a že service worker portfolia hru nekešuje. Nasazení zajišťuje Vercel z Gitu, žádný
server, placená služba ani izolace mezi původy se nepoužívá.

První načtení je asi 11 MB (zabalený wasm 10,1 MB, data 0,4 MB). Verzované soubory se ukládají neměnně,
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

## Jak vznikla verze 1.0.0-web.1
1. V repozitáři hry: `godot --headless --export-release Web` (export do `docs/`), Godot 4.7.2.
2. Do `tower-defense/releases/1.0.0-web.1/` zkopírovat `index.js`, `index.pck`, `index.audio*.js`,
   `index.icon.png`, `index.apple-touch-icon.png`, `index.png` a `index.wasm` zabalit `gzip -9 -n` jako
   `index.wasm.gz`. `index.html` upravit: za `<meta charset>` vložit `<base href="/tower-defense/releases/1.0.0-web.1/">`
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
