import React, { useState } from 'react';
import WalletConnection from './components/WalletConnections';
import WatchList from './components/WatchList';
import HistoricalData from './components/HistoricalData';
import Allowance from './components/Allowance';
import TokenTransfer from './components/TokenTransfer';

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Token Portfolio Manager</h1>
      <WalletConnection onChange={handleWalletAddressChange} />
      <WatchList walletAddress={walletAddress} />
      <HistoricalData walletAddress={walletAddress} tokenAddress={tokenAddress} />
      <Allowance walletAddress={walletAddress} tokenAddress={tokenAddress} />
      <TokenTransfer walletAddress={walletAddress} tokenAddress={tokenAddress} />
    </div>
  );
}

export default App;
