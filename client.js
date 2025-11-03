require('dotenv').config();
const { CdpClient } = require('@coinbase/cdp-sdk');
const { toAccount } = require('viem/accounts');
const { wrapFetchWithPayment } = require('x402-fetch');

async function fetchWeather(location = '上海') {
  try {
    // 初始化 CDP 客户端（使用您的 API 密钥）
    const walletSecret = process.env.CDP_WALLET_SECRET;
    if (!walletSecret) {
      throw new Error('请在 .env 中配置 CDP_WALLET_SECRET');
    }
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret,
    });
    // 直接加载你在 CDP Server Wallet 里已有的钱包
    const serverWalletAddress = process.env.SERVER_WALLET_ADDRESS;
    if (!serverWalletAddress) {
      throw new Error('请在 .env 中配置 SERVER_WALLET_ADDRESS');
    }
    console.log('准备加载钱包:', serverWalletAddress);
    const cdpAccount = await cdp.evm.getAccount({ address: serverWalletAddress });
    console.log('已加载钱包');
    const account = toAccount(cdpAccount);

    // 包装 fetch 以自动处理 x402 支付
    const fetchWithPayment = wrapFetchWithPayment(fetch, account);

    // 发送请求
    const response = await fetchWithPayment(`http://localhost:3000/weather?location=${location}`, {
      method: 'GET'
    });

    const body = await response.json();
    console.log('天气数据:', body);
  } catch (error) {
    console.error('错误:', error.message);
    if (error.response?.data) {
      console.error('响应数据:', error.response.data);
    } else if (error.stack) {
      console.error(error.stack);
    } else {
      console.error('完整错误对象:', error);
    }
  }
}

fetchWeather();
