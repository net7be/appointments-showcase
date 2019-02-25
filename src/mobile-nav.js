export default function MobileNav(mobileNav, mobileNavOverlay, openEl) {
  this.mobileNav = mobileNav;
  this.mobileNavOverlay = mobileNavOverlay;
  this.openEl = openEl;
  this.initialTranslate = '-110%';
  this.touchX = 0;
  this.width = mobileNav.offsetWidth;
  // Doing most of the calculations now rather than in
  // the touch event listeners:
  this.touchThresMin = Math.ceil(this.width * 0.1);
  this.touchThresMax = this.width - this.touchThresMin;
  // These functions could be in a prototype.
  // I'm not bothering because there is no reason to create
  // more than one navbar so it doesn't really matter here.
  this.initialize = function() {
    this.openEl.addEventListener('click', this.openMenu.bind(this));
    this.mobileNavOverlay.addEventListener('click', this.closeMenu.bind(this));
    document.body.addEventListener('touchstart', this.touchStart.bind(this));
    document.body.addEventListener('touchmove', this.touchMove.bind(this));
    document.body.addEventListener('touchend', this.touchEnd.bind(this));
    this.mobileNav.querySelectorAll('a').forEach(n => {
      n.addEventListener('click', this.closeMenu.bind(this));
    });
  };
  this.openMenu = function() {
    this.mobileNav.style.transform = 'translateX(0px)';
    this.mobileNavOverlay.style.display = 'block';
  };
  this.closeMenu = function() {
    this.mobileNavOverlay.style.display = 'none';
    this.mobileNav.style.transform = 'translateX(' + this.initialTranslate +  ')';
  };
  this.touchStart = function(e) {
    this.touchX = parseInt(e.changedTouches[0].clientX);
    // TODO We might have to remove the transition here,
    // and put it back at the touchend event.
  };
  this.touchMove = function(e) {
    // We can move up to a certain threshold of
    // this.mobileNav.offsetWidth.
    const cur = parseInt(e.changedTouches[0].clientX);
    const diff = cur - this.touchX;
    if (diff > 0) {
      // We're sliding to the right.
      // We want to ignore sliding to the left.
      // TODO We should not ignore sliding to the left
      // once we started sliding to the right...
      // We should also show the overlay:
      this.mobileNavOverlay.style.display = 'block';
      if (diff >= this.touchThresMax) {
        this.mobileNav.style.transform = 'translateX(0px)';
        // We need to reset touchX somehow.
        // To ignore touchend?
        this.touchX = 0;
      } else if (diff <= this.touchThresMin) {
        this.closeMenu();
        this.touchX = 0;
      } else {
        this.mobileNav.style.transform = 'translateX(-' + diff + 'px)';
      }
    }
  };
  this.touchEnd = function(e) {
    // Check if we're already full translated,
    // in which case we have nothing to do.
    // Otherwise, reset the translation on the
    // navbar.
    if (this.touchX) {
      // Reset:
      this.closeMenu();
    }
  }
}