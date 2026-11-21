(() => {
  const card = document.querySelector('.alma-brand-animation');
  if (!card) return;
  const image = card.querySelector('img');
  const button = card.querySelector('button');
  const poster = image.getAttribute('src');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let playing = false;
  let seen = false;
  function stop() {
    clearTimeout(timer);
    playing = false;
    image.src = poster;
    button.textContent = 'Volver a ver';
    button.setAttribute('aria-pressed', 'false');
  }
  function play() {
    seen = true;
    clearTimeout(timer);
    playing = true;
    image.src = image.dataset.animationSrc;
    button.textContent = 'Detener animación';
    button.setAttribute('aria-pressed', 'true');
  }
  image.addEventListener('load', () => {
    if (playing) {
      clearTimeout(timer);
      timer = setTimeout(stop, 17600); // Una reproducción; luego conserva la marca visible.
    }
  });
  image.addEventListener('error', () => {
    if (playing) stop();
  });
  button.addEventListener('click', () => playing ? stop() : play());
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && playing) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) stop(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !seen) {
          seen = true;
          if (!reducedMotion.matches && !navigator.connection?.saveData) play();
        } else if (!entry.isIntersecting && playing) stop();
      }
    }, { threshold: 0.5 });
    observer.observe(card);
  }
})();
