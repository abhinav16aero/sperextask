// src/components/WalletConnection.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnection = () => {
  const [address, setAddress] = useState<string>('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
    } else {
      alert('Please install MetaMask or use another compatible wallet.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <input
        type="text"
        placeholder="Enter Wallet Address"
        value={address}
        onChange={handleInputChange}
      />
      <p>Connected Address: {address}</p>
    </div>
  );
};

export default WalletConnection;
