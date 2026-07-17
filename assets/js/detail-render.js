// Detail page renderer - loads specific item from config based on URL query params
(function() {
  'use strict';
  var BILIBILI_BASE = 'https://www.bilibili.com/video/';

  function getQueryParam(name) {
    var match = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function loadConfig(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'config.json', true);
    xhr.onload = function() {
      if (xhr.status === 200 || xhr.status === 0) {
        callback(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
  }

  function renderDiscoDetail(config) {
    var bvid = getQueryParam('bvid');
    var inner = document.getElementById('disco-detail-inner');
    if (!inner) return;

    var item = config.discography.find(function(d) { return d.bvid === bvid; });
    if (!item && config.discography.length > 0) {
      item = config.discography[0];
    }
    if (!item) {
      inner.innerHTML = '<p style="text-align:center;padding:60px;">作品が見つかりません</p>';
      return;
    }

    document.title = item.title + ' | ' + config.site.name;

    inner.innerHTML = 
      '<div class="block--jacket"><ul class="list--jacket"><li class="inview">' +
      '<figure class="jacket"><img src="' + item.cover + '" alt="' + item.title + '">' +
      '<img src="assets/img/common/dummy.png" alt="dummy" class="dummy"></figure></li></ul></div>' +
      '<div class="block--detail inview">' +
      '<p class="date">' + item.date + ' COVER<span class="category">' + item.category + '</span></p>' +
      '<p class="tit">' + item.title + '</p>' +
      '<div class="text">原曲：' + item.original + '<br>' +
      '配信元：<a href="' + BILIBILI_BASE + item.bvid + '" target="_blank" style="color:#8B7AB8;text-decoration:underline;">bilibili</a></div>' +
      '<ul class="block--track"><li><p class="title">TRACKLIST</p><ul class="list--track">' +
      '<li><span class="num">1.</span> ' + item.title + ' <span class="tie-up">(Cover of ' + item.original + ')</span></li>' +
      '</ul></li></ul></div>';
  }

  function renderLyricsDetail(config) {
    var bvid = getQueryParam('bvid');
    var titleEl = document.getElementById('lyrics-title');
    var creditEl = document.getElementById('lyrics-credit');
    var bodyEl = document.getElementById('lyrics-body');
    if (!titleEl) return;

    var item = config.discography.find(function(d) { return d.bvid === bvid; });
    if (!item && config.discography.length > 0) {
      item = config.discography[0];
    }
    if (!item) {
      bodyEl.innerHTML = '<p>歌詞が見つかりません</p>';
      return;
    }

    document.title = item.title + ' 歌詞 | ' + config.site.name;
    titleEl.textContent = item.title;
    creditEl.innerHTML = '原曲：' + item.original + '<br>Cover：夏夜将终';

    if (item.lyrics && item.lyrics.trim()) {
      var esc = item.lyrics.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      bodyEl.innerHTML = esc.split(/\n{2,}/).map(function(p) {
        return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
      }).join('');
    } else {
      bodyEl.innerHTML = '<p style="text-align:center;color:#999;font-size:13px;padding:40px 0;">歌詞は準備中です<br>原曲の歌詞をご参照ください<br><br><a href="' + BILIBILI_BASE + item.bvid + '" target="_blank" style="color:#8B7AB8;text-decoration:underline;">Bilibiliで視聴する</a></p>';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    loadConfig(function(config) {
      if (document.body.classList.contains('page--discography')) {
        renderDiscoDetail(config);
      } else if (document.body.classList.contains('page--lyrics')) {
        renderLyricsDetail(config);
      }
    });
  });
})();