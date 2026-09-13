# Fyzika pastelkou pro Android — instalace

Balíček `Fyzika-pastelkou-0.1.5-android.7.apk` je alfa pro Android tablety
 a telefony. Vyžaduje 64bitový ARM Android 9 nebo novější a Vulkan.
Funguje bez účtu, internetu, telemetrie a cloudové zálohy.

Nové prostředí nabízí výběr úloh přes celou obrazovku, větší dotykové
ovládání, názornou pomoc a návrat k rozpracovaným pokusům. Učitelský
editor má šest částí práce, mechanické i elektrické prvky, místní
knihovnu a předávání vlastních úloh do dětského výběru.
Verze 0.1.5 přidává jasné **Zpět ke hraní** v editoru a opravuje
přechod čtečky TalkBack do ovládání papíru i oznámení při psaní.
Obsahuje také opravy čitelnosti a většího písma z verze 0.1.4.

Obsahuje 152 definic misí ve 12 kapitolách. Hratelnost 85 nových definic
Atlasu dosud nemá zaznamenané ověření; mohou vyžadovat opravy. Označení
alfa platí dál i po úpravách prostředí.

1. Otevři [Fyziku pastelkou na jenda.cool](https://jenda.cool/#app=fyzika-pastelkou)
   a klepni na **Stáhnout**. APK můžeš také přenést přes USB.
2. Ve správci souborů otevři APK. Pokud Android požádá, povol tomuto
   správci instalaci aplikace; po instalaci lze oprávnění opět odebrat.
3. Při prvním spuštění vyber **Zkus první úlohu** nebo **Chci si kreslit**.
   Prst nebo pero kreslí, dva prsty posouvají a přibližují papír.
   Přehled nástrojů a opakovatelné ukázky jsou v **Menu → Jak si hrát**.
4. **Úlohy** otevřou témata a celou nabídku; při návratu se uchová místo
   v seznamu. **Upravit pokus** vrátí scénu do přípravy a zachová kresbu.
5. Umístění panelu nastavíš v **Menu → Pro dospělé → Poloha ovládání**.
   **Automaticky** přizpůsobí panel dostupné ploše. Ruční polohu si
   aplikace pamatuje; v příliš úzkém okně ji dočasně nahradí spodní panel.

Editor otevři přes **Menu → Pro dospělé → Editor úloh**. V přehledu
najdeš **Moje úlohy · Nová / Kopie**, Zadání, Scénu, Cíle, Nápovědy,
Vyzkoušet a Připravit k hraní. Uložený návrh zůstává rozpracovanou prací;
do dětského výběru se přidá až konkrétní platná verze s ověřeným vítězným
pokusem. Pozdější úpravy návrhu již připravenou verzi potichu nezmění.
**Zpět ke hraní** vrátí dětský papír a ponechá návrh v místní knihovně.

Přes **Soubor** lze uložit kresbu, zálohu profilu, pracovní zálohu
nebo soubor vlastních úloh. Soubor `.fyzika-tasks` přenes na druhé zařízení,
vyber **Otevřít soubor úloh…**, zkontroluj náhled a potvrď výběr.
Na druhém zařízení lze úlohy hrát offline. Dětský profil se v tomto
souboru nepřenáší. Pracovní záloha obsahuje návrhy a rozehrané přípravy;
pro úplnou vlastní zálohu ulož také kresbu a profil.

Práce se ukládá automaticky do soukromého úložiště aplikace. **Uloženo
místně** se ukáže až po potvrzeném zápisu. Před odinstalováním nebo
vymazáním dat práci exportuj; odinstalování místní data odstraní.
Smazanou kresbu lze v mezích kapacity vrátit z **Nedávno smazané**.

Aktualizaci nainstaluj přes stávající release bez odinstalování;
používá původní podpisový klíč. Vývojářský debug balíček má jiný podpis,
při přechodu z něj nejprve exportuj práci. APK je dostupný přímo na
webu, nikoli v obchodě. Fyzický tablet, S Pen, dlaň a sezení s dětmi
mají samostatné neuzavřené brány; emulátor je nenahrazuje.

Licence použitých knihoven jsou v `THIRD-PARTY-NOTICES.txt` vedle APK
 a také uvnitř balíčku v assets. Přiložený `generational-arena-0.2.9.crate`
je původní zdroj této knihovny pod MPL-2.0. Kontrolní součty všech tří
souborů jsou v `SHA256SUMS.txt`; zdrojový kód aplikace zůstává soukromý.
