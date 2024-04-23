<template>
  <van-pull-refresh v-model="loadings" @refresh="onRefresh" loading-text="加载中">
    <div class="page">
      <div class="name-box flex-align-center">
        <img class="name" src="@/assets/images/home/gameTitle.png" alt="">
      </div>
      <div class="mu-box" v-if="!isShowTime">
        <div class="top">{{info.gameId|| 0}}期 /满人开局</div>
        <div class="num flex-align-center">
          <div class="img"></div>{{info.peopleNum || 0}}/{{info.startNum || 0}}
        </div>
      </div>
      <div class="time-box" v-if="isShowTime">
        <van-count-down class="" @finish="finish" :time="time">
          <template #default="timeData">
            <span class="num">{{ timeData.seconds }}</span>秒后狼出现
          </template>
        </van-count-down>
      </div>
      <div class="content flex-sb">
        <div class="left">
          <!-- 房间1 -->
          <div @click="clickBox(1,$event)" style="position: relative;">
            <div class="otherPlayers" v-if="!!info.roomVOS[0].users.length">
              <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[0].users" :key="i">
                <div class="top">{{item.name}}</div>
              </div>
            </div>
            <div class="quantity1 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[0].quantity,1)}}</div>
            <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 1">
            </div>
            <img class="home1r" :src="openRoom1 ? roomList[0]:roomList2[0]" alt="">
            <img class="home1" :style="{opacity:active === 1 ? '1': '0'}" :src="list[0]" alt="">
          </div>
          <!-- 房间2 -->
          <div @click="clickBox(2,$event)" style="position: relative;">
            <div class="otherPlayers" v-if="!!info.roomVOS[1].users.length">
              <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[1].users" :key="i">
                <div class="top">{{item.name}}</div>
              </div>
            </div>
            <div class="quantity2 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[1].quantity,1)}}</div>
            <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 2">
            </div>
            <img class="home2r" :src="openRoom2 ? roomList[1]:roomList2[1]" alt="">
            <img class="home2" :style="{opacity:active === 2 ? '1': '0'}" :src="list[1]" alt="">
          </div>

          <div class="flex">
            <!-- 房间3 -->
            <div @click="clickBox(3,$event)" style="position: relative;">
              <div class="otherPlayers" v-if="!!info.roomVOS[2].users.length">
                <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[2].users" :key="i">
                  <div class="top">{{item.name}}</div>
                </div>
              </div>
              <div class="quantity3 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[2].quantity,1)}}</div>
              <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 3">
              </div>
              <img class="home3r" :src="openRoom3 ? roomList[2]:roomList2[2]" alt="">
              <img class="home3" :style="{opacity:active === 3 ? '1': '0'}" :src="list[2]" alt="">
            </div>
            <!-- 房间4 -->
            <div @click="clickBox(4,$event)" class="home4-box">
              <div class="otherPlayers" v-if="!!info.roomVOS[3].users.length">
                <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[3].users" :key="i">
                  <div class="top">{{item.name}}</div>
                </div>
              </div>
              <div class="quantity4 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[3].quantity,1)}}</div>
              <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 4">
              </div>
              <img class="home4r" :src="openRoom4 ? roomList[3]:roomList2[3]" alt="">
              <img class="home4" :style="{opacity:active === 4 ? '1': '0'}" :src="list[3]" alt="">
            </div>
          </div>
          <!-- 房间5 -->
          <div @click="clickBox(5,$event)" style="position: relative; margin-top: 8.9vh;">
            <div class="otherPlayers" v-if="!!info.roomVOS[4].users.length">
              <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[4].users" :key="i">
                <div class="top">{{item.name}}</div>
              </div>
            </div>
            <div class="quantity5 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[4].quantity,1)}}</div>
            <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 5">
            </div>
            <img class="home5r" :src="openRoom5 ? roomList[4]:roomList2[4]" alt="">
            <img class="home5" :style="{opacity:active === 5 ? '1': '0'}" :src="list[4]" alt="">
          </div>

        </div>
        <div class="right">
          <!-- 房间6 -->
          <div @click="clickBox(6,$event)" style="position: relative;">
            <div class="otherPlayers" v-if="!!info.roomVOS[5].users.length">
              <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[5].users" :key="i">
                <div class="top">{{item.name}}</div>
              </div>
            </div>
            <div class="quantity6 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[5].quantity,1)}}</div>
            <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 6">
            </div>
            <img class="home6r" :src="openRoom6 ? roomList[5]:roomList2[5]" alt="">
            <img class="home6" :style="{opacity:active === 6 ? '1': '0'}" :src="list[5]" alt="">
          </div>
          <!-- 房间7 -->
          <div @click="clickBox(7,$event)" style="position: relative;">
            <div class="otherPlayers" v-if="!!info.roomVOS[6].users.length">
              <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[6].users" :key="i">
                <div class="top">{{item.name}}</div>
              </div>
            </div>
            <div class="quantity7 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[6].quantity,1)}}</div>
            <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 7">
            </div>
            <img class="home7r" :src="openRoom7 ? roomList[6]:roomList2[6]" alt="">
            <img class="home7" :style="{opacity:active === 7 ? '1': '0'}" :src="list[6]" alt="">
          </div>
          <!-- 房间8 -->
          <div @click="clickBox(8,$event)" style="position: relative;">
            <div class="otherPlayers" v-if="!!info.roomVOS[7].users.length">
              <div class="playList" :style="item.style" v-for="(item,i) in info.roomVOS[7].users" :key="i">
                <div class="top">{{item.name}}</div>
              </div>
            </div>
            <div class="quantity8 flex-center"><img class="icon" src="@/assets/images/icon/amax.png" alt="">{{sliceDecimal(info.roomVOS[7].quantity,1)}}</div>
            <div class="myPosition" :style="{top:clientY+'px',left:clientX+'px'}" v-if="animateBoxStop && active === 8">
            </div>
            <div class="home8">
              <div class="stop" @click.stop=""></div>
              <img class="home8r" :src="openRoom8 ? roomList[7]:roomList2[7]" alt="">
              <img class="img" :style="{opacity:active === 8 ? '1': '0'}" :src="list[7]" alt="">
            </div>
          </div>
        </div>
      </div>

      <!-- 投入按钮 -->
      <div class="btns flex-align-center">
        <div class="top flex">
          <img src="@/assets/images/home/sheep2.png" alt="">
          <div class="right flex-center">上期狼去了[{{info.lastKillRoom || '---'}}]</div>
        </div>
        <div class="left center">
          <van-popover v-model:show="showPopover" :show-arrow='false' placement="top">
            <div class="tagList">
              <div class="item" v-for="(item,i) in actions" @click="changeType(item.text)" :key="i">{{item.text}}</div>
            </div>
            <template #reference>
              <div class="leixing">
                {{money}}
              </div>
            </template>
          </van-popover>
          <van-icon class="icon" name="arrow-down" />
        </div>
        <div class="btn center" @click="joinGame">投入AMAX</div>
      </div>
      <!-- 狼杀羊动画 -->
      <div v-for="i in [1,2,3,4,5,6,7,8]" :key="i">
        <div v-if="wolfActive===i" :class="`wolf${i}`">
          <div class="left" v-if="isWolfRight"></div>
          <div class="right" v-else></div>
        </div>
      </div>

      <div class="icons">
        <div @click="toLink('/ranking')" class="rank-box"><img class="rank" src="@/assets/images/home/rank.png" alt="">排行榜</div>
        <div @click="toLink('/record')" class="record-box"><img class="rank" src="@/assets/images/home/record.png" alt="">记录</div>
      </div>

      <!-- 初始自己所在位置 -->
      <div v-if="active===0" class="animateBox">
      </div>

      <!-- 模拟其他玩家 -->
      <div class="falsePlayer">
        <div class="img1B">
          <div class="name">fwes</div>
          <img class="img1" :src="sheepList[0]" alt="">
        </div>
        <div class="img2B">
          <div class="name">sdfe</div>
          <img class="img2" :src="sheepList[1]" alt="">
        </div>
        <div class="img3B">
          <div class="name">rwt4</div>
          <img class="img3" :src="sheepList[2]" alt="">
        </div>
        <div class="img4B">
          <div class="name">ewrw</div>
          <img class="img4" :src="sheepList[3]" alt="">
        </div>
        <div class="img5B">
          <div class="name">rtse</div>
          <img class="img5" :src="sheepList[4]" alt="">
        </div>
        <div class="img6B">
          <div class="name">3q3s</div>
          <img class="img6" :src="sheepList[5]" alt="">
        </div>
      </div>

      <!-- 选择房间后自己运动动画 -->
      <div>
        <div v-for="i in [1,2,3,4,5,6,7,8]" :key="i" :class="active === i && !animateBoxStop? `animateBoxActive${active}` : ''">
          <div v-if="isShowFoot" class="left"></div>
          <div v-if="isShowFoot" class="right"></div>
        </div>
      </div>
      <!-- 狼来了大字弹框 -->
      <van-dialog class="dialog" v-model:show="showCountdown" :show-confirm-button="false">
      </van-dialog>

      <!-- 游戏结果弹框 -->
      <van-dialog class="dialog2" v-model:show="showResult" :show-confirm-button="false">
        <div>
          <img class="close" @click="showResult = false;wolfActive = 0" src="@/assets/images/dialog/close.png" alt="">
          <div class="state center">
            游戏结果：
            <span v-if="infoResult.state === 0">未投入</span>
            <span v-if="infoResult.state === 1">躲避杀手失败</span>
            <span v-if="infoResult.state === 2">躲避杀手成功</span>
          </div>
          <div class="nums center">瓜分数量：{{infoResult.outputQuantity}}AMAX</div>
        </div>
      </van-dialog>
      <audio id="myAudio" controls loop autoplay>
        <source src="@/assets/images/game/music.mp3" type="audio/mpeg">
      </audio>
    </div>
  </van-pull-refresh>
</template>
  
<script setup>
import myDialog from "@/components/MyDialog.vue";
import { showToast, showConfirmDialog } from "vant";
import {
  nextTick,
  onMounted,
  ref,
  watch,
  onUnmounted,
  computed,
  reactive,
} from "vue";
import { useRouter } from "vue-router";
import req from "@/libs/req";
import { useWalletStore } from "@/stores";
import { getRandom, sliceDecimal } from "@/libs/utils";
import home1 from "@/assets/images/game/bg/home1.png";
import home2 from "@/assets/images/game/bg/home2.png";
import home3 from "@/assets/images/game/bg/home3.png";
import home4 from "@/assets/images/game/bg/home4.png";
import home5 from "@/assets/images/game/bg/home5.png";
import home6 from "@/assets/images/game/bg/home6.png";
import home7 from "@/assets/images/game/bg/home7.png";
import home8 from "@/assets/images/game/bg/home8.png";
import sheep1 from "@/assets/images/icon/sheep1.png";
import sheep2 from "@/assets/images/icon/sheep2.png";
import sheep3 from "@/assets/images/icon/sheep3.png";
import sheep4 from "@/assets/images/icon/sheep4.png";
import sheep5 from "@/assets/images/icon/sheep5.png";
import sheep6 from "@/assets/images/icon/sheep6.png";
import rooms1 from "@/assets/images/game/have/home1.png";
import rooms2 from "@/assets/images/game/have/home2.png";
import rooms3 from "@/assets/images/game/have/home3.png";
import rooms4 from "@/assets/images/game/have/home4.png";
import rooms5 from "@/assets/images/game/have/home5.png";
import rooms6 from "@/assets/images/game/have/home6.png";
import rooms7 from "@/assets/images/game/have/home7.png";
import rooms8 from "@/assets/images/game/have/home8.png";
import room1 from "@/assets/images/game/home1.png";
import room2 from "@/assets/images/game/home2.png";
import room3 from "@/assets/images/game/home3.png";
import room4 from "@/assets/images/game/home4.png";
import room5 from "@/assets/images/game/home5.png";
import room6 from "@/assets/images/game/home6.png";
import room7 from "@/assets/images/game/home7.png";
import room8 from "@/assets/images/game/home8.png";
const sheepList = ref([sheep1, sheep2, sheep3, sheep4, sheep5, sheep6]); //羊图片
const roomList = ref([room1, room2, room3, room4, room5, room6, room7, room8]); //房间未开门图片
const roomList2 = ref([
  rooms1,
  rooms2,
  rooms3,
  rooms4,
  rooms5,
  rooms6,
  rooms7,
  rooms8,
]); //房间开门图片
const loadings = ref(false);
const onRefresh = async () => {
  if (isLogin.value) await getInfo();
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    getInfo();
  }, 5000);
  setTimeout(() => {
    showToast("刷新成功");
    loadings.value = false;
  }, 1000);
};

const walletStore = useWalletStore();
const isLogin = computed(() => walletStore.isConnection);
const list = ref([home1, home2, home3, home4, home5, home6, home7, home8]); //每个房间的选中图片
const router = useRouter();
const active = ref(0); //选择的房间编号
function toLink(url) {
  if (!isLogin.value) return showToast("请连接钱包");
  router.push(url);
}

const animateBoxStop = ref(false); //羊运动 动画是否开始 停止
const isShowFoot = ref(true); //是否显示羊脚
const openRoom1 = ref(false); //是否显示开门
const openRoom2 = ref(false); //是否显示开门
const openRoom3 = ref(false); //是否显示开门
const openRoom4 = ref(false); //是否显示开门
const openRoom5 = ref(false); //是否显示开门
const openRoom6 = ref(false); //是否显示开门
const openRoom7 = ref(false); //是否显示开门
const openRoom8 = ref(false); //是否显示开门

watch(active, (n, old) => {
  if (old !== 0) {
    // console.log(n, old);
    animateBoxStop.value = true;
    if (isLogin.value) changeRoom();
  } else {
    clearInterval(timer.value);
    timer.value = null;
    if (n === 1 || n == 2 || n == 4 || n == 6 || n == 7) {
      setTimeout(() => {
        isShowFoot.value = false;
        if (n === 1) openRoom1.value = true;
        if (n === 2) openRoom2.value = true;
        if (n === 4) openRoom4.value = true;
        if (n === 6) openRoom6.value = true;
        if (n === 7) openRoom7.value = true;
      }, 4000);
    } else if (n == 8) {
      setTimeout(() => {
        isShowFoot.value = false;
        openRoom8.value = true;
      }, 3000);
    } else if (n === 5) {
      setTimeout(() => {
        isShowFoot.value = false;
      }, 3000);
      setTimeout(() => {
        openRoom5.value = true;
      }, 1000);
    } else if (n === 3) {
      setTimeout(() => {
        isShowFoot.value = false;
        openRoom3.value = true;
      }, 2500);
    }
    setTimeout(() => {
      clearOpenRoom();
    }, 5000);
    // if(isLogin.value) joinGame();
  }
});

function clearOpenRoom() {
  openRoom1.value = false;
  openRoom2.value = false;
  openRoom3.value = false;
  openRoom4.value = false;
  openRoom5.value = false;
  openRoom6.value = false;
  openRoom7.value = false;
  openRoom8.value = false;
}
const wolfActive = ref(0); //狼杀羊房间
const isWolfRight = ref(false); //狼拿刀图片是否显示右边
watch(wolfActive, (n) => {
  if (n === 1 || n === 4 || n === 5) {
    setTimeout(() => {
      isWolfRight.value = true;
    }, 7500);
  } else if (n == 2) {
    setTimeout(() => {
      isWolfRight.value = true;
    }, 6000);
  } else if (n === 3) {
    setTimeout(() => {
      isWolfRight.value = true;
    }, 6500);
  }
});

const clientX = ref(10);
const clientY = ref(10);
async function changeRoom() {
  if (active.value === 0) return;
  await req.post("/api/game/switch/room", {
    gameId: info.value.gameId,
    roomId: active.value,
  });
  clearInterval(timer.value);
  timer.value = null;
  getInfo();
  timer.value = setInterval(() => {
    getInfo();
  }, 5000);
}
function clickBox(e, e2) {
  if (wolfActive.value !== 0) return showToast("正在结算中...");
  active.value = e;
  if (animateBoxStop.value) {
    clientX.value = e2.offsetX - 15 || 10;
    clientY.value = e2.offsetY - 15 || 10;
  }
}

const info = ref({
  roomVOS: [
    { users: [] },
    { users: [] },
    { users: [] },
    { users: [] },
    { users: [] },
    { users: [] },
    { users: [] },
    { users: [] },
  ],
});
const actions = ref([{ text: "0.1", text: "0.5", text: "0.8" }]);
const money = ref(0.1);
const showPopover = ref(false);
function changeType(e) {
  money.value = e;
  showPopover.value = false;
}

const time = ref(0);
const old = ref([]);
async function getInfo() {
  info.value = await req.post("/api/game/index");

  if (info.value.joinRoom !== 0) active.value = info.value.joinRoom; //加入房间号，没有加入就是0

  getStyle();

  if (info.value.peopleNum === info.value.startNum) {
    const res = await req.post(`/api/game/result?gameId=${info.value.gameId}`);

    const timestamp = Math.round(new Date());
    time.value = res.comeDate - timestamp;
    if (time.value <= 0) {
      isShowTime.value = false;
    } else {
      isShowTime.value = true;
    }
  }
}
const showCountdown = ref(false); //狼来了大字
const isShowTime = ref(false); //狼来了倒计时
const showResult = ref(false); //结果弹框
const infoResult = ref(false); //结果信息
async function finish() {
  isShowTime.value = false;
  showCountdown.value = true;
  setTimeout(async () => {
    showCountdown.value = false;
    const res2 = await req.post(
      `/api/game/user/result?gameId=${info.value.gameId}`
    );
    wolfActive.value = res2.killRoom;
    clearInterval(timer.value);
    timer.value = null;

    setTimeout(async () => {
      infoResult.value = res2;
      active.value = 0;
      wolfActive.value = 0;
      animateBoxStop.value = false;
      isWolfRight.value = false;
      clearOpenRoom();
      // isShowFoot.value = true;
      showResult.value = true; //显示游戏结果
      await getInfo();
      timer.value = setInterval(() => {
        getInfo();
      }, 5000);
    }, 10000);
  }, 5000);
}
async function joinGame() {
  if (wolfActive.value !== 0) return showToast("正在结算中...");
  if (!isLogin.value) return showToast("请连接钱包");

  if (Number(money.value) > Number(info.value.balance)) {
    showConfirmDialog({
      message: `当前余额不足，剩余${info.value.balance}AMAX，是否跳转充值页面？`,
    }).then(() => {
      router.push("/purse");
    });
  } else {
    if (active.value === 0) return showToast("请选择一个房间进行游戏");
    await req.post(
      "/api/game/join",
      {
        quantity: money.value,
        gameId: info.value.gameId,
        roomId: active.value,
      },
      { loading: true }
    );
    showToast("投入成功");
    getInfo();
    clearInterval(timer.value);

    timer.value = setInterval(() => {
      getInfo();
    }, 5000);
  }
}
const onSelect = (action) => showToast(action.text);
watch(
  () => isLogin.value,
  (n) => {
    if (n) {
      getInfo();
    }
  }
);
async function getList() {
  const res = await req.get("/api/game/figure");
  if (res.length !== 0) {
    actions.value = [];
    res.forEach((e) => {
      actions.value.push({ text: e });
    });
  }
  money.value = actions.value[0].text;
}
function getStyle() {
  // info.value.roomVOS[0].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // info.value.roomVOS[1].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // info.value.roomVOS[2].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // info.value.roomVOS[3].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // info.value.roomVOS[4].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // info.value.roomVOS[5].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // info.value.roomVOS[6].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // info.value.roomVOS[7].users = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
  // console.log(info.value.roomVOS, "info.value.roomVOS");
  if (info.value.roomVOS.length) {
    for (let i = 0; i < info.value.roomVOS.length; i++) {
      let arr = [];
      let item = info.value.roomVOS[i].users;
      if (item.length) {
        for (let i2 = 0; i2 < item.length; i2++) {
          let res = item[i2];
          let left = "";
          let top = "";
          if (i === 0) {
            top = getRandom(1, 10);
            left = getRandom(0, 32);
          } else if (i === 1) {
            left = getRandom(0, 32);
            top = getRandom(1, left > 21.2 ? 2 : 10);
          } else if (i === 2) {
            top = getRandom(1, 9);
            left = getRandom(0, 21.6);
          } else if (i === 3) {
            top = getRandom(1, 17);
            left = getRandom(0, 15.6);
          } else if (i === 4) {
            top = getRandom(1, 7);
            left = getRandom(0, 26.4);
          } else if (i === 5) {
            left = getRandom(3, 27.6);
            top = getRandom(left > 19.2 ? 9 : 1, 15);
          } else if (i === 6) {
            top = getRandom(1, 17);
            left = getRandom(0, 26.4);
          } else if (i === 7) {
            left = getRandom(0, 33.6);
            top = getRandom(left < 16.8 ? 10 : 1, 15);
          }
          arr.push({
            name: res,
            style: {
              left: left + "vw",
              top: top + "vh",
              background: `url("${
                sheepList.value[getRandom(0, 5)]
              }") no-repeat`,
              backgroundSize: "100% 100%",
            },
          });
        }

        info.value.roomVOS[i].users = arr;
      }
    }
  }
}
const timer = ref(null); //页面数据定时器

function beforeunloadHandler(e) {
  if (e) {
    e = e || window.event;
    if (e) {
      e.returnValue = "关闭提示";
    }
    return "关闭提示";
  }
}
onMounted(() => {
  //添加监听事件
  const myAudioRef = document.getElementById("myAudio");

  window.addEventListener("beforeunload", (e) => beforeunloadHandler(e));

  document.addEventListener("visibilitychange", function (e) {
    let state = document.visibilityState;
    if (state == "hidden") {
      //用户离开了
      myAudioRef.muted = true;
    }
    if (state == "visible") {
      //回来了
      myAudioRef.muted = false;
    }
  });

  if (isLogin.value) {
    getInfo();
    getList();
    timer.value = setInterval(() => {
      getInfo();
    }, 5000);
  }
  // getStyle()
});

onUnmounted(() => {
  if (timer.value !== null) {
    clearInterval(timer.value);
  }
});
</script>


<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  height: 100vh;
  // background: url("@/assets/images/home/gamebg.png") no-repeat;
  background: url("@/assets/images/game/bg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .name-box {
    position: absolute;
    margin-top: 2vh;
    width: 300px;
    height: 67px;
    background: #fcd070;
    border-radius: 0 40px 40px 0;
    .name {
      width: 280px;
      height: 47px;
      margin-left: 5px;
    }
  }
  .mu-box {
    width: 42vw;
    height: 10vh;
    background: url("@/assets/images/game/mubg.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 10px;
    top: 20px;
    .top {
      position: absolute;
      right: 80px;
      top: 2.5vh;
      font-size: 24px;
      color: #91461e;
      font-weight: bold;
    }
    .num {
      .img {
        width: 50px;
        height: 40px;
        background: url("@/assets/images/home/sheep2.png") no-repeat;
        background-size: 100% 100%;
        margin-right: 10px;
      }
      width: 160px;
      height: 50px;
      position: absolute;
      right: 80px;
      top: 4.8vh;
      font-size: 30px;
      color: #91461e;
    }
  }
  .btns {
    position: relative;
    top: 10vh;
    left: 205px;
    // width: 325px;
    height: 7vh;
    .top {
      position: absolute;
      top: -4.8vh;
      left: -10px;
      z-index: 10;
      img {
        width: 93px;
        height: 5vh;
      }
      .right {
        // width: 227px;
        height: 55px;
        padding: 0 10px;
        background: url("@/assets/images/home/gameBtn.png") no-repeat;
        background-size: 100% 100%;
        font-size: 26px;
        color: #16140e;
        font-weight: 550;
      }
    }

    .left {
      width: 105px;
      height: 100%;
      font-size: 30px;
      .icon {
        font-size: 24px;
        color: #2c1205;
        margin-left: 5px;
      }
    }
    .btn {
      width: 220px;
      height: 100%;
    }
  }
  .time-box {
    background: url("@/assets/images/home/countDown.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 3vh;
    right: 20px;
    width: 40vw;
    height: 6vh;
    .van-count-down {
      .num {
        font-size: 34px;
        color: #ffe116;
        font-weight: bold;
        font-style: italic;
        margin-right: 6px;
      }
      padding-left: 3.5vw;
      padding-top: 2.8vh;
      font-size: 28px;
      color: #fff;
    }
  }
  .btn {
    font-weight: bold;
    font-size: 36px;
  }
  .icons {
    position: absolute;
    width: 204px;
    height: 133px;
    right: 0;
    bottom: 10vh;
    background: url("@/assets/images/game/gameBg2.png") no-repeat;
    background-size: 100% 100%;
    font-size: 30px;
    padding: 15px 0 0 45px;
    .rank {
      width: 56px;
      height: 46px;
      background: url("@/assets/images/home/rank.png") no-repeat;
      background-size: 100% 100%;
      margin-right: 5px;
    }
    .record {
      width: 43px;
      height: 43px;
      background: url("@/assets/images/home/record.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .content {
    width: 100%;
    // height: 61vh;
    margin-top: 16vh;
    margin-left: 10px;
    .left {
      .home1 {
        margin-left: 1.4px;
        margin-top: 1.8vh;
        width: 292px;
        height: 13vh;
      }
      .home1r {
        position: absolute;
        left: -10px;
        top: -1.1vh;
        width: 380px;
        height: 14.3vh;
      }
      .home2 {
        width: 300px;
        height: 14vh;
        margin-top: 1vh;
      }
      .home2r {
        position: absolute;
        left: -10px;
        top: -1.65vh;
        width: 314px;
        height: 15.4vh;
      }
      .flex {
        position: relative;
        left: 0;
      }
      .home3 {
        width: 200px;
        height: 12.5vh;
        margin-top: 0.9vh;
      }
      .home3r {
        position: absolute;
        left: -10px;
        top: -1.3vh;
        width: 207px;
        height: 16.2vh;
      }
      .home4-box {
        width: 158px;
        height: 22vh;
        position: relative;
        position: absolute;
        margin-left: 206px;
        margin-top: -7.9vh;
      }
      .home4 {
        width: 158px;
        height: 22vh;
        margin-top: 0.3vh;
      }
      .home4r {
        position: absolute;
        left: -13px;
        top: -1.3vh;
        width: 178px;
        height: 24.1vh;
      }
      .home5 {
        width: 242px;
        height: 10vh;
        margin-top: 0.3vh;
      }
      .home5r {
        position: absolute;
        left: -12px;
        top: -7.5vh;
        width: 262px;
        height: 21.1vh;
      }
    }

    .right {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      margin-right: 15px;
      margin-top: 1vh;
      .home6 {
        width: 248px;
        height: 21vh;
      }
      .home6r {
        position: absolute;
        left: -117px;
        top: -2.6vh;
        width: 370px;
        height: 21.1vh;
      }
      .home7 {
        width: 240px;
        height: 21.1vh;
        position: relative;
        top: -0.7vh;
        left: -6.6px;
      }
      .home7r {
        position: absolute;
        left: -13px;
        top: -2.9vh;
        width: 258px;
        height: 22.8vh;
      }
      .home8 {
        width: 305px;
        height: 19vh;
        position: relative;
        left: -6.4px;
        top: 0.25vh;
        .stop {
          position: absolute;
          width: 155px;
          height: 8vh;
          opacity: 0;
        }
        .img {
          width: 100%;
          height: 100%;
        }
      }
      .home8r {
        position: absolute;
        left: -66px;
        top: -1.9vh;
        width: 382px;
        height: 27.8vh;
      }
    }
  }
  .falsePlayer {
    img {
      height: 60px;
      width: 60px;
    }
    .img1B {
      height: 60px;
      width: 60px;
      position: absolute;
      z-index: 1;
      left: 30px;
      bottom: 8vh;
      animation: walkLeftToRight1 3s ease-in-out infinite;
    }
    .name {
      font-size: 24px;
      position: absolute;
      left: 5px;
      color: #4b240e;
    }
    .img2B {
      @extend .img1B;
      left: 100px;
      bottom: 16vh;
    }
    .img3B {
      @extend .img1B;
      left: 200px;
      bottom: 18vh;
    }
    .img4B {
      @extend .img1B;
      left: 470px;
      bottom: 16vh;
    }
    .img5B {
      @extend .img1B;
      left: 620px;
      bottom: 6vh;
    }
    .img6B {
      @extend .img1B;
      left: 120px;
      bottom: 4vh;
    }
    @keyframes walkLeftToRight1 {
      from {
        transform: translateY(0);
      }

      50% {
        transform: translateX(10px) translateY(-10px);
      }

      to {
        transform:  translateY(0);
      }
    }
  }
}

.animateBox {
  --left: 10px;
  --bottom: 13vh;
  position: absolute;
  z-index: 10;
  bottom: var(--bottom);
  left: var(--left);
  background: url("@/assets/images/icon/sheep1.png") no-repeat;
  background-size: 100% 100%;
  height: 60px;
  width: 60px;
  .left {
    position: absolute;
    width: 8px;
    height: 10px;
    background: url("@/assets/images/icon/footLeft2.png") no-repeat;
    background-size: 100% 100%;
    transform-origin: center 0;
    margin-top: 3.2vh;
    margin-left: 18px;
    animation: walk 0.5s linear infinite;
  }
  .right {
    @extend .left;
    background: url("@/assets/images/icon/footRight2.png") no-repeat;
    background-size: 100% 100%;
    margin-left: 38px;
    animation: walk2 0.5s linear infinite;
  }
}
.animateBox::before,
.myPosition::before {
  content: "自己";
  font-size: 24px;
  position: absolute;
  top: -30px;
  left: 5px;
  color: #4b240e;
}
.myPosition {
  position: absolute;
  background: url("@/assets/images/icon/sheep1.png") no-repeat;
  background-size: 100% 100%;
  height: 60px;
  width: 60px;
  z-index: 100;
  .text {
    font-size: 24px;
    position: absolute;
    top: -30px;
    left: 5px;
    color: #91461e;
  }
}
.animateBoxActive1 {
  @extend .animateBox;
  animation: myfirst1 5s ease-in-out 1 forwards;
}
.animateBoxActive2 {
  @extend .animateBox;
  animation: myfirst2 5s ease-in-out 1 forwards;
}
.animateBoxActive3 {
  @extend .animateBox;
  animation: myfirst3 4s ease-in-out 1 forwards;
}
.animateBoxActive4 {
  @extend .animateBox;
  animation: myfirst4 5s ease-in-out 1 forwards;
}
.animateBoxActive5 {
  @extend .animateBox;
  animation: myfirst5 3s ease-in-out 1 forwards;
}
.animateBoxActive6 {
  @extend .animateBox;
  animation: myfirst6 5s ease-in-out 1 forwards;
}
.animateBoxActive7 {
  @extend .animateBox;
  animation: myfirst7 5s ease-in-out 1 forwards;
}
.animateBoxActive8 {
  @extend .animateBox;
  animation: myfirst8 4s ease-in-out 1 forwards;
}
@keyframes myfirst1 {
  30% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  50% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: 35vh;
  }
  60% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 390px;
    bottom: 35vh;
  }
  90% {
    left: 390px;
    bottom: 71vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 180px;
    bottom: 71vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes myfirst2 {
  30% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  50% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: 35vh;
  }
  60% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 390px;
    bottom: 35vh;
  }
  90% {
    left: 390px;
    bottom: 63vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 180px;
    bottom: 63vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes myfirst3 {
  25% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  50% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: 35vh;
  }
  75% {
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
    left: 120px;
    bottom: 35vh;
  }
  100% {
    left: 120px;
    bottom: 43vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes myfirst4 {
  30% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  50% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: 35vh;
  }
  70% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 390px;
    bottom: 35vh;
  }
  90% {
    left: 390px;
    bottom: 48vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 270px;
    bottom: 48vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes myfirst5 {
  0% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: var(--left);
    bottom: var(--bottom);
  }
  33% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  66% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: 26vh;
  }
  95% {
    left: 150px;
    bottom: 26vh;
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 150px;
    bottom: 26vh;
    background: url("@/assets/images/icon/sheep4.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes myfirst6 {
  0% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: var(--left);
    bottom: var(--bottom);
  }
  30% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  50% {
    left: 270px;
    bottom: 35vh;
  }
  60% {
    left: 390px;
    bottom: 35vh;
  }
  90% {
    left: 390px;
    bottom: 76vh;
  }
  100% {
    left: 530px;
    bottom: 76vh;
  }
}
@keyframes myfirst7 {
  0% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: var(--left);
    bottom: var(--bottom);
  }
  30% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  50% {
    left: 270px;
    bottom: 35vh;
  }
  60% {
    left: 390px;
    bottom: 35vh;
  }
  90% {
    left: 390px;
    bottom: 55vh;
  }
  100% {
    left: 530px;
    bottom: 55vh;
  }
}
@keyframes myfirst8 {
  0% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: var(--left);
    bottom: var(--bottom);
  }
  20% {
    background: url("@/assets/images/icon/sheepNoRightFoot.png") no-repeat;
    background-size: 100% 100%;
    left: 270px;
    bottom: var(--bottom);
  }
  50% {
    left: 270px;
    bottom: 35vh;
  }
  70% {
    left: 500px;
    bottom: 35vh;
  }
  100% {
    left: 500px;
    bottom: 25vh;
  }
}

.tagList {
  padding: 20px 50px;
  background: #f6d4a7;
  border: 1px solid #6b2b09;
  border-radius: 17px;
  .item {
    font-size: 24px;
    color: #6b2b09;
    padding-bottom: 10px;
  }
}

/*放大缩小动画*/
@keyframes slideDown {
  from {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  to {
    transform: scale(1);
  }
}
.quantity {
  position: absolute;
  top: -18px;
  left: 98px;
  font-size: 24px;
  color: #91461e;
  z-index: 10;
  padding: 0 10px;
  height: 27px;
  animation: slideDown 1500ms infinite;
  .icon {
    width: 30px;
    height: 30px;
  }
}
.quantity1 {
  @extend .quantity;
}
.quantity2 {
  @extend .quantity;
  top: -27px;
}
.quantity3 {
  @extend .quantity;
}
.quantity4 {
  @extend .quantity;
  left: 90px;
  top: -15px;
}
.quantity5 {
  @extend .quantity;
  top: -49px;
}
.quantity6 {
  @extend .quantity;
  top: -32px;
  left: 110px;
}
.quantity7 {
  @extend .quantity;
  top: -42px;
  left: 105px;
}
.quantity8 {
  @extend .quantity;
  top: 86px;
  left: 40px;
}
.otherPlayers {
  .playList {
    background: url("@/assets/images/icon/sheep3.png") no-repeat;
    background-size: 100% 100%;
    height: 40px;
    width: 40px;
    z-index: 10;
    position: absolute;
    bottom: 2vh;
    left: 34px;
  }
  .playList:active {
    animation: slideDown2 1500ms infinite;
  }
  .top {
    font-size: 24px;
    position: absolute;
    top: -30px;
    left: 0px;
    color: #91461e;
  }
}
/*放大动画*/
@keyframes slideDown2 {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.5);
  }
}

:deep(.van-dialog.dialog) {
  width: 80%;
  height: 200px;
  line-height: 200px;
  background: url("@/assets/images/home/wolfText.png") no-repeat;
  background-size: 100% 100%;
  overflow: visible;
  animation: slideDown3 3000ms infinite;
}
@keyframes slideDown3 {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
  }
}
:deep(.van-dialog.dialog2) {
  width: 80%;
  background: url("@/assets/images/dialog/bg4.png") no-repeat;
  background-size: 100% 100%;
  overflow: visible;
  padding: 100px 0 100px;
}
.dialog2 {
  position: relative;
  .close {
    width: 64px;
    height: 64px;
    position: absolute;
    right: -10px;
    top: -10px;
    z-index: 10;
  }
  .state,
  .nums {
    padding: 0 60px;
    font-size: 28px;
    color: #4b240e;
  }
  .nums {
    padding-top: 20px;
  }
}

//狼动画
.wolf1 {
  height: 60px;
  width: 60px;
  position: absolute;
  bottom: 13vh;
  left: -80px;
  animation: 10s ease-in-out 1 wolfAnimate1;
  background: url("@/assets/images/icon/wolf2.png") no-repeat;
  background-size: 100% 100%;
  .left {
    position: absolute;
    width: 28px;
    height: 20px;
    background: url("@/assets/images/icon/knifeLeft.png") no-repeat;
    background-size: 100% 100%;
    transform-origin: right bottom;
    margin-top: 1.4vh;
    margin-left: -25px;
    animation: knife2 1s linear infinite;
  }
  .right {
    @extend .left;
    background: url("@/assets/images/icon/knifeRight.png") no-repeat;
    background-size: 100% 100%;
    transform-origin: 0 bottom;
    margin-top: 1.5vh;
    margin-left: 55px;
    animation: knife 1s linear infinite;
  }
}
.wolf2 {
  @extend .wolf1;
  animation: 10s ease-in-out 1 wolfAnimate2;
}
.wolf3 {
  @extend .wolf1;
  animation: 10s ease-in-out 1 wolfAnimate3;
}
.wolf4 {
  @extend .wolf1;
  animation: 10s ease-in-out 1 wolfAnimate4;
}
.wolf5 {
  @extend .wolf1;
  animation: 10s ease-in-out 1 wolfAnimate5;
}
.wolf6 {
  @extend .wolf1;
  animation: 10s ease-in-out 1 wolfAnimate6;
}
.wolf7 {
  @extend .wolf1;
  animation: 10s ease-in-out 1 wolfAnimate7;
}
.wolf8 {
  @extend .wolf1;
  animation: 10s ease-in-out 1 wolfAnimate8;
}

@keyframes wolfAnimate1 {
  20% {
    left: 38vw;
    bottom: 14vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  40% {
    left: 38vw;
    bottom: 35vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  50% {
    left: 54vw;
    bottom: 35vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  70% {
    left: 54vw;
    bottom: 72vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  80% {
    left: 43vw;
    bottom: 72vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  85% {
    left: 40.8vw;
    bottom: 71vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  95% {
    left: 43vw;
    bottom: 72vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 40.8vw;
    bottom: 71vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes wolfAnimate2 {
  20% {
    left: 36vw;
    bottom: 14vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  40% {
    left: 36vw;
    bottom: 35vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  50% {
    left: 54vw;
    bottom: 35vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  70% {
    left: 54vw;
    bottom: 64vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  80% {
    left: 43vw;
    bottom: 64vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  85% {
    left: 40.8vw;
    bottom: 63vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  95% {
    left: 43vw;
    bottom: 64vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 40.8vw;
    bottom: 63vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes wolfAnimate3 {
  20% {
    left: 36vw;
    bottom: 14vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  40% {
    left: 36vw;
    bottom: 34vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  60% {
    left: 13.2vw;
    bottom: 35vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  70% {
    left: 13.2vw;
    bottom: 36vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  80% {
    left: 13.2vw;
    bottom: 34vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  90% {
    left: 13.2vw;
    bottom: 36vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 13.2vw;
    bottom: 34vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes wolfAnimate4 {
  20% {
    left: 36vw;
    bottom: 14vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  40% {
    left: 36vw;
    bottom: 35vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  50% {
    left: 54vw;
    bottom: 35vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  70% {
    left: 54vw;
    bottom: 47vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  80% {
    left: 43vw;
    bottom: 48vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  80% {
    left: 51.6vw;
    bottom: 47vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  85% {
    left: 49.2vw;
    bottom: 46vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  95% {
    left: 51.6vw;
    bottom: 47vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 49.2vw;
    bottom: 46vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
}

@keyframes wolfAnimate5 {
  35% {
    left: 36vw;
    bottom: 14vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  70% {
    left: 36vw;
    bottom: 25vh;
    background: url("@/assets/images/icon/wolf2.png") no-repeat;
    background-size: 100% 100%;
  }
  75% {
    left: 34.8vw;
    bottom: 25vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  80% {
    left: 36vw;
    bottom: 24vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  85% {
    left: 34.8vw;
    bottom: 25vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  90% {
    left: 36vw;
    bottom: 24vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  95% {
    left: 34.8vw;
    bottom: 25vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
  100% {
    left: 36vw;
    bottom: 24vh;
    background: url("@/assets/images/icon/wolf1.png") no-repeat;
    background-size: 100% 100%;
  }
}
@keyframes wolfAnimate6 {
  20% {
    left: 36vw;
    bottom: 14vh;
  }
  40% {
    left: 36vw;
    bottom: 35vh;
  }
  50% {
    left: 54vw;
    bottom: 35vh;
  }
  70% {
    left: 55.1vw;
    bottom: 74vh;
  }
  75% {
    left: 57.5vw;
    bottom: 73vh;
  }
  80% {
    left: 55.1vw;
    bottom: 74vh;
  }
  85% {
    left: 57.5vw;
    bottom: 73vh;
  }
  95% {
    left: 55.1vw;
    bottom: 74vh;
  }
  100% {
    left: 57.5vw;
    bottom: 73vh;
  }
}
@keyframes wolfAnimate7 {
  20% {
    left: 36vw;
    bottom: 14vh;
  }
  40% {
    left: 36vw;
    bottom: 35vh;
  }
  50% {
    left: 54vw;
    bottom: 35vh;
  }
  70% {
    left: 55.1vw;
    bottom: 54vh;
  }
  75% {
    left: 57.5vw;
    bottom: 53vh;
  }
  80% {
    left: 55.1vw;
    bottom: 54vh;
  }
  85% {
    left: 57.5vw;
    bottom: 53vh;
  }
  95% {
    left: 55.1vw;
    bottom: 54vh;
  }
  100% {
    left: 57.5vw;
    bottom: 53vh;
  }
}
@keyframes wolfAnimate8 {
  20% {
    left: 36vw;
    bottom: 14vh;
  }
  40% {
    left: 36vw;
    bottom: 34vh;
  }
  60% {
    left: 66vw;
    bottom: 35vh;
  }
  70% {
    left: 66vw;
    bottom: 34vh;
  }
  80% {
    left: 66vw;
    bottom: 35vh;
  }
  90% {
    left: 66vw;
    bottom: 34vh;
  }
  100% {
    left: 66vw;
    bottom: 35vh;
  }
}

@keyframes walk {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(40deg);
  }
  to {
    transform: rotate(0deg);
  }
}
@keyframes walk2 {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-40deg);
  }
  to {
    transform: rotate(0deg);
  }
}
@keyframes knife {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-40deg);
  }
  to {
    transform: rotate(0deg);
  }
}
@keyframes knife2 {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(40deg);
  }
  to {
    transform: rotate(0deg);
  }
}
#myAudio {
  position: absolute;
  bottom: -20vh;
}
</style>