<template>
  <div>
    <van-dialog class="my-dialog" v-model:show="show" :show-confirm-button="false" :close-on-click-overlay="false">
      <img class="close" v-if="showClose" @click="close" src="@/assets/images/dialog/close.png" alt="">
      <div class="content">
        <slot></slot>
      </div>
      <div>
        <div class="btn flex-sb" v-if="isShowBtn && !confirmBtn">
          <div class="center cancel" @click="close">取消</div>
          <div class="center confirm" @click="confirm">确认</div>
        </div>
        <div class="confirmBtn center" v-if="confirmBtn" @click="confirm">{{ confirmBtn }}</div>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  toRefs,
  defineProps,
  defineEmits,
} from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: false,
  },
  isShowBtn: {
    type: Boolean,
    default: false,
  },
  confirmBtn: {
    type: String,
    default: "",
  },
});
const { show } = toRefs(props);

const emit = defineEmits(["update:show", "confirm"]);
const close = () => {
  emit("update:show", false);
};
const confirm = () => {
  emit("confirm");
};
onMounted(() => {});
</script>

<style lang="scss" scoped>
.my-dialog {
  position: relative;
  .title {
    color: #ffffff;
    text-shadow: 0 3px #bb7d58, 3px 0 #bb7d58, -2px 0 #bb7d58, 0 -3px #bb7d58;
    text-align: center;
    margin-top: 30px;
    font-weight: bold;
    font-size: 36px;
    font-weight: 900;
    font-size: 48px;
  }

  .content {
    font-size: 28px;
    color: #bb7d58;
  }

  .btn {
    margin: 0px 60px 40px;
    font-size: 28px;
    padding: 20px 40px;
    color: #fff;

    div {
      width: 100%;
      text-align: center;
      height: 60px;
      color: #ffffff;
      font-size: 36px;
    }

    .cancel {
      position: relative;
      left: -40px;
      background: url("@/assets/images/dialog/cancel.png") no-repeat;
      background-size: 100% 100%;
      width: 215px;
      height: 80px;
    }
    .confirm {
      position: relative;
      right: -40px;
      background: url("@/assets/images/dialog/confirm.png") no-repeat;
      background-size: 100% 100%;
      width: 215px;
      height: 80px;
    }
  }

  .confirmBtn {
    width: 520px;
    height: 87px;
    background: url("@/assets/images/home/btn.png") no-repeat;
    background-size: 100% 100%;
    margin: 30px auto 80px;
    font-size: 34px;
    color: #fff;
  }

  .close {
    width: 64px;
    height: 64px;
    position: absolute;
    right: -10px;
    top: -10px;
  }
}

:deep(.van-dialog) {
  background: url("@/assets/images/dialog/bg3.png") no-repeat;
  background-size: 100% 100%;
  overflow: visible;
}
:deep(.van-dialog__content) {
  position: relative;
}

:deep(.van-button) {
  background: #321415;
  color: #fff;
}
</style>