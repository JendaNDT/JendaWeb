# Čistě místní provoz – ověření 6. 9. 2026

Sestavení `c8d33ed43b806bf4` používá pouze místní pracovní data. Synchronizace, cloudový režim, fronty a runtime přihlášení byly odstraněny. Výpočetní model zůstává `2026-09-06.1`.

## Ověřeno

- 60 automatických testů: výpočty, sedm typů historie, CR knihovna, formuláře, přístupnost ovládání, zálohy, migrace a offline chování.
- Převod dřívějších účtů uložených v zařízení na místní archivy, včetně dvou archivů se stejným ID a různým obsahem. Původní záznamy ani vazby nebyly přepsány. Odstranění příznaků čekajících zápisů a kurzorů, zachování rozpracované obnovy CR knihovny.
- V Chromiu 152 na Windows: nová zakázka, uložení výpočtu, skutečné CR měření a jeho historie, export JSON, opakovaná obnova bez duplicit a import další zakázky při vypnuté síti.
- Při sledovaném běžném provozu pocházelo všech 17 odpovědí aplikace ze service workeru; worker neprovedl žádný síťový požadavek. Neuložený kontrolní požadavek s dočasným vynecháním workeru při odpojené síti selhal.
- Úplné zavření testovacího prohlížeče, nové spuštění na prázdné kartě, vypnutý preview server a odpojení před navigací. Fungovaly `/` i `/offline`; zakázky, import, historie a CR měření přetrvaly.
- Vyžádaná aktualizace mezi dvěma skutečnými sestaveními: stará verze běžela do kliknutí na tlačítko, nová se stáhla, aktivovala až po zavření starších stránek a zachovala pracovní data. Kontrola aktuální verze i chybové hlášení bez sítě fungují.
- Kontrola instalovatelnosti prohlížeče bez chyb. Nový panel na šířce 390 px bez vodorovného přetečení; axe WCAG A/AA bez nálezů v ověřeném panelu. Během scénáře žádná chyba JavaScriptu.
- Původní serverové API vrací 410 bez čtení účtu, těla požadavku nebo databáze; starý server nemůže přijmout další synchronizovaný zápis po nasazení této verze.

## Převod a použití

Jednou otevřete distribuční adresu s připojením, vyčkejte na přípravu offline kopie a zavřete všechny starší karty i okna aplikace. Po novém otevření má záhlaví stav **Pouze v zařízení**. V panelu **Offline, instalace a zálohy** lze aplikaci nainstalovat. Běžné spuštění uložené aplikace nepotřebuje připojení ani přihlášení.

Výběr místních archivů se zobrazí pouze tehdy, pokud dřívější verze uchovávala více oddělených sad dat. Každý archiv zálohujte samostatně; CR knihovna je společná. Převod zahrnuje data již přítomná v zařízení. Data existující pouze na dřívějším serveru se nestahují a nejsou touto změnou mazána.

Tlačítko **Ověřit připravenost** pouze kontroluje místní soubory. **Vyhledat a stáhnout aktualizaci** výslovně kontaktuje distribuční web; novou verzi použije po zavření oken. Při vypršení přístupu ke stažení nabídne obnovu přístupu k soukromé distribuční stránce. Toto přihlášení neslouží pracovnímu ukládání.

## Meze ověření

Ověření proběhlo v odděleném testovacím profilu bez uživatelských dat. Neobsahuje nativní instalaci na konkrétním iOS/Android zařízení. První získání aplikace vyžaduje internet a oprávněný přístup k soukromému distribučnímu webu. Prohlížeč může provádět vlastní kontrolní požadavky; používá však neměnnou adresu verze workeru a sám tak nepřejde na nové sestavení. Aplikace při práci neodesílá zakázky ani měření.

Externí PDF zdroje nejsou přibalené; vestavěný manuál, grafy, písma a kalkulátory jsou místní. Ruční smazání dat prohlížeče odstraní i pracovní data a offline kopii. Export zálohy do samostatného souboru proto zůstává součástí pracovního postupu.
