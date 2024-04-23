<template>
  <div class="menu-box">
    <div class="menu flex-sb">
      <img v-for="(item,i) in menuList" @click="toLink(item.path)" :key="i" class="flex-sb" :src="item.src" :alt="item.name" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRefs, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { useWalletStore } from "@/stores";
import home from "@/assets/images/menu/home.png";
import magicHouse from "@/assets/images/menu/magicHouse.png";
import purse from "@/assets/images/menu/purse.png";
import sheepFarm from "@/assets/images/menu/sheepFarm.png";
import farm from "@/assets/images/menu/farm.png";

const router = useRouter();
const walletStore = useWalletStore();
const isLogin = computed(() => walletStore.isConnection);
const menuList = ref([
  {
    name: "首页",
    src: home,
    path: "/",
  },
  {
    name: "牧羊场",
    src: sheepFarm,
    path: "/sheepFarm",
  },
  {
    name: "农场",
    src: farm,
    path: "/farm",
  },
  {
    name: "魔法屋",
    src: magicHouse,
    path: "/magicHouse",
  },
  {
    name: "钱包",
    src: purse,
    path: "/purse",
  },
]);

function toLink(i) {
  // if (!isLogin.value) return showToast(i18n.t("qing-xian-lian-jie-qian-bao"));
    router.replace({
      path: i,
    });
}

function toPage(url) {
  window.location.href = url;
}
function showMenu() {
  show.value = true;
}

onMounted(() => {
  menuList.value.forEach((res, i) => {
    res["active"] = false;
    if (i !== 0) {
      if (window.location.hash.indexOf(res.path) !== -1) {
        res["active"] = true;
      } else {
        res["active"] = false;
      }
    }
  });
  if (window.location.hash === "#/") {
    menuList.value[0]["active"] = true;
  }
});
defineExpose({
  showMenu,
});
</script>

<style lang="scss" scoped >
.menu-box{
  // padding-top: 20px;
  height: 120px;
  background: #34ab75;
}
.menu {
  height: 200px;
  width: 100%;
  border-radius: 40px 40px 0px 0px;
 
  padding: 0 30px;
  background: url("@/assets/images/menu/bg.png") no-repeat;
  background-size: 100% 100%;
  position: fixed;
  bottom: 0;
  z-index: 100;
 
  img{
    width: 135px;
    height: 135px;
  }
}
</style>
