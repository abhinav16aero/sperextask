import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

interface Token {
  address: string;
  symbol: string;
  balance: number;
}

const WatchList = ({ walletAddress }: { walletAddress: string }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newTokenAddress, setNewTokenAddress] = useState<string>('');

  const addToken = async () => {
    if (!window.ethereum) {
      console.error('Ethereum provider is not available');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        newTokenAddress,
        ['function symbol() view returns (string)', 'function balanceOf(address) view returns (uint256)'],
        provider
      );

      const symbol: string = await contract.symbol();
      const balance: ethers.BigNumber = await contract.balanceOf(walletAddress);
      const formattedBalance: number = parseFloat(ethers.utils.formatEther(balance));

      setTokens([...tokens, { address: newTokenAddress, symbol, balance: formattedBalance }]);
      setNewTokenAddress('');
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Token Address"
        value={newTokenAddress}
        onChange={(e) => setNewTokenAddress(e.target.value)}
      />
      <button onClick={addToken}>Add Token</button>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.address}>
              <td>{token.symbol}</td>
              <td>{token.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WatchList;
