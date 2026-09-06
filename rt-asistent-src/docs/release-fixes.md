# Opravy předprodukčního auditu · 6. září 2026

Softwarové nálezy F01–F09 mají implementované opravy a regresní ověření. Původní audit zůstává historickým záznamem; tento dokument popisuje navazující změny. Rozsah použití: interní nástroj kvalifikovaného RT technika nebo malého týmu.

| Nález | Změna | Ověření |
|---|---|---|
| F01 · CR knihovna | IndexedDB ukládá jednotlivá měření transakčně. Ostatní karty dostávají oznámení změn; export čte aktuální databázi. Migrace zachovává měření, aktivní referenci i dřívější smazání. | Souběh uložení/smazání ve dvou kartách, obnova importu, selhání zápisu, zavření a nové spuštění prohlížeče. |
| F02 · Důvěryhodnost historie | Povinné vstupy a typy pro všech sedm výpočtů, soulad formuláře se vstupy, kontrolní přepočet výsledku podle uložené verze. Přenos do kalkulátoru odvozuje formulář z autoritativních vstupů. | Odmítnutí prázdných vstupů/výsledků, změněné tloušťky, vymyšleného výsledku a nepodporované verze. Zálohování původních historických údajů zůstává možné. |
| F03 · Ir‑192 | Model se stálou aktivitou vrací nové výsledky jen do 24 hodin. Delší čas odmítne s vysvětlením. Staré historické výsledky zůstávají čitelné a exportovatelné. | Původní referenční příklad, zákon převrácených čtverců, hranice 24 hodin a odmítnutí příkladu kolem 780 dní. |
| F04 · Souběžný zápis API | Rozdílný obsah se stejným ID vyvolá konflikt v samotné transakci. Celá konfliktní dávka se vrátí zpět, odpověď je 409. Totožný opakovaný zápis je idempotentní. | Vynucený souběh dvou předběžných čtení, kontrola celého rollbacku a opakování s jiným pořadím JSON klíčů. |
| F05 · Závislosti | Aktualizovány Vite, PostCSS, Drizzle a tranzitivní esbuild. Uzamčené závislosti lze čistě nainstalovat. | npm audit: 0 známých zranitelností; testy, sestavení a kontrola migrací. |
| F06 · Ochranné hlavičky | HTML i přesné soubory offline kopie doručuje Worker, aby hosting neobešel ochranné hlavičky. CSP s jednorázovým nonce pro skripty, nosniff, zákaz vložení aplikace do rámce, Referrer-Policy, Permissions-Policy a HSTS. | Testy HTML, statických souborů a chyb API; prohlížeč s produkčním Workerem a offline kopií. |
| F07 · Velká historie | Nejvýše 50 záznamů na stránku, hledání nad celou historií, předpočítaný vyhledávací text. Synchronizace používá přírůstkový kurzor oddělený podle účtu, uložený ve stejné transakci jako stažená data. | 5 001 výpočtů: 50 vykreslených řádků, asi 18 ms otevření v popředí Chrome na testovacím počítači; hledání na konci archivu; přepnutí účtu a restart kurzoru. Nejde o záruku stejného času na jiném zařízení. |
| F08 · Fokus | Před asynchronním zakázáním ovládacího prvku se fokus přesune do panelu a po dokončení vrátí. Escape i Tab obsluhuje aktivní dialog také při ztrátě fokusu. | Neúspěšná změna režimu, návrat na výběr, Escape a obnova fokusu spouštěče v Chrome a jsdom. |
| F09 · Zvětšený text | Záhlaví se zalamuje a počet sloupců odpovídá dostupné šířce i velikosti textu. | Všechny čtyři kalkulátory při 320/390/768/1440 px a 720 px s textem 200 %, bez vodorovného přetékání. |

## Význam omezení Ir‑192

24 hodin je rozsah implementovaného modelu, nikoli předepsaný limit normy ani doporučený čas pro pracoviště. Při poločasu 73,827 dne a λ = ln(2) / T½ dává přesná integrace aktivity čas `−ln(1 − λ × t₀) / λ`. Pro t₀ ≤ 24 hodin se od aproximace `t₀` liší o méně než 0,5 %. Toto srovnání hodnotí jen rozpad zdroje; nejistotu odečtu výrobního diagramu ani vlastnosti konkrétní techniky neodstraňuje. Rozsahy materiálu, tloušťky a filmu nadále platí. Verze výpočtů je `2026-09-06.1`; starší podporovaná historie `2026-09-05.2` se ověřuje v původním rozsahu a při novém použití už musí splnit aktuální omezení.

## Přechod na opravenou aplikaci

1. Stáhnout zálohu do souboru mimo data webu.
2. Zavřít všechny starší karty i instalovaná okna aplikace a otevřít aplikaci online. Vyčkat na připravenost offline kopie. Tím se dokončí aktualizace service workeru.
3. Zkontrolovat počet CR měření a aktivní referenci, poté stáhnout novou zálohu. Původní localStorage snímek knihovny je zachován pro případ obnovy; běžné zápisy již probíhají v IndexedDB.

Chyba trvalého uložení je viditelně označena; dočasné měření lze exportovat před zavřením stránky. Obnovy historie a CR knihovny používají trvalý záznam rozpracované obnovy. Jeho souběžné doplňování se slučuje transakčně a starší dokončení nesmaže novější rozpracovanou obnovu. Neznámé nebo rozporné historické záznamy již uložené v zařízení se nemažou; lze je číst/exportovat, bezpečný import či nové použití ale vyžaduje podporovaný a konzistentní obsah.

## Co zůstává před běžným provozem

Opravy softwaru nenahrazují odborné převzetí na konkrétní sestavě, porovnání s řízenou dokumentací pracoviště, zkoušku na skutečných telefonech a pravidelnou obnovu záloh. Sdílení s druhým reálným produkčním účtem, havarijní obnova produkční databáze a provozní odpovědnosti nebyly tímto zásahem převzaty. Podmínky O01–O07 původního auditu zůstávají k řešení s provozovatelem. Přístup k webu se nerozšiřuje; CR knihovna je nadále společná pro jeden profil prohlížeče, zakázky se oddělují podle zvoleného režimu/účtu.

## Technické podklady

- Hosting doručoval HTML i statické soubory před Workerem a nepřebíral `_headers`. Ověření živé aplikace vedlo k zabalení souborů této malé aplikace přímo do Workeru; soubory zachovávají původní bajty a dostávají hlavičky i při offline uložení.
- Transakce a rollback celé dávky: [Cloudflare D1 batch](https://developers.cloudflare.com/d1/worker-api/d1-database/).
- Nonce v HTTP CSP a jeho převzetí ochrannými skripty platformy: [Cloudflare JavaScript Detections](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/javascript-detections/).
- Radioaktivní rozpad a ostatní zdroje: [podklady výpočtů](calculation-sources.md).
- Automatická sada: `npm test`, zejména `tests/release-fixes.test.mjs`; sestavení `npm run build`; kontrola závislostí `npm audit`; migrace `npm exec drizzle-kit check`.
