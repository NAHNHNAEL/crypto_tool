import express from 'express';
// Import admin controller
import AdminController from '../controllers/AdminController.js';

const adminRouter = express.Router();

// Define your admin routes here

// Define your routes here
// Get dashboard page
adminRouter.get('/dashboard', AdminController.getDashboardPage);
// Get add new user page
adminRouter.get('/add-new-user', AdminController.getAddNewUserPage);
// Register new user
adminRouter.post('/add-new-user', AdminController.registerNewUser);
// Delete user
adminRouter.post('/delete-user', AdminController.deleteUser);


export default adminRouter;