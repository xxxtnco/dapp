<template>
  <div class="full flex-column">
    <div class="title">Hello World!</div>
    <van-button @click="link">连接钱包</van-button>
    <van-button @click="getUser">获取用户信息</van-button>
    <van-button @click="login">登录签名</van-button>
    <van-button @click="getBlock">获取最新区块</van-button>
    <van-button @click="getMainBalance">查询主币数量</van-button>
    <van-button @click="getBalance">查询代币数量</van-button>
    <van-button @click="getCurrencyStats">查询代币精度</van-button>
    <van-button @click="transfer">转账</van-button>
    <van-button @click="check">查询交易状态</van-button>
    <van-button @click="test">调试</van-button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Amax from '@amax/amaxjs';
import { showToast } from 'vant';

const { ecc, format } = Amax.modules;

let scatter = null;
let client = null;
let accountName = '';
let account = null;

async function getInfo() {
  try {

    //document.addEventListener('scatterLoaded', scatterExtension => {
    scatter = window.scatter;
    window.scatter = null;
    //console.log(scatter);
    //});

  } catch (e) {
    console.log(e);
  }
}

async function link() {
  console.log(scatter);

  const identity = await scatter.getIdentity();
  console.log(identity);
  account = identity.accounts[0];
  const network = {
    protocol: 'https',
    blockchain: 'amax',
    host: 'expnode.amaxscan.io',
    port: 443,
    chainId: '2403d6f602a87977f898aa3c62c79a760f458745904a15b3cd63a106f62adc16',
  };

  await scatter.suggestNetwork(network);

  accountName = account.name;
  client = scatter.amax(network, Amax, {
    authorization: [`${account.name}@${account.authority}`],
  });
  console.log(client);
  showToast('已连接');
}

function getUser() {
  const account = scatter.identity;
  console.log(account);
  showToast(`已获取 ${JSON.stringify(account)}`);
}

async function login() {
  try {


    let pubkeyArray;
    try {
      const accountInfo = await client.getAccount(account.name);
      if (accountInfo) {
        pubkeyArray = accountInfo.permissions
          .filter(item => (account.authority ? item.perm_name === account.authority : true))
          .reduce((pre, next) => {
            next.required_auth.keys.forEach(
              k => !pre.includes(k.key) && pre.push(k.key),
            );
            return pre;
          }, []);
      }
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }

    console.log('签名数据：', pubkeyArray);


    let publicKeys = pubkeyArray;

    const signatureString = '123456';
    let signature, publicKey;
    // 公钥遍历，让每个都去签名和验证签名
    // 如签名和验证签名都没问题，那就结束遍历，已经找到正确的公钥并且登录成功
    // 这里如果用 Promise.any 来写这里逻辑的话，在app中没问题，但插件存在问题，可能不能同时发起多个签名
    for (publicKey of publicKeys) {
      try {
        const signString = await scatter.getArbitrarySignature(
          publicKey,
          signatureString,
        );
        console.log(signString);
        if (signString) {
          try {
            // 验证通过能正常返回true，失败返回false,  或者报错走catch
            if (ecc.verify(signString, signatureString, publicKey)) {
              // 验证通过，登录成功，结束遍历
              signature = signString;
              break;
            }
          } catch (e) { }
        }
      } catch (e) { }
    }


    // 如果遍历了所有公钥，且没有能正常签名的，登录失败。中断操作
    if (!signature) {
      console.log('loginFailed');
      throw new Error('loginFailed');
    }
    // 正常返回，数据给后面使用
    //return { publicKey, account, authority };

    console.log('signatureString：', signatureString, 'signature：', signature, 'publicKey：', publicKey);
  } catch (e) {
    console.log(e);
  }
}

async function getBlock() {
  try {

    const info = await client.getInfo({});
    console.log(info);
    showToast(`最新区块：${info.head_block_num}`);
    const res = await client.getBlock(info.head_block_num);
    console.log(res);

  } catch (e) {
    console.log(e);
  }
}

async function getMainBalance() {
  try {

    const res = await client.getCurrencyBalance('amax.token', accountName, 'AMAX');
    console.log(res);
    showToast(res[0]);
  } catch (e) {

  }
}

async function getBalance() {
  try {
    const list = ['amax.token:AMAX', 'amax.mtoken:MUSDT'];

    const tmp = list.map(i => client.getCurrencyBalance(i.split(':')[0], accountName, i.split(':')[1]));
    const res = await Promise.all(tmp);

    console.log(res);
    showToast(res.map(i => i[0]).join(','));
  } catch (e) {
    console.log(e);
  }
}

async function getCurrencyStats() {
  try {
    const res = await client.getCurrencyStats('amax.mtoken', 'MUSDT');
    console.log(res);
    const precision = res['MUSDT'].max_supply.split(' ')[0].split('.')[1].length;
    showToast(`MUSDT精度${precision}`);
  } catch (e) {
    console.log(res);
  }
}

async function transfer() {
  try {

    const contract = await client.contract('amax.mtoken');
    console.log(contract);
    console.log(accountName);
    const res = await contract.transfer({
      from: accountName,
      to: 'xiaoxiong111',
      quantity: '0.000100 MUSDT',
      memo: '',
    });

    //const res = await client.transfer()

    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

async function check() {
  try {


    const res = await client.getTransaction({
      id: '2c61486cd110009ef56281d5ffcad2a3d16f95c4e9786bab7b20712e49aa0fff',
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

async function test() {
  try {
    const res = await scatter.suggestNetwork();
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

onMounted(() => {
  getInfo();
});

</script>

<style scoped lang="scss">
.title {
  font-size: 36px;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  padding: 24px;
}
</style>
