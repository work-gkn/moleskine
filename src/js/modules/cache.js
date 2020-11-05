/**
 * Module for setting cache operations
 */
class CacheModule extends EmitterModule {
  constructor(appCache) {
    super();
    this.appCache = appCache;
  }

  setInfoText(sText) {
    const infoModule = new InfoModule();
    infoModule.setText(sText);
  }

  init() {
    if (!this.appCache) {
      self.console.warn('No applicationCache available!');
      return;
    }
    
    this.appCache.addEventListener('checking', () => this.setInfoText('Check the cache ...'));
    this.appCache.addEventListener('noupdate', () => this.setInfoText('No cache update necessary'));
    this.appCache.addEventListener('downloading', () => this.setInfoText('Update the cache ...'));
    this.appCache.addEventListener('progress', () => this.setInfoText('Download file ...'));
    this.appCache.addEventListener('updateready', () => this.setInfoText('Cache update ready ...'));
    this.appCache.addEventListener('cached', () => this.setInfoText('Cache is up-to-date'));
    this.appCache.addEventListener('obsolete', () => this.setInfoText('Cache is obsolete'));
    this.appCache.addEventListener('error', (e) => this.setInfoText('Problem with Cache: ' + e));
    
   
  }
}