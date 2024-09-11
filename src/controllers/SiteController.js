import BaseController from "./BaseController.js";


class SiteController extends BaseController {
    getHomePage = async (req, res, next) => {
        this.setTitle('Home');
        this.setErrorMessage('');
        this.renderView(res, 'sites/home');
    }
}

export default new SiteController();