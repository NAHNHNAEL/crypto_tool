import express from 'express';
// Import user controller
import UserController from '../controllers/UserController.js';
// import auth middleware
import { isAuthenticated } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Get login page
userRouter.get('/login', UserController.getLoginPage);
// Post login data
userRouter.post('/login', UserController.doLogin);
// Get dashboard page
userRouter.get('/dashboard',isAuthenticated, UserController.getDashboardPage);
// Post logout data
userRouter.post('/logout',isAuthenticated, UserController.doLogout);


// Define your routes here

export default userRouter;