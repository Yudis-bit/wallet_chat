import React from 'react';
import '../App.css'; // Pastikan untuk mengimpor file CSS yang sesuai
import CustomLogo from './logo.png'; // Ganti dengan path ke logo baru
import MetaMaskLogo from './metamask.png'; // Ganti dengan path ke logo MetaMask

const Login = ({ onLoginClick }) => {
  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="login-card text-center p-4">
        <img src={CustomLogo} alt="Custom Logo" className="custom-logo mb-3" />
        <h2 className="mb-3">DisChat</h2>
        <p className="mb-4">
          Start chatting securely with your wallet. Connect your MetaMask wallet to begin.
        </p>
        <button className="btn btn-primary btn-lg d-flex align-items-center justify-content-center" onClick={onLoginClick}>
          <img src={MetaMaskLogo} alt="MetaMask Logo" className="metamask-logo mr-2" />
          Login with MetaMask
        </button>
      </div>
    </div>
  );
};

export default Login;
