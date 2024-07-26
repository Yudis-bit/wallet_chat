import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../App.css';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000', {
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
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (!balances[message.account]) {
        socket.emit('fetchBalance', message.account);
      }
    });

    socket.on('balance', ({ account, balance }) => {
      const badge = determineBadge(balance);
      setBalances((prevBalances) => ({ ...prevBalances, [account]: balance }));
      setBadges((prevBadges) => ({ ...prevBadges, [account]: badge }));
    });

    socket.on('error', (errorMessage) => {
      console.error(errorMessage);
    });

    return () => {
      socket.off('message');
      socket.off('balance');
      socket.off('error');
    };
  }, [balances]);

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
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
      </div>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.account}</strong> ({balances[msg.account] !== undefined ? balances[msg.account] : 'Loading...'} ETH, {badges[msg.account] !== undefined ? badges[msg.account] : 'Loading...'}): {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          className="form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
