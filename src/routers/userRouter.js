import express from 'express';
// Import user controller
import UserController from '../controllers/UserController.js';
// import auth middleware
import { isAuthenticatedUser } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Get login page
userRouter.get('/login', UserController.getLoginPage);
// Post login data
userRouter.post('/login', UserController.doLogin);
// Get dashboard page
userRouter.get('/dashboard',isAuthenticatedUser, UserController.getDashboardPage);
// Post logout data
userRouter.post('/logout',isAuthenticatedUser, UserController.doLogout);


// Define your routes here

export default userRouter;