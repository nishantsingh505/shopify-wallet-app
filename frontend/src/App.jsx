import React, { useState } from "react";
import WalletDashboard from "./components/WalletDashboard";
import SubscribeForm from "./components/SubscribeForm";
import SubscriptionDashboard from "./components/SubscriptionDashboard";

function App() {
  const [customerId, setCustomerId] = useState('');

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Country Delight - Auto Delivery App</h1>
      <div>
        <input
          placeholder="Enter Shopify Customer ID"
          value={customerId}
          onChange={e => setCustomerId(e.target.value)}
        />
      </div>
      {customerId && (
        <>
          <WalletDashboard customerId={customerId} />
          <SubscribeForm customerId={customerId} onSubscribed={() => {}} />
          <SubscriptionDashboard customerId={customerId} />
        </>
      )}
    </div>
  );
}

export default App;
