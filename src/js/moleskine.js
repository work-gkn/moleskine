"use strict"
var scripts = [
  'popper.min',
  'bootstrap.min',
  'modules/debug',
  'modules/cache',
  'modules/storage',
  'modules/note',
  'modules/main'
];

scripts.forEach(function(el) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', 'js/' + el + '.js');
	document.body.appendChild(script);
});