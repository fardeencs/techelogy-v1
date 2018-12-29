import * as toastr from 'toastr/toastr.js';

export class FlashMessage {
  private static options = {
    tapToDismiss: true,
    debug: false,

    showMethod: 'fadeIn', // fadeIn, slideDown, and show are built into jQuery
    showDuration: 300,
    showEasing: 'swing', // swing and linear are built into jQuery
    onShown: undefined,
    hideMethod: 'fadeOut',
    hideDuration: 1000,
    hideEasing: 'swing',
    onHidden: undefined,
    closeMethod: false,
    closeDuration: false,
    closeEasing: false,

    extendedTimeOut: 1000,
    iconClass: 'toast-info',
    positionClass: 'toast-bottom-right',
    timeOut: 2000,
    escapeHtml: false,
    newestOnTop: true,
    preventDuplicates: true,
    progressBar: true
  };

  constructor() {

  }

  /**
   *
   * @param type
   * @param message
   */
  private static setMessage(type, message) {
      toastr.options = this.options;
      toastr[type](message);
  }

  /**
   *
   * @param message
   */
  static setInfo(message) {
    this.setMessage('info', message);
  }

  /**
   *
   * @param message
   */
  static setSuccess(message) {
    this.setMessage('success', message);
  }

  /**
   *
   * @param message
   */
  static setWarning(message) {
    this.setMessage('warning', message);
  }

  /**
   *
   * @param message
   */
  static setError(message) {
    this.setMessage('error', message);
  }
}
