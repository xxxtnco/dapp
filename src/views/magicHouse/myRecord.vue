<template>
  <div class="page">
    <div class="page-box">
      <div class="header flex-sb">
        <div @click="changeType(1)" :class="active === 1 ? 'active':''">有效卡牌({{info.validNums}}张)</div>
        <div @click="changeType(2)" :class="active === 2 ? 'active':''">无效卡牌({{info.unValidNums}}张)</div>
      </div>
      <van-pull-refresh v-model="loadings" @refresh="onRefresh">
        <template #pulling="props">
          <div style="color: #ffe7ce;">释放即可刷新</div>
        </template>
        <template #loosing>
          <div style="color: #ffe7ce;">刷新中...</div>
        </template>
        <template #loading>
          <div style="color: #ffe7ce;">加载中...</div>
        </template>
        <van-list class="list-box" v-model:loading="loading" :finished="finished" @load="onLoad">
          <div class="box" v-for="item in list" :key="item.id">
            <div class="bg">
            </div>
            <div class="box-content flex">
              <img :src="item.image" class="left" alt="">
              <div class="right">
                <div class="name flex-sb">
                  <div>{{item.name}}</div>
                  <!-- <div class="day">1天</div> -->
                </div>
                <div class="data">领取时间：{{item.createTime}}</div>
                <div v-if="active === 1" class="btn flex">
                  <div class="center cancel" @click="use = true;id = item.id;">立即生效</div>
                  <div class="center confirm" @click="give = true;id = item.id;">立即转赠</div>
                </div>
                <div v-if="active === 2" class="data">使用时间：{{item.useTime}}</div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      <div v-if="list.length === 0" class="empty text-center">暂无数据</div>
    </div>
    <my-dialog v-model:show="use" :isShowBtn="true" @confirm="useCard">
      <div class="dialog">
        <div class="content text-center">
          确定生效卡牌吗？
        </div>
      </div>
    </my-dialog>
    <my-dialog v-model:show="give" confirmBtn="立即转赠" @confirm="giveCard" :showClose="true">
      <div class="dialog">
        <div class="title text-center"><img src="@/assets/images/magichouse/title.png" alt=""></div>
        <div class="content2">
          <div class="name">转赠钱包地址</div>
          <van-field class="input2" v-model="address" />
          <div class="text text-center" @click="mySheep">转赠记录</div>
        </div>
      </div>
    </my-dialog>
  </div>
</template>
  
<script setup>
import req from "@/libs/req";
import { onMounted, ref, computed, watch } from "vue";
import myDialog from "@/components/MyDialog.vue";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "vant";
const use = ref(false);
const give = ref(false);
const active = ref(1);
const address = ref("");
const router = useRouter();
const route = useRoute();
function mySheep() {
  router.push("/mySheep");
}
const list = ref([]);
const total = ref(0);
const page = ref(1);
const loading = ref(false);
const loadings = ref(false);
const finished = ref(false);
const info = ref({});

const onRefresh = async () => {
  page.value = 1;
  list.value = [];
  await onLoad();

  setTimeout(() => {
    showToast("刷新成功");
    loadings.value = false;
  }, 1000);
};

async function changeType(e) {
  active.value = e;
  page.value = 1;
  list.value = [];
  await onLoad();
}
async function getList() {
  let state = "";
  if (active.value === 1) state = 0;
  if (active.value === 2) state = 1;
  const data = await req.post(
    "/api/wallet/my/card",
    {
      pageNum: page.value,
      pageSize: 20,
      state: state,
    },
    { loading: true }
  );
  info.value = data;
  list.value = [...list.value, ...data.cardList.records];
  if(active.value === 1){
    total.value = data.validNums;
  }else{
    total.value = data.unValidNums;
  }
}

const onLoad = async () => {
  await getList();
  // 加载状态结束
  loading.value = false;
  // 数据全部加载完成
  if (list.value.length >= total.value) {
    finished.value = true;
  } else {
    page.value = page.value + 1;
  }
  if (list.value.length === 0) {
    finished.value = true;
  }
};

const id = ref("");
async function useCard() {
  await req.post(
    `/api/magic/use?magicCardId=${id.value}`,
    {},
    { loading: true }
  );
  use.value = false;
   showToast('生效成功');
  page.value = 1;
  list.value = [];
  await onLoad();
}
async function giveCard() {
  if(!address.value) return showToast('请输入转赠钱包地址')
  await req.post(
    `/api/magic/donation`,
    { id: id.value, address: address.value },
    { loading: true }
  );
  give.value = false;
  showToast('转赠成功');
  address.value = ''; 
  page.value = 1;
  list.value = [];
  await onLoad();
}
onMounted(() => {
  console.log(route.query.type);
  if (route.query.type === "2") {
    active.value = 2;
  }
});
</script>
  
<style lang="scss" scoped>
.page {
  color: #ffe7ce;
  width: 100%;
  max-width: 800px;
  overflow: auto;
  height: 100vh;
  background: #34aa75;
  .page-box {
    padding: 30px 0;
    .header {
      color: #b09d89;
      font-size: 28px;
      background: #ffe7ce;
      border-radius: 20px;
      border: 1px solid #775e15;
      margin: 0 30px;
      div {
        padding: 30px 0;
        flex: 1;
        text-align: center;
      }
    }
    .active {
      color: #6b2b09;
    }
    .list-box{
      height: calc(100vh - 220px);
      padding-bottom: 50px;
      overflow: auto;
      margin-top: 50px;
    }
    .box {
      margin: 0px 30px 40px;
      background: #ffe7ce;
      border: 2px solid #7c7b6e;
      border-radius: 20px;
      position: relative;
      .bg {
        width: 100%;
        height: 100px;
        position: absolute;
        background: #f5e2ac;
        z-index: 1;
        border-radius: 20px 20px 0 0;
      }
      .box-content {
        position: relative;
        z-index: 2;
        padding: 30px;
        .left {
          width: 172px;
          height: 243px;
          border-radius: 15px;
        }
        .right {
          width: 460px;
          padding-left: 20px;
          .name {
            padding-top: 15px;
            padding-bottom: 30px;
            font-size: 32px;
            color: #161612;
            font-weight: 550;
            .day {
              color: #ee8447;
              font-size: 28px;
            }
          }
          .data {
            margin-top: 10px;
            font-size: 28px;
            color: #91461e;
          }
          .btn {
            font-size: 28px;
            color: #fff;
            margin-top: 20px;

            div {
              width: 100%;
              text-align: center;
              height: 60px;
              color: #ffffff;
            }

            .cancel {
              background: url("@/assets/images/dialog/cancel.png") no-repeat;
              background-size: 100% 100%;
              width: 160px;
              height: 60px;
            }
            .confirm {
              background: url("@/assets/images/dialog/confirm.png") no-repeat;
              background-size: 100% 100%;
              width: 160px;
              height: 60px;
              margin-left: 30px;
            }
          }
        }
      }
    }
  }
  .empty {
    margin-top: 100px;
    font-size: 32px;
  }
  .dialog {
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
    .content {
      padding: 80px 0 30px;
      font-size: 36px;
    }
    .content2 {
      padding: 60px 0 30px;
      font-size: 36px;
      margin: 0 40px;
    }
  }
}
</style>