

/**
 * Represents a user controller.
 * @class
 */
class AdminController {
    
    async getDashboardPage(req, res, next) {
        res.render('admin/dashboard', { title: 'Admin Dashboard' });
    }
}

export default new AdminController();