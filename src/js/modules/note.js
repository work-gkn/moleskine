// ESLint definition for globals
/* global EmitterModule */

/** 
 * Class representing the notelist module 
 * @extends EmitterModule
 */

class NoteListModule extends EmitterModule {
  /**
   * 
   * @param {HTMLUListElement}  eUl
   * @param {HTMLTimeElement}   eTime
   */
  constructor (eUl, eTime) {
    super();
    this.eUl = eUl,
    this.eTime = eTime;
    this.aEntries = [],
    this.sDefaultText = '';
  }

  /**
   * Generates a new Date object and set time to the value in parameter, if given.
   * @param {String=} sTmstmp  An timestamp in milliseconds as string.
   * 
   * @returns {Object}  Which has the following properties
   *                    {Object} dateObject:    The date object itself.
   *                    {String} textTimestamp: Converted timestamp of date object.
   *                    {String} textTime:      Date and Time as String, seperated by blank
   *                                            (YYYY-MM-DD hh:mm:ss)
   *                    {String} textDateTime:  Date and Time as String, sperated by T 
   *                                            (YYYY-MM-DDThh:mm:ss)
   */
  generateDates(sTmstmp) {
    let oDt = new Date();
    
    if (typeof sTmstmp !== 'string') {
      sTmstmp = oDt.getTime().toString(10);
    } else {
      oDt.setTime(parseInt(sTmstmp, 10));
    }
    
    const fPad = function (nNr) {
      if (nNr < 10) {
        return '0' + nNr;
      }
      return nNr;
    };

    let sDt = oDt.getFullYear() + '-' + fPad(oDt.getMonth() + 1) + '-' + fPad(oDt.getDate());
    let sTm = fPad(oDt.getHours()) + ':' + fPad(oDt.getMinutes()) + ':' + fPad(oDt.getSeconds());

    return {
      dateObject: oDt,
      textTimestamp: sTmstmp,
      textTime: sDt + ' ' + sTm,
      textDateTime: sDt + 'T' + sTm
    }
  }
  
  /**
   * Gets the time element from DOM and updates it with the given object
   * @param {Object} oDtGnrt Object should be geerated by method [generateDates]{@link NoteListModule#generateDates}
   */
  updateTimeElement(oDtGnrt) {
    if (this.eTime) {
      this.eTime.firstChild.nodeValue = oDtGnrt.textTime;
      this.eTime.setAttribute('datetime', oDtGnrt.textDateTime);
    }
  }

  /**
   * Try to call setInfoText from the events property and pass the parameters to it.
   * @param {String} sText Text to show in InfoModule
   */
  setInfoText(sText) {
    try {
      this.emit('setInfoText', sText);
    } catch (e) {
      self.console.error(e);
    }
  }

  /**
   * Try to call deleteEntry from the events property and pass the parameters to it.
   */
  deleteEntry(sId) {
    try {
      this.emit('deleteEntry', sId);
    } catch(e) {
      self.console.error(e);
    }
  }

  /**
   * Tries to remove the given sId from the internal property aEntries and the related element in
   * DOM.
   * @param {String} sId ID to remove from the array
   */
  removeFromList(sId) {
    let index = this.aEntries.findIndex(value => value.key === sId);
    if (index > -1) {
      this.aEntries.splice(index, 1);
    }
    document.getElementById(sId).remove();
    this.updateTimeElement(this.generateDates());
  }

  /**
   * Try to call readStore from the events property.
   */
  readStore() {
    if (this.aEntries.length === 0) {
      try {
        this.emit('readStore');
      } catch (e) {
        self.console.warn('Storage not available: ', e);
      }
    }
  }

  /**
   * Try to call saveEntry from the events property and pass the parameter to it.
   * 
   * @param {String} sValue Value to save in storage.
   */
  save(sValue) {
    if (sValue === '' || sValue === this.sDefaultText) {
      return;
    }

    try {
      this.emit('saveEntry', sValue, this.generateDates())
    } catch (e) {
      this.setInfoText('Entry could not be saved in storage!');
      self.console.error(e);
    }
  }

  /**
   * Prepairs delete after confirming deletion
   * @param {String} sId ID that should be tried to remove from localStorage
   * 
   */
  delete(sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.log('Wrong format for parameter sId');
      return;
    }

    if (self.confirm('Do you really want to delete this entry?')) {
      this.deleteEntry(sId);
    }
  }

  /**
   * Creates a note item element to include it in the DOM
   * @param {Object} oDtGnrt  Date information and strings. See [generateDates]{@link NoteListModule#generateDates}
   * @param {String} sText   Text for li element
   * @param {Boolean} bFirst Item should be set on top. Mainly the case by generating a new note.
   */
  create(oDtGnrt, sText, bFirst = false) {
    
    let eLi = document.createElement('li'),
      eDiv = document.createElement('div'),
      eStr = document.createElement('strong'),
      eP = document.createElement('p'),
      eBtn = document.createElement('button'),
      oEntry = {key: oDtGnrt.textTimestamp, value: sText, dateGenerate: oDtGnrt};

    eStr.appendChild(document.createTextNode(oDtGnrt.textTime));

    eP.appendChild(document.createTextNode(sText));

    eBtn.setAttribute('type', 'button');
    eBtn.setAttribute('data-key', oDtGnrt.textTimestamp)
    eBtn.classList.add('btn', 'btn-danger', 'destroy', 'remove-note');
    eBtn.appendChild(document.createTextNode('Delete'));

    eDiv.appendChild(eStr);
    eDiv.appendChild(eP);
    eDiv.appendChild(eBtn);

    eLi.classList.add('list-group-item');
    eLi.setAttribute('id', oDtGnrt.textTimestamp);

    eLi.appendChild(eDiv);

    if (bFirst === true) {
      this.aEntries.unshift(oEntry);
      this.updateTimeElement(oDtGnrt);
      this.eUl.insertBefore(eLi, this.eUl.childNodes[0]);
    } else {
      this.aEntries.push(oEntry);
      this.eUl.appendChild(eLi);
    }
  }

  /** 
   * Get entries from Storage and calls [create]{@link NoteListModule#create} for each note item.
   * @param {Array} aValues Array of entries generated by the storage handler.
   */
  initList(aValues) {
    let bUpdate = true;

    aValues.map(item => {
      const oDtGnrt = this.generateDates(item.key),
        nCheck = oDtGnrt.dateObject.getTime();
      if (typeof nCheck === 'number' && item.key !== 'author') {
        this.create(oDtGnrt, item.value);
        // This updates the information in 'Last updated' with the date of the first entry
        if (bUpdate) {
          this.updateTimeElement(oDtGnrt);
          bUpdate = false;
        }
      }
    });
  }

  /**
   * Init the module. Init event listener for the delete button and calls 
   * method [readStore]{@link NoteModule#readStore}
   */
  init() {
    const on = function (selector, eventType, cb) {
      document.addEventListener(eventType, (event) => {
        let element = event.target

        while (element) {
          if (element.matches(selector)) {
            return cb({
              handleObj: element, 
              originalEvent: event
            })
          }
          element = element.parentElement
        }
      })
    };

    // Set listener to get click event of the delete buttons 
    on('.remove-note', 'click', event => {
      const sId = event.handleObj.getAttribute("data-key");
      if (sId) {
        this.delete(sId);
      }
    });

    this.readStore();
  }
}