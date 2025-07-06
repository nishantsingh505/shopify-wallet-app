const mongoose = require('mongoose');
const WalletSchema = new mongoose.Schema({
  shopifyCustomerId: String,
  balance: { type: Number, default: 0 },
  transactions: [{
    type: { type: String }, // 'credit' or 'debit'
    amount: Number,
    date: { type: Date, default: Date.now },
    remark: String
  }]
});
module.exports = mongoose.model('Wallet', WalletSchema);
