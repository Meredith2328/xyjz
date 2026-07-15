// Yorushika reproduction - interactions
(function() {
  'use strict';

  // Menu toggle
  function initMenu() {
    var btn = document.querySelector('.drawer__btn');
    if (btn) {
      btn.addEventListener('click', function() {
        document.body.classList.toggle('menu-open');
      });
    }
    var overlay = document.querySelector('.overlay');
    if (overlay) {
      overlay.addEventListener('click', function() {
        document.body.classList.remove('menu-open');
      });
    }
  }

  // Inview animation using IntersectionObserver
  function initInview() {
    var elements = document.querySelectorAll('.inview, .inview_b');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('view');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      elements.forEach(function(el) { observer.observe(el); });
    } else {
      elements.forEach(function(el) { el.classList.add('view'); });
    }
  }

  // YouTube thumbnails for movie section
  function initYouTubeThumbs() {
    var items = document.querySelectorAll('.list--movie li.youtube');
    items.forEach(function(item) {
      var movieBlock = item.querySelector('.block--movie');
      if (movieBlock) {
        var yId = movieBlock.getAttribute('youtubeid');
        if (yId) {
          var url = 'https://i.ytimg.com/vi/' + yId + '/sddefault.jpg';
          var thumb = item.querySelector('.thumb');
          if (thumb) {
            thumb.style.backgroundImage = 'url(' + url + ')';
          }
        }
      }
    });
  }

  // Movie carousel (simple horizontal scroll with arrows)
  function initMovieCarousel() {
    var slider = document.querySelector('.page--home .section--movie .list--movie');
    if (!slider) return;

    var isMobile = window.matchMedia('(max-width: 960px)').matches;
    if (isMobile) {
      // Mobile: just horizontal scroll
      slider.style.overflowX = 'auto';
      slider.style.scrollSnapType = 'x mandatory';
      slider.querySelectorAll('li').forEach(function(li) {
        li.style.scrollSnapAlign = 'center';
      });
      return;
    }

    // PC: simple carousel with prev/next
    var items = slider.querySelectorAll('li');
    if (items.length <= 1) return;

    var scrollAmount = 0;
    var itemWidth = items[0].offsetWidth + 40; // margin

    // Create arrows if not present
    var titArea = document.querySelector('.page--home .section--movie .tit-area');
    if (titArea && !titArea.querySelector('.slick-arrows')) {
      var arrowsWrap = document.createElement('div');
      arrowsWrap.className = 'slick-arrows';
      arrowsWrap.style.cssText = 'position:absolute;top:-163px;right:80px;display:flex;gap:30px;cursor:pointer;';
      
      var prev = document.createElement('p');
      prev.className = 'arrow-prev';
      prev.innerHTML = '<svg width="60" height="12" viewBox="0 0 57.64 11.17" style="fill:#222;transition:fill 0.3s;"><polygon points="57.64 11.18 0 11.18 0 10.18 55.23 10.18 45.76 0.71 46.47 0 57.64 11.18"></polygon></svg>';
      prev.style.cssText = 'cursor:pointer;padding:10px 0;transition:all 0.3s;';
      prev.addEventListener('mouseenter', function() { prev.querySelector('svg').style.fill = '#ACD0D1'; });
      prev.addEventListener('mouseleave', function() { prev.querySelector('svg').style.fill = '#222'; });

      var next = document.createElement('p');
      next.className = 'arrow-next';
      next.innerHTML = '<svg width="60" height="12" viewBox="0 0 57.64 11.17" style="fill:#222;transition:fill 0.3s;"><polygon points="0 11.18 57.64 11.18 57.64 10.18 2.41 10.18 11.88 0.71 11.18 0 0 11.18"></polygon></svg>';
      next.style.cssText = 'cursor:pointer;padding:10px 0;transition:all 0.3s;';
      next.addEventListener('mouseenter', function() { next.querySelector('svg').style.fill = '#ACD0D1'; });
      next.addEventListener('mouseleave', function() { next.querySelector('svg').style.fill = '#222'; });

      prev.addEventListener('click', function() { slider.scrollBy({ left: -itemWidth, behavior: 'smooth' }); });
      next.addEventListener('click', function() { slider.scrollBy({ left: itemWidth, behavior: 'smooth' }); });

      arrowsWrap.appendChild(prev);
      arrowsWrap.appendChild(next);
      titArea.style.position = 'relative';
      titArea.appendChild(arrowsWrap);
    }

    // Make slider horizontally scrollable
    slider.style.overflowX = 'hidden';
    slider.style.display = 'flex';
    slider.style.flexWrap = 'nowrap';
    slider.style.transition = 'transform 0.4s ease';
  }

  // Banner carousel (keyvisual and section--bnr)
  function initBannerCarousel() {
    // Keyvisual banner
    var kvSlider = document.querySelector('.page--home .section--keyvisual .list--bnr');
    if (kvSlider && kvSlider.children.length > 1) {
      initSimpleSlider(kvSlider, 7000);
    }

    // Section banner
    var bnrSlider = document.querySelector('.page--home .section--bnr .list--bnr');
    if (bnrSlider && bnrSlider.children.length > 1) {
      initBnrSlider(bnrSlider);
    }
  }

  function initSimpleSlider(container, interval) {
    var items = container.children;
    var current = 0;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    
    // Create dots
    var dotsWrap = document.createElement('ul');
    dotsWrap.className = 'slick-dots';
    dotsWrap.style.cssText = 'position:absolute;bottom:20px;left:20px;z-index:20;list-style:none;display:flex;gap:8px;';
    
    for (var i = 0; i < items.length; i++) {
      items[i].style.cssText = 'transition:opacity 0.8s ease;position:absolute;top:0;left:0;width:100%;';
      if (i > 0) items[i].style.opacity = '0';
      
      (function(idx) {
        var dot = document.createElement('li');
        dot.style.cssText = 'width:12px;height:12px;border-radius:50%;background:' + (idx === 0 ? '#ACD0D1' : '#F0F0F0') + ';cursor:pointer;transition:background 0.3s;';
        dot.addEventListener('click', function() {
          current = idx;
          updateSlide();
        });
        dotsWrap.appendChild(dot);
      })(i);
    }
    container.appendChild(dotsWrap);

    var dots = dotsWrap.children;

    function updateSlide() {
      for (var i = 0; i < items.length; i++) {
        items[i].style.opacity = i === current ? '1' : '0';
        if (dots[i]) dots[i].style.background = i === current ? '#ACD0D1' : '#F0F0F0';
      }
    }

    setInterval(function() {
      current = (current + 1) % items.length;
      updateSlide();
    }, interval);
  }

  function initBnrSlider(container) {
    var items = container.children;
    var isMobile = window.matchMedia('(max-width: 960px)').matches;
    
    if (isMobile) {
      // Mobile: show 1, autoplay
      container.style.overflow = 'hidden';
      container.style.position = 'relative';
      for (var i = 0; i < items.length; i++) {
        items[i].style.cssText = 'transition:transform 0.6s ease;';
      }
      var current = 0;
      setInterval(function() {
        current = (current + 1) % items.length;
        for (var i = 0; i < items.length; i++) {
          items[i].style.transform = 'translateX(' + ((i - current) * 100) + '%)';
        }
      }, 7000);
    } else {
      // PC: show 3 at a time, horizontal scroll
      container.style.overflowX = 'auto';
      container.style.display = 'flex';
      container.style.flexWrap = 'nowrap';
      container.style.gap = '24px';
      container.style.scrollSnapType = 'x mandatory';
      container.style.paddingBottom = '20px';
      Array.from(items).forEach(function(li) {
        li.style.flex = '0 0 auto';
        li.style.scrollSnapAlign = 'start';
        li.style.width = '400px';
      });

      // Auto-scroll
      var scrollPos = 0;
      setInterval(function() {
        scrollPos += 424;
        if (scrollPos >= container.scrollWidth - container.clientWidth) {
          scrollPos = 0;
        }
        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }, 5000);
    }
  }

  // Scroll indicator hide on scroll
  function initScrollIndicator() {
    var scroll = document.querySelector('.scroll');
    if (scroll) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
          scroll.classList.add('hide');
        } else {
          scroll.classList.remove('hide');
        }
      });
    }
  }

  // Mobile header fixed on scroll
  function initMobileHeader() {
    if (window.matchMedia('(max-width: 960px)').matches) {
      var header = document.querySelector('header');
      window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
          header.classList.add('fixed');
        } else {
          header.classList.remove('fixed');
        }
      });
    }
  }

  // Init all
  document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
    initMenu();
    initInview();
    initYouTubeThumbs();
    initMovieCarousel();
    initBannerCarousel();
    initScrollIndicator();
    initMobileHeader();
  });
})();