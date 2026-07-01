/**
 * ALMA Kids — UI liviana para páginas internas.
 * Sin listeners de scroll ni animaciones de altura.
 */
(() => {
  'use strict';

  const mobileMenu = document.querySelector('.simple-mobile-menu');
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.removeAttribute('open'));
    });
    document.addEventListener('click', (event) => {
      if (mobileMenu.hasAttribute('open') && !mobileMenu.contains(event.target)) {
        mobileMenu.removeAttribute('open');
      }
    });
  }

  const search = document.getElementById('faqSearch');
  if (!search) return;

  const cards = [...document.querySelectorAll('.faq-card')];
  const categories = [...document.querySelectorAll('[data-faq-category]')];
  const status = document.getElementById('faqSearchStatus');
  const noResults = document.getElementById('faqNoResults');

  const normalize = (value) =>
    value.toLocaleLowerCase('es-CL')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const filterFAQ = () => {
    const query = normalize(search.value);
    let matches = 0;

    cards.forEach((card) => {
      const visible = !query || normalize(card.textContent).includes(query);
      card.hidden = !visible;
      if (visible) matches += 1;
    });

    categories.forEach((category) => {
      category.hidden = ![...category.querySelectorAll('.faq-card')].some((card) => !card.hidden);
    });

    if (noResults) noResults.hidden = matches !== 0;
    if (status) {
      status.textContent = query
        ? `${matches} ${matches === 1 ? 'respuesta encontrada' : 'respuestas encontradas'}`
        : '';
    }
  };

  search.addEventListener('input', filterFAQ);
  search.addEventListener('search', filterFAQ);
})();
