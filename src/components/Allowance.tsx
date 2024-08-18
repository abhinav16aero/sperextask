import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Allowance {
  contract: string;
  allowance: number;
}

const Allowance = ({ walletAddress, tokenAddress }: { walletAddress: string; tokenAddress: string }) => {
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [newAllowance, setNewAllowance] = useState<string>(''); // Use string to handle input values
  const [contractAddress, setContractAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // Added error state

  const fetchAllowances = async () => {
    if (!window.ethereum) {
      setError('Ethereum provider is not available');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, ['function allowance(address owner, address spender) view returns (uint256)'], provider);
      
      // Assuming the allowances are fetched from the contract
      const allowance: ethers.BigNumber = await contract.allowance(walletAddress, contractAddress);
      setAllowances([{ contract: contractAddress, allowance: parseFloat(ethers.utils.formatUnits(allowance, 'ether')) }]); // Update allowances
      
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching allowances:', err);
      setError('Failed to fetch allowances. Check the console for details.');
    }
  };

  const setAllowance = async () => {
    if (!window.ethereum) {
      setError('Ethereum provider is not available');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, ['function approve(address spender, uint256 amount)'], signer);
      
      // Parse newAllowance as BigNumber and handle empty or invalid input
      if (!newAllowance || isNaN(parseFloat(newAllowance))) {
        setError('Invalid allowance amount');
        return;
      }

      const tx = await contract.approve(contractAddress, ethers.utils.parseUnits(newAllowance, 'ether'));
      await tx.wait(); // Wait for transaction confirmation
      
      // Refresh the allowances state
      fetchAllowances();
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error setting allowance:', err);
      setError('Transaction failed. Check the console for details.');
    }
  };

  useEffect(() => {
    fetchAllowances();
  }, [contractAddress, tokenAddress]); // Add dependencies to refetch when contractAddress or tokenAddress changes

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Allowance</th>
          </tr>
        </thead>
        <tbody>
          {allowances.map((allowance) => (
            <tr key={allowance.contract}>
              <td>{allowance.contract}</td>
              <td>{allowance.allowance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <input
        type="text"
        placeholder="Enter Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />
      <input
        type="text" // Changed to text to handle string values directly
        placeholder="Set Allowance"
        value={newAllowance}
        onChange={(e) => setNewAllowance(e.target.value)}
      />
      <button onClick={setAllowance}>Set Allowance</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default Allowance;
