"use strict"
var scripts = [
  'popper.min',
  'bootstrap.min',
  'modules/emitter',
  'modules/debug',
  'modules/cache',
  'modules/storage',
  'modules/note',
  'moleskine'
];

scripts.forEach(function(el) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', 'js/' + el + '.js');
	document.body.appendChild(script);
});