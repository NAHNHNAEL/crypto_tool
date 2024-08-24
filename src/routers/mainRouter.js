import express from "express";

// Create main router
const mainRouter = express.Router();

// Import file defined router function
// import siteRouter from "./siteRouter.js";
import userRouter from "./userRouter.js";
import adminRouter from "./adminRouter.js";

// Define main router
mainRouter.use("/admin", adminRouter);
mainRouter.use("/user", userRouter);
// mainRouter.use("/", siteRouter);

// Export main router
export default mainRouter;