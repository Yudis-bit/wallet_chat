const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Network, Alchemy } = require('alchemy-sdk');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY || "QdBTnsO9zdFkfycyIGmNRFiFYVsDQuNB",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('fetchBalance', async (address) => {
    try {
      const balance = await alchemy.core.getBalance(address);
      const balanceInEth = (parseFloat(balance) / (10 ** 18)).toFixed(4); // Convert to ETH and fix to 4 decimals
      socket.emit('balance', { account: address, balance: balanceInEth });
    } catch (error) {
      console.error('Error fetching balance:', error);
      socket.emit('error', 'Failed to fetch balance');
    }
  });

  socket.on('message', (message) => {
    console.log('Message received: ', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
