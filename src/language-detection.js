const userLang = navigator.language || navigator.userLanguage;
let lang;
if (userLang.indexOf('fr') >= 0) {
  //window.location.replace('/en');
  lang = 'fr';
} else if (userLang.indexOf('ln') >= 0) {
  lang = 'nl';
} else {
  lang = 'en';
}
window.location.replace(window.location.protocol + '//' + window.location.host + window.location.pathname + lang + '/');