import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionDashboard = ({ customerId }) => {
  const [subs, setSubs] = useState([]);

  const loadSubs = () => {
    if (!customerId) return;
    axios.get(`http://localhost:3001/api/subscription/${customerId}`)
      .then(res => setSubs(res.data));
  };

  useEffect(() => {
    loadSubs();
    // eslint-disable-next-line
  }, [customerId]);

  return (
    <div style={{ margin: "24px 0", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h2>Your Subscriptions</h2>
      {subs.length === 0 && <p>No subscriptions found.</p>}
      {subs.map(sub => (
        <div key={sub._id} style={{ border: "1px solid #aaa", margin: "10px 0", padding: "8px", borderRadius: 5 }}>
          <div><b>Product ID:</b> {sub.productId}</div>
          <div><b>Quantity:</b> {sub.quantity}</div>
          <div><b>Schedule:</b> {sub.schedule?.type || JSON.stringify(sub.schedule)}</div>
          <div><b>Next Delivery:</b> {new Date(sub.nextDelivery).toLocaleDateString()}</div>
          <div><b>Status:</b> {sub.active ? "Active" : "Paused"}</div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionDashboard;
