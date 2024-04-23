<template>
  <div class="page">
    <div class="page-box">
      <van-pull-refresh v-model="loading" @refresh="onRefresh" loading-text="加载中">
        <my-nav></my-nav>
        <div class="banner" @click="toGame">
        </div>
        <div class="title">
        </div>
        <div class="bg">
          <div class="bg-box">
          </div>
          <div class="box">
            <div class="img">
              <img class="img" src="@/assets/images/home/sheepBig.png" alt="">
              <div class="state">{{info.sheepNums ? '已获得' : '未获得'}}</div>
            </div>
            <div class="title3 flex-align-center">
              <img class="icon" src="@/assets/images/home/sheep.png" alt="">
              超级羊羊
            </div>
            <div class="line">参与GameFi —狼来了</div>
            <div class="line">建设牧羊场</div>
            <div class="line">参与魔法屋抽魔法牌</div>
            <div class="line">获得Magic meta 水晶</div>
            <div class="line">直推好友奖励10%-25%</div>
            <div class="line">参与游戏免伤3%</div>
            <div class="title3 flex-sb">
              <div class="flex-align-center">
                <img class="icon" src="@/assets/images/home/sheep.png" alt="">
                购买数量
              </div>
              <div>
                <van-stepper class="step" v-model="quantity" integer min="1" :max="9999" />
              </div>
            </div>
            <div class="btn flex-sb">
              <div @click="buySheep">立即购买 {{quantity}}AMAX</div>
              <div class="divide"></div>
              <div @click="toGame">进入游戏</div>
            </div>
            <div class="banlance">
              钱包余额：{{amaxBalance}} AMAX
            </div>
          </div>

        </div>

        <div class="title2">
        </div>
        <div class="box">
          <div class="intro">
            是一个搭建在Armonia 链上的元宇宙游戏和NFT平台.
            旨在建立一个致力于区链游戏的生态系统。它提供了
            一个类似于真实世界的虛拟环境，并允许用户在其中进
            行交互和游戏。在这个虚拟世界里，用户可以自由地探
            索、创造、交易、社交等，同时也可以享受到虚拟现实
            技术所带来的惊人体验。MAGIC META将在游戏、科
            技、艺术等多个领域的交集下，不断创新出了一系列的
            新题材类型的游戏。同时MAGIC META也是一个开放
            性平台，也将鼓励社区开发者进驻。
          </div>
          <img src="@/assets/images/home/intro.png" class="intro-img" alt="">
          <div class="intro">
            水晶 crystal是MAGIC META系统通行证，我们不排除
            在MAGIC META的发展中将其升级或映射为平台的功
            能型Token。但这一切并无定论，我们需要广大的平台
            的参与者支持，现行的水晶 crystal可流通MAGIC ME
            TA所发行的游戏之中，在MAGIC商店上线后可购买游
            戏内物品和NFT。
          </div>
          <img src="@/assets/images/home/intro2.png" class="intro-img" alt="">
          <div class="intro">
            《狼来了》游戏作为MAGIC META第一款以元宇宙为
            主题的生存游戏。游戏结合了竞技、养成、收集的多种
            玩法模式，设计独特，为玩家带来沉浸式的游戏体验。
            在游戏中，玩家需要与其他玩家展开击杀，玩家利用各
            种道具、潮玩等击败狼群，最终获得奖励。
          </div>
        </div>
      </van-pull-refresh>
      <my-menu></my-menu>
    </div>
  </div>
</template>
<script setup>
import {
  closeDialog,
  showLoadingToast,
  showToast,
  showConfirmDialog,
} from "vant";
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useWalletStore } from "@/stores";
import req from "@/libs/req";
import { contractList } from "@/common/enum";
const contractValueList = computed(() => contractList);
const loading = ref(false);
const walletStore = useWalletStore();
const amaxBalance = ref(0);
const router = useRouter();
const isLogin = computed(() => walletStore.isConnection);
const quantity = ref(1);
const info = ref({ sheepNums: 0 });
const onRefresh = async () => {
  if (isLogin.value) {
   await getBalance();
  }
  setTimeout(() => {
    showToast('刷新成功');
    loading.value = false;
  }, 1000);
};
async function getBalance() {
  // const userBalance = await walletStore.getBalanceByContract(
  //   contractValueList.value["AMAX"]
  // );
  // amaxBalance.value = String(userBalance).split(" ")[0];
  info.value = await req.post("/api/wallet/index");
  amaxBalance.value = Number(info.value.amaxQuantity).toFixed(4);
}
watch(
  () => isLogin.value,
  async (n) => {
    if (n) {
      getBalance();
    }
  }
);
function toGame() {
  //  return showToast("暂未开放");
  router.push("/game");
}

async function buySheep() {
  if (!isLogin.value) return showToast("请先连接钱包");

  if (Number(quantity.value) > Number(amaxBalance.value)) {
    showConfirmDialog({
      message: "当前AMAX余额不足，是否跳转充值页面？",
    }).then(() => {
      router.push("/purse");
    });
  } else {
    showConfirmDialog({
      message: `确定购买${quantity.value}只羊？`,
    }).then(async() => {
      try {
        await req.post(
          `/api/user/buy/sheep?number=${quantity.value}`,
          {},
          { loading: true }
        );
        showToast("购买成功");
        getBalance();
      } catch (error) {}
    });
  }
}

onMounted(async () => {
  if (isLogin.value) {
    getBalance();
  }
});
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 800px;
  overflow: auto;
  height: calc(100vh - 150px);
  .page-box {
    background: url("@/assets/images/home/bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .banner {
    margin-top: 30px;
    width: 710px;
    height: 463px;
    background: url("@/assets/images/home/banner.png");
    background-size: 100% 100%;
    padding: 20px 0;
  }

  .title {
    margin: 60px auto 0;
    width: 528px;
    height: 107px;
    background: url("@/assets/images/home/title.png");
    background-size: 100% 100%;
    position: relative;
    z-index: 10;
  }
  .title2 {
    @extend .title;
    background: url("@/assets/images/home/title2.png");
    background-size: 100% 100%;
  }
  .bg {
    position: relative;

    .bg-box {
      border-radius: 40px;
      background: #34ab75;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 20px;
      z-index: 1;
    }
  }
  .box {
    position: relative;
    z-index: 2;
    border-radius: 20px;
    background: #ffe7ce;
    margin: -20px 30px 0;
    padding: 60px 30px;
    .img {
      margin: 0 auto;
      width: 465px;
      height: 563px;
      background: #ffffff;
      border-radius: 30px;
      position: relative;
      .state {
        position: absolute;
        right: 0;
        bottom: 0;
        background: #d0aa8a;
        border-radius: 20px 0px 30px 0px;
        padding: 10px 30px;
        font-size: 30px;
        color: #6b2b09;
      }
    }
    .title3 {
      font-size: 40px;
      color: #92461e;
      margin-top: 40px;
      font-weight: 550;

      .icon {
        width: 53px;
        height: 50px;
        margin-right: 20px;
      }
      .step {
        background: #d0aa8a;
        border: 1px solid #9f6b44;
        border-radius: 20px;
        height: 60px;
        display: flex;
        align-items: center;

        :deep(.van-stepper__minus),
        :deep(.van-stepper__plus),
        :deep(.van-stepper__minus--disabled),
        :deep(.van-stepper__input) {
          color: #fff;
          background: transparent !important;
        }

        :deep(.van-stepper__input) {
          height: 40px;
          font-size: 30px;
          padding: 0 10px;
        }
      }
    }
    .line::before {
      content: "";
      width: 16px;
      height: 16px;
      margin-left: 20px;
      margin-right: 20px;
      display: inline-block;
      background: #f3b16e;
      border-radius: 50%;
    }
    .line {
      font-size: 30px;
      color: #91461e;
      margin-top: 10px;
    }
    .btn {
      width: 610px;
      height: 94px;
      background: url("@/assets/images/home/btn.png") no-repeat;
      background-size: 100% 100%;
      color: #fff;
      font-size: 36px;
      margin: 40px auto 0;
      padding: 0 50px;
      .divide {
        width: 1px;
        height: 51px;
        background: #a35918;
      }
    }
    .banlance {
      color: #91461e;
      font-size: 28px;
      margin: 20px 100px 0;
    }
    .intro {
      font-size: 26px;
      color: #91461e;
      line-height: 0.65rem;
    }
    .intro-img {
      margin: 20px 0;
      width: 100%;
      height: 312px;
    }
  }
}
</style>
