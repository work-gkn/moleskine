'use strict';
var scripts = [
  'popper.min',
  'bootstrap.min',
  'moleskine'
];

scripts.forEach(function(el) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', 'js/' + el + '.js');
  document.body.appendChild(script);
});