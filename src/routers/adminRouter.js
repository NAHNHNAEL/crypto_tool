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


export default adminRouter;