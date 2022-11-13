// dynamic favicon
window.addEventListener('online',  greenFavicon);
window.addEventListener('offline', whiteFavicon);

function greenFavicon() {
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = '/favicon-32x32.png';
  document.getElementsByTagName('head')[0].appendChild(link);
}

function whiteFavicon() {
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/svg+xml';
  link.rel = 'shortcut icon';
  link.href = '/favicon-white.svg';
  document.getElementsByTagName('head')[0].appendChild(link);
}
