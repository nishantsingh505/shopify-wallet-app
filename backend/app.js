const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const Wallet = require('./models/wallet');
const Subscription = require('./models/Subscription');
const { createShopifyOrder } = require('./utils/shopifyOrder');
require('dotenv').config();

const walletRoutes = require('./routes/wallet');
const subscriptionRoutes = require('./routes/Subscription');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/test', (req, res) => {
  res.send('API working!');
});


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.error("MongoDB connection error:", err));

app.use('/api/wallet', walletRoutes);
app.use('/api/subscription', subscriptionRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));


cron.schedule('0 6 * * *', async () => {
  const today = new Date();
  const subs = await Subscription.find({ active: true, nextDelivery: { $lte: today } });

  for (let sub of subs) {
    try {
      const wallet = await Wallet.findOne({ shopifyCustomerId: sub.shopifyCustomerId });
      // TODO: Fetch price from Shopify if needed, here we'll use a hardcoded value for demo:
      const price = 100; // replace with real price lookup

      // 1. Check if wallet has enough balance
      if (wallet && wallet.balance >= price * sub.quantity) {
        // 2. Deduct from wallet
        wallet.balance -= price * sub.quantity;
        wallet.transactions.push({
          type: 'debit',
          amount: price * sub.quantity,
          remark: `Auto Delivery for subscription ${sub._id}`
        });
        await wallet.save();

        // 3. Create Shopify order
        await createShopifyOrder(sub.shopifyCustomerId, sub.productId, sub.quantity);

        // 4. Update next delivery date
        // (For "daily", just add 1 day. For "alternate", custom logic needed)
        const next = new Date(sub.nextDelivery || today);
        next.setDate(next.getDate() + 1); // daily
        sub.nextDelivery = next;
        await sub.save();

        // 5. (Optional) Send "order placed" notification here
      } else {
        // 6. Insufficient balance: (Optional) Send notification
        console.log(`Insufficient balance for customer ${sub.shopifyCustomerId}`);
        sendLowBalanceNotification(sub.shopifyCustomerId, wallet.balance);
        // You can email/SMS the customer to top up their wallet.
      }
    } catch (e) {
      // Log any issues
      console.error(`Error processing subscription ${sub._id}:`, e.message);
    }
  }
});

