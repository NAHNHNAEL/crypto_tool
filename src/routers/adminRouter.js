import express from 'express';
// Import admin controller
import AdminController from '../controllers/AdminController.js';

const adminRouter = express.Router();

// Define your admin routes here

// Example route
adminRouter.get('/dashboard', AdminController.getDashboardPage);

export default adminRouter;