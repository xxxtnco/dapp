<template>
  <div class='page'>
    <div class='page-box'>
      <div class='title width-full'>
        <div class='ranking'>
          <div class='item'>
            <div class='titlea'>
              {{ rankinglista[1]?.gardenName||"大型牧羊场" }}
            </div>
            <div class='num'>
              {{ Math.ceil(rankinglista[1]?.outputTotal)||"222"}}
            </div>
          </div>
          <div class='item'>
            <div class='titlea'>
              {{ rankinglista[0]?.gardenName||"" }}
            </div>
            <div class='num'>
              {{ Math.ceil(rankinglista[0]?.outputTotal)||""}}
            </div>
          </div>
          <div class='item'>
            <div class='titlea'>
              {{ rankinglista[2]?.gardenName||"超级牧羊场" }}
            </div>
            <div class='num'>
              {{ Math.ceil(rankinglista[2]?.outputTotal)||"333"}}
            </div>
          </div>
        </div>
      </div>

      <div class='content'>
        <div class='datalist'>
          <div class='item flex-center' v-for='(i,j) in datalist' :key='j' @click='datalistclick(i,j)'>
            {{ i.title }}
          </div>
        </div>

        <div class='division'>
        </div>

        <div class='rankinglist'>
          <div class='item flex-center' v-for='(i,j) in rankinglista' :key='j'>
            <img class='img' :src='i.img' alt=''>
            <div class='titlea break-ellipsis'>{{ i.name }}</div>
            <div class='num'>{{ Math.ceil(i.outputTotal) }}</div>
          </div>
        </div>
      </div>
     
    </div>
  </div>
</template>

<script setup>
import {closeDialog, closeToast, showToast} from "vant";
import {onMounted, ref, computed, watch} from "vue";
import {useRouter} from "vue-router";
import {useWalletStore} from "@/stores";
import req from "@/libs/req";
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
const walletStore = useWalletStore();
const isLogin = computed(() => walletStore.isConnection);
const loading = ref(false);
const onRefresh = async () => {
  if (isLogin.value) {
    await homelist();
  }
  setTimeout(() => {
    showToast('刷新成功');
    loading.value = false;
  }, 1000);
};
const router = useRouter();
const datalist = ref([{
  title: "排名",
  actvit: true
}, {
  title: "牧场名称",
  actvit: false
}, {
  title: "总产出",
  actvit: false
}])
const data = ref([{
  title: "聚龙牧羊场",
  sum: "123",
  output: "20",
  divide: "5"
}, {
  title: "聚龙牧羊场",
  sum: "123",
  output: "20",
  divide: "5"
},])
const rankinglist = ref([{
  title: "聚龙牧羊场",
  output: "20",
  img: ranking1
}, {
  title: "聚龙牧羊场",
  output: "23",
  img: ranking2
},
  {
    title: "聚龙牧羊场",
    output: "34",
    img: ranking3
  },
  {
    title: "聚龙牧羊场",
    output: "56",
    img: ranking4
  },
  {
    title: "聚龙牧羊场",
    output: "98",
    img: ranking5
  },
  {
    title: "聚龙牧羊场",
    output: "56",
    img: ranking6
  },
  {
    title: "聚龙牧羊场",
    output: "98",
    img: ranking7
  },
  {
    title: "聚龙牧羊场",
    output: "66",
    img: ranking8
  }, {
    title: "聚龙牧羊场",
    output: "22",
    img: ranking9
  },
  {
    title: "聚龙牧羊场",
    output: "11",
    img: ranking10
  }

])

const rankinglista = ref([]);


const datalistclick = (i, j) => {
  datalist.value.map((item) => item.actvit = false)
  datalist.value[j].actvit = true
  console.log(i,"当前点击")
}


async function homelist() {
  const res = await req.post('/api/SheepWalk/rank', {},{ loading: true })
  try {
    rankinglista.value = res
    if(!!rankinglista.value){
      rankinglista.value.map((i,j)=>{
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
    homelist()
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
  background: #FFE7CE;

  .page-box {
    background: url("@/assets/images/sheepfarm/trophybg.png") no-repeat;
    background-size: 100% 23%;
  }
  .content {
    width: 100%;
    height: 100%;
    background: #FFE7CE;
    border-radius: 30px 30px 0px 0px;
    position: relative;
    top: -20px;

    .datalist {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-evenly;
      padding-block: 35px;
      .item {
        width: 222px;
        height: 77px;
        background: url("@/assets/images/sheepfarm/sf-actiona.png") no-repeat;
        background-size: 100% 100%;
        font-size: 36px;
        font-weight: 400;
        color: #BB7A2A;
      }

      .actvit {
        @extend .item;
        background: url("@/assets/images/sheepfarm/sf-action.png") no-repeat;
        background-size: 100% 100%;
      }

    }

    .division {
      width: 100%;
      height: 10px;
      background: url("@/assets/images/sheepfarm/division.png") no-repeat;
      background-size: 100% 100%;
    }

    .rankinglist {
      display: flex;
      flex-direction: column;
      align-items: center;
      height:calc(100vh - 522px);
      overflow: auto;
      .item {
        width: 694px;
        height: 136px;
        margin-block: 10px;
        background: url("@/assets/images/rankinglist/bg1.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        font-size: 36px;
        font-weight: 400;
        color: #BB7A2A;
        padding-inline: 35px;

        .img {
          width: 116px;
          height: 94px;
        }

        .num {
          padding-inline: 50px;
        }
      }
    }
  }
}

.title {
  height: 335px;

  .ranking {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding-inline: 70px;
    height: 50px;
    padding-top: 300px;
    .item {
      width: 300px !important;
      height: 120px;
      text-align: center;
      font-size: 30px;
      font-weight: 600;
      color: #FFFFFF;
      .titlea {
        font-size: 30px;
        font-weight: 600;
        color: #6B2B09;
        line-height: 40px;
      }
      .num {
        font-size: 34px;
        font-weight: 600;
        color: #FFFFFF;
        text-align: center;
        line-height: 35px;
        margin-bottom: 10px;
      }
    }


    .item:nth-child(1) {
      margin-bottom: 10px;
    }
    .item:nth-child(2) {
      margin-inline: 50px;
      height: 190px;
      .titlea {
        font-size: 34px;
        font-weight: 600;
        line-height: 60px;
      }
      .num {
        font-size: 40px;
        font-weight: 600;
      }
    }
  }
}


</style>