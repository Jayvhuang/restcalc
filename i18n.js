/*
 * i18n.js — Restcalc language switcher (URL-prefix model)
 * Each language is its own URL: EN at "/", ZH at "/zh/...".
 * This script only renders EN / 中文 links from the current pathname.
 * It never swaps in-page text — that lives in the literal HTML of each page.
 */
(function () {
  function inZh() {
    var p = location.pathname.replace(/\/+/g, '/');
    return p.indexOf('/zh') === 0;
  }
  function zhUrl() {
    var p = location.pathname;
    if (inZh()) return p;
    if (p === '/') return '/zh';
    return '/zh' + p;
  }
  function enUrl() {
    var p = location.pathname;
    if (!inZh()) return p;
    var rest = p.slice(3); // strip leading "/zh"
    if (rest === '' || rest === '/') return '/';
    return rest;
  }
  function render() {
    var box = document.getElementById('lang-switch');
    if (!box) return;
    var zh = inZh();
    var tail = location.search + location.hash;
    box.innerHTML =
      '<a href="' + enUrl() + tail + '" class="' + (zh ? '' : 'active') + '">EN</a>' +
      '<a href="' + zhUrl() + tail + '" class="' + (zh ? 'active' : '') + '">中文</a>';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
