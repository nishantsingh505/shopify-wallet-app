const axios = require('axios');
require('dotenv').config();

async function createShopifyOrder(customerId, productId, quantity) {
  // You must use Shopify's product variant ID (not productId directly)
  const orderPayload = {
    order: {
      customer: { id: customerId },
      line_items: [{ variant_id: productId, quantity }]
    }
  };

  try {
    const response = await axios.post(
      `https://${process.env.SHOP}/admin/api/2023-01/orders.json`,
      orderPayload,
      {
        headers: {
          'X-Shopify-Access-Token': process.env.ACCESS_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error('Shopify Order Error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { createShopifyOrder };
