/**
 * Module to generate a Message in a toaster
 */
self.mDebug = (function () {
  /**
   * inits and shows the toaster. This is taken from bootstrap documentation
   */
  const fShow = function() {
    try {
      let toastElList = [].slice.call(document.querySelectorAll('.toast'));
      let toastList = toastElList.map(function (toastEl) {
        return new self.bootstrap.Toast(toastEl, {delay:1500});
      });
      for (const toast of toastList) {
        toast.show();
      }
    } catch (e) {
      self.console.error(e);
    }
  };

  /**
   * Defines the toster and set it into the right position in DOM
   * @param {string} sText Text that should be shown in toaster
   */
  const fCreateOutput = function(sText) {
    if (typeof sText !== 'string' || sText === '') {
      self.console.warn('Format of parameter was not correct');
      return;
    }
    let eCntner = document.getElementById('debug'),
      eDvTst = document.createElement('div'),
      eDvHdr = document.createElement('div'),
      eDvBdy = document.createElement('div'),
      eStrng = document.createElement('strong');

    eStrng.appendChild(document.createTextNode('Info'));
    
    eDvHdr.classList.add('toast-header', 'bg-info');
    eDvHdr.appendChild(eStrng);
    
    eDvBdy.classList.add('toast-body');
    eDvBdy.appendChild(document.createTextNode(sText));
    
    eDvTst.classList.add('toast');
    eDvTst.setAttribute('role', 'alert');
    eDvTst.appendChild(eDvHdr);
    eDvTst.appendChild(eDvBdy);
    
    //Removes the content from DOM, after toaster was shown.
    eDvTst.addEventListener('hidden.bs.toast', function () {
      eDvTst.remove();
    });

    eCntner.appendChild(eDvTst);
  };

  /**
   * Gets a text to show in the toaster.
   * @param {string} sText Message, that could be set to the debug body
   */
  const fSetText = function (sText) {
    if (typeof sText === 'string' && sText !== '') {
      fCreateOutput(sText);
      fShow();
    } else {
      self.console.warn('Format of parameter was not correct');
    }
  };

  // Set the public methods
  return {
    setText: fSetText
  };
})();


/* the same as Module */
class InfoModule {
  constructor() {
    this.toastrText = '';
  }

  show() {
    try {
      let toastElList = [].slice.call(document.querySelectorAll('.toast'));
      let toastList = toastElList.map(function (toastEl) {
        return new self.bootstrap.Toast(toastEl, {delay:1500});
      });
      for (const toast of toastList) {
        toast.show();
      }
    } catch (e) {
      self.console.error(e);
    }
  }
  
  createOutput() {
    let eCntner = document.getElementById('debug'),
      eDvTst = document.createElement('div'),
      eDvHdr = document.createElement('div'),
      eDvBdy = document.createElement('div'),
      eStrng = document.createElement('strong');

    eStrng.appendChild(document.createTextNode('Info'));
    
    eDvHdr.classList.add('toast-header', 'bg-info');
    eDvHdr.appendChild(eStrng);
    
    eDvBdy.classList.add('toast-body');
    eDvBdy.appendChild(document.createTextNode(this.toastrText));
    
    eDvTst.classList.add('toast');
    eDvTst.setAttribute('role', 'alert');
    eDvTst.appendChild(eDvHdr);
    eDvTst.appendChild(eDvBdy);
    
    //Removes the content from DOM, after toaster was shown.
    eDvTst.addEventListener('hidden.bs.toast', function () {
      eDvTst.remove();
    });

    if (eCntner.appendChild(eDvTst)) {
      this.show();
    }
  }

  /**
   * Gets a text to show in the toaster.
   * @param {string} sText Message, that could be set to the debug body
   */
  setText(sText) {
    if (typeof sText !== 'string' || sText === '') {
      self.console.warn('Format of parameter was not correct');
      this.toastrText = '';
      return;
    }
    this.toastrText = sText;
    this.createOutput();
  }
}