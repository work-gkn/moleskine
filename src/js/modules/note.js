// ESLint definition for globals
/* global InfoModule,  StorageModule */


/**
 * Module to handle the notes
 */
self.mNotes = (function () {
  const infoModule = new InfoModule(),
    storageModule = new StorageModule();
  
  let bStorage = true,
    eUl = document.getElementById('containerNotes'),
    sDefaultAuthor = '',
    sDefaultText = '';

  /**
   * Generate a String from a given date Object
   * @param {Object} oDate   A valid JS date object
   * @param {Number} nFormat Number to get the formated string
   *                         1 = For output in frontend
   *                         2 = For insert into datetime attribute
   */
  const fDateToString = function (oDate, nFormat = 1) {
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
  };

  /**
   * Gets the time element from DOM and updates it with the given parameters
   * @param {String} sValueText   Text to set in the textnode of time element
   * @param {String} sValueAttrib Text to set into the datetime attribute of time element
   */
  const fUpdateTimeElement = function (sValueText, sValueAttrib) {
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
  };

  /**
   * Tries to delete the given id from localStorage after confirmation
   * @param {String} sId ID that should be tried to remove from localStorage
   * @returns {Boolean} If deletion was successful or not
   */
  const fDelete = function(sId) {
    if (typeof sId !== 'string' || sId === '') {
      self.console.log('Wrong format for parameter sId');
      return false;
    }

    let bQuestion = self.confirm('Do you really want to delete this entry?'),
      oDate = new Date();

    if (bQuestion && bStorage) {
      bQuestion = storageModule.remove(sId); // Overwrites bQuestion with boolean bSuccess from remove!
    }
    
    if (bQuestion) {
      // getDateTime()
      fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
      
    }
    return bQuestion;
  };

  /**
   * Creates the note item to include it in the DOM
   * @param {number} nId     Id for li element
   * @param {string} sText   Text for li element
   * @param {boolean} bFirst Item should be set on top
   */
  const fCreate = function(nId, sText, bFirst = false) {
    let oDate = new Date(nId),
      eLi = document.createElement('li'),
      eDiv = document.createElement('div'),
      eStr = document.createElement('strong'),
      eP = document.createElement('p'),
      eBtn = document.createElement('button'),
      sDate = fDateToString(oDate, 1);
      // getDateTime(nId)

    eStr.appendChild(document.createTextNode(sDate));

    eP.appendChild(document.createTextNode(sText));

    eBtn.setAttribute('type', 'button');
    eBtn.classList.add('btn', 'btn-danger', 'destroy');
    eBtn.appendChild(document.createTextNode('Delete'));

    eDiv.appendChild(eStr);
    eDiv.appendChild(eP);
    eDiv.appendChild(eBtn);

    eLi.classList.add('list-group-item');
    eLi.setAttribute('id', nId);
    
    eBtn.addEventListener('click', () => { 
      if(fDelete(eLi.attributes.id.value)) {
        eLi.remove();
      }
    });

    eLi.appendChild(eDiv);

    if (bFirst === true) {
      let eFirst;
      eFirst = eUl.childNodes[0];
      eUl.insertBefore(eLi, eFirst);
    } else {
      eUl.appendChild(eLi);
    }
  };

  /**
   * Get the content for the note and creates new elements to include in DOM
   * @param {String} sEntry  Content from textarea
   * @param {String} sAuthor Content from h2 element
   * @returns {Boolean} Save in localStorage was successful or not
   */
  const fSave = function(sEntry, sAuthor) {
    let bSuccess = true, // When no localStorage is available, set only to DOM
      oDate = new Date(),
      nKey = oDate.getTime();
      // getDateTime()

    if (sEntry === '' || sEntry === sDefaultText) {
      return false;
    }

    if (bStorage) {
      if (sAuthor !== sDefaultAuthor) {
        bSuccess = storageModule.save('author', sAuthor);
      }
      bSuccess = storageModule.save(nKey.toString(), sEntry);
    }
    if (bSuccess) {
      fCreate(nKey, sEntry, true);
      fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
    }
    return bSuccess;
  };

  /** 
   * Get entries from Storage and writes the information for each item into DOM
   * @returns {String} value read from aEntries with key author or an empty string
   */
  const fReadStore = function () {
    let aEntries = storageModule.getList(),
      bUpdate = true,
      oDate = new Date(),
      sAuthor = '';
    
    for (let i = 0; i < aEntries.length; i = i + 1) {
      let oEntry = aEntries[i],
        nCheck = parseInt(oEntry.key, 10);
        //getDateTime(nCheck)

      if (isNaN(nCheck)) {
        if (oEntry.key === 'author') {
          sAuthor = oEntry.value;
        }
      } else {
        oDate.setTime(nCheck);
        // This updates the information in 'Last updated' with the date of the first entry
        if (bUpdate) {
          fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
          bUpdate = false;
        }

        fCreate(nCheck, oEntry.value);
      }
    }
    return sAuthor;
  };

  /**
   * Init the module. Reads information from localstorage and add existing items.
   * @param {String} sTextDef   The existing text in textarea
   * @param {String} sAuthorDef The default text in h2 element
   * @returns {String} Content from fReadstore or h2 element 
   */
  const fInit = function(sTextDef, sAuthorDef) {
    let oDate = new Date(),
      sAuthor = '';

    // To set current date in case localStorage has no entries
    // fUpdateTimeElement(fDateToString(oDate, 1), fDateToString(oDate, 2));
  
    if (typeof(self.localStorage) === 'undefined') {
      infoModule.setText('No localStorage!');
      bStorage = false;
    } else {
      sAuthor = fReadStore();
    }

    if (typeof sTextDef === 'string') {
      sDefaultText = sTextDef;
    }

    if (typeof(sAuthorDef) === 'string') {
      sDefaultAuthor = sAuthorDef;
    }

    if (sAuthor === '') {
      return sAuthorDef;
    } else {
      return sAuthor;
    }
  };

  // Set public methods
  return {
    init: fInit,
    save: fSave,
  };
})();

/* The same as class */
class NoteModule {
  constructor (eUl) {
    this.infoModule = new InfoModule();
    this.bStorage = true,
    this.storageModule = new StorageModule(),
    this.eUl = eUl,
    this.sDefaultAuthor = '',
    this.sDefaultText = '';
  }

  delete() {}

  create() {}

  save() {}

  readStore() {}

  init() {}
}