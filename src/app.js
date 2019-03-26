import './styles/base.scss';
import MobileNav from './mobile-nav';
import axios from 'axios';
import locales from "./locales.json";

const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const openEl = document.getElementById('menuBtn');
const langSelector = document.getElementById('langSelector');

// We need the current language to get the right translations
// from the "locales" object:
const currentLang = document.documentElement.lang || DEFAULT_LANG;
const absoluteUrl = ABSOLUTE_URL || '/';

// Register the language picker.
// This looks more convoluted than it should be.
const reg = /\/\w{2}\/([a-zA-Z0-9#\.-]+)$/;
langSelector.addEventListener('change', (e) => {
  const nlang = e.currentTarget.options[e.currentTarget.selectedIndex].getAttribute('data-lang');
  const matches = reg.exec(window.location.href);
  if (matches) {
    /*window.location.href = window.location.protocol + '//' +
      window.location.host + window.location.pathname + nlang + 
        '/' + matches[1];*/
    window.location.href = absoluteUrl + '/' + nlang + '/' + matches[1];
  } else {
    window.location.href = absoluteUrl + '/' + nlang + '/';
  }
});

const myNav = new MobileNav(mobileNav, mobileNavOverlay, openEl);
myNav.initialize();

// Check if the form is present on page, and register
// the free trial form action if it is.
const trialForm = document.getElementById('trialForm');
if (trialForm) {
  const message = document.getElementById('message');
  const outputMessage = (text, calloutClass) => {
    message.textContent = text;
    message.style.display = 'block';
    message.classList = 'callout ' + calloutClass;
    location.href = '#message';
  };
  trialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('https://api-remindothers.net7.be/v1/account/free-trial', {
      fullname: document.getElementById('nameInput').value,
      email: document.getElementById('emailInput').value,
      languageCode: document.getElementById('trialLangSelect').value
    })
    .then(_ => {
      // "response" should be JSON with a result field.
      outputMessage(locales[currentLang].messageSent, 'success');
    })
    .catch((error) => {
      switch (error.response.status) {
        case 400:
          if (error.response.data.indexOf('email') >= 0) {
            // Email is malformed:
            outputMessage(locales[currentLang].invalidEmail, 'alert');
          } else {
            // A field is missing:
            outputMessage(locales[currentLang].missingField, 'alert');
          }
          break;
        case 500:
        default:
          // Take it as a server error:
          outputMessage(locales[currentLang].serverError, 'alert');
      }
    });
  });
}