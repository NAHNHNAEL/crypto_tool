import User from '../models/user.js';
import BaseController from './BaseController.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendVerificationEmail from '../services/mailer.js';
import TokenList from '../models/token-list.js';
import ccxt from 'ccxt';
import Exchange from '../models/exchange.js';

dotenv.config();

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
            // Check if password is correct
            // Encrypt password and compare with stored password
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                // Redirect to login page with error message
                const errorMessage = 'Invalid email or password';
                this.setErrorMessage(errorMessage);
                this.renderView(res, 'admin/login');
                return;
            }
            // Set session
            req.session.admin = user;
            // Redirect to dashboard
            res.redirect('/admin/dashboard');
        } catch (error) {
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
        const { email, role, password } = req.body;

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
           
            // Create token for email verification
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            // Create email transporter
            await sendVerificationEmail(email, token);

            // Register user using model
            const user = new User({
                username: email,
                email: email,
                password: password,
                role: role,
                verificationToken: token
            });
            await user.save();

            // Redirect to dashboard
            res.redirect('/admin/dashboard');
        } catch (error) {
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
            const errorMessage = 'Error deleting user';
            this.setErrorMessage(errorMessage);
            // Redirect to dashboard with error message
            this.renderView(res, 'admin/dashboard');
        }
    }

    /**
     * Get add new token page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getAddNewTokenPage = async (req, res, next) => {
        this.setTitle('Add New Token');
        this.setErrorMessage('');
        this.setSuccessMessage('');
        // Get all exchanges
        const exchanges = await Exchange.find();
        // Check if exchanges exist
        if (!exchanges) {
            // Redirect to add new token page with error message
            const errorMessage = 'Error fetching exchanges';
            this.setErrorMessage(errorMessage);
            this.renderView(res, 'admin/add_new_token');
            return;
        }

        // Render add new token page with exchanges
        this.renderView(res, 'admin/add_new_token', { exchanges: exchanges });
    }

    /**
     * Register new token
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    registerNewToken = async (req, res, next) => {
        // Setting title
        this.setTitle('Add New Token');
        // Get token data from form
        const token = req.body;
        // Register token
        try {
            // Register token using model
            const newToken = new TokenList({
                tokenName: token.tokenName.toUpperCase(),
                key1: token.key1,
                key2: token.key2,
                key3: token.key3,
                key4: token.key4,
                key5: token.key5,
                target1: token.target1,
                target2: token.target2,
                target3: token.target3,
                target4: token.target4,
                target5: token.target5,
                target6: token.target6,
                target7: token.target7,
                exchange: token.exchange,
            });
            await newToken.save();
            // Redirect to add new token page with success message
            const successMessage = 'Token registered successfully';
            this.setSuccessMessage(successMessage);
            this.getTokenListPage(req, res, next);
        } catch (error) {
            // Redirect to add new token page with error message
            const errorMessage = 'Error registering token';
            this.setErrorMessage(errorMessage);
            this.renderView(res, 'admin/add_new_token');
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
    getTokenListPage = async (req, res, next) => {
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
        // Render token list page with tokens
        this.renderView(res, 'admin/token_list', { tokens: tokens });
    }

    /**
     * Delete token
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    deleteToken = async (req, res, next) => {
        // Setting title
        this.setTitle('Delete Token');
        this.setErrorMessage('');
        this.setSuccessMessage('');
        // Get token id from form
        const { tokenId } = req.body;
        // Delete token
        try {
            await TokenList.findByIdAndDelete(tokenId);
            // Redirect to token list
            this.getTokenListPage(req, res, next);
        } catch (error) {
            const errorMessage = 'Error deleting token';
            this.setErrorMessage(errorMessage);
            // Redirect to token list with error message
            this.renderView(res, 'admin/token_list');
        }
    }

    /**
     * Get edit token page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getEditTokenPage = async (req, res, next) => {
        this.setTitle('Edit Token');
        this.setErrorMessage('');
        this.setSuccessMessage('');
        // Get token id from request
        const { id } = req.params;
        // Find token by id
        const token = await TokenList.findById(id);
        // Check if token exists
        if (!token) {
            // Redirect to token list with error message
            this.setErrorMessage('Token not found');
            this.getTokenListPage(req, res, next);
            return;
        }
        // Get exchanges
        const exchanges = await Exchange.find();
        // Check if exchanges exist
        if (!exchanges) {
            // Redirect to edit token page with error message
            const errorMessage = 'Error fetching exchanges';
            this.setErrorMessage(errorMessage);
            this.renderView(res, 'admin/edit_token');
            return;
        }
        // Render edit token page with token and exchanges
        this.renderView(res, 'admin/edit_token', { token: token, exchanges: exchanges });
    }

    /**
     * Update token
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    updateToken = async (req, res, next) => {
        // Setting title
        this.setTitle('Edit Token');
        // Get token data from form
        const token = req.body;
        console.log(token);
        // Update token
        try {
            // Update token using model
            await TokenList.findByIdAndUpdate(token.id, {
                tokenName: token.tokenName.toUpperCase(),
                key1: token.key1,
                key2: token.key2,
                key3: token.key3,
                key4: token.key4,
                key5: token.key5,
                target1: token.target1,
                target2: token.target2,
                target3: token.target3,
                target4: token.target4,
                target5: token.target5,
                target6: token.target6,
                target7: token.target7,
                exchange: token.exchange,
            });
            // Redirect to token list with success message
            const successMessage = 'Token updated successfully';
            this.setSuccessMessage(successMessage);
            this.getTokenListPage(req, res, next);
        } catch (error) {
            // Redirect to edit token page with error message
            const errorMessage = 'Error updating token';
            this.setErrorMessage(errorMessage);
            this.renderView(res, 'admin/edit_token');
        }
    }

    /**
     * Get token price page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getTokenPricePage = async (req, res, next) => {
       
        try {
            this.setTitle('Token Price');
            this.setErrorMessage('');
            this.setSuccessMessage('');

            const tokens = await TokenList.find(); // Lấy danh sách tất cả các token từ database
            this.renderView(res, 'admin/token_price', { tokens: tokens });
          } catch (error) {
            console.error('Error fetching token list:', error);
            res.status(500).send('Internal Server Error');
          }
    }

    /**
     * Get exchange list page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * @async
     * 
     * */
    getExchangeListPage = async (req, res, next) => {
        this.setTitle('Exchange List');
        this.setErrorMessage('');
        this.setSuccessMessage('');
        // Get all exchanges
        const exchanges = await Exchange.find();
        // Render exchange list page with exchanges
        this.renderView(res, 'admin/exchange_list', { exchanges: exchanges });
    }

    /**
     * Get add new exchange page
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     * @param {function} next - Express next middleware function
     * @returns {void}
     * 
     * */
    addNewExchange = async (req, res, next) => {

        try {
            this.setTitle('Add New Exchange');
            this.setErrorMessage('');
            this.setSuccessMessage('');
            const exchangeInfo = req.body;
            console.log(exchangeInfo);

            // Check exchange is exist by exchangeID
            const exchange = await Exchange.findOne({ exchangeID: exchangeInfo.id });
            if (exchange) {
                // Redirect to add new exchange page with error message
                const errorMessage = 'Exchange already exists';
                this.setErrorMessage(errorMessage);
                this.renderView(res, 'admin/exchange_list');
                return;
            }
            // Register exchange using model
            const newExchange = new Exchange({
                exchangeID: exchangeInfo.id,
                exchangeName: exchangeInfo.name,
                exchangeType: exchangeInfo.type,
                exchangeUrl: exchangeInfo.logo,
                createdAt: new Date(),
            });
            await newExchange.save();
            // Redirect to exchange list page with success message
            const successMessage = 'Exchange registered successfully';
            this.setSuccessMessage(successMessage);
            this.getExchangeListPage(req, res, next);
        } catch (error) {
            console.error('Error fetching exchange list:', error);
            res.status(500).send('Internal Server Error');
            
        }
    }
}

export default new AdminController();