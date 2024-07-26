import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Balance = ({ account }) => {
  const [balance, setBalance] = useState(0);
  const [badge, setBadge] = useState('');

  useEffect(() => {
    const getBalance = () => {
      socket.emit('fetchBalance', account);
    };

    socket.on('balance', ({ account, balance }) => {
      console.log(`Fetched balance for account ${account}: ${balance} ETH`);
      setBalance(balance);
      determineBadge(balance);
    });

    socket.on('error', (errorMessage) => {
      console.error(errorMessage);
    });

    getBalance();

    return () => {
      socket.off('balance');
      socket.off('error');
    };
  }, [account]);

  const determineBadge = (balance) => {
    if (balance >= 100) {
      setBadge('Gold');
    } else if (balance >= 50) {
      setBadge('Silver');
    } else {
      setBadge('Bronze');
    }
  };

  return (
    <div className="balance-info">
      <h4>Wallet Balance: {balance} ETH</h4>
      <h5>Badge: {badge}</h5>
    </div>
  );
};

export default Balance;
