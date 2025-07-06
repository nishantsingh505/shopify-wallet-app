import React, { useState, useEffect } from "react";
import axios from "axios";

const WalletDashboard = ({ customerId }) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!customerId) return;
    axios.get(`http://localhost:3001/api/wallet/${customerId}`)
      .then(res => {
        setBalance(res.data.balance);
        setTransactions(res.data.transactions || []);
      });
  }, [customerId]);

  const handleRecharge = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    const res = await axios.post(`http://localhost:3001/api/wallet/recharge`, {
      customerId,
      amount: Number(amount),
    });
    setBalance(res.data.balance);
    setAmount('');
    // Reload transactions:
    const updated = await axios.get(`http://localhost:3001/api/wallet/${customerId}`);
    setTransactions(updated.data.transactions || []);
  };

  return (
    <div style={{ margin: "24px 0", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Wallet Balance: ₹{balance}</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleRecharge}>Recharge</button>
      <h4 style={{ marginTop: 16 }}>Transaction History:</h4>
      <ul>
        {transactions.slice().reverse().map((t, i) => (
          <li key={i}>
            [{t.type}] ₹{t.amount} - {t.remark} ({new Date(t.date).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WalletDashboard;
