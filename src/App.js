import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);

  const onLoginClick = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error('User denied account access');
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  return (
    <div>
      {!account ? (
        <Login onLoginClick={onLoginClick} />
      ) : (
        <Chat account={account} />
      )}
    </div>
  );
}

export default App;
