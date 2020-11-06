/** Class representing an inforamtion module. */
class InfoModule {

  constructor() {
    this.toastrText = '';
    this.eCntnr = document.getElementById('debug');
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

  /**
   * Creates the HTML elements for a toastr to the DOM. Also set an event listener that the toaster
   * could be removed by the Bootstrap Toast method.
   */
  createOutput() {
    let eDvTst = document.createElement('div'),
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
    eDvTst.addEventListener('hidden.bs.toast', () => eDvTst.remove());
    this.eCntnr.appendChild(eDvTst);
    this.show(eDvTst);
  }

  /**
   * Tries to show the created toastrs here.
   * @param {HTMLDivElement} eDvTst 
   */
  show(eDvTst) {
    try {
      // This code is taken from Bootstrap documentation
      let toastElList = [].slice.call(document.querySelectorAll('.toast'));
      let toastList = toastElList.map(toastEl => new self.bootstrap.Toast(toastEl, {delay:1500}));
      toastList.map(toast => toast.show());
    } catch (e) {
      self.console.warn('Bootstrap JS is not available now!', e);
      eDvTst.remove();
    }
  }
}