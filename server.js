// server.js 顶部
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { paymentMiddleware } = require('x402-express');
const { facilitator } = require('@coinbase/x402');

const app = express();
const port = process.env.PORT || 3000;

// 静态文件服务，把 index.html 放在 public 目录
app.use(express.static(path.join(__dirname, 'public')));

// 允许前端访问（若需要）
app.use(cors({ origin: '*', methods: ['GET'] }));

// x402 支付中间件
app.use(paymentMiddleware(
  process.env.RECEIVING_ADDRESS,
  {
    'GET /weather': {
      price: '$0.001',
      network: process.env.NETWORK,
      config: {
        description: '获取任意位置的天气',
        inputSchema: { type: 'object' },
        outputSchema: { type: 'object' }
      }
    }
  },
  facilitator
));

// API
app.get('/weather', (req, res) => {
  res.json({ weather: '晴朗', temperature: 25, city: req.query.location || '北京' });
});

// 启动服务
app.listen(port, () => console.log(`服务器运行在 http://localhost:${port}`));