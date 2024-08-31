import User from '../models/user.js';
import BaseController from './BaseController.js';
import bcrypt from 'bcryptjs';

/**
 * Represents a user controller.
 * @class
 */
class UserController extends BaseController {
    
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
        this.setTitle('Dashboard');
        this.setErrorMessage('');
        
        // Render dashboard page
        this.renderView(res, 'users/dashboard');
    }

    /**
     * Get login page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getLoginPage = async (req, res, next) => {
        this.setTitle('Login');

        // Render login page
        this.renderView(res, 'users/login');
    }

    /**
     * Post login data
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    doLogin = async(req, res, next) => {
        // Get user data from form
        const { email, password } = req.body;

        try {
            // Find user by email
            const user = await User.findOne({email: email});
            // Check if user exists
            if (!user) {
                // Set error message
                this.setErrorMessage('Invalid login details');
                // Render login page with error message
                this.renderView(res, 'users/login');
                return;
            }
            // Check if password is correct
            // Encrypt password and compare
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch === false) {
                // Set error message
                this.setErrorMessage('Invalid login details');
                // Render login page with error message
                this.renderView(res, 'users/login');
                return;
            }
            // Set user session
            req.session.user = user;
            // Redirect to dashboard
            res.redirect('/user/dashboard');
        }catch(err) {
            // Set error message
            this.setErrorMessage('An error occurred');
            // Render login page with error message
            this.renderView(res, 'users/login');
        }
    }

    /**
     * Post logout data
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    doLogout = async(req, res, next) => {
        // Destroy session
        req.session.destroy();
        // Redirect to login page
        res.redirect('/user/login');
    }
}

export default new UserController();