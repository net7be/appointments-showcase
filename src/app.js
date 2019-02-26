import './styles/base.scss';
import MobileNav from './mobile-nav';

const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const openEl = document.getElementById('menuBtn');
const langSelector = document.getElementById('langSelector');

// Register the language picker.
// This looks more convoluted than it should be.
const reg = /\/\w{2}\/([a-zA-Z0-9\.]+)$/;
langSelector.addEventListener('change', (e) => {
  const nlang = e.currentTarget.options[e.currentTarget.selectedIndex].getAttribute('data-lang');
  var matches = reg.exec(window.location.href);
  if (matches) {
    window.location.href = window.location.protocol + '//' +
      window.location.host + '/' + nlang + 
        '/' + matches[1];
  } else {
    window.location.href = window.location.protocol + '//' + 
    window.location.host + '/' + nlang + '/'; 
  }
});

const myNav = new MobileNav(mobileNav, mobileNavOverlay, openEl);
myNav.initialize();

