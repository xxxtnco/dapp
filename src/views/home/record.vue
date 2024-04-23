<template>
  <div class='page'>
    <div class='page-box'>
      <van-pull-refresh v-model='loading' @refresh='onRefresh' loading-text='加载中'>
        <div class='bottomdata'>

          <div class='item'>
            <div class='title flex-center'>
              近100期统计
            </div>
            <div class='contenta'>
              <div class='itema' v-for='(i,j) in statisticstop' :key='j'>
                <div class='hader flex-center'>
                  {{i.roomName||""}}
                </div>
                <div class='num'>
                  <img src='@/assets/images/home/youxiicon.png' class='img'>
                  <div class='text'> {{i.killNum||0}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class='item'>
            <div class='title flex-center'>
              近10期杀手房间记录
            </div>
            <div class='contenta'>
              <div class='itema' v-for='(i,j) in statisticsbottom' :key='j'>
                <div class='hader w flex-center'>
                  {{i.roomName||""}}
                </div>
                <div class='num'>
                  <div class='text t'>{{i.id||0}}期</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class='myrecord'>我的参与记录</div>
        <div class='myrecorda'>
          <div class='a'>
            <div>{{Math.ceil(statistics.totalInput)||0}}</div>
            <div>共投入</div>
          </div>
          <div class='b'></div>
          <div class='a'>
            <div>{{Math.ceil(statistics.totalOutput)||0}}</div>
            <div>共获得</div>
          </div>
        </div>

        <div class='myrecordc'>

        </div>

        <div class='bottomddata flex-center'>
          <div v-if="participation.length===0">
            <van-empty description="暂无数据" />
          </div>
          <div class='item' v-for='(i,j) in participation' :key='j'>
            <div class='hader'>
              <div class='time'>{{ i.createTime||'---' }}</div>
              <div class='status'>{{i.isWin? "躲避成功":"躲避失败"}}</div>
            </div>
            <div class='centera'>
              <div class='row'>
                <div>参与期数</div>
                <div>{{i.gameId||0}}期</div>
                <div>投入AMAX</div>
                <div>{{sliceDecimal(i.input,1)||0}}</div>
              </div>
              <div class='row'>
                <div>房间记录</div>
                <div>{{i.roomName||''}}</div>
                <div>获得AMAX</div>
                <div>{{sliceDecimal(i.output)||0}}</div>
              </div>
              <div class='row'>
                <div>收益比例</div>
                <div>{{i.earningRate * 100 ||0}}%</div>
                <div>保险牌</div>
                <div>{{i.insure * 100 ||0}}%</div>
              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { closeDialog, showToast } from "vant";
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useWalletStore } from "@/stores";
import req from "@/libs/req";
import { sliceDecimal } from "@/libs/utils";
const statistics = ref({});
const router = useRouter();
const walletStore = useWalletStore();
const isLogin = computed(() => walletStore.isConnection);
const loading = ref(false);
const onRefresh = async () => {
  if (isLogin.value) {
    loading.value = true;
    await getInfo();
  }
  setTimeout(() => {
    showToast("刷新成功");
    loading.value = false;
  }, 1000);
};

//100期统计
const statisticstop = ref([{
  killNum:'0',
  roomName:'兽医室'
},{
  killNum:'0',
  roomName:'屠宰场'
},{
  killNum:'0',
  roomName:'化验室'
},{
  killNum:'0',
  roomName:'会议室'
},{
  killNum:'0',
  roomName:'饲料室'
},{
  killNum:'0',
  roomName:'杂物间'
},{
  killNum:'0',
  roomName:'管理室'
},{
  killNum:'0',
  roomName:'休息室'
},]);
//10期统计
const statisticsbottom = ref([{
  id:'0',
  roomName:'兽医室'
},{
  id:'0',
  roomName:'屠宰场'
},{
  id:'0',
  roomName:'化验室'
},{
  id:'0',
  roomName:'会议室'
},{
  id:'0',
  roomName:'饲料室'
},{
  id:'0',
  roomName:'杂物间'
},{
  id:'0',
  roomName:'管理室'
},{
  id:'0',
  roomName:'休息室'
},
{
  id:'0',
  roomName:'兽医室'
},{
  id:'0',
  roomName:'屠宰场'
}]);
const participation = ref('');
async function getInfo() {
  try {
    const res = await req.post("/api/game/record/statistics");
    const ress = await req.post("/api/game/join/record", {}, { loading: true });
    statistics.value = res;
    if(res.game100.length!==0){
      statisticstop.value = res.game100;
    }
    if(res.gameList.length!==0){
      statisticsbottom.value = res.gameList;
    }
    participation.value = ress.rows;
  } catch (e) {
    console.log(e, "error");
  }
}

onMounted(() => {
  if (!!isLogin.value) {
    getInfo();
  } else {
    showToast("请连接钱包");
  }
});
</script>

<style scoped lang='scss'>
.page {
  width: 100%;
  max-width: 800px;

  .page-box {
    background: #34aa75;
    overflow: auto;
    height: calc(100vh);

    .bottomddata {
      margin-block: 30px;
      display: flex;
      flex-direction: column;
      :deep(.van-empty__description){
        font-size: 30px;
        color: #f2f2f2;
      }
      .item {
        width: 692px;
        background: #ffe7ce;
        border: 2px solid #6b2b09;
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 35px;

        .hader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 28px;
          font-weight: 400;
          color: #91461e;
        }
        .centera {
          display: flex;
          flex-direction: column;
          margin-block: 10px;
          .row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            font-size: 28px;
            font-weight: 400;
            color: #ec962c;
            margin-top: 10px;
          }
        }
      }
    }

    .myrecordc {
      width: 302px;
      height: 86px;
      background: url("@/assets/images/home/wodejilu.png") no-repeat;
      background-size: 100% 100%;
      position: relative;
      left: -10px;
    }

    .myrecorda {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      font-size: 26px;
      font-weight: 400;
      color: #f2f2f2;
      padding-inline: 230px;
      margin-block: 30px;
      margin-bottom: 50px;
      .a {
        display: flex;
        flex-direction: column;
        align-items: center;

        div:nth-child(1) {
          font-size: 36px;
        }
      }

      .b {
        width: 1px;
        height: 50px;
        background: #ffffff;
      }
    }

    .myrecord {
      font-size: 32px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      margin-top: 40px;
    }

    .bottomdata {
      display: flex;
      flex-direction: column;

      .item {
        width: 692px;
        background: #ffe7ce;
        border: 2px solid #7c7b6e;
        border-radius: 20px;
        margin: auto;
        margin-block: 20px;

        .contenta {
          font-size: 28px;
          font-weight: 400;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding-inline: 40px;

          .itema {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-block: 30px;

            .hader {
              width: 129px;
              height: 56px;
              background: url("@/assets/images/home/youxibg.png") no-repeat;
              background-size: 100% 100%;
              font-size: 28px;
              font-weight: 600;
              color: #161612;
              &.w {
                width: 105px;
                height: 50px;
                font-size: 24px;
              }
            }

            .num {
              display: flex;
              flex-wrap: nowrap;
              align-items: center;
              margin-top: 5px;

              .img {
                width: 40px;
                height: 40px;
              }

              .text {
                font-size: 30px;
                font-weight: 500;
                color: #91461e;
                padding-inline: 10px;
                &.t {
                  font-size: 26px;
                  //padding: 0px;
                }
              }
            }
          }
        }

        .title {
          font-size: 32px;
          font-weight: 600;
          color: #161612;
          background: #f5e2ac;
          border-radius: 20px 20px 0px 0px;
          padding: 20px;
        }
      }
    }
  }
}
</style>