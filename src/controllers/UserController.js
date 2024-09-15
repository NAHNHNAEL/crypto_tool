import User from '../models/user.js';
import BaseController from './BaseController.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendVerificationEmail from '../services/mailer.js';
import dotenv from 'dotenv';
import TokenList from '../models/token-list.js';

dotenv.config();
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
        this.setErrorMessage('');
        this.setSuccessMessage('');

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

            // Check if user is verified
            if (!user.isVerified) {
                // Set error message
                this.setErrorMessage('Please verify your email');
                // Setting redirect URL to page verify email
                this.setRedirectUrl('/user/verify-email');
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

    /**
     * Verification email user before login
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    verifyEmail = async(req, res, next) => {
        try {
            // Get token from query
            const { token } = req.query;
            console.log(token);

            if (!token) {
                this.setTitle('Verify Email');
                this.renderView(res, 'users/verify_email');
                return;
            }

            // Decode token to get email
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { email } = decoded;

            // Find user by email
            const user = await User.findOne({ email, verificationToken: token });
            console.log(user);

            if (!user) {
                this.setTitle('Verify Email');
                this.setErrorMessage('Invalid token or user not found');
                this.renderView(res, 'users/verify_email');
                return;
            }

            // Update user to set isVerified to true
            user.isVerified = true;
            user.verificationToken = ""; // Clear the verification token
            await user.save();

            // Redirect to login page with success message
            this.setSuccessMessage('Email verified. You can now login');
            this.setTitle('Login');
            this.setErrorMessage('');
            this.renderView(res, 'users/login');
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                this.setTitle('Verify Email');
                this.renderView(res, 'users/verify_email', { errorMessage: 'Token has expired' });
            } else if (error.name === 'JsonWebTokenError') {
                this.setTitle('Verify Email');
                this.renderView(res, 'users/verify_email', { errorMessage: 'Invalid token' });
            } else {
                console.error('Error verifying email:', error);
                res.status(500).json({ message: 'Server error' });
            }
        }
    }

    /**
     * Resend verification email to user
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    resendVerificationEmail = async(req, res, next) => {
        try {
            // Get email from query
            const { email } = req.body;

            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                this.setTitle('Error');
                this.setErrorMessage('User not found');
                this.renderView(res, 'sites/error');
                return;
            }

            // Create token for email verification
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Update user with verification token
            user.verificationToken = token;
            await user.save();

            // Send verification email
            await sendVerificationEmail(user.email, token);

            // Setting success message
            this.setSuccessMessage('Verification email sent. Check your email');
            // Redirect to verify email page with success message
            this.renderView(res, 'users/verify_email');
        } catch (error) {
            console.error('Error resending verification email:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    /**
     * Get token list page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getTokenListPage = async(req, res, next) => {
        this.setTitle('Token List');
        this.setErrorMessage('');
        this.setSuccessMessage('');

        // Get all tokens
        const tokens = await TokenList.find();
        // Check if tokens exist
        if (!tokens) {
            // Redirect to add new token page with error message
            tokens = [];
        }

        // Render token list page
        this.renderView(res, 'users/token_list', { tokens: tokens });
    }

}

export default new UserController();