import User from '../models/user.js';
import BaseController from './BaseController.js';

/**
 * Represents a user controller.
 * @class
 */
class AdminController extends BaseController {
    
    constructor() {
        super();
    }

    /**
     * Get dashboard page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getDashboardPage = async (req, res, next) => {
        this.setTitle('Admin Dashboard');
        this.setErrorMessage('');
        // Get all users
        const users = await User.find();
        // Render dashboard page with users
        this.renderView(res, 'admin/dashboard', { users: users });
    }

    /**
     * Get add new user page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getAddNewUserPage = async (req, res, next) => {
        this.setTitle('Add New User');
        // Render add new user page
        this.renderView(res, 'admin/add_new_user');
    }

    /**
     * Register new user
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    registerNewUser = async(req, res, next) => {
        // Setting title
        this.setTitle('Add New User');
        // Get user data from form
        const { email, password } = req.body;

        // Register user
        try {
            // Check if user already exists
            const userExists = await User.findOne({ email: email });
            if (userExists) {
                // Redirect to add new user page with error message
                const errorMessage = 'User already exists';
                this.setErrorMessage(errorMessage);
                this.renderView(res, 'admin/add_new_user');
            }
            // Register user using model
            const user = new User({ email, password });
            await user.save();
            // Redirect to dashboard
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
            // Redirect to add new user page with error message
            const errorMessage = 'Error registering user';
            this.setErrorMessage(errorMessage);
            this.renderView(res, 'admin/add_new_user');
        }
    }

    /**
     * Delete user
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    deleteUser = async (req, res, next) => {
        // Setting title
        this.setTitle('Delete User');
        // Get user id from form
        const { userId } = req.body;
        // Delete user
        try {
            await User.findByIdAndDelete(userId);
            // Redirect to dashboard
            this.getDashboardPage(req, res, next);
        } catch (error) {
            console.log(error);
            const errorMessage = 'Error deleting user';
            this.setErrorMessage(errorMessage);
            // Redirect to dashboard with error message
            this.renderView(res, 'admin/dashboard');
        }
    }
}

export default new AdminController();