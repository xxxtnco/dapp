import { defineStore } from 'pinia';
import { closeToast, showDialog, showToast } from 'vant';
import { reactive, ref } from 'vue';
import Amax from '@amax/amaxjs';
import req from '@/libs/req';

const { ecc, format } = Amax.modules;

export const useWalletStore = defineStore('wallet', () => {
    let scatter = null;
    let client = null;
    // let contract = null;

    const isConnection = ref(false);
    const walletInfo = reactive({
        name: '',
        authority: '',
        blockchain: '',
        publicKey: '',
        balance: '',
        node: '',
        baseInfo:{}
    });
    // const network = {
    //     protocol: 'http',
    //     blockchain: 'amax',
    //     host: '47.242.1.143',
    //     port: 8888,
    //     chainId: '2403d6f602a87977f898aa3c62c79a760f458745904a15b3cd63a106f62adc16',
    // };
    const network = {
        protocol: 'https',
        blockchain: 'amax',
        host: 'expnode.amaxscan.io',
        port: 443,
        chainId: '2403d6f602a87977f898aa3c62c79a760f458745904a15b3cd63a106f62adc16',
    }; 

    function showLoading(text) {
        return showToast({
            type: 'loading',
            message: text,
            overlay: true,
            forbidClick: true,
            duration: 0,
        });
    }

    // 初始化
    function init(example) {
        if (example) {
            scatter = example;
            console.log('已初始化');
            // const broadcast = !(window.tinyBrige && window.tinyBrige.pushTransaction)
            // console.log('APLink端发起push_transaction',broadcast);
        } else if (window.scatter) {
            scatter = window.scatter;
            // window.scatter = null;
            console.log('已初始化');
        } else {
            showDialog({
                title: '提示',
                message:`未检测到<strong>DApp环境</strong>，请使用<strong>APLink App</strong>或Scatter浏览器插件，仅支持Scatter协议`,
                allowHtml: true,
                confirmButtonText: `重试`,
                confirmButtonColor: '#F30C1B',
                showCancelButton: false,
                closeOnClickOverlay: false,
            })
                .then(() => init(example))
                .catch();
        }
    }

    // 连接钱包
    async function linkWallet() {
        try {
            isConnection.value = false;
            const toast = showLoading('连接钱包');
            if (!scatter) {
                await init();
            }
            const identity = await scatter.getIdentity();
            const accounts = identity?.accounts;
            if (accounts && accounts.length) {
                const account = accounts[0];
                walletInfo.name = account.name;
                walletInfo.authority = account.authority;
                walletInfo.blockchain = account.blockchain;
            }
            walletInfo.publicKey = identity.publicKey;
            await scatter.suggestNetwork(network);
            client = scatter.amax(network, Amax, {
                broadcast: !(window.tinyBrige && window.tinyBrige.pushTransaction),
                authorization: [`${walletInfo.name}@${walletInfo.authority}`],
            });
            console.log('已连接');
            //const publicKeys = await getPublicKey(walletInfo.name, walletInfo.authority);
            //console.log(publicKeys);
            getBalance();

            const num = await req.post('/api/user/get/nonce', {
                walletAddress: walletInfo.name,
            });

            const signature = await sign(walletInfo.publicKey, num);

            toast.message = '验证签名';
            walletInfo.baseInfo = await req.post('/api/user/login', {
                walletAddress: walletInfo.name,
                signature: signature,
                nonce: num,
                publicKey: walletInfo.publicKey,
            });
            req.defaults.headers['token'] = walletInfo.baseInfo.token;

            isConnection.value = true;

            closeToast();
            // contract = await client.contract("amax.mtoken");
        } catch (e) {
            console.log(e);
            closeToast();
        } finally {
        }
    }
    // 获取公钥
    async function getPublicKey(walletName, authority) {
        try {
            let keyArray;
            const accountInfo = await client.getAccount(walletName);
            if (accountInfo) {
                keyArray = accountInfo.permissions
                    .filter((item) => (authority ? item.perm_name === authority : true))
                    .reduce((pre, next) => {
                        next.required_auth.keys.forEach(
                            (k) => !pre.includes(k.key) && pre.push(k.key),
                        );
                        return pre;
                    }, []);
            }
            return keyArray;
        } catch (e) { }
    }

    // 签名
    async function sign(publicKey, signatureString) {
        const signString = await scatter.getArbitrarySignature(
            publicKey,
            signatureString,
        );
        if (signString && ecc.verify(signString, signatureString, publicKey)) {
            return signString;
        }
        throw new Error('Login Failed');
    }

    // 获取余额
    async function getBalance() {
        try {
            const list = ['amax.mtoken:MUSDT'];
            const accountName = walletInfo.name;
            const tmp = list.map((i) =>
                client.getCurrencyBalance(i.split(':')[0], accountName, i.split(':')[1]),
            );
            const res = await Promise.all(tmp);
            walletInfo.balance = res[0][0];
        } catch (e) { }
    }

    // 转账
    async function transfer(to, quantity, orderId) {
        try {
            const toast = showLoading('正拉起支付');
            // if (!contract) {
            //   contract = await client.contract("amax.mtoken");
            // }
            // const res = await contract.transfer({
            //   from: walletInfo.name,
            //   to: to,
            //   quantity: ,
            //   memo: "",
            // });

            const res = await client.transaction({
                actions: [
                    {
                        account: 'amax.mtoken',
                        name: 'transfer',
                        authorization: [{
                            actor: walletInfo.name,
                            permission: 'active',
                        }],
                        data: {
                            from: walletInfo.name,
                            to: to,
                            quantity: `${Number(quantity).toFixed(6)} MUSDT`,
                            memo: '',
                        },
                    },
                ],
            });

            // console.log(res);

            toast.message = '确认交易';
            const transactionId = res.transaction_id;

            //调接口transactionId
            await req.post('/api/account/update/recharge/state', {
                hash: transactionId,
                id: orderId,
            });

            await getBalance();
            const tx = await client.getTransaction({
                id: transactionId,
            });
            closeToast();
            showToast('已完成');
            return tx;
        } catch (e) {
            closeToast();
            console.log(e);

            const msg =
                e?.error?.what ||
                e?.error?.details?.indexAt(0)?.message ||
                e?.message ||
                JSON.stringify(e);
            showToast(msg);
        }
    }

    // 根据合约获取余额，e.g: ["amax.mtoken:MUSDT"]
    async function getBalanceByContract(list) {
        const accountName = walletInfo.name;
        const tmp = list.map((i) => client.getCurrencyBalance(i.split(':')[0], accountName, i.split(':')[1]),
        );
        return await Promise.all(tmp);
    }

    /**
     * @description 根据合约转账
     * @author lecoler
     * @date 2023/8/1
     * @param {String} contract - 合约地址，例如 amax.mtoken
     * @param {String} symbol - 币符，例如 MUSDT
     * @param {String} to - 收款地址
     * @param {String} quantity - 转出数量，例如 0.100000 注意：必须符合币精度
     * @param {String} [memo] - 备注
     * @return Promise
     */
    async function transferByContract(contract, symbol, to, quantity, memo = '') {
        return await client.transaction({
            actions: [
                {
                    account: contract,
                    name: 'transfer',
                    authorization: [{
                        actor: walletInfo.name,
                        permission: 'active',
                    }],
                    data: {
                        from: walletInfo.name,
                        to: to,
                        quantity: `${quantity} ${symbol}`,
                        memo: memo,
                    },
                },
            ],
        });
    }

    // 根据交易id获取交易详情
    async function getTx(transactionId) {
        return await client.getTransaction({
            id: transactionId,
        });
    }

    return {
        init,
        linkWallet,

        walletInfo,
        isConnection,
        getBalance,
        transfer,
        getBalanceByContract,
        transferByContract,
        getTx
        
    };
});
