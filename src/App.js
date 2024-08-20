import React, { useState } from 'react';
import WalletConnection from './components/WalletConnections';
import WatchList from './components/WatchList';
import HistoricalData from './components/HistoricalData';
import Allowance from './components/Allowance';
import TokenTransfer from './components/TokenTransfer';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');

  const handleWalletAddressChange = (address) => {
    setWalletAddress(address);
  };

  const handleTokenAddressChange = (address) => {
    setTokenAddress(address);
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">SperexDAO Token Manager</h1>
      <div className="grid">
        <div className="card">
          <WalletConnection onChange={handleWalletAddressChange} />
        </div>
        <div className="card">
          <WatchList walletAddress={walletAddress} />
        </div>
        <div className="card">
          <HistoricalData walletAddress={walletAddress} tokenAddress={tokenAddress} />
        </div>
        <div className="card">
          <Allowance walletAddress={walletAddress} tokenAddress={tokenAddress} />
        </div>
        <div className="card">
          <TokenTransfer walletAddress={walletAddress} tokenAddress={tokenAddress} />
        </div>
      </div>
    </div>
  );
}

export default App;
