import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import necessary components from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = '4P35FDRB8M6W8FMUWX7Y7CC8D146KD4N64'; // Replace with your Etherscan API key

const HistoricalData = ({ walletAddress, tokenAddress }: { walletAddress: string; tokenAddress: string }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  const fetchHistoricalData = async () => {
    if (startDate && endDate) {
      // Convert dates to Unix timestamps
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      try {
        const response = await axios.get(`https://api.etherscan.io/api`, {
          params: {
            module: 'account',
            action: 'txlist',
            address: walletAddress,
            startblock: '0',
            endblock: '99999999',
            sort: 'asc',
            apikey: API_KEY,
          },
        });

        const transactions = response.data.result;

        // Filter transactions based on the date range
        const filteredTransactions = transactions.filter((tx: any) => {
          const txTimestamp = parseInt(tx.timeStamp, 10);
          return txTimestamp >= startTimestamp && txTimestamp <= endTimestamp;
        });

        // Process filtered transactions into balance data
        // This is a simple example; you may need more advanced logic for real applications
        const balanceData = filteredTransactions.map((tx: any) => ({
          date: new Date(tx.timeStamp * 1000).toLocaleDateString(),
          balance: parseFloat(tx.value) / 1e18, // Convert Wei to Ether
        }));

        setHistoricalData(balanceData);

      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    }
  };

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        dateFormat="yyyy/MM/dd"
      />
      <DatePicker
        selected={endDate}
        onChange={(date: Date | null) => setEndDate(date)}
        dateFormat="yyyy/MM/dd"
      />
      <button onClick={fetchHistoricalData}>Fetch Historical Data</button>
      <Line
        data={{
          labels: historicalData.map((data) => data.date),
          datasets: [
            {
              label: 'Balance',
              data: historicalData.map((data) => data.balance),
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Balance (ETH)',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default HistoricalData;
