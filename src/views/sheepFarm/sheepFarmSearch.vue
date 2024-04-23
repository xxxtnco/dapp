<template>
  <div class='page'>
    <div class='title width-full'>
      <div class='input-box'>
        <div class='input-boxa'>
          <van-search v-model="sgeepdata.name" placeholder="输入内容~" />
        </div>
        <div class='seach' @click='submit'>
        </div>
      </div>
    </div>
    <div class='content'>
      <div class='bottomdata'>
        <div v-if='!!homedata?.page?.records.length'>
          <div class='item' v-for='(i,j) in homedata?.page?.records' :key='j'>
            <div class='title'>
              <div class='left'>
                <img class='img' :src='i.avatar'>
                <div class='tetx'>
                  {{ i.name }}
                </div>
                <div class='b flex-center'>
                  {{ i.gardenName }}
                </div>
              </div>
              <div class='right'>
                加速 {{ i.speedUpRate * 100|| 0 }}%
              </div>
            </div>
            <div class='content'>
              <div class='left'>
                <div>
                  羊群数量：{{ i.sheepNum || 0 }}只
                </div>
                <div>
                  牧羊分成：{{ i.sheepwalkShareRate * 100 || 0 }}%
                </div>
                <div>
                  总产出：{{ i.outputTotal || 0 }} crystal
                </div>
              </div>
              <div class='right'>
                <div class='top flex-center' @click='todetaili(i.id)'>
                  立即加入
                </div>
                <div class='bottom'>
                  {{ i.addressNum||0 }} 个地址加入
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class='nothing' v-else>
          暂无数据~~
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { closeDialog, showToast } from "vant";
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import req from "@/libs/req";

const homedata = ref({});
const router = useRouter();
//创建牧羊场
const sgeepdata = ref({
  name: "",
  searchNum: 0,
});

function todetaili(id) {
  if (!!isLogin.value) {
    router.push(`/sheepFarmDetail?id=${id}`);
  }
}

async function submit() {
  try {
    const res = await req.post("/api/SheepWalk/list", sgeepdata.value, {
      loading: true,
    });
    homedata.value = res;
  } catch (e) {}
}

onMounted(() => {});
</script>

<style scoped lang='scss'>
.page {
  width: 100%;
  max-width: 800px;
  color: #ffffff;
  background: #34aa75;
  overflow: auto;
  height: 100vh;
  .bottomdata {
    display: flex;
    flex-direction: column;
    margin-block: 30px;
    .nothing {
      font-size: 50px;
      color: white;
      font-weight: 600;
      margin: 500px auto;
    }
    .item {
      width: 692px;
      //height: 304px;
      background: #ffe7ce;
      border: 2px solid #7c7b6e;
      border-radius: 20px;
      margin: auto;
      margin-block: 20px;
      .content {
        font-size: 28px;
        font-weight: 400;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        padding-inline: 40px;
        margin-block: 30px;
        .left {
          font-size: 28px;
          font-weight: 400;
          color: #91461e;
          line-height: 43px;
        }

        .right {
          text-align: center;

          .top {
            width: 228px;
            height: 77px;
            background: url("@/assets/images/sheepfarm/sf-mixbox.png") no-repeat;
            background-size: 100% 100%;
            font-size: 36px;
            font-weight: 500;
            color: #ffffff;
          }

          .bottom {
            font-size: 26px;
            font-weight: 400;
            color: #ee884a;
            padding-block: 10px;
          }
        }
      }

      .title {
        height: 103px;
        background: #f5e2ac;
        border-radius: 20px 20px 0px 0px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding-inline: 45px;
        .left {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          .img {
            width: 86px;
            height: 86px;
            background: #6b2b09;
            border-radius: 50%;
            margin-inline: 10px;
          }
          .tetx {
            font-size: 32px;
            font-weight: 500;
            color: #161612;
          }

          .b {
            height: 40px;
            background: #e2b079;
            border: 1px solid #91461e;
            border-radius: 16px;
            margin-left: 10px;
            font-size: 22px;
            font-weight: 400;
            color: #fdfef5;
            padding: 10px;
          }
        }

        .right {
          font-size: 28px;
          font-weight: 500;
          color: #ee8447;
          line-height: 43px;
        }
      }
    }
  }
}

.title {
  padding-top: 50px;
  .input-box {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding-inline: 12px;
    .input-boxa {
      width: 540px;
      height: 65px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      background: #ffe7ce;
      //border: 1px solid #775E15;
      border-radius: 20px;
      margin-inline: 20px;
      //.img {
      //  width: 30px;
      //  height: 30px;
      //  margin-inline: 25px;
      //}

      .text {
        font-size: 24px;
        font-weight: 400;
        color: #6b2b09;
      }
    }

    :deep(.van-search) {
      @extend .input-boxa;
      .van-search__content {
        background: #ffe7ce;
        padding: 0px !important;
        height: 65px;
        .van-field__control {
          color: #6b2b09 !important;
        }
      }
    }

    .seach {
      width: 130px;
      height: 65px;
      background: url("@/assets/images/sheepfarm/openseach.png") no-repeat;
      background-size: 100% 100%;
      margin-inlines: 20px;
    }
  }
}
</style>