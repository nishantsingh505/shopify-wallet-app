const mongoose = require('mongoose');
const SubscriptionSchema = new mongoose.Schema({
  shopifyCustomerId: String,
  productId: String,
  quantity: Number,
  schedule: {
  type: Object,
  default: {}
},
 // Change from String to Object
  nextDelivery: Date,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
