// BaseController.js
class BaseController {
    constructor() {
      this.title = 'Default Title';
      this.errorMessage = '';
    }
  
    setTitle(title) {
      this.title = title;
    }

    setErrorMessage(errorMessage) {
        this.errorMessage = errorMessage;
    }
  
    renderView(res, view, options = {}) {
      options.title = this.title;
      options.errorMessage = this.errorMessage;
      res.render(view, options);
    }
  }

export default BaseController;