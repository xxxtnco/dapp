<template>
  <div class='page'>
    <div class='page-box'>

      <div class='hader list flex-sb'>
        <div class="time">
          时间
        </div>
        <div class="num">
          <van-popover v-model:show="showPopover" :show-arrow='false'>
            <div class="tagList">
              <div class="item" v-for="(item,i) in actions" @click="changeType(item.code)" :key="i">{{item.msg}}</div>
            </div>
            <template #reference>
              <div class="leixing">
                类型 <img src='@/assets/images/purse/sanjiaoxing.png' class='img'>
              </div>
            </template>
          </van-popover>
        </div>
        <div class='money'>
          金额
        </div>
      </div>

      <div class='division'>
      </div>

      <van-pull-refresh v-model="loadings" @refresh="onRefresh" loading-text="加载中">
        <van-list class="list-box" v-model:loading="loading" :finished="finished" :finished-text="text" @load="onLoad">
          <div v-for="item in list" :key="item.createDate" class="list flex">
            <div class="time">{{ item.createDate }}</div>
            <div class="num">
              {{item.typeName}}
            </div>
            <div class="money">
              {{item.operationBalance}}{{type}}
            </div>
          </div>
        </van-list>

      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { showToast } from "vant";
import { onMounted, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import req from "@/libs/req";

const showPopover = ref(false);

const router = useRouter();
const route = useRoute();

const action = ref(false);
const id = ref("");

const actions = ref([]);

const list = ref([]);
const total = ref(0);
const page = ref(1);
const text = ref("");
const loading = ref(false);
const finished = ref(false);

const loadings = ref(false);

const type = ref("AMAX");
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
  console.log(e, "id");
  id.value = e;
  showPopover.value = false;
  page.value = 1;
  list.value = [];
  await onLoad();
}
async function getList() {
  let accountType = "";
  if (type.value === "AMAX") accountType = 0;
  if (type.value === "MUSDT") accountType = 1;
  if (type.value === "水晶") accountType = 2;
  const data = await req.post(
    "/api/wallet/record/query",
    {
      pageNum: page.value,
      pageSize: 20,
      type: id.value,
      accountType: accountType,
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
async function getTypeList() {
  actions.value = await req.get("api/wallet/record/type/list");
  actions.value.unshift({ code: "", msg: "全部" });
}
onMounted(() => {
  getTypeList();
  if (route.query.type) {
    type.value = route.query.type;
  }
});
</script>

<style scoped lang='scss'>
.page {
  width: 100%;
  max-width: 800px;
  padding-top: 70px;
  display: flex;
  flex-direction: column;
  background: #34aa75;
  overflow: hidden;
  height: 100vh;
  .page-box {
    background: #ffe7ce;
    padding-top: 50px;
    border-radius: 20px 20px 0px 0px;
  }

  .hader {
    font-size: 28px;
    font-weight: 600;
    color: #6b2b09;
    padding: 0 40px;

    .leixing {

      .img {
        width: 25px;
        height: 20px;
        margin: 0 10px;
      }
    }
  }

  .division {
    width: 100%;
    height: 5px;
    background: url("@/assets/images/sheepfarm/division.png") no-repeat;
    background-size: 100% 100%;
    margin-inline: 40px;
  }
  .list-box {
    height: calc(100vh - 180px);
    padding-bottom: 50px;
    overflow: auto;
  }
  .list {
    font-size: 30px;
    font-weight: 400;
    color: #91461e;
    margin: 30px 60px;

    .time {
      flex: 0.3;
    }
    .num {
      text-align: center;
      flex: 0.3;
    }
    .money {
      text-align: right;
      flex: 0.4;
    }
  }
}

.tagList {
  padding: 20px 50px;
  background: #f6d4a7;
  border: 1px solid #6b2b09;
  border-radius: 20px;
  .item {
    font-size: 24px;
    color: #6b2b09;
    padding-bottom: 10px;
  }
}
</style>