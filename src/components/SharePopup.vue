<template>
  <van-popup v-model:show="show" teleport="#app" style="background: transparent; max-width: none;" :close-on-click-overlay="false">
    <div class="popup">
      <div class="title">确定邀请地址</div>
      <div class="adrTitle">邀请人钱包地址：</div>
      <div class="adrBox">
        <textarea class="adr" type="text" v-model="adr" placeholder="请输入邀请人地址"></textarea>
      </div>
      <div class="submit flex-center" @click="submit">确认</div>
    </div>
  </van-popup>
</template>
<script setup>
import { ref } from "vue";
import { useWalletStore } from "@/stores";
import { showToast } from "vant";
import req from "@/libs/req";
import { getSearchParams } from "@/libs/utils";
const show = ref(false);
const adr = ref("");
const walletStore = useWalletStore();
const emits = defineEmits(["isbindLevel"]);
async function submit() {
  try {
    if (!adr.value) {
      return showToast("未填写邀请人地址");
    }
    // const tmp = walletStore.checkAddress(adr.value);
    // if (!tmp) {
    //   return showToast('请检查地址是否输入正确');
    // }
    await req.post(
      "/api/user/bind",
      {
        walletAddress: walletStore.walletInfo.name,
        levelWalletAddress: adr.value,
      },
      { loading: true }
    );
    show.value = false
    emits("isbindLevel");
  } catch (e) {
    console.log(e);
  }
}

function showFun(str) {
  adr.value = str || getSearchParams("s")?.toLowerCase() || "";
  show.value = true;
}

defineExpose({
  show: showFun,
  close: function () {
    show.value = false;
  },
});
</script>

<style scoped lang="scss">
.popup {
  min-width: 690px;
  min-height: 560px;
  margin: 0 30px;
  position: relative;
  background: url("@/assets/images/dialog/bg3.png") no-repeat;
  background-size: 100% 100%;
  border-radius: 20px;
  padding: 0 36px 24px;

  .title {
    font-size: 42px;
    font-weight: 500;
    text-align: center;
    padding: 40px 0 60px;
    color: #bb7d58;
  }

  .closeIcon {
    position: absolute;
    top: 28px;
    right: 40px;
    width: 13px;
    height: 14px;
    overflow: hidden;
    font-size: 15px;
  }

  .adrTitle {
    font-size: 28px;
    font-weight: normal;
    margin: 0 0 24px;
    color: #bb7d58;
  }

  .adrBox {
    margin-bottom: 26px;

    .adr {
      min-width: 628px;
      min-height: 66px;
      background: #f6d4a7;
      border-radius: 20px;
      font-size: 28px;
      border: 0;
      font-weight: 400;
      padding: 12px;
      color: #bb7d58;
    }
  }

  .submit {
    width: 584px;
    height: 76px;
    background: url("@/assets/images/home/btn.png") no-repeat;
    background-size: 100% 100%;
    color: #ffffff;
    font-size: 30px;
    letter-spacing: 2px;
    margin: 48px auto 0;

    &:active {
      filter: brightness(0.8);
    }
  }
}
</style>
