<template>
  <div>
    <my-dialog v-model:show='show' :showClose='true'>
      <div class='dialogNotice'>
        <div class='title'>{{ infodata.noticeType == 1 ? '通知' : '公告' }}</div>
        <div class='adrTitle' v-html='infodata.noticeContent'></div>
      </div>
    </my-dialog>
  </div>
</template>

<script setup>
import {defineProps, ref} from "vue";

const props = defineProps({
  infodata: {
    type: Object,
    default: {},
  },
})

const show = ref(false);

function showFun(str) {
  show.value = true;
}

defineExpose({
  show: showFun,
  close: function () {
    show.value = false;
  },
});
</script>

<style scoped lang='scss'>

.dialogNotice {
  color: #bb7d58;
  padding-inline: 30px;

  .title {
    font-size: 42px;
    font-weight: 500;
    text-align: center;
    padding: 40px 0 30px;
    color: #bb7d58;
  }

  .adrTitle {
    font-size: 34px;
    font-weight: normal;
    color: #bb7d58;
    padding-inline: 20px;
    padding-bottom: 100px;
  }

}


</style>
