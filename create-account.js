require('dotenv').config();
const { CdpClient } = require('@coinbase/cdp-sdk');

(async () => {
  const cdp = new CdpClient();
  const account = await cdp.evm.createAccount({
    name: 'x402-base-wallet',      // ✅ 只用字母数字和短横线，长度 2–36
    networkId: 'base-mainnet'      // ✅ 明确 Base 主网
  });
  console.log('Created EVM account:', account.address);
})();