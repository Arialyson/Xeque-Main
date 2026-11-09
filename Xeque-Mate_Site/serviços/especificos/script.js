// script.js - rolagem suave com offset e reveal usando IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const btn = document.getElementById('btn-scroll');
  const target = document.getElementById('sobre');

  // função de rolagem com offset (considera header fixo)
  function scrollToWithOffset(element) {
    if (!element) return;
    const headerHeight = header ? header.offsetHeight : 0;
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offset = 16; // espaçamento extra
    const targetY = Math.max(elementTop - headerHeight - offset, 0);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  // botão - proteções se elemento existir
  if (btn && target) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToWithOffset(target);
    });
  }

  // REVEAL: IntersectionObserver para animações ao aparecer
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    const obsOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // se for card dentro de .cards, respeite a var --i (stagger) já definida no HTML
          // adiciona classe active para ativar animação (CSS controla delay via --i)
          el.classList.add('active');
          obs.unobserve(el); // anima uma vez
        }
      });
    }, obsOptions);

    reveals.forEach(r => observer.observe(r));
  } else {
    // fallback simples: adiciona active após load
    reveals.forEach(r => r.classList.add('active'));
  }

});
