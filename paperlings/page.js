(() => {
  const en = {
    tag:'Free · Android rc3 / Windows rc2 · with music',
    intro:'Little paper characters. A big journey home. Dig tunnels, build stairs and guide the whole crowd through 24 puzzle missions.',
    caption:'An actual game screenshot. Four chapters, eight skills and four rotating music tracks.',
    winReq:'Windows 10 / 11 · 64-bit', winDownload:'Download for Windows',
    winInstall:'Extract the ZIP and run Paperlings.exe. Mouse and keyboard controls. The build is unsigned; Windows may display a warning on first launch.',
    androidReq:'Android 7.0 or newer · phones and tablets', androidDownload:'Download for Android',
    androidInstall:'Open the downloaded APK and allow installation when prompted. If you already have rc2, install rc3 over it without uninstalling — your saved progress is preserved. This package does not update the older Lemmings 2026 test app.',
    howTitle:'Every little character needs a plan.',
    how:'Choose a skill and assign it to a character. The others will follow. If your plan goes wrong, slow down time, pause or rewind five seconds. The game is in Czech and works offline.',
    news:'New in Android rc3: updated phone and tablet rendering, an HD viewport and shared grass geometry. The image may look slightly softer on high-resolution displays.',
    music:'Both versions include music. Four tracks rotate between missions. Adjust the volume in Settings → Sound → Music.',
    preview:'This is a prerelease. The packages and shared game files passed checks in the cloud; this version still needs testing on actual Windows and Android devices.',
    checksums:'File checksums', back:'← More apps by Jenda',
    copyright:'Paperlings © 2026 Jenda. Free to play; other rights reserved. Inspired by Lemmings (1991); not affiliated with the original game or its owners.'
  };
  const nodes = [...document.querySelectorAll('[data-text]')];
  const cs = Object.fromEntries(nodes.map(n => [n.dataset.text, n.textContent]));
  function setLanguage(lang) {
    const texts = lang === 'en' ? en : cs;
    document.documentElement.lang = lang;
    document.title = lang === 'en' ? 'Paperlings — a paper puzzle game | jenda.cool' : 'Paperlings — papírová logická hra | jenda.cool';
    nodes.forEach(n => { n.textContent = texts[n.dataset.text]; });
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.querySelector('figure img').alt = lang === 'en' ? 'Origami characters in the first Paperlings mission' : 'Origami postavičky v první misi Paperlings';
  }
  document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
    setLanguage(b.dataset.lang);
    const url = new URL(location.href); url.searchParams.set('lang', b.dataset.lang); history.replaceState(null, '', url);
  }));
  setLanguage(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'cs');
})();
