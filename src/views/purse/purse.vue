<template>
  <div class="page">
    <div class="page-box">
      <van-pull-refresh v-model="loading" @refresh="onRefresh" loading-text="加载中...">
      <my-nav></my-nav>
      <div class="box">
        <div class="header flex-sb">
          <div>
            <img class="icon" src="@/assets/images/icon/amax.png" alt=""><span class="name">AMAX</span>
          </div>
          <div class="right" @click="toLink('/recorda?type=AMAX')">变动记录
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="num-box">
          <span class="num">{{info.amaxQuantity || 0}}</span>
          <span class="icon">AMAX</span>
        </div>
        <div class="btns">
          <img class="btn" @click="openRechargeShow('AMAX')" src="@/assets/images/purse/rechange.png" alt="">
          <img class="btn" @click="openWithdrawal('AMAX')" src="@/assets/images/purse/withdrawal.png" alt="">
        </div>
      </div>
      <div class="box">
        <div class="header flex-sb">
          <div>
            <img class="icon" src="@/assets/images/icon/musdt.png" alt=""><span class="name">MUSDT</span>
          </div>
          <div class="right" @click="toLink('/recorda?type=MUSDT')">变动记录
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="num-box">
          <span class="num">{{info.musdtQuantity || 0}}</span>
          <span class="icon">MUSDT</span>
        </div>
        <div class="btns">
          <div class="btns">
            <img class="btn" @click="openRechargeShow('MUSDT')" src="@/assets/images/purse/rechange.png" alt="">
            <img class="btn" @click="openWithdrawal('MUSDT')" src="@/assets/images/purse/withdrawal.png" alt="">
          </div>
        </div>
      </div>
      <div class="box">
        <div class="header flex-sb">
          <div>
            <img class="icon" src="@/assets/images/icon/crystal.png" alt=""><span class="name">Crystal(水晶)</span>
          </div>
          <div class="right" @click="toLink('/recorda?type=水晶')">变动记录
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="num-box">
          <span class="num">{{info.crystalQuantity || 0}}</span>
          <span class="icon">Crystal(水晶)</span>
        </div>
        <div class="btns">
          <div class="btns">
            <div class="btna" @click="give=true;">
              <div class='text flex-center'>立即转赠</div>
            </div>
          </div>
        </div>
      </div>
      <div class="invite-box">
        <img class="btn" src="@/assets/images/purse/invite.png" alt="">
        <div class="invite break-ellipsis text-center">
          {{linkUrl}}
        </div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="btn2" v-copy="() => linkUrl" :style="{ 'opacity': !isLogin ? 0.5 : 1 }">复制邀请好友链接</div>
      </div>
      <div class="invite-box">
        <img class="btn" src="@/assets/images/purse/more.png" alt="">
        <div class="menuList">
          <div class="menu flex-sb" @click="toLink('/mySheep')">
            <div class="left">
              <img src="@/assets/images/purse/sheep.png" alt="">
              <span class="name">我的羊</span>
            </div>
            <div class="right">{{info.sheepNums || 0}}只
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="menu flex-sb" @click="toLink('/myWolf')">
            <div class="left">
              <img src="@/assets/images/purse/wolf.png" alt="">
              <span class="name">我的狼</span>
            </div>
            <div class="right">{{info.wolfNums || 0}}只
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="menu flex-sb" @click="toLink('/myRecord?type=1')">
            <div class="left">
              <img src="@/assets/images/purse/magic.png" alt="">
              <span class="name">我的魔法牌</span>
            </div>
            <div class="right">{{info.magicCardNums || 0}}张
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="menu flex-sb" @click="toLink('/giveRecord')">
            <div class="left">
              <img src="@/assets/images/purse/transfer.png" alt="">
              <span class="name">转赠记录</span>
            </div>
            <div class="right">
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="menu flex-sb" @click="toLink('/farmList')">
            <div class="left">
              <img src="@/assets/images/purse/input.png" alt="">
              <span class="name">投入记录</span>
            </div>
            <div class="right">
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="menu flex-sb" @click="isLogin ? isContactShow = true : showToast('请连接钱包')">
            <div class="left">
              <img src="@/assets/images/purse/contact.png" alt="">
              <span class="name">联系我们</span>
            </div>
            <div class="right">
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    </div>
    <my-dialog v-model:show="isRechargeShow" confirmBtn="立即充值" :showClose="true" @confirm="onRecharge">
      <div class="dialog">
        <div class="title text-center"><img src="@/assets/images/purse/rechangeTitle.png" alt=""></div>
        <van-field class="input" v-model="customQuantity" placeholder="自定义输入金额" type="number">
          <template #button>
             {{rechargeScene}}
          </template>
        </van-field>
        <div class="rechargepopup-options">
          <div :class="
                checkoutIndex === item.num
                  ? 'options-box'
                  : 'options-active-box'
              " v-for="(item, index) in optionsList" :key="index" @click="rechargeCheckout(item.num)">
            {{ item.num }}
          </div>
        </div>
      </div>
    </my-dialog>
    <my-dialog v-model:show="isWithdrawShow" confirmBtn="立即提现" :showClose="true" @confirm="submitWithdrawal">
      <div class="dialog">
        <div class="title text-center"><img src="@/assets/images/purse/withdrawalTitle.png" alt=""></div>
        <div class="name">提现金额</div>
        <van-field class="input2" v-model="withdrawalQuantity" type="number" />
        <div class="name">钱包余额：{{withdrawalType === 'AMAX' ? info.amaxQuantity : info.musdtQuantity}} {{withdrawalType}}</div>
        <div class="name">提现地址：{{textSubstr( walletStore.walletInfo.name, 4)}}</div>
      </div>
    </my-dialog>
    <my-dialog v-model:show="isContactShow" confirmBtn="复制" @confirm="contactCopy(mailbox)" :showClose="true">
      <div class="dialog">
        <div class="content text-center">
          {{mailbox}}
        </div>
      </div>
    </my-dialog>
    <my-dialog v-model:show="give" confirmBtn="立即转赠" @confirm="giveCard" :showClose="true">
      <div class="dialog3">
<!--        <div class="title text-center"><img src="@/assets/images/magichouse/title.png" alt=""></div>-->
        <div class="content2">
          <div class="name">水晶数量</div>
          <van-field class="input2" type="number" v-model="gemgivdata.quantity" />
          <div class="name">转赠钱包地址</div>
          <van-field class="input2" v-model="gemgivdata.toAddress" />
        </div>
      </div>
    </my-dialog>
    <my-menu></my-menu>
  </div>
</template>
  
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
  showToast,
  showSuccessToast,
  showLoadingToast,
  showNotify,
  closeToast,
  showConfirmDialog,
} from "vant";
import { useWalletStore } from "@/stores";
import { copyText,textSubstr } from "@/libs/utils";
import req from "@/libs/req";
import { contractList } from "@/common/enum";
import myDialog from "@/components/MyDialog.vue";
const onRefresh = async () => {
  if (isLogin.value) await getInfo();
  setTimeout(() => {
    showToast('刷新成功');
    loading.value = false;
  }, 1000);
};
const give = ref(false)
const router = useRouter();
const walletStore = useWalletStore();
const loading = ref(false);
const isRechargeShow = ref(false);
const isWithdrawShow = ref(false);
const isContactShow = ref(false);
const checkoutIndex = ref(100);
const info = ref({});
const quantity = ref(0);
const customQuantity = ref(null);
const balance = ref(0);
const show = ref(false);
const input = ref("");
const giveQuantity = ref(false);
const withdrawalType = ref("");
const withdrawalQuantity = ref("");

const gemgivdata = ref({
  quantity:"",
  toAddress:""
})

const optionsList = ref([
  {
    num: 100,
  },
  {
    num: 200,
  },
  {
    num: 500,
  },
  {
    num: 1000,
  },
  {
    num: 2000,
  },
  {
    num: 5000,
  },
]);
const rechargeScene = ref(""); // 充值场景
const transferAccountType = ref(0); // 转账场景
const isLogin = computed(() => walletStore.isConnection);
const contractValueList = computed(() => contractList);
const contract = ref(null);
const linkUrl = ref("登录获取邀请链接");
function toLink(url) {
  if(!isLogin.value) return showToast('请先连接钱包')
  router.push(url);
}
watch(
  () => isLogin.value,
  (n) => {
    if (n) {
      getInfo();
      linkUrl.value =
        window.location.origin + "?s=" + walletStore.walletInfo.name;
    }
  }
);
watch(isRechargeShow, (n) => {
  if (!n) {
    customQuantity.value = "";
  }
});

onMounted(() => {
  try {
    if (isLogin.value) {
      getInfo();
      linkUrl.value =
        window.location.origin + "?s=" + walletStore.walletInfo.name;
    }
  } catch (error) {
    console.log(error);
  }
});

// 获取信息详情
const mailbox = ref('');
async function getInfo () {
  mailbox.value = await req.post("/api/common/get/contract?key=contract");
  const data = await req.post("/api/wallet/index");
  data.amaxQuantity = Number(data.amaxQuantity).toFixed(4);
  data.musdtQuantity = Number(data.musdtQuantity).toFixed(4);
  data.crystalQuantity = Number(data.crystalQuantity).toFixed(4);
  info.value = data;
  walletStore.getBalance();
};
// 点击充值
const onRecharge = async () => {
  if (!isLogin.value) return showToast('请先连接钱包');
  const quantityValue = getRightQuantity(
    Number(customQuantity.value) || Number(checkoutIndex.value)
  );
  if (Number(quantityValue) > Number(balance.value))
    return showToast(`余额不足，当前余额${balance.value}`);
  let recharge;
  switch (transferAccountType.value) {
    case 0:
      recharge = info.value.entryAMAXWalletAddress;
      break;
    case 1:
      recharge = info.value.entryMUSDTWalletAddress;
      break;
    default:
      break;
  }
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  //创建订单
  const res = await req.post("/api/account/ready/order", {
    type: transferAccountType.value, //账户类型 0-AMAX 1-MUSDT
    quantity: quantityValue, //数量
  });
  //发起转账
  const tx = await walletStore.transferByContract(
    contract.value,
    rechargeScene.value,
    recharge,
    quantityValue
  );
  customQuantity.value = "";
  isRechargeShow.value = false;
  showSuccessToast('充值成功，预计1-3分钟到账，请耐心等待~');
  getInfo();
};


//点击转赠宝石
async function giveCard(){
  if(!isLogin.value) return showToast('请先连接钱包')
  if (!gemgivdata.value.quantity) return showToast("请输入宝石数量");
  if (!gemgivdata.value.toAddress) return showToast("请输入钱包地址");
    await req.post("/api/wallet/donation/crystal",gemgivdata.value,{loading:true});
    showToast('转赠成功')
    getInfo()
    give.value = false;
}
const getUserBalance = async (scene) => {
  const userBalance = await walletStore.getBalanceByContract(
    contractValueList.value[scene]
  );
  balance.value = String(userBalance).split(" ")[0];
};

// 点击打开充值弹窗
const openRechargeShow = async (scene) => {
  isRechargeShow.value = true;
  rechargeScene.value = scene;
  contract.value = String(contractValueList.value[scene][0]).split(":")[0];
  switch (scene) {
    case "AMAX":
      transferAccountType.value = 0;
      break;
    case "MUSDT":
      transferAccountType.value = 1;
      break;
    default:

      break;
  }
  getUserBalance(scene);
};

// 充值弹窗点击金额
const rechargeCheckout = (num) => {
  checkoutIndex.value = num;
};

// 提现弹窗点击
const openWithdrawal = (e) => {
  withdrawalType.value = e;
  isWithdrawShow.value = true;
  withdrawalQuantity.value = "";
};
//确定提现
async function submitWithdrawal() {
  //0-AMAX 1-MUSDT 
  // return showToast('暂未开放')
  if(!isLogin.value) return showToast('请先连接钱包')
  let type = "";
  if (withdrawalType.value === 'AMAX') {
    type = 0;
  } else if (withdrawalType.value === 'MUSDT') {
    type = 1;
  }
  if (!withdrawalQuantity.value || withdrawalQuantity.value === "0")
    return showNotify({ type: "danger", message: '请输入正确的提现数量' });
  showToast({
    type: "loading",
    message: '提现中',
    overlay: true,
    forbidClick: true,
    duration: 0,
  });
  try {
    const res = await req.post("/api/account/withdrawal", {
      accountType: type,
      quantity: withdrawalQuantity.value,
    });
    if (res === null) {
      closeToast();
      showToast('提现成功');
      isWithdrawShow.value = false;
    }
  } catch (error) {
    showToast('提现失败');
  }
}

// 自动补全金额位数
const formatNumberWithFixedDecimal = (number, fixedDigits) => {
  const formattedNumber = Number(number).toFixed(fixedDigits);

  return formattedNumber;
};
// 印射转账金额
const getRightQuantity = (num) => {
  let quantityData = "";
  switch (rechargeScene.value) {
    case "MUSDT":
      quantityData = formatNumberWithFixedDecimal(num, 6);
      break;
    case "AMAX":
      quantityData = formatNumberWithFixedDecimal(num, 8);
      break;
    case "MNTH":
      quantityData = formatNumberWithFixedDecimal(num, 6);
      break;
    default:
      break;
  }
  console.log(quantityData, "quantityData");
  return quantityData;
};
const giftPackBalance = ref(0);
const auctionPackageBalance = ref({});

// 点击复制
const contactCopy = (text) => {
  showToast('复制成功');
  copyText(text);
};

function inputBackQuantity() {
  if (backPackageType.value === "AMAX") {
    if (
      auctionPackageBalance.value.amaxAuctionWrapAvailableBalance <
      backPackageQuantity.value
    ) {
      backPackageQuantity.value =
        auctionPackageBalance.value.amaxAuctionWrapAvailableBalance;
    }
  } else {
    if (
      auctionPackageBalance.value.nthAuctionWrapAvailableBalance <
      backPackageQuantity.value
    ) {
      backPackageQuantity.value =
        auctionPackageBalance.value.nthAuctionWrapAvailableBalance;
    }
  }
}


</script>
  
<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 800px;
  overflow: auto;
  height: calc(100vh - 150px);
  .page-box {
    background: url("@/assets/images/home/bg.png") no-repeat;
    background-size: 100%;
    .box {
      margin: 40px 30px;
      background: url("@/assets/images/dialog/bg3.png") no-repeat;
      background-size: 100% 100%;
      padding: 40px 40px;
      color: #91461e;
      .header {
        .name {
          margin-left: 20px;
          font-size: 36px;
          font-weight: 550;
        }
        .icon {
          width: 85px;
          height: 85px;
          border-radius: 50%;
        }
        .right {
          font-size: 26px;
        }
      }
      .num-box {
        font-weight: 550;
        .num {
          font-size: 48px;
        }
        .icon {
          margin-left: 10px;
          font-size: 24px;
        }
      }
      .btns {
        .btn {
          width: 188px;
          height: 60px;
          margin-right: 40px;
        }
        .btna{
          width: 188px;
          height: 60px;
          margin-right: 40px;
          background: url("@/assets/images/sheepfarm/sf-mixbox.png") no-repeat;
          background-size: 100% 100%;
          position: relative;
          .text{
            font-size: 30px;
            color: white;
            padding-top: 6px;
          }
        }

      }
    }
    .invite-box {
      margin: 50px 30px 0;
      background: #ffe7ce;
      border-radius: 20px;
      border: 2px solid #6b2b09;
      position: relative;
      .btn {
        position: absolute;
        left: -40px;
        top: -20px;
        width: 318px;
        height: 87px;
      }
      .invite {
        border-radius: 20px;
        background: #f6d4a7;
        font-size: 30px;
        color: #91461e;
        padding: 60px 30px;
        margin: 90px 40px 30px;
        width: 610px;
      }
      .line {
        width: 686px;
        height: 7px;
        background: #f9dba0;
      }
      .btn2 {
        text-align: center;
        line-height: 68px;
        width: 325px;
        height: 68px;
        margin: 30px auto;
        color: #91461e;
        font-size: 30px;
        border-radius: 34px;
        border: 2px solid #6b2b09;
      }
      .menuList {
        font-size: 30px;
        color: #6b2b09;
        padding: 90px 30px 40px;
        .menu:not(:last-child) {
          border-bottom: 1px solid #f6d4a7;
          padding: 30px 0;
        }
        .menu:last-child {
          padding-top: 30px;
        }
        .menu {
          .left {
            img {
              width: 80px;
              height: 80px;
            }
            .name {
              padding-left: 20px;
            }
          }
          .right {
          }
        }
      }
    }
  }
  .dialog {
    color: #bb7d58;
    padding: 0 40px;
    .title {
      padding: 60px 0 20px;
      img {
        width: 267px;
        height: 70px;
      }
    }
    .name {
      padding-top: 20px;
    }
    .input {
      margin-top: 10px;
      background: transparent;
      border-bottom: 1px solid #6b2b09;
      padding: 20px 0;
      font-size: 26px;
      :deep(.van-field__control),
      :deep(.van-field__control)::placeholder,
      :deep(.van-field__button) {
        color: #bb7d58;
      }
    }
    .input2 {
      margin-top: 10px;
      background: #f6d4a7;
      border-radius: 20px;
      :deep(.van-field__control),
      :deep(.van-field__control)::placeholder,
      :deep(.van-field__button) {
        color: #bb7d58;
      }
    }
    .rechargepopup-options {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 36px;

      .options-active-box,
      .options-box {
        width: calc((100% - 35px) / 3);
        padding: 16px 0;
        font-size: 28px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #d29b6c;
        border-radius: 20px;
        margin-bottom: 34px;
        color: #fff;
      }

      .options-active-box {
        color: #91461e;
        background: #f6d4a7;
        border: 1px solid #e8e8e8;
      }
    }
    .content {
      padding: 80px 0 30px;
      font-size: 36px;
    }
  }
}
:deep(.van-dialog) {
  width: 100vw;
}

.dialog3 {
  padding-top: 40px;
  .title {
    padding-top: 40px;
  }
  .name {
    font-size: 26px;
    padding-top: 20px;
  }
  .input2 {
    margin-top: 10px;
    background: #f6d4a7;
    border-radius: 20px;
  }
  .text {
    font-size: 28px;
    bottom: -50px;
    left: 41%;
    position: absolute;
  }
  .contenta {
    padding: 80px 0 30px;
    font-size: 36px;
  }
  .content2 {
    padding: 60px 0 30px;
    font-size: 36px;
    margin: 0 40px;
  }
}
</style>