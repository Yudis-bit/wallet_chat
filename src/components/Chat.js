import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Web3 from 'web3';
import '../App.css';

const socket = io('http://localhost:4000', {
  withCredentials: true,
  extraHeaders: {
    "Content-Type": "application/json"
  }
});

const Chat = ({ account }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [balances, setBalances] = useState({});
  const [badges, setBadges] = useState({});

  useEffect(() => {
    socket.on('message', async (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (!balances[message.account]) {
        const balance = await getBalance(message.account);
        const badge = determineBadge(balance);
        setBalances((prevBalances) => ({ ...prevBalances, [message.account]: balance }));
        setBadges((prevBadges) => ({ ...prevBadges, [message.account]: badge }));
      }
    });

    return () => {
      socket.off('message');
    };
  }, [balances]);

  const getBalance = async (account) => {
    try {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      const balance = await web3.eth.getBalance(account);
      return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return '0';
    }
  };

  const determineBadge = (balance) => {
    if (balance >= 100) {
      return 'Gold';
    } else if (balance >= 50) {
      return 'Silver';
    } else {
      return 'Bronze';
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { account, text: message });
      setMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <div className="chat-window mb-3">
        {messages.map((msg, index) => (
          <div key={index} className="alert alert-secondary">
            <strong>{msg.account}</strong> ({balances[msg.account] !== undefined ? balances[msg.account] : 'Loading...'} ETH, {badges[msg.account] !== undefined ? badges[msg.account] : 'Loading...'}): {msg.text}
          </div>
        ))}
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
