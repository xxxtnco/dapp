<template>
  <div class='page'>
    <div class='page-box'>
      <van-pull-refresh v-model="loadings" @refresh="onRefresh" loading-text="加载中">
      <my-nav></my-nav>
      <div class='content'>
        <div class="header">
          <img class="title" src="@/assets/images/farm/title.png" alt="">
          <van-count-down :time="time">
            <template #default="timeData">
              <span class="block">{{ timeData.days }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.hours }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.minutes }}</span>
              <span class="colon">:</span>
              <span class="block">{{ timeData.seconds }}</span>
            </template>
          </van-count-down>
          <div class="num-content">
            <div class="num-box flex-sb">
              <div class="left">
                <div class="num">{{info.totalAmax || 0}}</div>
                <div class="text">总资源(AMAX)</div>
              </div>
              <div class="right">
                <div class="num">{{info.todayAmax || 0}}</div>
                <div class="text">今日资源(AMAX)</div>
              </div>
            </div>
            <div class="num-box flex-sb">
              <div class="left">
                <div class="num">{{info.unShare || 0}}</div>
                <div class="text">待瓜分(AMAX)</div>
              </div>
              <div class="right">
                <div class="num">{{info.totalCrystal || 0}}</div>
                <div class="text">总水晶(crystal)</div>
              </div>
            </div>
            <div class="num-box flex-sb">
              <div class="left">
                <div class="num">{{info.inputNum || 0}}</div>
                <div class="text">投入水晶(crystal)</div>
              </div>
              <div class="right">
                <div class="num">{{sliceDecimal(info.proportion*100 ,0)|| 0}}%<div @click="show = true;quantity=''" class="btn">投入+</div>
                </div>
                <div class="text">我的占比</div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg">
          <div class="bg-box">
          </div>
          <div class="box">
            <div class="title center">AMAX农场说明</div>
            <div class="text">1、《狼来了》游戏每天会沉淀大量的资源进入农场，MAGIC META将手续费用的45%沉淀进农场。</div>
            <div class="text">2、用户养殖的羊群可以将水晶投入农场瓜分每周沉淀的资源。</div>
            <div class="text">3、投入的水晶可以随时撤回，如果参与了本轮瓜分，则水晶不予退回。</div>
            <div class="text">4、用户参与下期农场分红需要在投入水晶。所以用户需要不断壮大自己的羊群获得水晶。</div>
          </div>
          <div class="box" v-if="isLogin">
            <div class="title center">瓜分走势图(天)</div>
            <div id="main"></div>
          </div>
        </div>
      </div>
   
      <van-dialog class="input-dialog" v-model:show="show" :show-confirm-button="false">
        <div class="input-content">
          <div class="close" @click="show = false"></div>
          <van-field class="input" v-model="quantity" placeholder="投入数量" type="number" @update:model-value="changeQuantity">
            <template #button>
              crystal
            </template>
          </van-field>
          <div class="line line-top flex-sb">
            <div>当前占比：</div>
            <div>{{sliceDecimal(info.proportion*100 ,0) || 0}}%</div>
          </div>
          <div class="line flex-sb">
            <div>投入后占比：</div>
            <div>{{afterNum}}%</div>
          </div>
          <div class="line flex-sb">
            <div>预计瓜分资源：</div>
            <div>{{info.inputNum + Number(quantity)}}(crystal)</div>
          </div>
          <div class="confirmBtn center" @click="confirm">立即投入</div>
          <div class="look text-center" @click="toFarmList">查看记录</div>
        </div>
      </van-dialog>
      </van-pull-refresh>
    </div>
  <my-menu></my-menu>
  </div>
</template>
  
<script setup>
import * as echarts from "echarts";
import { closeDialog, showToast } from "vant";
import { onMounted, ref, computed, watch, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useWalletStore } from "@/stores";
import req from "@/libs/req";
import { sliceDecimal } from "@/libs/utils";
const loadings = ref(false);
const onRefresh = async () => {
  if(isLogin.value) await getInfo();
  setTimeout(() => {
    showToast("刷新成功");
    loadings.value = false;
  }, 1000);
};

const walletStore = useWalletStore();
const isLogin = computed(() => walletStore.isConnection);

const time = ref(0);
watch(
  () => isLogin.value,
  (n) => {
    if (n) {
      getInfo();
    }
  }
);

const afterNum = ref(0);
function changeQuantity(){
  quantity.value = Number(quantity.value);
  if(info.value.totalCrystal === 0) return afterNum.value = 0;
  afterNum.value = (((info.value.inputNum + quantity.value)/info.value.totalCrystal)*100).toFixed(0);
}
const router = useRouter();
const show = ref(false);
const info = ref({proportion:0,inputNum:0})
function toFarmList(){
  if(!isLogin.value) return showToast('请连接钱包')
    router.push('/farmList')
}

const lineX = ref([]);
const lineY = ref([]);
async function getInfo(){
  info.value = await req.post("/api/farm/index");
  info.value.totalCrystal = Number(info.value.totalCrystal);
  info.value.inputNum = Number(info.value.inputNum);
  time.value = info.value.countDown;
  lineX.value = [];
  lineY.value = [];
  info.value.klineVOS.forEach(res => {
    lineX.value.push(res.date);
    lineY.value.push(res.inputNum);
  });
   init();
}
const myChart = ref(null);

const quantity = ref('');
async function confirm(){
  if(!isLogin.value) return showToast('请连接钱包')
  if(!quantity.value) return showToast('请输入投入数量')
  await req.post(`/api/farm/user/input?crystalNum=${quantity.value}`,{},{loading:true})
  showToast('投入成功');
  show.value = false;
  quantity.value = '';
  getInfo();
}

function init() {
  let chartDom = document.getElementById("main");
  myChart.value = echarts.init(chartDom);
  let option;

  option = {
    xAxis: {
      type: "category",
      data: lineX.value,
      axisLabel:{
        interval:0,
        rotate:50,
        margin:8
      },
      // axisTick:{
      //   show:false//去除刻度线
      // }
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: lineY.value,
        type: "line",
        symbol: "none", //去掉小圆点
        symbolSize: 0, //圆点大小设置为0
        itemStyle: {
          color: "#91461E",
        },
      },
    ],
  };

  option && myChart.value.setOption(option);
}
onUnmounted(() => {
  if(myChart.value){
    myChart.value.dispose();
  }
});
onMounted(() => {
  if (isLogin.value) getInfo();
});
</script>
  
<style scoped lang='scss'>
.page {
  width: 100%;
  max-width: 800px;
  overflow: auto;
  height: calc(100vh - 80px);
  .page-box {
    background: url("@/assets/images/farm/bg.png") no-repeat;
    background-size: 100%;
    padding-bottom: 10px;
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
    .content {
      .header {
        padding-bottom: 160px;
        text-align: center;
        .title {
          margin: 100px 0 50px;
          width: 504px;
          height: 48px;
        }
        .colon {
          display: inline-block;
          margin: 0 12px;
          color: #6b2b09;
          font-weight: bold;
        }
        .block {
          display: inline-block;
          width: 62px;
          height: 62px;
          line-height: 62px;
          font-size: 36px;
          text-align: center;
          background-color: #6b2b09;
          border-radius: 10px;
          color: #fff;
          font-weight: bold;
        }
        .num-content {
          margin: 140px 100px 0;
          .num-box {
            margin-bottom: 20px;
            .left,
            .right {
              flex: 1;
              max-width: 275px;
              max-height: 140px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .num {
              color: #874419;
              font-size: 32px;
              font-weight: bold;
              word-break: break-all;
              position: relative;
              z-index: 2;
              .btn {
                z-index: -1;
                position: absolute;
                top: -10px;
                right: 0px;
                background: #e2b079;
                border: 1px solid #91461e;
                border-radius: 26px;
                font-size: 22px;
                color: #fff;
                padding: 2px 10px;
              }
            }
            .text {
              font-size: 24px;
            }
          }
        }
      }
      .box {
        border-radius: 20px;
        background: #ffe7ce;
        margin: 0px 30px 100px;
        padding: 60px 30px;
        position: relative;
        z-index: 2;
        .title {
          text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
          font-weight: 900;
          font-size: 40px;
          color: #ffffff;
          position: absolute;
          top: -50px;
          margin: 0 40px;
          width: 528px;
          height: 107px;
          background: url("@/assets/images/sheepFarm/sf-boxred.png") no-repeat;
          background-size: 100%;
        }
        .text {
          font-size: 30px;
          color: #91461e;
          margin-top: 20px;
        }
      }
    }
  }
}
#main {
  width: 100%;
  height: 500px;
}
:deep(.van-dialog) {
  max-width: 800px;
  width: 750px;
  background: url("@/assets/images/farm/dialogBg.png") no-repeat;
  background-size: 100% 100%;
}
.input-dialog {
  .input-content {
    width: 750px;
    position: relative;
    padding: 200px 140px 0;
    .close {
      position: absolute;
      top: 140px;
      right: 60px;
      width: 80px;
      height: 80px;
      opacity: 0;
    }
    .input {
      margin-top: 10px;
      background: transparent;
      border-bottom: 1px solid #6b2b09;
      padding: 20px 0;
      font-size: 26px;
      :deep(.van-field__control),
      :deep(.van-field__control)::placeholder {
        color: #bb7d58;
      }
      :deep(.van-field__button) {
        color: #6b2b09;
      }
    }
    .line-top {
      margin-top: 40px !important;
    }
    .line {
      color: #91461e;
      font-size: 26px;
      margin-top: 20px;
    }
    .confirmBtn {
      width: 470px;
      height: 87px;
      background: url("@/assets/images/home/btn.png") no-repeat;
      background-size: 100% 100%;
      margin: 50px auto 0px;
      font-size: 34px;
      color: #fff;
    }
    .look {
      color: #91461e;
      font-size: 26px;
      padding: 20px 0 30px;
    }
  }
}
</style>