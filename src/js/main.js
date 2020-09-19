
// Starts to initialize the site
(function (oDebug, oCache, oNotes) {
  "use strict";
  let bClean = false,
    eAuthor = document.getElementById('author'),
    eBtn = document.getElementById('save'),
    eText = document.getElementById('textarea'),
    fCleanUp;

  // Clean up the textarea
  fCleanUp = function () {
      if (bClean) {
        return;
      }
      eText.value = '';
      bClean = true;
  };
  
  self.addEventListener('online', () => oDebug.setText('on the web'));
  self.addEventListener('offline', () => oDebug.setText('off the web'));

  if (navigator.onLine) {
    oDebug.setText('on the web');
  } else {
    oDebug.setText('off the web');
  }
  oCache.init();

  eAuthor.addEventListener('click', () => eAuthor.firstChild.nodeValue = '');

  eText.addEventListener('click', () => fCleanUp());
  eText.addEventListener('focus', () => fCleanUp());

  eBtn.addEventListener('click', () => {
    if (oNotes.save(eText.value, eAuthor.firstChild.nodeValue)) {
      bClean = false;
    }
    eText.focus();
  });

  eAuthor.firstChild.nodeValue = oNotes.init(eText.value, eAuthor.firstChild.nodeValue);
})(self.oDebug, self.oCache, self.oNotes);