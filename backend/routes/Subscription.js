const express = require('express');
const Subscription = require('../models/Subscription');
const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { customerId, productId, quantity, schedule, nextDelivery } = req.body;
  const sub = new Subscription({
    shopifyCustomerId: customerId,
    productId, quantity, schedule, nextDelivery
  });
  await sub.save();
  res.json({ success: true, subscription: sub });
});

router.get('/:customerId', async (req, res) => {
  const subs = await Subscription.find({ shopifyCustomerId: req.params.customerId });
  res.json(subs);
});

module.exports = router;
