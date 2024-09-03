import User from '../models/user.js';
import BaseController from './BaseController.js';
import bcrypt from 'bcryptjs';

/**
 * Represents a user controller.
 * @class
 */
class AdminController extends BaseController {
    
    constructor() {
        super();
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
        this.setTitle('Admin Login');
        // Render login page
        this.renderView(res, 'admin/login');
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
                // Redirect to login page with error message
                const errorMessage = 'Invalid email or password';
                this.setErrorMessage(errorMessage);
                this.renderView(res, 'admin/login');
                return;
            }
            console.log(user);
            console.log('Stored hashed password:', user.password);
            console.log('password:', password);
            // Check if password is correct
            // Encrypt password and compare with stored password
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            console.log('isPasswordCorrect:', isPasswordCorrect);
            if (!isPasswordCorrect) {
                console.log(0);
                // Redirect to login page with error message
                const errorMessage = 'Invalid email or password';
                this.setErrorMessage(errorMessage);
                this.renderView(res, 'admin/login');
                return;
            }
            // Set session
            req.session.admin = user;
            console.log(1);
            // Redirect to dashboard
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
            // Redirect to login page with error message
            const errorMessage = 'Error logging in';
            this.setErrorMessage(errorMessage);
            this.renderView(res, 'admin/login');
            return;
        }
    }

    /**
     * Do logout
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    doLogout = async (req, res, next) => {
        // Destroy session
        req.session.destroy();
        // Redirect to login page
        res.redirect('/admin/login');
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