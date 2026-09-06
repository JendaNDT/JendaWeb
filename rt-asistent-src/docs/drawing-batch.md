# Číslo výkresu a dávka — 6. září 2026

- Horní kontext výpočtu nově obsahuje nepovinná textová pole Číslo výkresu a Dávka (nejvýše 120 znaků).
- Hodnoty se pamatují v rozepsaném zadání a uloží se do záznamu výpočtu. Historie je zobrazuje, hledá podle nich a při otevření obnovuje původní hodnoty.
- Zálohy obsahují obě pole. Starší záznamy bez těchto údajů zůstávají čitelné a importovatelné; při jejich otevření se pole vyprázdní. Verze formátu záloh zůstává 1.
- Rozložení bylo ověřeno na šířkách 320, 390, 768, 1024 a 1440 px. Úzké zobrazení a zvětšený text skládají pole pod sebe.
- Prošlo 65 automatických testů. Prohlížečová zkouška ověřila uložení bez sítě, obnovení rozepsaných hodnot po načtení, vyhledání, otevření historie a export/načtení zálohy bez duplikátů. Nová pole nemají nalezené axe chyby; aplikace nehlásila JavaScriptové chyby.
- Sestavení samostatného repozitáře i webu mají shodné soubory a verzi `2f2038ecf335d7a4`. Matematický model zůstává stejný.

Instalovanou kopii aktualizujte v panelu Offline a zálohy tlačítkem Vyhledat a stáhnout aktualizaci; po dokončení zavřete všechna okna aplikace a znovu ji spusťte.
