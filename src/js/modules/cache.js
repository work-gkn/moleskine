// ESLint definition for globals
/* global InfoModule */

/**
 * Class representing a cache inforamtion module.
 * 
 * Heads up! Using this is now an antipattern!
 */
class CacheModule {
  /**
   * Checks, if ApplicationCache is available and set EventListeners to inform the user about
   * the cache status.
   * @param {ApplicationCache} appCache 
   */
  constructor(appCache) {
    const infoModule = new InfoModule();
    if (appCache) {
      appCache.addEventListener('checking', () => infoModule.setText('Check the cache ...'));
      appCache.addEventListener('noupdate', () => infoModule.setText('No cache update necessary'));
      appCache.addEventListener('downloading', () => infoModule.setText('Update the cache ...'));
      appCache.addEventListener('progress', () => infoModule.setText('Download file ...'));
      appCache.addEventListener('updateready', () => infoModule.setText('Cache update ready ...'));
      appCache.addEventListener('cached', () => infoModule.setText('Cache is up-to-date'));
      appCache.addEventListener('obsolete', () => infoModule.setText('Cache is obsolete'));
      appCache.addEventListener('error', e => infoModule.setText('Problem with Cache: ' + e));
    } else {
      self.console.warn('No applicationCache available!');
    }
  }
}