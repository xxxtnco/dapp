<template>
  <div>
    <div class="titleNav flex-sb">
      <img src="@/assets/images/home/logo.png" alt="logo" class="logo">
      <div class="flex">
        <div class="adrBox flex-center" v-if="info.garden !== 0 && info.garden !== null" @click="show = true">V{{info.garden}}</div>
        <div class="adrBox2 flex-center" @click="link">{{ textSubstr(walletName, 4) || $t('connect') }}</div>
      </div>
    </div>

    <van-dialog class="grade-dialog" v-model:show="show" :show-confirm-button="false">
      <div class="grade-content">
        <div class="close" @click="show = false"></div>
        <div class="title flex">
          <div class="left">等级</div>
          <div class="center">升级条件</div>
          <div class="right">奖励</div>
        </div>
        <div class="line flex">
          <div class="left">V1</div>
          <div class="center">推荐满15只羊 <br>或15个有效账户</div>
          <div class="right">15%</div>
        </div>
        <div class="line flex">
          <div class="left">V2</div>
          <div class="center">推荐满50只羊 <br>或50个有效账户</div>
          <div class="right">25%</div>
        </div>
      </div>
    </van-dialog>

    <bind-level ref='sharePopup' @isbindLevel='getInfo'></bind-level>

    <notice ref='noticePopup' :infodata='makrdata'></notice>
  </div>
</template>

<script setup>
import bindLevel from "@/components/SharePopup.vue";
import notice from "@/components/NoticePopup.vue";
import myDialog from "@/components/MyDialog.vue";
import { computed, ref, onMounted, toRefs, watch } from "vue";
import req from "@/libs/req";
import { textSubstr, copyText } from "@/libs/utils";
import { useWalletStore } from "@/stores";
import { showToast } from "vant";
const show = ref(false);
const emit = defineEmits(["link"]);
const info = ref({ garden: 0 });
const noticePopup = ref(null);
const sharePopup = ref(null);
const walletStore = useWalletStore();
const walletName = computed(() =>
  walletStore.isConnection ? walletStore.walletInfo.name : ""
);
const isLogin = computed(() => walletStore.isConnection);
const makrdata = ref({});

watch(isLogin, (n) => {
  if (n) {
    req.post("/api/notice/popup").then((e) => {
      if (!!e) {
        noticePopup.value.show();
        makrdata.value = e;
      }
    });
  }
});

async function getInfo() {
  walletStore.getBalance();
}

async function link() {
  try {
    if (!walletName.value) {
      await walletStore.linkWallet();
      info.value = walletStore.walletInfo.baseInfo;
      if (info.value.isHaveTop === 0) {
        sharePopup.value.show();
      } else {
        sharePopup.value.close();
      }
    } else {
      copyText(walletName.value);
      showToast("复制成功");
    }
  } catch (e) {}
}

onMounted(async () => {
  if (isLogin.value) {
    info.value = walletStore.walletInfo.baseInfo;
  }
});
</script>

<style  lang="scss" scoped>
.titleNav {
  padding: 20px 20px;
  color: #000;
  font-size: 26px;

  .logo {
    width: 142px;
    height: 62px;
  }

  .adrBox {
    min-height: 54px;
    padding: 0 16px;
    border-radius: 30px;
    font-size: 24px;
    background: #738b95;
    color: #fff;
  }

  .adrBox2 {
    @extend .adrBox;
    margin-left: 10px;
    min-width: 140px;
  }

  .lang-icon {
    width: 45px;
    height: 45px;
  }
}

.grade-dialog {
  position: relative;
  .grade-content {
    margin: 140px 60px 20px 40px;
    border-radius: 20px;
    background: #f6d4a7;
    color: #bb7d58;
    text-align: center;
    position: relative;
    .close {
      width: 64px;
      height: 64px;
      position: absolute;
      right: -60px;
      top: -100px;
      opacity: 0;
    }
    .title {
      font-size: 28px;
      line-height: 100px;
    }
    .line {
      font-size: 24px;
      border-top: 1px solid #edc692;
    }
    .left {
      line-height: 120px;
      flex: 0.25;
    }
    .center {
      border-left: 1px solid #edc692;
      border-right: 1px solid #edc692;
      flex: 0.5;
    }
    .right {
      line-height: 120px;
      flex: 0.25;
    }
  }
}
:deep(.van-dialog.grade-dialog) {
  width: 635px;
  height: 576px;
  background: url("@/assets/images/dialog/bg.png") no-repeat;
  background-size: 100% 100%;
}
</style>