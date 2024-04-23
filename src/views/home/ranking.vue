<template>
  <div class='page'>
    <div class='page-box'>
      <van-pull-refresh v-model='loading' @refresh='onRefresh' loading-text='加载中'>
      <div class='title width-full'>
        <div class='top'>
          <img src='@/assets/images/home/bg7.png' class='img'>
          <div class='text'>奖励免杀手伤害皮肤，最高免伤15%</div>
        </div>
        <div class='ranking' v-if='!!datalista'>
          <div class='item' v-for='(i,j) in datalista' :key='j'>
            <img :src='i.img1' class='img'>
            <div class='titlea flex-center' :style='{ background: `url(${i.img2}) no-repeat`,backgroundSize: `100% 100%` }'>
              {{ i.title }}
            </div>
            <div class='num flex-center' :style='{ background: `url(${i.img3}) no-repeat`,backgroundSize: `100% 100%` }'>
              {{ i.num }}
            </div>
          </div>
        </div>
      </div>

      <div class='content'>
        <div class='datalist'>
          <div class='item flex-center' v-for='(i,j) in datalist' :class='i.actvit?"actvit":" "' :key='j'
               @click='datalistclick(i,j)'>
            {{ i.title }}
          </div>
        </div>

        <div class='rankingbox'>
          <div class='title'>
            <div>排名/用户</div>
<!--            <div>奖励勋章数</div>-->
          </div>

          <div class='division'>
          </div>

          <div class='rankinglist'>
            <template v-if='!!homedata.length'>
              <div class='item' v-for='(i,j) in homedata' :key='j'>
                <img class='img' :src='i.img' alt=''>
                <div class='titlebox'>
                  <img src='@/assets/images/sheepfarm/sf-imgbox.png' class='image'>
                  <div class='text'>{{ textSubstr(i.walletAddress, 2) ||'暂无' }}</div>
                </div>
<!--                <div class='num'>{{ Math.ceil(i.output)||'-&#45;&#45;' }}</div>-->
              </div>
            </template>
            <div class='nothing' v-else>
              暂无数据~~
            </div>
          </div>
        </div>

        <div class='bnt'>
          <div class='title'>
            补充说明
          </div>
          <div class='titledetail'>
            每周排名统计奖励。统计前10名，第一名免伤害 15%，2-5免伤10%，6-10免伤5%，权益持续 一周，直到下周排行更新。可叠加使用魔法牌
          </div>

        </div>

      </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import {closeDialog, showToast} from "vant";
import {onMounted, ref, computed, watch} from "vue";
import {useRouter} from "vue-router";
import {useWalletStore} from "@/stores";
import { textSubstr } from "@/libs/utils";
import req from "@/libs/req";
import bg8 from '@/assets/images/home/bg8.png';
import bg3 from '@/assets/images/home/bg3.png';
import bg6 from '@/assets/images/home/bg6.png';
import bg10 from '@/assets/images/home/bg10.png';
import bg2 from '@/assets/images/home/bg2.png';
import bg5 from '@/assets/images/home/bg5.png';
import bg9 from '@/assets/images/home/bg9.png';
import bg1 from '@/assets/images/home/bg1.png';
import bg4 from '@/assets/images/home/bg4.png';
import ranking1 from '@/assets/images/rankinglist/ranking1.png';
import ranking2 from '@/assets/images/rankinglist/ranking2.png';
import ranking3 from '@/assets/images/rankinglist/ranking3.png';
import ranking4 from '@/assets/images/rankinglist/ranking4.png';
import ranking5 from '@/assets/images/rankinglist/ranking5.png';
import ranking6 from '@/assets/images/rankinglist/ranking6.png';
import ranking7 from '@/assets/images/rankinglist/ranking7.png';
import ranking8 from '@/assets/images/rankinglist/ranking8.png';
import ranking9 from '@/assets/images/rankinglist/ranking9.png';
import ranking10 from '@/assets/images/rankinglist/ranking10.png';

const loading = ref(false);
const onRefresh = async () => {
  if (isLogin.value) {
    await homelist(0);
  }
  setTimeout(() => {
    datalist.value.map((i, j) => i.actvit = false)
    datalist.value[0].actvit = true
    showToast('刷新成功');
    loading.value = false;
  }, 1000);
};
const router = useRouter();
const walletStore = useWalletStore();
const isLogin = computed(() => walletStore.isConnection);
const datalista = ref([
  {
    title: "免伤5%",
    num: "第6-10名",
    img1: bg8,
    img2: bg3,
    img3: bg6,
  },
  {
    title: "免伤15%",
    num: "上周榜第1名",
    img1: bg10,
    img2: bg2,
    img3: bg5,
  },
  {
    title: "免伤10%",
    num: "第2-5名",
    img1: bg9,
    img2: bg1,
    img3: bg4,
  }
])

const datalist = ref([{
  title: "本周榜",
  actvit: true,
  type:0
}, {
  title: "上周榜",
  actvit: false,
  type:1
}])

const data = ref([])

const rankinglist = ref([])

const homedata = ref([]);

const datalistclick = (i, j) => {
  homelist(i.type)
  datalist.value.map((item) => item.actvit = false)
  datalist.value[j].actvit = true
}


async function homelist(id) {
  console.log(id, "type列表参数")
  const res = await req.post(`/api/game/rank?type=${id}`, {}, {loading: true})
  try {
    homedata.value = res
    if(!!homedata.value){
      homedata.value.map((i,j)=>{
        switch (j) {
          case 0:
            i['img'] = ranking1
            break;
          case 1:
            i['img'] = ranking2
            break;
          case 2:
            i['img'] = ranking3
            break;
          case 3:
            i['img'] = ranking4
            break;
          case 4:
            i['img'] = ranking5
            break;
          case 5:
            i['img'] = ranking6
            break;
          case 6:
            i['img'] = ranking7
            break;
          case 7:
            i['img'] = ranking8
            break;
          case 8:
            i['img'] = ranking9
            break;
          case 9:
            i['img'] = ranking10
            break;
        }
      })
    }
  } catch (e) {
  }
}



onMounted(() => {
  if (!!isLogin.value) {
    homelist(0)
  } else {
    showToast("请连接钱包");
  }
});

</script>

<style scoped lang='scss'>

.page {
  width: 100%;
  max-width: 800px;
  overflow: auto;
  height: calc(100vh);
  background: #34ab75;
  .page-box {
    background: url("@/assets/images/home/back.png") no-repeat;
    background-size: 100% 100%;
  }

  .content {
    width: 100%;
    height: 100%;
    border-radius: 30px 30px 0px 0px;
    position: relative;

    .datalist {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-evenly;
      width: 692px;
      height: 140px;
      margin: auto;
      background: #FFE7CE;
      border: 2px solid #6B2B09;
      border-radius: 20px;
      margin-block: 50px;

      .item {
        font-size: 36px;
        font-weight: 400;
        color: #BB7A2A;
        width: 305px;
        height: 86px;

      }

      .actvit {
        @extend .item;
        background: #F5E2AC;
        border-radius: 43px;
      }

    }

    .bnt {
      margin-inline: 30px;
      padding-bottom: 30px;
      .title {
        font-size: 40px;
        font-weight: 900;
        color: #FFFFFF;
        margin-block: 40px;
      }

      .titledetail {
        background: #95C7A0;
        border: 2px solid #6B2B09;
        border-radius: 20px;
        padding: 33px;
        font-size: 28px;
        font-weight: 400;
        color: #FFFFFF;
      }



    }

    .rankingbox {
      margin-inline: 30px;
      padding-inline: 25px;
      background: #FFE7CE;
      border-radius: 20px;

      .title {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        justify-content: space-between;
        font-size: 26px;
        font-weight: 400;
        color: #161612;
        padding-block: 30px;
      }

      .division {
        width: 100%;
        height: 10px;
        background: url("@/assets/images/sheepfarm/division.png") no-repeat;
        background-size: 100% 100%;
        margin-bottom: 20px;
      }

      .rankinglist {
        display: flex;
        flex-direction: column;
        align-items: center;

        .nothing {
          font-size: 40px;
          color: #BB7A2A;
          font-weight: 600;
          margin: 145px auto;
        }

        .item {
          width: 100%;
          height: 136px;
          margin-block: 10px;
          background: url("@/assets/images/rankinglist/bg1.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          font-size: 36px;
          font-weight: 400;
          color: #BB7A2A;
          padding-inline: 35px;

          .img {
            width: 116px;
            height: 94px;
          }

          .titlebox {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            margin-left: 40px;
            .image {
              width: 73px;
              height: 73px;
            }

            .text {
              margin-left: 70px;
              width: 60px;
            }
          }

          .num {
            margin-inline: 200px;
          }

        }

      }

    }
  }
}

.title {
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;

    .img {
      width: 636px;
      height: 84px;
      margin-top: 46px;
    }

    .text {
      font-size: 30px;
      font-weight: 500;
      color: #FFFFF7;
      margin-top: 20px;
    }
  }

  .ranking {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    padding-inline: 70px;
    margin-top: 190px;
    margin-bottom: 140px;
    position: relative;

    .item:nth-child(1) {
      .titlea {
        color: #747C88;
      }
    }

    .item:nth-child(2) {
      margin-bottom: 55px !important;

      .img {
        top: -160px;
      }

      .titlea {
        color: #E98F22;
      }

      .num {
        top: 35px;
      }

    }

    .item:nth-child(3) {
      .titlea {
        color: #747C88;
      }
    }

    .item {
      //font-size: 30px;
      //font-weight: 600;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #FFFFFF;

      .img {
        width: 155px;
        height: 188px;
        position: absolute;
        top: -130px;
      }

      .titlea {
        width: 190px;
        height: 53px;
        background-size: 100% 100%;
        position: relative;
        z-index: 99;
        font-size: 28px;
        font-weight: 500;
        //font-size: 30px;
        //font-weight: 600;
        //color: #6B2B09;
      }

      .num {
        width: 178px;
        height: 109px;
        background-size: 100% 100%;
        position: absolute;
        top: 65px;
        font-size: 26px;
        font-weight: 400;
        color: #161612;
        //font-size: 34px;
        //font-weight: 600;
        //color: #FFFFFF;
        //text-align: center;
        //margin-bottom: 10px;
      }
    }
  }
}


</style>