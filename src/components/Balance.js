import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const Balance = ({ account }) => {
  const [balance, setBalance] = useState(0);
  const [badge, setBadge] = useState('');

  useEffect(() => {
    const getBalance = async () => {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      try {
        const balance = await web3.eth.getBalance(account);
        const balanceInEth = web3.utils.fromWei(balance, 'ether');
        console.log(`Fetched balance for account ${account}: ${balanceInEth} ETH`);
        setBalance(balanceInEth);
        determineBadge(balanceInEth);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    const determineBadge = (balance) => {
      if (balance >= 100) {
        setBadge('Gold');
      } else if (balance >= 50) {
        setBadge('Silver');
      } else {
        setBadge('Bronze');
      }
    };

    getBalance();
  }, [account]);

  return (
    <div className="balance-info">
      <h4>Wallet Balance: {balance} ETH</h4>
      <h5>Badge: {badge}</h5>
    </div>
  );
};

export default Balance;
