// Application Code.
var anchorSelector = '.main-content-source h2, ' +
                     '.main-content-source h3, ' +
                     '.main-content-source h4, ' +
                     '.main-content-source h5, ' +
                     '.main-content-source h6 ';

addAnchors(anchorSelector);

function toggleToc(evt) {
  evt.preventDefault();
  var toc = document.getElementById('toc-nav');
  if (toc.style.display !== 'none') {
    toc.style.display = 'none';
  } else {
    toc.style.display = '';
  }
}

var el = document.getElementById('toc-title');
el.addEventListener('click', toggleToc);
