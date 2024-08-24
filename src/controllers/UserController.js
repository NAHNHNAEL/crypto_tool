

/**
 * Represents a user controller.
 * @class
 */
class UserController {
    
    async getDashboardPage(req, res, next) {
        res.render('users/dashboard', { title: 'Dashboard' });
    }
}

export default new UserController();