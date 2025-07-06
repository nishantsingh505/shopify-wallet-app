import React, { useState } from "react";
import axios from "axios";

const SubscribeForm = ({ customerId, onSubscribed }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [scheduleType, setScheduleType] = useState('daily');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!productId || !quantity) return;
    try {
      await axios.post(`http://localhost:3001/api/subscription/subscribe`, {
        customerId,
        productId,
        quantity: Number(quantity),
        schedule: { type: scheduleType },
        nextDelivery: new Date(),
      });
      setMessage("Subscribed successfully!");
      setProductId('');
      setQuantity(1);
      setScheduleType('daily');
      if (onSubscribed) onSubscribed();
    } catch (e) {
      setMessage("Error subscribing.");
    }
  };

  return (
    <form onSubmit={handleSubscribe} style={{ margin: "24px 0", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h3>New Subscription</h3>
      <input
        type="text"
        placeholder="Product Variant ID"
        value={productId}
        onChange={e => setProductId(e.target.value)}
        required
        style={{ marginRight: 10 }}
      />
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        required
        style={{ marginRight: 10, width: 80 }}
      />
      <select value={scheduleType} onChange={e => setScheduleType(e.target.value)} style={{ marginRight: 10 }}>
        <option value="daily">Daily</option>
        <option value="alternate">Alternate Days</option>
        <option value="weekly">Weekly</option>
      </select>
      <button type="submit">Subscribe</button>
      <div style={{ marginTop: 8, color: "#27ae60" }}>{message}</div>
    </form>
  );
};

export default SubscribeForm;
