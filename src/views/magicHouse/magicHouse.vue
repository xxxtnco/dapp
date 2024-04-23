<template>
  <div class='page'>
    <div class='page-box'>
      <van-pull-refresh v-model='loading' @refresh='onRefresh' loading-text="加载中...">

        <my-nav></my-nav>
        <div class='banner'>
        </div>
        <div class='title'>
          魔法牌抽奖大派送
        </div>
        <div class='bg'>
          <div class='bg-box'>
          </div>
          <div class='box'>
            <div class='datalist'>

              <div class='draw-card' v-for='(item,index) of cardStateArray' @click='clickImg(index)' :key='index'>
                <img class='front' :class="item.state ? 'front_reverse':''" :src='open' mode='widthFix'>
                <img class='back' :class="item.state ? 'back_reverse':''" :src='item.src ? item.src:open' mode='widthFix'>

                <img class='img a' :class="item.select?'img_hover':''" src='@/assets/images/magichouse/xuanze.png' mode='widthFix'>
              </div>

            </div>
            <div class='banlance'>
              每次抽10张魔法牌任选3张
            </div>
            <div class='btn flex-center' v-if="!isBuy" @click='buy'>
              10 Crystal+3 MUSDT/次
            </div>
            <div class='btn flex-center' v-if="isBuy" @click="submit">
              {{ "确定选择(" + cardStateArray.filter((i) => i.select == true).length + "/3)" }}
            </div>
            <div class="myRecord text-center" @click="toMyRecord">我的记录</div>
          </div>

        </div>

        <div class='title2'>
          魔法牌介绍
        </div>

        <div class='bottomdata'>
          <div class='item' v-for='(i,j) in bottomdata' :key='j'>
            <div class='titles'></div>

            <div class='contenta'>
              <img :src='i.img' class='imga'>
              <div class='centera'>
                <div class='hader'>{{ i.title }}</div>
                <div class='bottom'>{{ i.content }}</div>
              </div>
            </div>
          </div>

        </div>

      </van-pull-refresh>
    </div>

    <my-dialog v-model:show='showAdd' :isShowBtn='true' @confirm='confirma'>
      <div class='dialog2'>
        <div class='content text-center'>
          确定开启魔法屋吗？
        </div>
      </div>
    </my-dialog>

    <my-menu></my-menu>
  </div>
</template>

<script setup>
import { closeDialog, showToast, showConfirmDialog } from "vant";
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useWalletStore } from "@/stores";
import req from "@/libs/req";
import cardSheep from "@/assets/images/magichouse/cardSheep.png";
import cardWolf from "@/assets/images/magichouse/cardWolf.png";
import card50 from "@/assets/images/magichouse/card50.png";
import card80 from "@/assets/images/magichouse/card80.png";
import card100 from "@/assets/images/magichouse/card100.png";
import card0 from "@/assets/images/magichouse/card0.png";
import open from "@/assets/images/magichouse/open.png";
const loading = ref(false);
const router = useRouter();
const index = ref(1);
const info = ref({});
const isLogin = computed(() => walletStore.isConnection);
const quantity = ref(0);
const showAdd = ref(false);
const walletStore = useWalletStore();
const cardStateArray = ref([]); //牌状态数组

const createState = () => {
  //初始化数组长度和状态
  cardStateArray.value = Array(10) //10张牌
    .fill(0)
    .map((item, index) => {
      let obj = {
        state: false,
        select: false,
      };
      return obj;
    });
  console.log("状态数组", cardStateArray.value);
};

function buy() {
  if (!isLogin.value) return showToast("请先连接钱包");
  showAdd.value = true;
}

const isBuy = ref(false); //用户是否购买
const isRoll = ref(false); //是否处于翻牌状态
function clickImg(index) {
  if (isBuy.value) {
    if (!isRoll.value) {
      //翻牌
      isRoll.value = true;
      cardStateArray.value.forEach((res) => (res.state = true));
    } else {
      if (!cardStateArray.value[index].select) {
        if (cardStateArray.value.filter((i) => i.select == true).length > 2)
          return;
        if (cardStateArray.value[index].id === null) return;
      }
      cardStateArray.value[index].select = !cardStateArray.value[index].select;
    }
    //createState()//可以再次初始化来实现还原
  } else {
    showToast("请先购买魔法牌");
  }
}
async function submit() {
  if (cardStateArray.value.filter((i) => i.select == true).length !== 3)
    return showToast("请选择3张魔法牌");
  let data = [];
  cardStateArray.value.forEach((val) => {
    console.log(val.select);
    if (val.select) {
      console.log(val.id);
      data.push({
        id: val.id,
      });
    }
  });
  const res = await req.post(
    "/api/magic/get/award",
    { sn: sn.value, awardList: data },
    { loading: true }
  );
  showToast("领取成功");
  createState();
  isRoll.value = false;
  getInfo();
}

const sn = ref("");
async function getInfo() {
  isBuy.value = await req.post("/api/magic/isGetAward");

  info.value = await req.post("/api/wallet/index");

  if (isBuy.value) {
    const res = await req.post("/api/magic/lottery");
    res.awardList.forEach((val, i) => {
      cardStateArray.value[i].src = val.images;
      cardStateArray.value[i].id = val.id;
    });
    sn.value = res.sn;
    //翻牌
    isRoll.value = true;
    cardStateArray.value.forEach((res) => (res.state = true));
  }
}
async function confirma() {
  if (10 > Number(info.value.crystalQuantity)) {
    showConfirmDialog({
      message: "当前crystal余额不足，是否跳转充值页面？",
    }).then(() => {
      router.push("/purse");
    });
  } else if (3 > Number(info.value.musdtQuantity)) {
    showConfirmDialog({
      message: "当前MUSDT余额不足，是否跳转充值页面？",
    }).then(() => {
      router.push("/purse");
    });
  } else {
    const res = await req.post("/api/magic/lottery", {}, { loading: true });
    showToast("购买成功");
    res.awardList.forEach((val, i) => {
      cardStateArray.value[i].src = val.images;
      cardStateArray.value[i].id = val.id;
    });
    sn.value = res.sn;
    //翻牌
    isRoll.value = true;
    cardStateArray.value.forEach((res) => (res.state = true));
    isBuy.value = true;
    showAdd.value = false;
  }
}

const bottomdata = ref([
  {
    title: "羊牌",
    content:
      "抽中羊牌将获得一只羊，羊牌可以进行转增，需要点击使用才能生效。羊可以参与游戏和产出水晶",
    img: cardSheep,
  },
  {
    title: "狼牌",
    content:
      "抽中羊牌将获得一只狼，狼牌可以进行转增，需要点击使用才能生效。狼可以获得牧羊场收入水晶的80%",
    img: cardWolf,
  },
  {
    title: "50%保险牌",
    content:
      "50%保险牌（分1天，3天，即当天参与游戏如果遇到被杀只扣除当前投入资源的50%)",
    img: card50,
  },
  {
    title: "80%保险牌",
    content:
      "80%保险牌（分1天，3天，即当天参与游戏如果遇到被杀只扣除当前投入资源的20%)",
    img: card80,
  },
  {
    title: "水晶奖励牌",
    content:
      "抽中将获得5水晶或者10水晶，水晶可以参与每周的资源瓜分和开启魔法牌",
    img: card100,
  },
  {
    title: "空魔法牌",
    content: "抽中空魔法牌，表示没有任何奖励",
    img: card0,
  },
]);

const onRefresh = () => {
  if (isLogin.value) {
    getInfo();
  }
  setTimeout(() => {
    showToast("刷新成功");
    loading.value = false;
  }, 1000);
};

watch(
  () => isLogin.value,
  (n) => {
    if (n) {
      getInfo();
    }
  }
);

function toMyRecord() {
  if (!isLogin.value) return showToast("请先连接钱包");
  router.push("/myRecord");
}

onMounted(() => {
  createState();
  if (isLogin.value) {
    getInfo();
  }
});
</script>

<style scoped lang='scss'>
.page {
  width: 100%;
  max-width: 800px;
  overflow: auto;
  height: calc(100vh - 150px);

  .page-box {
    background: url("@/assets/images/home/bg.png") no-repeat;
    background-size: 100%;
  }

  .banner {
    width: 100%;
    height: 732px;
    background: url("@/assets/images/magichouse/mofawu.png");
    background-size: 100% 100%;
  }

  .title {
    margin: auto;
    width: 528px;
    height: 107px;
    background: url("@/assets/images/sheepfarm/sf-boxred.png");
    background-size: 100% 100%;
    position: relative;
    z-index: 10;
    font-size: 40px;
    font-weight: 900;
    color: #ffffff;
    line-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    bottom: 100px;
  }

  .title2 {
    @extend .title;
    background: url("@/assets/images/sheepfarm/sf-boxred.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    bottom: 5px;
  }

  .bottomdata {
    .item {
      width: 692px;
      height: 330px;
      background: #ffe7ce;
      border: 2px solid #7c7b6e;
      border-radius: 20px;
      margin: 40px auto;
      position: relative;

      .contenta {
        font-size: 28px;
        font-weight: 400;
        position: absolute;
        top: 40px;
        z-index: 99;
        display: flex;
        flex-wrap: nowrap;
        padding-inline: 40px;

        .imga {
          flex: 1;
          width: 168px;
          height: 243px;
          background: #6b2b09;
          border-radius: 15px;
          object-fit: contain;
        }

        .centera {
          display: flex;
          flex-direction: column;
          margin-left: 20px;

          .hader {
            font-size: 32px;
            font-weight: 500;
            color: #161612;
            margin-block: 10px;
          }

          .bottom {
            font-size: 28px;
            font-weight: 400;
            color: #91461e;
            margin-block: 20px;
          }
        }
      }

      .titles {
        width: 100%;
        height: 103px;
        background: #f5e2ac;
        border-radius: 20px 20px 0px 0px;
      }
    }
  }

  .bg {
    position: relative;
    top: -48px;
    height: 666px;
    .bg-box {
      border-radius: 30px;
      background: #34ab75;
      width: 100%;
      height: 100%;
      position: absolute;
      top: -40px;
      z-index: 1;
    }
  }

  .box {
    position: relative;
    z-index: 2;
    border-radius: 20px;
    background: url("@/assets/images/magichouse/box.png");
    background-size: 100% 100%;
    margin: 0px 10px;
    padding: 60px 45px 80px;
    top: -64px;

    .datalist {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .draw-card {
        position: relative;
        perspective: 500px; /* 设置透视投影 */
        width: 109px;
        height: 147px;
        margin-block: 20px;
        //background: url("@/assets/images/magichouse/open.png");
        //background-size: 100% 100%;
        .front,
        .back {
          position: absolute;
          backface-visibility: hidden; /* 隐藏背面元素 */
          width: 100%;
          height: 100%;
        }

        .img {
          width: 39px;
          height: 34px;
          position: absolute;
          top: -10px;
          right: -13px;
          opacity: 0;
          transition: opacity 1s ease-in-out;

          &_hover {
            opacity: 1;
          }
        }

        .front {
          z-index: 2; /* 设置正面元素位于背面元素之上 */
          transform: rotateY(0deg); /* 初始状态正面朝上 */
          transition: transform 0.6s ease; /* 添加过渡效果 */

          &_reverse {
            transform: rotateY(-180deg); /*正面翻转为背面 */
          }
        }

        .back {
          transform: rotateY(180deg); /* 初始状态背面朝上 */
          transition: transform 0.6s ease; /* 添加过渡效果 */
          &_reverse {
            transform: rotateY(0deg); /*背面翻转为正面 */
          }
        }
      }

      .Animation {
        @keyframes whirling {
          100% {
            transform: rotateY(360deg);
          }
        }
        animation: whirling 0.8s 2 ease-in-out;
      }

      .item {
        width: 109px;
        height: 147px;
        background: url("@/assets/images/magichouse/open.png");
        background-size: 100% 100%;
        margin-block: 20px;
        position: relative;

        .img {
          width: 39px;
          height: 34px;
          position: absolute;
          top: -10px;
          right: -13px;
        }

        .text {
          font-size: 28px;
          font-weight: 400;
          color: #6b2b09;
          margin-block: 10px;
        }
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
    }
    .myRecord {
      margin-top: 20px;
      color: #91461e;
      font-size: 26px;
    }

    .banlance {
      color: #91461e;
      font-size: 28px;
      margin: 10px 110px;
      text-align: center;
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

.dialog2 {
  margin-top: 50px;
  .content {
    padding: 40px 0;
    font-size: 36px;
  }
}
</style>
