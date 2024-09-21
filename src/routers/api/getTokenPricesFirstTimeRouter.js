import express from 'express';
import ccxt from 'ccxt';

const router = express.Router();

router.post('/', async (req, res) => {
    const { tokens } = req.body;

    try {
      const prices = {};
  
      for (const token of tokens) {
        const symbol = `${token.tokenName}/USDT`;
        const ExchangeClass = ccxt[token.exchange];
        if (!ExchangeClass) {
          console.error(`Exchange ${token.exchange} not found`);
          continue;
        }
        const exchange = new ExchangeClass();
        const ticker = await exchange.fetchTicker(symbol);
        prices[symbol] = ticker.last;
      }
  
      res.json(prices);
    } catch (error) {
      console.error('Error fetching token prices:', error);
      res.status(500).json({ error: 'Error fetching token prices' });
    }
});

export default router;