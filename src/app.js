import './styles/base.scss';
import MobileNav from './mobile-nav';

const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const openEl = document.getElementById('menuBtn');

const myNav = new MobileNav(mobileNav, mobileNavOverlay, openEl);
myNav.initialize();
