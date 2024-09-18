import express from 'express';
// Import admin controller
import AdminController from '../controllers/AdminController.js';
import { isAuthenticatedAdmin } from '../middleware/authMiddleware.js';

const adminRouter = express.Router();

// Define your admin routes here

// Define your routes here
// Get login page
adminRouter.get('/login', AdminController.getLoginPage);
// Post login data
adminRouter.post('/login', AdminController.doLogin);
// Do logout
adminRouter.post('/logout', AdminController.doLogout);
// Get dashboard page
adminRouter.get('/dashboard',isAuthenticatedAdmin, AdminController.getDashboardPage);
// Get add new user page
adminRouter.get('/add-new-user',isAuthenticatedAdmin, AdminController.getAddNewUserPage);
// Register new user
adminRouter.post('/add-new-user',isAuthenticatedAdmin, AdminController.registerNewUser);
// Delete user
adminRouter.post('/delete-user',isAuthenticatedAdmin, AdminController.deleteUser);
// Get add new token page
adminRouter.get('/add-new-token',isAuthenticatedAdmin, AdminController.getAddNewTokenPage);
// Register new token
adminRouter.post('/add-new-token',isAuthenticatedAdmin, AdminController.registerNewToken);
// Get token list page
adminRouter.get('/token-list',isAuthenticatedAdmin, AdminController.getTokenListPage);
// Delete token
adminRouter.post('/delete-token',isAuthenticatedAdmin, AdminController.deleteToken);
// Get edit token page
adminRouter.get('/edit-token/:id',isAuthenticatedAdmin, AdminController.getEditTokenPage);
// Update token
adminRouter.post('/edit-token',isAuthenticatedAdmin, AdminController.updateToken);
// Get token price page
adminRouter.get('/token-price',isAuthenticatedAdmin, AdminController.getTokenPricePage);
// Get exchange list page
adminRouter.get('/exchange-list',isAuthenticatedAdmin, AdminController.getExchangeListPage);
// Add new exchange
adminRouter.post('/add-new-exchange',isAuthenticatedAdmin, AdminController.addNewExchange);



export default adminRouter;
