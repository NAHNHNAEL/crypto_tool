import ccxt from 'ccxt';
import { Server } from 'socket.io';

let io;

export const initializeWebSocket = (server) => {
  try {
    io = new Server(server);
    io.on('connection', (socket) => {
      console.log('Client connected', socket.id);
      let tokens = [];

      socket.on('subscribeToTokens', async (tokenList) => {
        tokens = tokenList.map(token => ({
          symbol: `${token.tokenName}/USDT`,
          exchange: token.exchange
        }));
        console.log('Subscribed to tokens:', tokens);
      });

      const fetchTokenPrices = async () => {
        if (tokens.length === 0) return;

        try {
          const prices = {};

          for (const token of tokens) {
            const ExchangeClass = ccxt[token.exchange];
            if (!ExchangeClass) {
              console.error(`Exchange ${token.exchange} not found`);
              continue;
            }
            const exchange = new ExchangeClass();
            const ticker = await exchange.fetchTicker(token.symbol);
            prices[token.symbol] = ticker.last;
          }

          socket.emit('tokenPrices', prices);
        } catch (error) {
          console.error('Error fetching token prices:', error);
        }
      };

      // Gọi hàm fetchTokenPrices mỗi 5 giây
      const interval = setInterval(fetchTokenPrices, 3000);

      socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        clearInterval(interval);
      });

    });
  } catch (error) {
    console.error('Error initializing Socket.IO server:', error);
  }
};