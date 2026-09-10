// Small startup guard, embedded into HTML by build_site.cjs (no extra request).
(() => {
  const panel = document.getElementById('boot-status');
  const message = document.getElementById('boot-message');
  const retry = document.getElementById('boot-retry');
  let ready = false;
  let en = false;
  try { en = localStorage.getItem('jw_lang') === 'en'; } catch (_) {}
  const copy = {
    loading: en ? 'Loading music and applications…' : 'Načítám hudbu a aplikace…',
    failed: en ? 'The page could not finish loading. Check your connection and try again.' : 'Web se nepodařilo načíst. Zkontroluj připojení a zkus to prosím znovu.',
    slow: en ? 'Loading is taking longer than usual. You can wait or try again.' : 'Načítání trvá déle než obvykle. Můžeš počkat nebo to zkusit znovu.',
  };
  message.textContent = copy.loading;
  retry.textContent = en ? 'Try loading again' : 'Zkusit načíst znovu';
  retry.addEventListener('click', () => window.location.reload());
  function showFailure(slow) {
    panel.hidden = false;
    message.textContent = slow ? copy.slow : copy.failed;
    retry.hidden = false;
  }
  function startupError(event) {
    const target = event.target;
    if (!ready && (target === window || target?.hasAttribute?.('data-jw-required'))) showFailure(false);
  }
  window.addEventListener('error', startupError, true);
  const timer = setTimeout(() => { if (!ready) showFailure(true); }, 20000);
  window.__jwBootFailed = () => { clearTimeout(timer); showFailure(false); };
  window.__jwAppReady = () => {
    if (ready) return;
    ready = true;
    clearTimeout(timer);
    window.removeEventListener('error', startupError, true);
    panel.hidden = true;
    // Retire only the previous JSX compiler cache; keep preferences, likes and offline data.
    try {
      for (const key of Object.keys(localStorage)) {
        if (key === 'jw_jsx_version' || key.startsWith('jw_jsx_cache_')) localStorage.removeItem(key);
      }
    } catch (_) {}
  };
})();
