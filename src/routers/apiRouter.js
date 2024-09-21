import express from 'express';
import getTokenPricesFirstTimeRouter from './api/getTokenPricesFirstTimeRouter.js';

const apiRouter = express.Router();

apiRouter.use('/get-token-prices-first-time', getTokenPricesFirstTimeRouter);

export default apiRouter;