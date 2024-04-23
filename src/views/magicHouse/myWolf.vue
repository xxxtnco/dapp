<template>
  <div class="page">
    <div class="page-box">

      <van-pull-refresh v-model="loadings" @refresh="onRefresh" loading-text="加载中">
        <van-list class="list-box" v-model:loading="loading" :finished="finished" :finished-text="text" @load="onLoad">
          <div class="box" v-for="item in list" :key="item.id">
            <div class="bg">
            </div>
            <div class="box-content flex">
              <img :src="item.image" class="left" alt="">
              <div class="right">
                <div class="name flex-sb">
                  <div>{{item.name}}({{item.serial}})</div>
                </div>
                <div class="data" v-if="item.createTime">领养时间：{{item.createTime}}</div>
                <div class="data" v-if="item.joinTime">加入时间：{{item.joinTime}}</div>
                <div class="data">产出：{{item.output}} Crystal</div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
      
  <script setup>
import { onMounted, ref, computed, watch } from "vue";
import myDialog from "@/components/MyDialog.vue";
import req from "@/libs/req";
import { showToast } from "vant";
const list = ref([]);
const total = ref(0);
const page = ref(1);
const text = ref("");
const loading = ref(false);
const loadings = ref(false);
const finished = ref(false);

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
  page.value = 1;
  list.value = [];
  await onLoad();
}
async function getList() {
  const data = await req.post(
    "/api/wallet/my/wolf",
    {
      pageNum: page.value,
      pageSize: 20,
    },
    { loading: true }
  );
  list.value = [...list.value, ...data.rows];
  total.value = data.total;
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
    text.value = "暂无数据";
  } else {
    text.value = "";
  }
};
</script>
      
  <style lang="scss" scoped>
.page {
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  height: 100vh;
  background: #34aa75;
  .page-box {
    margin-top: 40px;
    padding: 30px 0;
    background: #ffe7ce;
    border-radius: 20px 20px 0 0;
    .list-box {
      height: calc(100vh - 100px);
      padding-bottom: 50px;
      overflow: auto;
    }
    .box {
      margin: 40px 30px 0;
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
          width: 168px;
          height: 243px;
          background: #6b2b09;
          border-radius: 15px;
        }
        .right {
          width: 460px;
          padding-left: 20px;
          .name {
            padding-top: 15px;
            padding-bottom: 40px;
            font-size: 32px;
            color: #161612;
            font-weight: 550;
            .day {
              color: #ee8447;
              font-size: 28px;
            }
          }
          .data {
            font-size: 28px;
            color: #91461e;
          }
        }
      }
    }
  }
}
</style>