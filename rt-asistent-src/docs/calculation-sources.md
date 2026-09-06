# Podklady a rozsah výpočtů

Revize 2026-09-05.2. Tato dokumentace popisuje implementovaný rozsah, nikoli schválení celé radiografické techniky.

## Geometrie a počet expozic

Podklad: [ISO 17636-1:2022](https://weldcalc.ssab.com/sisStandards/ISO%2017636-1.pdf), čl. 7.6, příloha A a příloha C. Edice ověřena proti [katalogu ISO](https://www.iso.org/standard/78319.html).

Počty jsou diskrétní oblasti nomogramů A.1–A.4. U A.2/A.4 byla ze zdrojových souřadnic odstraněna křivka znázorňující hranici stěny a opraveno číslování. Zdroj v dutině vyžaduje De/2 ≤ SFD < De − t; pro vnější DWSI musí být SFD > De. Eliptická a kolmá DWDI se tímto modulem neposuzují. Zdroj v ose umožňuje jednu panoramatickou expozici.

Souřadnice původního prototypu zůstávají digitalizovaným odečtem. U hranic se počet zaokrouhluje konzervativně podle okolí ±0,001 v t/De a ±0,01 ve svislém poměru; jde o implementační toleranci odečtu, nikoli požadavek normy. Překročení poslední dostupné křivky se zobrazí jako „> N“. To nenahrazuje kontrolu překrytí, IQI a celé geometrie zkoušky.

Geometrická neostrost používá skutečnou vzdálenost hodnoceného povrchu k filmu včetně mezery. U DWSI se f′ a b′ vztahují ke stěně u filmu; u DWDI se počítá i neostrost přivrácené stěny. Pro normové minimum u DWDI se použije vnější průměr. Kontrola minimum f je určena filmu, nikoli celkové neostrosti CR detektoru. Napětí využívá vztahy přílohy C, bez extrapolace nad 1 MV.

## Filmové expoziční diagramy

Podklad: [Waygate / Agfa, Radiographic Film Systems](https://dam.bakerhughes.com/m/15e84aab13c9d73d/original/Radiographic-Film-Systems-Brochure_EN_LR.pdf), str. 14 a 16. Číselné přímky byly odvozeny z vektorových souřadnic PDF a porovnány s vykreslenými popisky. Pořadí kreslení v PDF není pořadím napětí, zejména u D2 a D4; přiřazení bylo opraveno a kontroluje se regresí i monotónností. Počet desetinných míst koeficientu nezvyšuje přesnost grafického podkladu.

Rentgen: ocel, konstantní napětí, Pb fólie, denzita 2, FFD 1 m, G135 při 28 °C a automatický osmiminutový cyklus. Každý film D2–D7 používá vlastní křivky. Hodnoty mezi napětími se interpolují v logaritmu expozice, pouze pokud obě ohraničující křivky pokrývají tloušťku. Rozsah konkrétní nakreslené křivky může být užší než celé osy diagramu. Původní tabulka Seifert a univerzální filmové násobitele nejsou provozními vstupy.

Ir-192: ocel 10–90 mm, Pb fólie, denzita 2, SFD 1 m, filmy D4/D5/D7. Převod Ci·h → GBq·h používá 37; hodiny → minuty 60. Poločas 73,827 dne podle [LNHB](https://www.lnhb.fr/nuclides/Ir-192_tables.pdf). Aktivita se přepočítává k uživatelem zvolenému času expozice; místní časy se převádějí na časový rozdíl v milisekundách. Základní model považuje aktivitu během vlastní expozice za konstantní a od verze 2026-09-06.1 odmítá nové výsledky nad 24 hodin. Jde o produktové omezení tohoto modelu, nikoli požadavek normy. Do 24 hodin se čas liší od přesné integrace rozpadu o méně než 0,5 %; nejistota diagramu a kalibrace tím není omezena. Výpočet tohoto rozdílu a zacházení se starší historií popisuje [záznam oprav](release-fixes.md).

Výrobní diagram není univerzální kalibrace. Vlastní rentgenové E vyžaduje identifikaci podkladu, referenční SFD a potvrzení jeho platnosti pro materiál, film, tloušťku a kV. Proud se neodhaduje ze skrytého výkonu.

## CR

Podklad: [ISO 17636-2:2022, opravená verze 2023-02](https://weldcalc.ssab.com/sisStandards/ISO%2017636-2.pdf), čl. 7.3.1, tabulky 3/4, příloha D a G; [katalog ISO](https://www.iso.org/standard/78320.html).

Implementovány jsou rentgenové oblasti do 1 000 kV pro Fe/Cu/Ni a do 500 kV pro Al/Ti. Cíl závisí na třídě, kV, tloušťce a místě měření. CP I s cílem 80 % je dostupné pouze se sníženým napětím a potvrzenou kvalitou/IQI. Jiné kompenzace nejsou vyhodnocovány. Vyhovující SNR_N není potvrzením IQI, prostorového rozlišení ani přijatelnosti vad.

Nenormalizované SNR se převádí pomocí naměřeného SR_b; rozměr pixelu se automaticky nepovažuje za SR_b. Pro zvětšení nad 1,2 uživatel zadává SR_b obrazu. Měřená data mají obsahovat skutečný proud, čas, FDD, materiál, tloušťku, kV, desku a sestavu, filtraci/fólie, režim skeneru a prodlevu do skenování. Změna parametrů měření vymaže starou naměřenou hodnotu.

Odhad nové expozice vychází z kvantového šumu: E_new = E_ref × (FDD_new/FDD_ref)² × (SNR_N_target/SNR_N_ref)². Ostatní uvedené podmínky musejí zůstat stejné. Fyzikální podklad: [IAEA, Industrial Digital Radiography](https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1561_web.pdf), část 1.3.3. Strukturní šum desky, saturace, rozptyl a další vlivy omezují platnost odhadu. Nová expozice se musí znovu změřit.

Zkušební měření pod cílem lze uložit s výslovným označením; může posloužit k odhadu potřebného zvýšení expozice. Staré odhadové záznamy se nemigrují na skutečná měření. Nové uložené záznamy se při načtení znovu validují a jejich odvozené hodnoty přepočtou.

## Referenční příklady a ověření

| Příklad | Očekávaný výsledek |
|---|---:|
| A.2, B, t/De 0,05, De/SFD 0,5 | 6 expozic |
| A.4, A, stejné poměry | 5 expozic |
| d 1,5 mm, f 490 mm, t 10 mm, mezera 0 / 20 mm | Ug 0,03061 / 0,09184 mm |
| Ir-192, D7, Fe 40 mm, 1 000 GBq k času expozice, SFD 1 m | asi 20 min 43 s |
| Fe 20 mm, 200 kV, 1 m: D7 / D5 / D4 / D3 / D2 | asi 5,2 / 8,1 / 13,6 / 20,9 / 39,6 mA·min |
| CR Fe 40 mm, 400 kV, B, měření ve svaru / HAZ bez zarovnání | SNR_N alespoň 100 / 140 |
| CR reference 4 mA·min, SNR_N 85, požadavek 100, stejná FDD | odhad 5,536 mA·min |

`npm test` ověřuje tyto příklady, hraniční případy, změny vstupů a uchování dat v jsdom. `npm run build` připravuje lokálně distribuovatelný web. Neproběhla fyzická zkouška na radiografickém zařízení.
