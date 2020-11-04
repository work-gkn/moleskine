class EmitterModule {
  constructor() {
    this.events = {};
  }

/** 
   * Löst ein Ereignis aus. Dieser Funktion dürfen beliebig viele 
   * Parameter übergeben werden, diese werden 1:1 an die Event-Listener  
   * durchgereicht.  
   *  
   * @param {string} eventName  
   * @param {*=} arguments 
   */ 
  emit(eventName) { 
    var f, args = [].slice.call(arguments, 1); 
    if (eventName in this.events) { 
      for(f of this.events[eventName]) { 
        f.apply(this, args); 
      } 
    } 
  }

  /** 
   * Registriert einen Event-Listener für das Event eventName. 
   *  
   * @param {string} eventName  
   * @param {Function} cb  
   */ 
  on(eventName, cb) { 
    if (!(eventName in this.events)) { 
      this.events[eventName] = []; 
    } 
    this.events[eventName].push(cb); 
  } 
}