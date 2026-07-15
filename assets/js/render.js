// 夏夜将终 - Content renderer
// Reads config.json and dynamically renders all page content
(function() {
  'use strict';
  
  var config = null;
  var BILIBILI_BASE = 'https://www.bilibili.com/video/';
  
  // Load config
  function loadConfig(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/config.json', true);
    xhr.onload = function() {
      if (xhr.status === 200 || xhr.status === 0) {
        config = JSON.parse(xhr.responseText);
        callback();
      }
    };
    xhr.send();
  }

  // Set document title
  function renderTitle() {
    if (!config) return;
    var pageTitle = document.title.split('|')[0].trim();
    if (pageTitle && pageTitle !== '夏夜将终 OFFICIAL SITE') {
      document.title = pageTitle + ' | ' + config.site.name;
    } else {
      document.title = config.site.name;
    }
  }

  // Render header logo
  function renderHeader() {
    if (!config) return;
    var logo = document.querySelector('header .logo a');
    if (logo) {
      logo.href = '/';
      logo.innerHTML = '<img src="/assets/img/avatar.jpg" alt="' + config.site.name + '" class="logo-img">';
    }
    var fcLogo = document.querySelector('header .fc-logo');
    if (fcLogo) fcLogo.remove();
  }

  // Render drawer navigation
  function renderDrawer() {
    if (!config) return;
    var drawer = document.querySelector('.drawer .g-nav');
    if (!drawer) return;
    var navItems = [
      { label: 'TOP', href: '/' },
      { label: 'NEWS', href: '/news.html' },
      { label: 'LIVE', href: '/live.html' },
      { label: 'MOVIE', href: '/movie.html' },
      { label: 'DISCOGRAPHY', href: '/discography.html' },
      { label: 'LYRICS', href: '/lyrics.html' },
      { label: 'SPECIAL', href: '/special.html' },
      { label: 'BIOGRAPHY', href: '/biography.html' },
      { label: 'WORKS', href: '/works.html' },
      { label: 'BILIBILI', href: config.social.bilibili, target: '_blank', icon: true },
      { label: 'CONTACT', href: '/contact.html' }
    ];
    drawer.innerHTML = navItems.map(function(item) {
      var cls = '';
      // Highlight current page
      var currentPath = location.pathname.split('/').pop() || 'index.html';
      var itemPath = item.href.split('/').pop();
      if (currentPath === itemPath || (currentPath === '' && itemPath === 'index.html')) {
        cls = 'active';
      }
      var icon = item.icon ? '<i class="fa fa-external-link" style="margin-left:6px;font-size:10px;"></i>' : '';
      var target = item.target ? ' target="' + item.target + '"' : '';
      return '<li class="' + cls + '"><a href="' + item.href + '"' + target + '><span>' + item.label + icon + '</span></a></li>';
    }).join('');
  }

  // Render SNS links
  function renderSNS() {
    if (!config) return;
    var snsLists = document.querySelectorAll('.list--sns');
    var snsHTML = '<li><a href="' + config.social.bilibili + '" target="_blank"><i class="fa fa-youtube-play" aria-hidden="true"></i></a></li>';
    snsLists.forEach(function(list) {
      list.innerHTML = snsHTML;
    });
  }

  // Render SNS float button
  function renderSNSFloat() {
    if (!config) return;
    if (document.querySelector('.sns-float')) return;
    var btn = document.createElement('div');
    btn.className = 'sns-float';
    btn.innerHTML = '<a href="' + config.social.bilibili + '" target="_blank"><img src="/assets/img/avatar.jpg" alt="Bilibili"><span>Bilibili</span></a>';
    document.body.appendChild(btn);
  }

  // Render footer
  function renderFooter() {
    if (!config) return;
    // Footer banners - always render on all pages
    var footerBnr = document.querySelector('footer .block--footer-bnr .list--bnr');
    if (footerBnr) {
      footerBnr.innerHTML = config.footerBanners.map(function(b) {
        return '<li><a href="' + b.link + '" target="' + (b.target || '_self') + '"><img src="' + b.img + '" alt="' + b.alt + '"></a></li>';
      }).join('');
    }
    // Copyright
    var copyright = document.querySelector('footer .copyright');
    if (copyright) {
      copyright.innerHTML = '<small>© ' + config.site.nameCN + ' All Rights Reserved.</small>';
    }
  }

  // Render key visual (home page)
  function renderKeyVisual() {
    if (!config) return;
    var kv = document.querySelector('.keyvisual');
    if (kv) {
      kv.style.backgroundImage = 'url(/assets/img/top/kv.jpg)';
    }
    var bg = document.querySelector('.bg span');
    if (bg) {
      bg.style.backgroundImage = 'url(/assets/img/top/bg.jpg)';
    }
    /* keyvisual logo-main removed - logo is in header */
  }

  // Render banner carousel (home page)
  function renderBanners() {
    if (!config) return;
    var bnrList = document.querySelector('.section--bnr .list--bnr');
    if (!bnrList) return;
    var bnrHTML = config.discography.map(function(d) {
      var link = d.bvid ? BILIBILI_BASE + d.bvid : '#';
      return '<li><a href="' + link + '" target="_blank"><img src="' + d.cover + '" alt="' + d.title + '"></a></li>';
    }).join('');
    // Duplicate items for seamless infinite loop
    bnrList.innerHTML = bnrHTML + bnrHTML;
  }

  // Render news (home page - 3 items, news page - all)
  function renderNews() {
    if (!config) return;
    var newsList = document.querySelector('.section--news .list--news');
    if (!newsList) return;
    var items = document.body.classList.contains('page--home') ? config.news.slice(0, 3) : config.news;
    newsList.innerHTML = items.map(function(n) {
      var link = n.bvid ? BILIBILI_BASE + n.bvid : '/news.html';
      return '<li class="inview new"><a href="' + link + '" target="' + (n.bvid ? '_blank' : '_self') + '"><p class="date">' + n.date + '<span class="category">' + n.category + '</span></p><p class="tit">' + n.title + '</p></a></li>';
    }).join('');
  }

  // Render news list page
  function renderNewsList() {
    if (!config) return;
    var newsList = document.querySelector('.section--list .list--news');
    if (!newsList) return;
    newsList.innerHTML = config.news.map(function(n) {
      var link = n.bvid ? BILIBILI_BASE + n.bvid : '#';
      return '<li class="inview"><a href="' + link + '" target="' + (n.bvid ? '_blank' : '_self') + '" class="clearfix"><p class="date">' + n.date + '<span class="category">' + n.category + '</span></p><p class="tit">' + n.title + '</p></a></li>';
    }).join('');
  }

  // Render live list page
  function renderLiveList() {
    if (!config) return;
    var liveList = document.querySelector('.section--list .list--news');
    if (!liveList || !document.body.classList.contains('page--live')) return;
    liveList.innerHTML = config.live.map(function(l) {
      var link = l.bvid ? BILIBILI_BASE + l.bvid : '#';
      return '<li class="inview"><a href="' + link + '" target="' + (l.bvid ? '_blank' : '_self') + '" class="clearfix"><p class="date">' + l.date + '<span class="week">' + (l.week || '') + '</span></p><p class="tit">' + l.title + '</p></a></li>';
    }).join('');
  }

  // Render movie section (home page and movie page)
  function renderMovies() {
    if (!config) return;
    var movieList = document.querySelector('.section--movie .list--movie') || document.querySelector('.section--list .list--movie');
    if (!movieList) return;
    // Build a map of bvid -> cover from discography
    var coverMap = {};
    config.discography.forEach(function(d) {
      if (d.bvid) coverMap[d.bvid] = d.cover;
    });
    movieList.innerHTML = config.movies.map(function(m) {
      var cover = coverMap[m.bvid] || ('https://i2.hdslb.com/bfs/archive/' + m.bvid + '.jpg');
      return '<li class="inview youtube">' +
        '<a href="' + BILIBILI_BASE + m.bvid + '" target="_blank">' +
        '<figure class="thumb" style="background-image:url(\'' + cover + '\');">' +
        '<img src="/assets/img/common/dummy.png" style="display:none;">' +
        '<div class="block--text pc">' +
        '<p class="icon-play"><span><svg width="20" height="24" viewBox="0 0 24.67 28.45"><path fill="white" d="M22.67,14.22,1,1.73v25l21.67-12.5m2,0L0,28.45V0Z"></path></svg></span></p>' +
        '<p class="tit">' + m.title + '</p>' +
        '</div>' +
        '<p class="icon-play sp"><span><svg width="20" height="24" viewBox="0 0 24.67 28.45"><path fill="white" d="M22.67,14.22,1,1.73v25l21.67-12.5m2,0L0,28.45V0Z"></path></svg></span></p>' +
        '</figure>' +
        '<p class="sp">' + m.title + '</p>' +
        '</a></li>';
    }).join('');
  }

  // Add MOVIE section arrows (NEXT/PREV)
  function addMovieArrows() {
    var titArea = document.querySelector('.page--home .section--movie .tit-area');
    if (!titArea || titArea.querySelector('.movie-arrows')) return;
    var arrows = document.createElement('div');
    arrows.className = 'movie-arrows';
    arrows.innerHTML = 
      '<div class="arrow-btn arrow-prev"><svg viewBox="0 0 57.64 11.17"><polygon points="57.64 11.18 0 11.18 0 10.18 55.23 10.18 45.76 0.71 46.47 0 57.64 11.18"></polygon></svg>PREV</div>' +
      '<div class="arrow-divider"></div>' +
      '<div class="arrow-btn arrow-next">NEXT<svg viewBox="0 0 57.64 11.17"><polygon points="0 11.18 57.64 11.18 57.64 10.18 2.41 10.18 11.88 0.71 11.18 0 0 11.18"></polygon></svg></div>';
    titArea.appendChild(arrows);
    
    var movieList = document.querySelector('.page--home .section--movie .list--movie');
    arrows.querySelector('.arrow-prev').addEventListener('click', function() {
      if (movieList) movieList.scrollBy({ left: -316, behavior: 'smooth' });
    });
    arrows.querySelector('.arrow-next').addEventListener('click', function() {
      if (movieList) movieList.scrollBy({ left: 316, behavior: 'smooth' });
    });
  }

  // Bilibili cover helper
  function getBiliCover(bvid) {
    return 'https://i2.hdslb.com/bfs/archive/' + bvid + '.jpg';
  }

  // Render discography page
  function renderDiscography() {
    if (!config) return;
    var discoList = document.querySelector('.section--list .list--discography');
    if (!discoList) return;
    discoList.innerHTML = config.discography.map(function(d) {
      var link = d.bvid ? '/disco-detail.html?bvid=' + d.bvid : '#';
      return '<li class="inview"><a href="' + link + '" target="_blank" class="clearfix">' +
        '<figure class="thumb"><img src="/assets/img/common/dummy.png" style="background-image:url(\'' + d.cover + '\');" alt="' + d.title + '"></figure>' +
        '<ul class="block--text">' +
        '<li class="title"><p><span><span class="category">' + d.category + '</span></span></p><br><p class="tit"><span><span>' + d.title + '</span></span></p></li>' +
        '<li class="date"><p><span><span>' + d.date + ' COVER</span></span></p></li>' +
        '</ul></a></li>';
    }).join('');
  }

  // Render lyrics page
  function renderLyrics() {
    if (!config) return;
    var lyricsList = document.querySelector('.section--list .list--discography');
    if (!lyricsList || !document.body.classList.contains('page--lyrics')) return;
    lyricsList.innerHTML = config.discography.filter(function(d) { return d.category === '翻唱'; }).map(function(d) {
      var link = d.bvid ? '/lyrics-detail.html?bvid=' + d.bvid : '#';
      return '<li class="inview"><a href="' + link + '" class="clearfix">' +
        '<figure class="thumb"><img src="/assets/img/common/dummy.png" style="background-image:url(\'' + d.cover + '\');" alt="' + d.title + '"></figure>' +
        '<ul class="block--text"><li class="title"><p class="tit"><span><span>' + d.title + '</span></span></p></li></ul></a></li>';
    }).join('');
  }

  // Render biography page
  function renderBiography() {
    if (!config) return;
    var bio = config.biography;
    if (!bio) return;
    
    var artistBlock = document.querySelector('.block--artist');
    if (artistBlock) {
      artistBlock.innerHTML = '<img src="' + bio.photo + '" alt="夏夜将終"><img src="/assets/img/common/dummy.png" alt="dummy" class="dummy">';
    }
    
    var textBlock = document.querySelector('.block--text .text');
    if (textBlock) {
      var membersHTML = bio.members.map(function(m) {
        return m.role + ': ' + m.name;
      }).join('<br>');
      textBlock.innerHTML = bio.intro.replace(/\n/g, '<br>') + '<br><br>夏夜将終 メンバー：<br>' + membersHTML;
    }
    
    var historyBlock = document.querySelector('.list--history');
    if (historyBlock) {
      historyBlock.innerHTML = bio.history.map(function(h) {
        return '<dt>' + h.year + '</dt><dd>' + h.text.replace(/\n/g, '<br>') + '</dd>';
      }).join('');
    }
  }

  // Render contact page
  function renderContact() {
    if (!config) return;
    var emailBlock = document.querySelector('.email a');
    if (emailBlock) {
      emailBlock.href = config.contact.bilibili;
      emailBlock.innerHTML = '<i class="fa fa-television"></i>' + config.contact.bilibiliName;
    }
  }

  // Render works page
  function renderWorks() {
    if (!config) return;
    var worksList = document.querySelector('.section--list .list--news');
    if (!worksList || !document.body.classList.contains('page--information') || !document.title.includes('WORKS')) return;
    if (config.works.length === 0) {
      worksList.innerHTML = '<li class="no-data" style="border:none;text-align:center;padding:60px 30px;">暂无 Works 信息</li>';
    } else {
      worksList.innerHTML = config.works.map(function(w) {
        return '<li class="inview"><a href="#" class="clearfix"><p class="date">' + w.date + '<span class="category">' + w.category + '</span></p><p class="tit">' + w.title + '</p></a></li>';
      }).join('');
    }
  }

  // Render special page
  function renderSpecial() {
    if (!config) return;
    var specialList = document.querySelector('.section--list .list--discography');
    if (!specialList || !document.body.classList.contains('page--list') || !document.title.includes('SPECIAL')) return;
    // Show discography covers as special content
    specialList.innerHTML = config.discography.slice(0, 4).map(function(d) {
      var link = d.bvid ? '/disco-detail.html?bvid=' + d.bvid : '#';
      return '<li class="inview"><a href="' + link + '" target="_blank" class="clearfix">' +
        '<figure class="thumb"><img src="/assets/img/common/dummy.png" style="background-image:url(\'' + d.cover + '\');" alt="' + d.title + '"></figure>' +
        '<ul class="block--text"><li class="title"><p class="tit"><span><span>' + d.title + '</span></span></p></li></ul></a></li>';
    }).join('');
  }

  // Init all
  function init() {
    renderTitle();
    renderHeader();
    renderDrawer();
    renderSNS();
    renderKeyVisual();
    renderBanners();
    renderNews();
    renderNewsList();
    renderLiveList();
    renderMovies();
    addMovieArrows();
    renderDiscography();
    renderLyrics();
    renderBiography();
    renderContact();
    renderWorks();
    renderSpecial();
    renderSNSFloat();
    renderFooter();
    
    // Dispatch event so main.js can init carousels
    window.dispatchEvent(new CustomEvent('contentRendered'));
    
    // Re-trigger inview observer for dynamically added content
    if ('IntersectionObserver' in window) {
      document.querySelectorAll('.inview:not(.view)').forEach(function(el) {
        inviewObserver.observe(el);
      });
    }
  }

  // IntersectionObserver for inview animations
  var inviewObserver = null;
  
  document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
      inviewObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) entry.target.classList.add('view');
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    }
    
    loadConfig(init);
  });
})();