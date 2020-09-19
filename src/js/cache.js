/**
 * Module for setting cache operations
 * @module oCache
 * @exports init
 */
var oCache = (function (oDebug) {
  let fInit;

  /**
   * Init the debug information for the caching events
   */
  fInit = function () {
    let oAppCache = self.applicationCache;

    if (!oAppCache) {
      self.console.warn('No applicationCache available!')
      return;
    }
    oAppCache.addEventListener('checking', () => oDebug.setText('Check the cache ...'));
    oAppCache.addEventListener('noupdate', () => oDebug.setText('No cache update necessary'));
    oAppCache.addEventListener('downloading', () => oDebug.setText('Update the cache ...'));
    oAppCache.addEventListener('progress', () => oDebug.setText('Download file ...'));
    oAppCache.addEventListener('updateready', () => oDebug.setText('Cache update ready ...'));
    oAppCache.addEventListener('cached', () => oDebug.setText('Cache is up-to-date'));
    oAppCache.addEventListener('obsolete', () => oDebug.setText('Cache is obsolete'));
    oAppCache.addEventListener('error', (e) => oDebug.setText('Problem with Cache: ' + e));
  }

  // Set the public methods
  return {
    init: fInit
  };
})(self.oDebug);