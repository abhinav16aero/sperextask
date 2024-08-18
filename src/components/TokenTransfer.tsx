import React, { useState } from 'react';
import { ethers } from 'ethers';

const TokenTransfer = ({ walletAddress, tokenAddress }: { walletAddress: string; tokenAddress: string }) => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); // Use string to handle input values
  const [transactionHash, setTransactionHash] = useState<string | null>(null); // Use null initially
  const [error, setError] = useState<string | null>(null); // Added error state

  const transferTokens = async () => {
    if (!window.ethereum) {
      setError('Ethereum provider is not available');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokenAddress,
        ['function transfer(address to, uint256 amount)'],
        signer
      );

      // Parse amount as BigNumber and handle empty or invalid input
      if (!amount || isNaN(parseFloat(amount))) {
        setError('Invalid amount');
        return;
      }

      const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, 'ether'));
      setTransactionHash(tx.hash);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error during token transfer:', err);
      setError('Transaction failed. Check the console for details.');
      setTransactionHash(null); // Clear transaction hash on error
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={transferTokens}>Transfer Tokens</button>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default TokenTransfer;
