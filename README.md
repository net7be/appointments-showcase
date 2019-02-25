# RemindOthers - Showcase website
Multilingual static site generator using Webpack and Handlebars templates.

## Foundation
The official npm package can be installed as such:
```
npm install -D foundation-sites
```

We should now be able to import the CSS either in the main JS entry point, or the main SASS file.

Using the latter, we need the full path to the files:
```scss
@import 'node_modules/foundation-sites/scss/foundation';
```

Finally, each required individual parts of foundation has to be imported. See the list here : https://foundation.zurb.com/sites/docs/sass.html

I started with the following includes (using Flex grid instead of their new XY grid):
```scss
@include foundation-global-styles;
@include foundation-forms;
@include foundation-typography;
@include foundation-flex-grid;
@include foundation-button;
@include foundation-button-group;
@include foundation-close-button;
@include foundation-label;
//@include foundation-progress-bar;
//@include foundation-slider;
//@include foundation-switch;
@include foundation-table;

// Basic components
@include foundation-badge;
//@include foundation-breadcrumbs;
@include foundation-callout;
@include foundation-card;
@include foundation-dropdown;
//@include foundation-pagination;
//@include foundation-tooltip;

// Containers
//@include foundation-accordion;
@include foundation-media-object;
//@include foundation-orbit;
@include foundation-responsive-embed;
@include foundation-tabs;
@include foundation-thumbnail;

// Menu-based containers
@include foundation-menu;
@include foundation-menu-icon;
@include foundation-accordion-menu;
@include foundation-drilldown-menu;
@include foundation-dropdown-menu;

// Layout components
@include foundation-off-canvas;
@include foundation-reveal;
@include foundation-sticky;
@include foundation-title-bar;
@include foundation-top-bar;

// Helpers
//@include foundation-float-classes;
@include foundation-flex-classes;
@include foundation-visibility-classes;
```

### Customizing the color scheme
We need to import our color scheme from the Net7 site.

Colors:
* Light: #009ee0
* Dark: #172983
* Warning: #ffa500
* Light text - Menu text: #aaa

This is supposed to hold all the SASS variables they use: https://raw.githubusercontent.com/zurb/foundation-sites/master/scss/settings/_settings.scss

We need to create a _settings.scss file to import **before** the foundation one.

# Where to put the showcase
It should be linked from the actual RemindOthers app. login screen. We could just host it on the same domain using an alias like **/about**.

# TODO
- [ ] Add Babel.
- [ ] Font size is weird on mobile when compared to titles.
- [ ] There are different images per language for the learn more screenshot.
- [ ] Minify the images in static.