/* HeartCheck Wise — UX enhancements (presentation only)
   - iframe auto-resize via postMessage (embedding on hospital CMS)
   - eligibility (ASCVD history) visual highlight — does NOT change validation/safety logic
   No network use (CSP connect-src 'none' safe). */
(function (global) {
  'use strict';

  /* ---------- iframe auto-resize ---------- */
  var MSG_HEIGHT = 'bsr-prevent-height';
  var MSG_REQUEST = 'bsr-prevent-request-height';
  function currentHeight() {
    var d = document.documentElement, b = document.body;
    return Math.ceil(Math.max(
      d ? d.getBoundingClientRect().height : 0,
      b ? b.getBoundingClientRect().height : 0
    ));
  }
  function postHeight() {
    try {
      if (global.parent && global.parent !== global) {
        global.parent.postMessage({ type: MSG_HEIGHT, height: currentHeight() }, '*');
      }
    } catch (e) { /* cross-origin parent: ignore */ }
  }
  var scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    (global.requestAnimationFrame || function (f) { return setTimeout(f, 16); })(function () {
      scheduled = false; postHeight();
    });
  }
  global.addEventListener('load', postHeight);
  global.addEventListener('resize', schedule);
  global.addEventListener('message', function (ev) {
    if (ev && ev.data && ev.data.type === MSG_REQUEST) postHeight();
  });
  if ('ResizeObserver' in global) {
    try { new global.ResizeObserver(schedule).observe(document.body); } catch (e) {}
  }

  /* ---------- eligibility (ASCVD history) visual highlight ---------- */
  function initHistory() {
    var sel = document.getElementById('ascvdHistory');
    var card = document.querySelector('.history-card');
    if (!sel || !card) return;
    function sync() {
      card.classList.toggle('eligible-confirmed', sel.value === '0');
      card.classList.toggle('eligible-excluded', sel.value === '1');
    }
    sel.addEventListener('change', function () { sync(); schedule(); });
    sync();
  }

  /* eligibility highlight styles live in css/style.css (linked 'self' stylesheet)
     so the meta CSP style-src 'self' applies them — an injected <style> would be blocked. */

  function boot() { initHistory(); postHeight(); }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);

  global.HeartCheckEnhancements = { postHeight: postHeight, MSG_HEIGHT: MSG_HEIGHT };
})(window);
