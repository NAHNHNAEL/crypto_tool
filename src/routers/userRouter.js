import express from 'express';
// Import user controller
import UserController from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.get('/dashboard', UserController.getDashboardPage);

// Define your routes here

export default userRouter;