/**
 * Module for setting cache operations
 */
var mCache = (function (mDebug) {
  if (typeof mDebug === 'undefined') {
    return;
  }
  // import
  const fSetText = mDebug.setText; 

  /**
   * Init the debug information for the caching events
   */
  const fInit = function () {
    let oAppCache = self.applicationCache;

    if (!oAppCache) {
      self.console.warn('No applicationCache available!');
      return;
    }
    oAppCache.addEventListener('checking', () => fSetText('Check the cache ...'));
    oAppCache.addEventListener('noupdate', () => fSetText('No cache update necessary'));
    oAppCache.addEventListener('downloading', () => fSetText('Update the cache ...'));
    oAppCache.addEventListener('progress', () => fSetText('Download file ...'));
    oAppCache.addEventListener('updateready', () => fSetText('Cache update ready ...'));
    oAppCache.addEventListener('cached', () => fSetText('Cache is up-to-date'));
    oAppCache.addEventListener('obsolete', () => fSetText('Cache is obsolete'));
    oAppCache.addEventListener('error', (e) => fSetText('Problem with Cache: ' + e));
  };

  // Set the public methods
  return {
    init: fInit
  };
})(self.mDebug);