// SVG symbols loader - loads SVG symbols from external file and injects into DOM
(function() {
  var svgPath = 'assets/svg-symbols.svg';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', svgPath, true);
  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 0) {
      var div = document.createElement('div');
      div.style.display = 'none';
      div.innerHTML = xhr.responseText;
      document.body.insertBefore(div.firstChild, document.body.firstChild);
    }
  };
  xhr.send();
})();