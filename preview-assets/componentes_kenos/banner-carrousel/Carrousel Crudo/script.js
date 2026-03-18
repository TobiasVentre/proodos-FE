$(document).ready(function () {
  'use strict';

  /* =========================
   *  CONFIG & SELECTORES
   * ========================= */
  const ROOT = '#banner-principal';
  const SEL = {
    slider: `${ROOT} .banner-box`,
    dotsUl: `${ROOT} .slider-dots`,
    dotsBtn: `${ROOT} .slider-dots li button`,
    dotsItem: `${ROOT} .slider-dots li .dot-item`,
    prev: `${ROOT} .prev`,
    next: `${ROOT} .next`,
    container: `${ROOT} .container`,
    slide: `${ROOT} .slider-box`,
    skipBtn: `${ROOT} .btn-saltar-contenido`,
    skipTarget: `#banner-principal-final`,
  };

  let isTransitioning = false; // evita reinicios dobles durante el cambio

  /* =========================
   *  SLICK INIT
   * ========================= */
  const $slider = $(SEL.slider).slick({
    speed: 400,
    autoplaySpeed: 7000,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    infinite: true,
    pauseOnDotsHover: false,
    focusOnChange: false,
    cssEase: 'ease-out',
    dotsClass: 'slider-dots',
    accessibility: true,
    appendDots: $('.slide-m-dots'),
    prevArrow: $(SEL.prev),
    nextArrow: $(SEL.next),
  });

  const slickOpts = $slider.slick('getSlick').options;
  const RING_DURATION_MS = (slickOpts.autoplaySpeed || 7000) + (slickOpts.speed || 400);

  /* =========================
   *  NAVEGACIÓN ARROWS + ARIA
   * ========================= */

  // Maneja el evento de clic en el botón "anterior"
  $(SEL.prev).on('click', announceActiveSlide);

  // Maneja el evento de clic en el botón "siguiente"
  $(SEL.next).on('click', announceActiveSlide);

  // Función para leer el aria-label usando un elemento live
  function ariaLive(message) {
    const $liveRegion = $(SEL.slider);
    $liveRegion.text(message);
  }

  function announceActiveSlide() {
    const $active = $slider.find(`${ROOT} .slick-active`);
    const label = $active.attr('aria-label');
    if (label) ariaLive(label);
  }

  /* HACER QUE EL SLIDE ACTIVO SE LE AGREGUE EL FOCO SOLAMENTE SI EL FOCO ESTÁ EN OTRO SLIDE */
  $(document).on('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const $activeSlide = $(`${SEL.slider} .slick-current`);
    const $focused = $(document.activeElement);
    const isArrowFocused = $focused.hasClass('prev') || $focused.hasClass('next');
    const isSameSlide =
      $focused.closest(`${ROOT} .slick-slide`).get(0) === $activeSlide.get(0);

    if (!isArrowFocused && !isSameSlide) {
      $activeSlide.focus();
    }
  });

  /* =========================
   *  DOTS: REEMPLAZO, A11Y, ENHANCE
   * ========================= */

  /* REEMPLAZAR EL <BUTTON> POR UN <DIV> PARA LOGRAR QUE LOS DOTS NO SEAN FOCUSEABLES */
  document.querySelectorAll(SEL.dotsBtn).forEach((button) => {
    const div = document.createElement('div');
    div.classList.add('dot-item');
    Array.from(button.attributes).forEach((attr) => {
      div.setAttribute(attr.name, attr.value);
    });
    button.parentNode.replaceChild(div, button);
  });

  /* SE LE AGREGA A LOS DOTS TABINDEX=-1 Y ARIA-HIDDEN:TRUE */
  $(SEL.dotsItem).attr({ tabindex: '-1', 'aria-hidden': 'true' });
  

  /* ========= Dots circulares con SVG y número ========= */

// Reemplazar esta función:
function enhanceDots() {
  document.querySelectorAll('#banner-principal .slider-dots li .dot-item').forEach((el, i) => {
    if (el.dataset.enhanced === '1') return;

    // Lee el tamaño real desde CSS (fallback 30)
    const size = parseFloat(getComputedStyle(el).getPropertyValue('--size')) || 30;

    // El trazo más grueso será el activo: 3px (o lee var si la cambiaste en CSS)
    const ringMax =
      parseFloat(getComputedStyle(el).getPropertyValue('--ring-progress-active')) || 3;

    // Radio que respeta 30x30 sin cortar el trazo activo (stroke centrado en el camino)
    const r = (size - ringMax) / 2;
    const c = size / 2;
    const circumf = 2 * Math.PI * r;

    // La duración ya la calculás como antes (RING_DURATION_MS)
    el.style.setProperty('--dur', (window.RING_DURATION_MS || 7400) + 'ms');
    el.style.setProperty('--circumf', circumf);

    el.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">
        <circle class="ring-track"    cx="${c}" cy="${c}" r="${r}"></circle>
        <circle class="ring-progress" cx="${c}" cy="${c}" r="${r}"
                stroke-dasharray="${circumf}" stroke-dashoffset="${circumf}"></circle>
      </svg>
      <span class="dot-label">${i + 1}</span>
    `;

    el.dataset.enhanced = '1';
  });
}


  function getDotByIndex(i) {
    return document.querySelectorAll(`${SEL.dotsUl} li .dot-item`)[i] || null;
  }
  function getRingByIndex(i) {
    const dot = getDotByIndex(i);
    return dot ? dot.querySelector('.ring-progress') : null;
  }
  function getCirc(dot) {
    return parseFloat(getComputedStyle(dot).getPropertyValue('--circumf')) || 100;
  }

  function stopAllRings() {
    document.querySelectorAll(`${SEL.dotsUl} li`).forEach((li) => {
      const dot = li.querySelector('.dot-item');
      const ring = dot && dot.querySelector('.ring-progress');
      if (!dot || !ring) return;
      const c = getCirc(dot);
      li.classList.remove('is-active');
      dot.classList.remove('is-active');
      ring.style.animation = 'none';
      ring.style.strokeDashoffset = c;
    });
  }

  function startRingFor(index) {
    stopAllRings();
    const dot = getDotByIndex(index);
    const ring = getRingByIndex(index);
    if (!dot || !ring) return;
    const c = getCirc(dot);
    dot.classList.add('is-active');
    ring.style.animation = 'none';
    ring.style.strokeDashoffset = c;
    ring.getBoundingClientRect(); // reflow
    ring.style.animation = '';    // dispara @keyframes ring-progress
  }

  function restartActiveRing() {
    const idx = $slider.slick('slickCurrentSlide');
    startRingFor(idx);
  }

  function setDotsPaused(paused) {
    document
      .querySelectorAll(`${SEL.dotsUl} .dot-item`)
      .forEach((dot) => dot.classList.toggle('is-paused', paused));
  }

  // Inicializamos el contenido circular y el estado
  enhanceDots();
  startRingFor($slider.slick('slickCurrentSlide'));

  /* =========================
   *  SLICK HOOKS (SIN DOBLE REINICIO)
   * ========================= */
  $(SEL.slider).on('beforeChange', function (e, slick, current, next) {
    isTransitioning = true;
    startRingFor(next);        // único reinicio: cuando arranca la transición
  });

  $(SEL.slider).on('afterChange', function () {
    isTransitioning = false;   // no reiniciar aquí para evitar micro-corte
  });

  /* =========================
   *  HOVER/FOCUS: PAUSAR Y (A VECES) REINICIAR
   * ========================= */

  /* PAUSA LA ANIMACIÓN DE LOS DOTS CUANDO HAGO HOVER O FOCUS EN LOS SLIDES */
  function pauseDots() { setDotsPaused(true); }

  // Si salimos de hover/blur y NO hay transición en curso, reiniciamos
  function resumeDots() {
    setDotsPaused(false);
    if (!isTransitioning) restartActiveRing();
  }

  // Slides
  document.querySelectorAll(SEL.slide).forEach((el) => {
    el.addEventListener('mouseenter', pauseDots);
    el.addEventListener('mouseleave', resumeDots);
    el.addEventListener('focus', pauseDots);
    el.addEventListener('blur', resumeDots);
  });

  // Arrows
  /* document.querySelectorAll(`${SEL.prev}, ${SEL.next}`).forEach((el) => {
    el.addEventListener('mouseenter', pauseDots);
    el.addEventListener('mouseleave', resumeDots);
    el.addEventListener('focus', pauseDots);
    el.addEventListener('blur', resumeDots);
  }); */

  /* =========================
   *  SKIP LINK
   * ========================= */

  /* FUNCIÓN PARA QUE EL BOTÓN DE SALTAR CONTENIDO VAYA AL FINAL DEL COMPONENTE */
  (function bindSkip() {
    const btn = document.querySelector(SEL.skipBtn);
    const tgt = document.querySelector(SEL.skipTarget);
    if (!btn || !tgt) return;
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') tgt.focus();
    });
    btn.addEventListener('click', function () { tgt.focus(); });
  })();

  /* =========================
   *  ACCESIBILIDAD (ocultar hijos)
   * ========================= */

  /* SE LE AGREGA ARIA-HIDDEN: TRUE A TODOS LOS ELEMENTOS DENTRO DE LOS SLIDE */
  (function hideSlidesChildrenFromA11y() {
    document.querySelectorAll(SEL.slide).forEach((slide) => {
      slide.querySelectorAll('*').forEach((el) => {
        el.setAttribute('aria-hidden', 'true');
      });
    });
  })();
});
