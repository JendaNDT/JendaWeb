# GeoReminder 2.7 — stabilizační build CI #196

[Stáhnout instalační APK](https://jenda.cool/binaries/georeminder-2.7-ci196-777d743/GeoReminder-2.7-ci196.apk) · Android 8.0 a novější · 4,5 MB

Sestaveno z větve `fix/stabilizace-etapa-1` repozitáře [JendaNDT/GeoReminder-Android](https://github.com/JendaNDT/GeoReminder-Android/tree/777d7433cb275e2fee79f0d0c32cc736dd618969).

- Verze 2.7, kód verze 19; commit `777d7433cb275e2fee79f0d0c32cc736dd618969`.
- [CI #196](https://github.com/JendaNDT/GeoReminder-Android/actions/runs/34167357127) úspěšně dokončeno: unit testy, release lint, minifikované APK/AAB a všech 10 Android instrumentation testů.
- Toto APK je přímo release artefakt úspěšného CI, následně podepsaný bez změny obsahu aplikace. Obsahuje všechny dosavadní stabilizační opravy a konfiguraci Google Maps.
- Pro přímou instalaci z webu použijte APK. AAB je formát pro distribuci přes obchod.

## Podpis a instalace

Nový trvalý podpis vytvořený se souhlasem vlastníka 8. 9. 2026. Starší instalaci s jiným podpisem nelze přímo aktualizovat; před případnou přeinstalací exportujte důležitá data. Pro další webové aktualizace bude zachován tento podpis.

SHA-256 certifikátu: `a358a95ca4d6fb03c8d60c71487a1e00ce4dcd61254897e1239a39dff03063b0`.
SHA-1 certifikátu pro případné nastavení Maps: `e776ed22344f36c7dae32ef23ff88898e68f92f9`.
Balíček: `cz.jenda.georeminder`.

Po stažení povolte instalaci aplikací z použitého prohlížeče, pokud o to Android požádá.

## Rozsah ověření

Podpis APK a kontrolní součet jsou ověřené. Testy na skutečném telefonu Samsung/One UI, scénáře úspory baterie a funkčnost Google Maps s novým certifikátem ještě vyžadují ověření. Jde o stabilizační sestavení pro stažení z webu, nikoli potvrzení dokončení všech podmínek pro Google Play.

Kontrolní součet instalačního souboru je v [SHA256SUMS.txt](SHA256SUMS.txt).
