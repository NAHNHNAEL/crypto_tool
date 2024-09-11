import express from "express";

// import controllers
import SiteController from "../controllers/SiteController.js";

// Create main router
const siteRouter = express.Router();

// Define your routes here
siteRouter.get("/", SiteController.getHomePage);

export default siteRouter;
