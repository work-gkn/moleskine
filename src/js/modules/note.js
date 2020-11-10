// ESLint definition for globals
/* global EmitterModule */

/** 
 * Class representing the note module 
 * @extends EmitterModule
 */

class NoteListModule extends EmitterModule {
  /**
   * 
   * @param {HTMLUListElement} eUl 
   */
  constructor (eUl) {
    super();
    this.eUl = eUl,
    this.aEntries = [],
    this.sDefaultText = '';
  }

  /**
   * Generate a String from a given date Object
   * @param {Object} oDate   A valid JS date object
   * @param {Number} nFormat Number to get the formated string
   *                         1 = For output in frontend
   *                         2 = For insert into datetime attribute
   */
  dateToString(oDate, nFormat = 1) {
    let fPad,
      sDate,
      sTime;

    fPad = function (nNr) {
      if (nNr < 10) {
        return '0' + nNr;
      }
      return nNr;
    };

    sDate = oDate.getFullYear() +
    '-' + fPad(oDate.getMonth() + 1) +
    '-' + fPad(oDate.getDate());

    sTime = fPad(oDate.getHours()) +
    ':' + fPad(oDate.getMinutes()) +
    ':' + fPad(oDate.getSeconds());

    if (nFormat === 2) {
      return sDate + 'T' + sTime;
    } else {
      return sDate + ' ' + sTime;
    }
  }
  
  /**
   * Gets the time element from DOM and updates it with the given parameters
   * @param {String} sValueText   Text to set in the textnode of time element
   * @param {String} sValueAttrib Text to set into the datetime attribute of time element
   */
  updateTimeElement(sValueText, sValueAttrib) {
    if (typeof sValueText !== 'string' || sValueText === '') {
      self.console.warn('Wrong format for parameter sValueText');
      return;
    }

    if (typeof sValueAttrib !== 'string' || sValueAttrib === '') {
      self.console.warn('Wrong format for parameter sValueAttrib');
      return;
    }

    let eTime = document.getElementsByTagName('time')[0];

    if (eTime) {
      eTime.firstChild.nodeValue = sValueText;
      eTime.setAttribute('datetime', sValueAttrib);
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
   * Try to call saveEntry from the events property and pass the parameters to it. Saves also
   * the given parameter sValue as the first entry of the property aEntries.
   * 
   * @param {String} sKey   Key to save in storage.
   * @param {String} sValue Value to save in storage.
   */
  saveEntry(sKey, sValue) {
    try {
      this.emit('saveEntry', sKey, sValue)
    } catch (e) {
      this.setInfoText('Entry could not be saved in storage!');
      self.console.error(e);
    } finally {
      this.aEntries.unshift({key: sKey, value: sValue});
    }
  }

  /**
   * Try to call deleteEntry from the events property and pass the parameters to it.
   * 
   * @param {String} sKey   Key to save in storage.
   * @param {String} sValue Value to save in storage.
   */
  deleteEntry(sId, oDate) {
    try {
      this.emit('deleteEntry', sId, oDate);
    } catch(e) {
      self.console.error(e);
      return false;
    }
  }

  /**
   * Tries to remove the given sId from the internal property aEntries.
   * @param {String} sId ID to remove from the array
   * @param {Date} oDate Date object to update the last change info
   */
  removeFromList(sId, oDate) {
    this.updateTimeElement(this.dateToString(oDate, 1), this.dateToString(oDate, 2));
    let index = this.aEntries.findIndex(value => value.key === sId);
    if (index > -1) {
      this.aEntries.splice(index, 1);
    }
    document.getElementById(sId).remove();
  }

  /**
   * Tries to delete the given id from localStorage after confirmation
   * @param {String} sId ID that should be tried to remove from localStorage
   * @returns {Boolean} If deletion was successful or not
   */
  delete(sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.log('Wrong format for parameter sId');
      return false;
    }

    let bQuestion = self.confirm('Do you really want to delete this entry?'),
      oDate = new Date();

    if (bQuestion) {
      this.deleteEntry(sId, oDate);
    }
  }

  /**
   * Creates the note item to include it in the DOM
   * @param {number} nId     Id for li element
   * @param {string} sText   Text for li element
   * @param {boolean} bFirst Item should be set on top
   */
  create(nId, sText, bFirst = false) {
    let eLi = document.createElement('li'),
      eDiv = document.createElement('div'),
      eStr = document.createElement('strong'),
      eP = document.createElement('p'),
      eBtn = document.createElement('button'),
      sDate = this.dateToString(new Date(nId), 1);
      // getDateTime(nId)

    eStr.appendChild(document.createTextNode(sDate));

    eP.appendChild(document.createTextNode(sText));

    eBtn.setAttribute('type', 'button');
    eBtn.setAttribute('data-key', nId)
    eBtn.classList.add('btn', 'btn-danger', 'destroy', 'remove-note');
    eBtn.appendChild(document.createTextNode('Delete'));

    eDiv.appendChild(eStr);
    eDiv.appendChild(eP);
    eDiv.appendChild(eBtn);

    eLi.classList.add('list-group-item');
    eLi.setAttribute('id', nId);

    eLi.appendChild(eDiv);

    if (bFirst === true) {
      const eFirst = this.eUl.childNodes[0];
      this.eUl.insertBefore(eLi, eFirst);
    } else {
      this.eUl.appendChild(eLi);
    }
  }

  /**
   * Get the content for the note and creates new elements to include in DOM
   * @param {String} sEntry  Content from textarea
   * @returns {Boolean}      Save in Storage was successful or not
   */
  save(sEntry) {
    let oDate = new Date(),
      nKey = oDate.getTime(), // getDateTime()
      sKey = nKey.toString();

    if (sEntry === '' || sEntry === this.sDefaultText) {
      return false;
    }

    this.saveEntry(sKey, sEntry);  
  }

  /** 
   * Get entries from Storage and writes the information for each item into DOM
   * @returns {String} value read from aEntries with key author or an empty string
   */
  initList(aValues) {
    let bUpdate = true,
    oDate = new Date();

    aValues.map(item => {
      const nCheck = parseInt(item.key, 10);
      if (typeof nCheck === 'number' && item.key !== 'author') {
        oDate.setTime(nCheck);
        // This updates the information in 'Last updated' with the date of the first entry
        if (bUpdate) {
          this.updateTimeElement(this.dateToString(oDate, 1), this.dateToString(oDate, 2)); // getDateTime(oDate)
          bUpdate = false;
        }
        this.aEntries.push(item);
        this.create(nCheck, item.value);
      }
    });
    console.dir(this.aEntries);
  }

  /**
   * Init the module. Init event listener for the delete button and calls 
   * [method readStore]{@link NoteModule#readStore}
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
      this.delete(sId);
    });

    this.readStore();
  }
}