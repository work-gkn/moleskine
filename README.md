# Moleskine
A simple HTML-App to demo LocalStorage. 

It takes notes and stores them into the LocalStorage of the browser. It is possible to delete the notes afterwards. Existing items on LocalStorage should be displayed when the page is loaded.

Has a toaster that displays information about the application.

The javascript (dist/js/moleskine.js) is divided into two parts:
1. definition of all necessary parts with the help of "Module (Tight) Augmentation".
2. initialising the page with Immediatly-Invoked Function Expression

This application includes [the alpha of Bootstraps version 5](https://v5.getbootstrap.com/) for the UI design. Therefore, the app cannot be displayed in Internet Explorer, [which is no longer supported](https://v5.getbootstrap.com/docs/5.0/getting-started/browsers-devices/#internet-explorer).

## Releases
In Releases you find all the files you need to show the app in the browser. The index.html file can be opened directly in the browser.
