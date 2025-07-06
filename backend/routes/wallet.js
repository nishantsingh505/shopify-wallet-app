const express = require('express');
const Wallet = require('../models/wallet');
const router = express.Router();

router.get('/:customerId', async (req, res) => {
  const wallet = await Wallet.findOne({ shopifyCustomerId: req.params.customerId });
  res.json(wallet || { balance: 0, transactions: [] });
});

router.post('/recharge', async (req, res) => {
  const { customerId, amount } = req.body;
  const rechargeAmount = Number(amount);
  if (!customerId || isNaN(rechargeAmount) || rechargeAmount <= 0) {
    return res.status(400).json({ error: 'Invalid customerId or amount' });
  }
  let wallet = await Wallet.findOne({ shopifyCustomerId: customerId });
  if (!wallet) wallet = new Wallet({ shopifyCustomerId: customerId });
  wallet.balance += rechargeAmount;
  wallet.transactions.push({ type: 'credit', amount: rechargeAmount, remark: 'Recharge' });
  await wallet.save();
  res.json({ success: true, balance: wallet.balance });
});
// POST /api/wallet/deduct
router.post('/deduct', async (req, res) => {
  const { customerId, amount } = req.body;
  const deductAmount = Number(amount);
  if (!customerId || isNaN(deductAmount) || deductAmount <= 0) {
    return res.status(400).json({ error: 'Invalid customerId or amount' });
  }
  let wallet = await Wallet.findOne({ shopifyCustomerId: customerId });
  if (!wallet || wallet.balance < deductAmount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  wallet.balance -= deductAmount;
  wallet.transactions.push({ type: 'debit', amount: deductAmount, remark: 'Manual Deduction' });
  await wallet.save();
  res.json({ success: true, balance: wallet.balance });
});

// Add in a test route in any file (e.g., wallet.js)
router.post('/test-order', async (req, res) => {
  try {
    const { customerId, variantId, quantity } = req.body;
    const result = await createShopifyOrder(customerId, variantId, quantity);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});




module.exports = router;
