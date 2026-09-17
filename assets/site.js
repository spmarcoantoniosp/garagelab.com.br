/* Liga cada botão ao checkout do seu código, controla o CTA da barra
   e o tamanho do texto. Um arquivo para todas as páginas. */
(function () {
  var mapa = window.CHECKOUTS || {};
  document.querySelectorAll('.js-checkout').forEach(function (a) {
    var url = mapa[a.getAttribute('data-cod')];
    if (url) { a.href = url; } else { a.setAttribute('aria-disabled', 'true'); }
  });

  var capa = document.querySelector('.capa'), topoCta = document.getElementById('topoCta');
  if (capa && topoCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      topoCta.classList.toggle('on', !e[0].isIntersecting);
    }, { rootMargin: '-56px 0px 0px 0px' }).observe(capa);
  }
})();

var base = 19;
function aplica(v) { document.documentElement.style.setProperty('--base', v + 'px'); }
function ajusta(d) { base = Math.min(26, Math.max(16, base + d)); aplica(base); }
function reset() { base = 19; aplica(base); }
