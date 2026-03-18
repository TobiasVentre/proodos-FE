function sliderKenos(selector, options = {}) {
  const $container = $(selector);
  if (!$container.length) return;

  const $slider = $container.find('.slider');
  // ensure children divs have .slide
  $slider.children("div").addClass("slide");
  let $slides = $container.find('.slide');
  const $dotsContainer = $container.find('.dots');
  const $prev = $container.find('.prev');
  const $next = $container.find('.next');

  // config
  let config = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    infinite: true,
    gap: 20,
    responsive: [],
    ...options
  };

  let currentIndex = 0; 
  let autoplayInterval = null;
  let baseOffset = 0;
  let slideOuter = 0;

  // Helpers
  function getResponsiveSettings() {
    const width = $(window).width();
    let matched = { slidesToShow: config.slidesToShow, slidesToScroll: config.slidesToScroll };
    (config.responsive || []).forEach(bp => {
      if (width <= bp.breakpoint) {
        matched = { ...matched, ...bp.settings };
      }
    });
    return matched;
  }

  function getClonesCount() {
    const { slidesToShow } = getResponsiveSettings();
    return Math.max(1, Math.ceil(slidesToShow));
  }

  function getBaseIndex() {
    return config.infinite ? getClonesCount() : 0;
  }

  function updateSlideWidths() {
    const { slidesToShow } = getResponsiveSettings();
    const gap = config.gap;
    const containerWidth = $container.width();

    let slideWidth;
    if (Number.isInteger(slidesToShow)) {
      slideWidth = Math.max(0, (containerWidth - gap * (slidesToShow - 1)) / slidesToShow);
    } else {
      slideWidth = containerWidth / slidesToShow;
    }

    $slides.css({
      width: Math.round(slideWidth) + "px",
      "margin-right": gap + "px"
    });

    $slider.find('.slide').last().css('margin-right', '0');

    const $anySlide = $slider.find('.slide').first();
    slideOuter = $anySlide.outerWidth(true);
  }

  function cloneSlides() {
    $slider.find('.clone').remove();

    if (!config.infinite) {
      $slides = $container.find('.slide');
      updateSlideWidths();
      return;
    }

    const clonesCount = getClonesCount();
    const $original = $slider.find('.slide').not('.clone');
    if ($original.length === 0) return;

    const $firstClones = $original.slice(0, clonesCount).clone().addClass('clone');
    const $lastClones = $original.slice(-clonesCount).clone().addClass('clone');

    $slider.prepend($lastClones);
    $slider.append($firstClones);

    $slides = $container.find('.slide');
    updateSlideWidths();
  }

  function setInitialPosition() {
    updateSlideWidths();

    const { slidesToShow } = getResponsiveSettings();
    const startDesktop = parseInt($slider.attr("startDesktop"), 10) || 0;
    const startMobile  = parseInt($slider.attr("startMobile"), 10) || 0;
    const isMobile = $(window).width() < 992;
    const startIndex = isMobile ? startMobile : startDesktop;

    const base = getBaseIndex();
    const gap = config.gap;
    const slideWidth = parseFloat($slides.first().css('width')) || $slides.first().outerWidth();
    const visibleWidth = slideWidth * slidesToShow + gap * (Math.max(0, slidesToShow - 1));
    const containerWidth = $container.width();
    baseOffset = Math.round((containerWidth - visibleWidth) / 2);

    if (isNaN(baseOffset) || baseOffset < 0) baseOffset = 0;

    currentIndex = config.infinite ? base + Math.max(0, startIndex) : Math.max(0, startIndex);

    $slider.css('transition', 'none');
    $slider.css('transform', `translateX(calc(${baseOffset}px - ${slideOuter * currentIndex}px))`);
    setTimeout(() => { $slider.css('transition', 'transform 0.5s ease'); }, 20);
  }

  function updateDots() {
    $dotsContainer.find('.dot').removeClass('active');
    const originalCount = $slider.find('.slide').not('.clone').length;
    if (!originalCount) return;

    const base = getBaseIndex();
    const dotIndex = ((currentIndex - base) % originalCount + originalCount) % originalCount;
    $dotsContainer.find('.dot').eq(dotIndex).addClass('active');
  }

  function createDots() {
    $dotsContainer.empty();
    const originalSlides = $slider.find('.slide').not('.clone');
    for (let i = 0; i < originalSlides.length; i++) {
      $dotsContainer.append(`<span class="dot" data-index="${i}"></span>`);
    }
    updateDots();
    toggleControls();
  }

  function toggleControls() {
    const { slidesToShow } = getResponsiveSettings();
    const originalCount = $slider.find('.slide').not('.clone').length;
    if (originalCount <= slidesToShow) {
      $prev.hide(); $next.hide(); $dotsContainer.hide();
    } else {
      $prev.show(); $next.show(); $dotsContainer.show();
    }
  }

  function updateSlider() {
    $slider.css('transform', `translateX(calc(${baseOffset}px - ${slideOuter * currentIndex}px))`);
    updateDots();

    if (!config.infinite) {
      const { slidesToShow } = getResponsiveSettings();
      const originalCount = $slider.find('.slide').not('.clone').length;
      const maxIndex = Math.max(0, Math.ceil(originalCount - slidesToShow));
      // base for non-infinite = 0
      $prev.prop('disabled', currentIndex <= 0);
      $next.prop('disabled', currentIndex >= maxIndex);
    }
  }

  function nextSlide() {
    const { slidesToScroll, slidesToShow } = getResponsiveSettings();
    const base = getBaseIndex();
    const originalCount = $slider.find('.slide').not('.clone').length;
    const maxIndex = base + Math.max(0, originalCount - Math.ceil(slidesToShow));
    if (config.infinite) {
      currentIndex += slidesToScroll;
    } else {
      currentIndex = Math.min(currentIndex + slidesToScroll, maxIndex);
    }
    updateSlider();
  }

  function prevSlide() {
    const { slidesToScroll } = getResponsiveSettings();
    const base = getBaseIndex();
    if (config.infinite) {
      currentIndex -= slidesToScroll;
    } else {
      currentIndex = Math.max(currentIndex - slidesToScroll, base);
    }
    updateSlider();
  }

  function startAutoplay() {
    stopAutoplay();
    if (config.autoplay) {
      autoplayInterval = setInterval(nextSlide, config.autoplaySpeed);
    }
  }
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function lockButtons() {
    $next.css("pointer-events", "none");
    $prev.css("pointer-events", "none");
    setTimeout(() => {
      $next.css("pointer-events", "auto");
      $prev.css("pointer-events", "auto");
    }, 500);
  }

  $next.on('click', () => { nextSlide(); lockButtons(); });
  $prev.on('click', () => { prevSlide(); lockButtons(); });

  $dotsContainer.on('click', '.dot', function () {
    const index = parseInt($(this).data('index'), 10);
    const base = getBaseIndex();
    currentIndex = base + index;
    updateSlider();
  });

  $slider.on('transitionend', () => {
    if (!config.infinite) return;

    const base = getBaseIndex();
    const totalSlides = $slides.length;
    const originalCount = $slider.find('.slide').not('.clone').length;

    if ($slides.eq(currentIndex).hasClass('clone')) {
      let newIndex;
      if (currentIndex < base) {
        newIndex = originalCount + currentIndex;
      } else if (currentIndex >= totalSlides - base) {
        newIndex = currentIndex - originalCount;
      } else {
        return;
      }
      $slider.css('transition', 'none');
      $slider.find('.clone').remove();
      cloneSlides();
      $slides = $container.find('.slide');
      const $anySlide = $slider.find('.slide').first();
      slideOuter = $anySlide.outerWidth(true);

      currentIndex = newIndex;
      $slider.css('transform', `translateX(calc(${baseOffset}px - ${slideOuter * currentIndex}px))`);
      setTimeout(() => {
        $slider.css('transition', 'transform 0.5s ease');
      }, 20);
    }
  });

  let resizeTimer;
  $(window).on('resize', () => {
    stopAutoplay();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // cleanup and reinit parts
      $slider.find('.clone').remove();
      $slides = $slider.find('.slide').not('.clone');
      cloneSlides();
      updateSlideWidths();
      setInitialPosition();
      createDots();
      updateSlider();
      toggleControls();
      startAutoplay();
    }, 80);
  });

  cloneSlides();
  setInitialPosition();
  createDots();
  updateSlider();
  toggleControls();
  startAutoplay();
}


$(document).ready(function () {
  sliderKenos('#sliderUno', {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    infinite: true,
    gap: 24,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1.2, slidesToScroll: 1 } }
    ]
  });

  sliderKenos('#sliderDos', {
    slidesToShow: 2.3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: false,
    gap: 20,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2.2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1.3, slidesToScroll: 1 } }
    ]
  });
});


//! Cosas que agregar:
//* Funcion Draggable para desktop y mobile
//* Una pausa tipo hover al slider que haga que se pause la animación al poner el cursor encima
//* Si el "infinite" es "false", que no muestre un pedacito de la proxima card, sino que quede a la derecha del todo

//todo Cosas que corregir:
//* Arreglar la generacion de dots