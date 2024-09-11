// BaseController.js
class BaseController {
    constructor() {
      this.title = 'Default Title';
      this.errorMessage = '';
      this.redirectUrl = '';
      this.successMessage = '';
    }
  
    setTitle(title) {
      this.title = title;
    }

    setErrorMessage(errorMessage) {
        this.errorMessage = errorMessage;
    }

    setRedirectUrl(redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    setSuccessMessage(successMessage) {
        this.successMessage = successMessage;
    }
  
    renderView(res, view, options = {}) {
      options.title = this.title;
      options.errorMessage = this.errorMessage;
      options.redirectUrl = this.redirectUrl;
      options.successMessage = this.successMessage;
      res.render(view, options);
    }
  }

export default BaseController;