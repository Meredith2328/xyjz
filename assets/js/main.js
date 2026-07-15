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

  // Banner carousel - 3 items visible, 7 total, auto-advance, loop
  function initBannerCarousel() {
    var bnrList = document.querySelector('.page--home .section--bnr .list--bnr');
    if (!bnrList || bnrList.children.length < 3) return;

    var items = Array.from(bnrList.children);
    var totalItems = items.length; // 7
    var visibleCount = 3;
    var maxIndex = totalItems - visibleCount; // 4 (positions 0-4)
    var current = 0;
    var gap = 16;

    // Wait for layout to complete, then measure actual item width
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        var containerWidth = bnrList.offsetWidth;
        var itemWidth = (containerWidth - gap * (visibleCount - 1)) / visibleCount;
        
        // Set fixed item widths
        items.forEach(function(item) {
          item.style.flex = '0 0 ' + itemWidth + 'px';
          item.style.width = itemWidth + 'px';
        });

        function scrollToIndex(idx, animate) {
          var offset = idx * (itemWidth + gap);
          bnrList.style.transition = animate !== false ? 'transform 0.6s ease' : 'none';
          bnrList.style.transform = 'translateX(-' + offset + 'px)';
        }

        function next() {
          current++;
          if (current > maxIndex) {
            // Animate to the next position (showing duplicates area), then reset
            current = 0;
            scrollToIndex(0, true);
          } else {
            scrollToIndex(current, true);
          }
          updateDots();
        }

        // Dots
        var dotsWrap = document.createElement('ul');
        dotsWrap.style.cssText = 'display:flex;gap:6px;justify-content:center;list-style:none;padding:10px 0 0;margin:0;';
        for (var i = 0; i <= maxIndex; i++) {
          (function(idx) {
            var dot = document.createElement('li');
            dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + (idx === 0 ? '#6B5B95' : '#ddd') + ';cursor:pointer;transition:background 0.3s;';
            dot.addEventListener('click', function() {
              current = idx;
              scrollToIndex(current, true);
              updateDots();
            });
            dotsWrap.appendChild(dot);
          })(i);
        }
        bnrList.parentElement.appendChild(dotsWrap);

        function updateDots() {
          var dots = dotsWrap.children;
          for (var i = 0; i < dots.length; i++) {
            dots[i].style.background = i === current ? '#6B5B95' : '#ddd';
          }
        }

        // Auto-advance every 4 seconds
        setInterval(next, 4000);
      });
    });
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
    
    // Listen for content rendered by render.js
    window.addEventListener('contentRendered', function() {
      initBannerCarousel();
      initMovieCarousel();
    });
    // Trigger loaded class after a small delay for render.js to complete
    setTimeout(function() { document.body.classList.add('loaded'); }, 200);
    initMenu();
    initInview();
    initYouTubeThumbs();
    initMovieCarousel();
    initBannerCarousel();
    initScrollIndicator();
    initMobileHeader();
  });
})();