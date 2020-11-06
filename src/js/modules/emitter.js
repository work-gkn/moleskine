/** class representing an emitter module */
class EmitterModule {
  constructor() {
    this.events = {};
  }
  
  /** 
   * Registers an event listener for the event eventName. 
   *  
   * @param {String} eventName  
   * @param {Function} cb  
   */ 
  on(eventName, cb) { 
    if (!(eventName in this.events)) { 
      this.events[eventName] = []; 
    } 
    this.events[eventName].push(cb); 
  } 

  /** 
   * Triggers an event. Any number of parameters may be passed to this function, these are passed
   * 1:1 to the event listeners. 
   *  
   * @param {String} eventName  
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
}