<template>
  <div class="page">
    <div class="page-box">
      <van-pull-refresh v-if="list.length !== 0" v-model="loadings" @refresh="onRefresh" loading-text="加载中">
        <van-list class="list-box" v-model:loading="loading" :finished="finished" :finished-text="text" @load="onLoad">
          <div class="box" v-for="item in list" :key="item.id">
            <div class="top">{{item.createTime}}</div>
            <div class="flex-sb">
              <div class="left">
                <div>投入Crystal：{{item.input}}</div>
                <div v-if="item.state === 1">瓜分：{{item.output}} Crystal</div>
                <div v-if="item.state === 0">当前状态：等待瓜分</div>
                <div v-if="item.state === 1">当前状态：已瓜分</div>
                <div v-if="item.state === 2">当前状态：已撤出</div>
              </div>
              <div class="right text-center">
                <div v-if="item.state === 0" class="btn center" @click="show = true;id=item.id;">撤出投入</div>
                <div v-if="item.state === 1">已瓜分</div>
                <div v-if="item.state === 2">已撤出</div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      <div class="empty">
        <van-empty v-if="list.length === 0" description="暂无数据" />
      </div>
    </div>
    <my-dialog v-model:show="show" :isShowBtn="true" @confirm="submit">
      <div class="dialog">
        <div class="content text-center">
          确定撤出将无法瓜分资源！
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import myDialog from "@/components/MyDialog.vue";
import req from "@/libs/req";
import { showToast } from "vant";
const show = ref(false);
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
    "/api/wallet/input/record",
    {
      pageNum: page.value,
      pageSize: 20,
    },
    { loading: true }
  );
  list.value = [...list.value, ...data.rows];
  total.value = data.total;
}
const id = ref("");
async function submit() {
  await req.post(
    `/api/wallet/back/record?id=${id.value}`,
    {},
    { loading: true }
  );
  show.value = false;
  page.value = 1;
  list.value = [];
  await onLoad();
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
    .list-box {
      height: 100vh;
      padding-bottom: 50px;
      overflow: auto;
    }
    .box {
      margin: 40px 30px 0;
      background: #ffe7ce;
      border: 2px solid #7c7b6e;
      border-radius: 20px;
      padding-bottom: 40px;
      .top {
        background: #f5e2ac;
        border-radius: 20px 20px 0px 0px;
        font-size: 32px;
        color: #161612;
        padding: 20px 30px;
        font-weight: 550;
      }
      .left {
        color: #91461e;
        font-size: 28px;
        padding-left: 30px;
        div:first-child {
          padding-top: 30px;
        }
        div {
          padding-top: 10px;
        }
      }
      .right {
        color: #774d29;
        font-size: 30px;
        width: 228px;
        height: 77px;
        margin-right: 30px;
        .btn {
          width: 228px;
          height: 77px;
          background: url("@/assets/images/dialog/confirm.png") no-repeat;
          background-size: 100% 100%;
          color: #ffffff;
          font-size: 36px;
        }
      }
    }
    .empty{
      padding-top: 200px;
      :deep(.van-empty__description){
          font-size: 30px;
          color: #f2f2f2;
        }
    }
  }
  .dialog {
    .content {
      padding: 80px 0 30px;
      font-size: 36px;
    }
  }
}
</style>