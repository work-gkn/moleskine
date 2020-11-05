/**
 * Module for setting cache operations
 */
class CacheModule extends EmitterModule {
  constructor(appCache) {
    super();
    this.appCache = appCache;
  }

  emitTextChange(sText) {
    this.emit('updateCacheEvent', sText);
  }

  init() {
    if (!this.appCache) {
      self.console.warn('No applicationCache available!');
      return;
    }
    
    this.appCache.addEventListener('checking', () => this.emitTextChange('Check the cache ...'));
    this.appCache.addEventListener('noupdate', () => this.emitTextChange('No cache update necessary'));
    this.appCache.addEventListener('downloading', () => this.emitTextChange('Update the cache ...'));
    this.appCache.addEventListener('progress', () => this.emitTextChange('Download file ...'));
    this.appCache.addEventListener('updateready', () => this.emitTextChange('Cache update ready ...'));
    this.appCache.addEventListener('cached', () => this.emitTextChange('Cache is up-to-date'));
    this.appCache.addEventListener('obsolete', () => this.emitTextChange('Cache is obsolete'));
    this.appCache.addEventListener('error', (e) => this.emitTextChange('Problem with Cache: ' + e));
  }
}