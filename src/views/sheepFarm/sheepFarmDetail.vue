<template>
  <div class='page'>
    <div class='page-box'>
      <div class="bg">
        <div class='title flex-sb'>
          <div class='imgbox'>
            <div class="box center">
              <img class="img" :src="info.avatar" alt="">
            </div>
            <div v-if="info.isMe === 1" @click='clickEdit' class='text flex-center'>编辑</div>
          </div>

          <div class='content'>
            <div class='textbox flex-align-center'>
              <div class='text'>{{info.name}}</div>
              <div class='b flex-center'>
                <span v-if="info.grade === 1">小型</span>
                <span v-if="info.grade === 2">中型</span>
                <span v-if="info.grade === 3">大型</span>
                <span v-if="info.grade === 4">超级</span>
              </div>
            </div>
            <div class='num'>
              <span>{{info.minNum || 0}}只～{{info.maxNum || 0}}只</span>
            </div>
          </div>

          <div class='bottom'>
            <div class='top' @click="showAdd = true;addNumber='';" v-if="info.isMe === 0"></div>
            <div class='btm' @click='clickEdit' v-if="info.isMe === 1"></div>
          </div>
        </div>

        <div class='content'>
          <div class='toptext'>
            <div>{{info.introduce}}</div>
          </div>

          <div class='bor'>
            <div class='top'>
              <div class='text'>
                <div class='num'>{{info.outputTotal || 0}}</div>
                <div class='i'>总产出</div>
              </div>
              <div class='text'>
                <div class='num'>{{sliceDecimal(info.outputRate*100,0) || 0}}%</div>
                <div class='i'>产出率</div>
              </div>
              <div class='text'>
                <div class='num'>{{info.shareTotal || 0}}</div>
                <div class='i'>牧场分成</div>
              </div>
            </div>
            <div class='bottom'>
              <div class='text'>
                <div class='num'>{{info.sheepNum || 0}}</div>
                <div class='i'>总羊数</div>
              </div>
              <div class='text'>
                <div class='num'>{{info.addressNum || 0}}</div>
                <div class='i'>地址数</div>
              </div>
              <div class='text'>
                <div class='num'>{{info.yesOutput || 0}}</div>
                <div class='i'>昨日产出</div>
              </div>
            </div>
          </div>

          <div class="bg-box">
          </div>
          <div class='box'>
            <div class='title center'>
              地址排行榜
            </div>
            <div class='item' v-for="item in info.userSheepVOS" :key="item.walletAddress">
              <div>{{textSubstr(item.walletAddress, 4)}}</div>
              <div>产出: {{item.output}}</div>
              <div>{{item.sheepNums}}只</div>
            </div>
          </div>

          <div class='box a'>
            <div class='title center'>
              地址数(近7天)
            </div>
            <div id="main"></div>
          </div>
        </div>
      </div>
      <!--   编辑牧羊场-->
      <van-popup v-model:show='showEdit' position='bottom' class='dialog3'>
        <div class='contents'>
          <div class='title text-center'><img src="@/assets/images/sheepfarm/edit.png" alt=""></div>
          <div class='profile'>
            <div class='openimg' v-if='!!sgeepdata.avatar'>
              <van-uploader :after-read='afterRead' @click-upload='clickupload' result-type='file' accept='image/*' />
              <img :src='sgeepdata.avatar' class='img'>
            </div>
            <div class='imgbox' v-else>
              <van-uploader :after-read='afterRead' @click-upload='clickupload' result-type='file' accept='image/*' />
              <img src='@/assets/images/sheepfarm/sf-imgbox.png' class='img'>
              <div class='add'>+</div>
            </div>
            <div class='text'> 牧羊场头像</div>
          </div>
          <div class='section'>
            <div class='text'>牧羊场名称</div>
            <div class='item'>
              <van-cell-group>
                <van-field v-model='sgeepdata.name' />
              </van-cell-group>
            </div>
          </div>
          <div class='section'>
            <div class='text'>牧羊场级别</div>
            <div class='item'>
              <div class='box' @click='handleBtnClick'>
                <div class='text'> {{ selectedValues }}</div>
                <img src='@/assets/images/sheepfarm/fanhui.png' class='a'>
              </div>
              <van-picker v-model="selectedValuesId" :columns='columns' @change='onChange' confirm-button-text=' ' cancel-button-text=' ' option-height='25' :class="expandVisible?'active':''" />
            </div>
          </div>
          <div class='section'>
            <div class='text'>牧羊场介绍</div>
            <div class='item'>
              <van-cell-group>
                <van-field v-model='sgeepdata.introduce' type='textarea' />
              </van-cell-group>
            </div>
          </div>
          <div class='bnt' @click='submint'>
            编辑牧羊场
          </div>
        </div>
      </van-popup>

      <!--  加入牧羊场-->
      <my-dialog v-model:show="showAdd" confirmBtn="申请加入" @confirm="applyAdd" :showClose="true">
        <div class="dialog">
          <div class="content2">
            <div class="titles center"><img src="@/assets/images/sheepfarm/apply.png" alt=""></div>
            <div class="name">加入羊数量</div>
            <van-field class="input2" v-model="addNumber" />
            <div class="texts">当前羊：{{mySheepNum}}只</div>
          </div>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { closeDialog, showToast } from "vant";
import { onMounted, ref, computed, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import req from "@/libs/req";
import { textSubstr, sliceDecimal } from "@/libs/utils";
import myDialog from "@/components/MyDialog.vue";
const router = useRouter();
const route = useRoute();
const id = ref("");
const info = ref({});

const myChart = ref(null);
function init() {
  let chartDom = document.getElementById("main");
  myChart.value = echarts.init(chartDom);
  let option;

  option = {
    xAxis: {
      type: "category",
      data: lineX.value,
      axisLabel: {
        interval: 0,
        rotate: 50,
        margin: 8,
      },
      // axisTick:{
      //   show:false//去除刻度线
      // }
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: lineY.value,
        type: "line",
        symbol: "none", //去掉小圆点
        symbolSize: 0, //圆点大小设置为0
        itemStyle: {
          color: "#91461E",
        },
      },
    ],
  };

  option && myChart.value.setOption(option);
}

const lineX = ref([]);
const lineY = ref([]);

//基本配置
const gradedata = ref([]);
async function getInfo() {
  info.value = await req.post(`/api/SheepWalk/detail?sheepWalkId=${id.value}`);
  lineX.value = [];
  lineY.value = [];
  info.value.kline.forEach((res) => {
    lineX.value.push(res.days);
    lineY.value.push(res.addressNum);
  });
  init();
  mySheepNum.value = await req.post("/api/wallet/my/loose/sheep");

  const res = await req.post("/api/SheepWalk/config/list");
  columns.value = []
  res.forEach((item) => {
    console.log(item.id , info.value.grade);
    columns.value.push({ text: item.configName, value: item.id,disabled: item.id < info.value.grade });
    if (item.id === info.value.grade) {
      selectedValues.value = item.configName;
      selectedValuesId.value = [item.id];
    }
  });
}

//加入牧羊场
const showAdd = ref(false);
const mySheepNum = ref("");
const addNumber = ref("");
async function applyAdd() {
  if (!addNumber.value) return showToast("请输入羊数量");
  if (Number(mySheepNum.value) < Number(addNumber.value))
    return showToast("我的羊不足");
  info.value = await req.post(
    "/api/SheepWalk/join",
    {
      num: addNumber.value,
      sheepWalkId: id.value,
    },
    { loading: true }
  );
  showToast("加入牧羊场成功");
  showAdd.value = false;
  await getInfo();
}

//编辑牧羊场
const showEdit = ref(false);
const expandVisible = ref(false);
const selectedValues = ref("");
const selectedValuesId = ref("");
const columns = ref([]);
const imgfile = ref({}); //图片文件
const sgeepdata = ref({
  sheepWalkId: "",
  name: "",
  avatar: "",
  grade: "",
  introduce: "",
});
function clickEdit() {
  showEdit.value = true;
  sgeepdata.value.sheepWalkId = id.value;
  sgeepdata.value.name = info.value.name;
  sgeepdata.value.avatar = info.value.avatar;
  sgeepdata.value.grade = info.value.grade;
  sgeepdata.value.introduce = info.value.introduce;
  expandVisible.value = false;
}
const onChange = ({ selectedOptions }) => {
  selectedValues.value = selectedOptions[0].text;
  sgeepdata.value.grade = selectedOptions[0].value;
  handleBtnClick();
};
const handleBtnClick = () => {
  expandVisible.value = !expandVisible.value;
};
function afterRead(file) {
  imgfile.value = file.file;
  sgeepdata.value.avatar = file.objectUrl;
}

//点击图片上传组件方法
function clickupload(e){
  navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        /* 使用这个 stream stream */
        console.log(stream,"stream--------------成功")
      })
      .catch(function (err) {
        /* 处理 error */
        console.log(err,"error--------------失败")
      });
}


async function submint() {
  if (!sgeepdata.value.avatar) return showToast("请上传头像");
  if (!sgeepdata.value.name) return showToast("请输入名称");
  if (!sgeepdata.value.introduce) return showToast("请输入介绍");
  if (!imgfile.value) {
    let formData = new FormData();
    formData.append("file", imgfile.value);
    await req
      .post("/api/oss/upload", formData, {
        headers: {
          "Content-Type": "application/form-data",
        },
        loading: true,
      })
      .then((res) => {
        sgeepdata.value.avatar = res;
      });
  }

  await req.post("/api/SheepWalk/edit", sgeepdata.value, { loading: true });
  showToast("修改成功");
  await getInfo();
  showEdit.value = false;
}

onMounted(async () => {
  if (route.query.id) {
    id.value = route.query.id;
    await getInfo();
  }
});
onUnmounted(() => {
  if (myChart.value) {
    myChart.value.dispose();
  }
});
</script>

<style scoped lang='scss'>
.page {
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  background: url("@/assets/images/sheepfarm/sf-bbox.png") no-repeat;
  background-size: 100%;
  .page-box {
    padding: 0 30px;

    .bg-box {
      border-radius: 40px;
      background: #34ab75;
      width: 100vw;
      height: 100%;
      position: absolute;
      left: -30px;
      top: 750px;
      z-index: 1;
    }
  }

  .content {
    position: relative;
    z-index: 2;
    .toptext {
      font-size: 22px;
      font-weight: 400;
      color: #874419;
      margin: 40px auto;
      padding: 0 40px;
      height: 140px;
      overflow: auto;
      word-break: break-all;
    }

    .bor {
      width: 631px;
      height: 286px;
      border: 2.5px solid #7c7b6e;
      border-radius: 20px;
      padding: 48px 44px;
      margin: auto;
      margin-block: 40px;
      > div {
        display: flex;
        justify-content: space-between;
      }
      .text {
        flex: 1;
        justify-content: center;
        text-align: center;
        .num {
          font-size: 32px;
          color: #874419;
          word-break: break-all;
        }
        .i {
          font-size: 24px;
          color: #4d4338;
        }
      }
      .bottom {
        margin-top: 20px;
      }
    }

    .box {
      width: 690px;
      min-height: 500px;
      background: #ffe7ce;
      border-radius: 20px;
      padding: 80px 50px 60px;
      margin: 250px auto 0;
      position: relative;
      z-index: 3;

      &.a {
        margin-block: 100px;
        padding-top: 10px;
      }
      .title {
        width: 528px;
        height: 107px;
        background: url("@/assets/images/sheepfarm/sf-boxred.png") no-repeat;
        background-size: 100%;
        font-weight: 900;
        color: #ffffff;
        font-size: 42px;
        position: absolute;
        top: -180px;
        left: 83px;
        z-index: 3;
      }
      .item {
        position: relative;
        z-index: 3;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        font-size: 30px;
        font-weight: 500;
        color: #91461e;
        margin-top: 43px;
      }
    }
  }
}

.title {
  margin-top: 130px;
  padding: 0 40px;
  position: relative;
  z-index: 3;
  .bottom {
    .top {
      width: 172px;
      height: 53px;
      background: url("@/assets/images/sheepfarm/sf-jiaru.png") no-repeat;
      background-size: 100% 100%;
    }
    .btm {
      width: 172px;
      height: 53px;
      background: url("@/assets/images/sheepfarm/sf-muchang.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
  }

  .imgbox {
    position: relative;

    .box {
      width: 124px;
      height: 124px;
      background: url("@/assets/images/sheepfarm/sf-imgbox.png") no-repeat;
      background-size: 100% 100%;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 88%;
        height: 88%;
        border-radius: 50%;
      }
    }

    .text {
      width: 134px;
      height: 46px;
      background: url("@/assets/images/sheepfarm/sf-textbox.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      bottom: -10px;
      left: -5px;
      font-size: 22px;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .content {
    .num {
      font-size: 28px;
      font-weight: 400;
      color: #91461e;
      margin-top: 10px;
    }
    .textbox {
      width: 280px;
      .text {
        font-size: 32px;
        color: #161612;
        font-weight: 550;
        word-break: break-all;
      }

      .b {
        width: 68px;
        height: 32px;
        background: #e2b079;
        border: 1px solid #91461e;
        border-radius: 16px;
        margin-left: 10px;
        font-size: 22px;
        font-weight: 400;
        color: #fdfef5;
      }
    }
  }
}
#main {
  width: 100%;
  height: 500px;
}
.dialog {
  .titles {
    img {
      width: 250px;
      margin-bottom: 40px;
    }
  }
  .name {
    font-size: 28px;
    padding-top: 20px;
  }
  .input2 {
    margin-top: 10px;
    background: #f6d4a7;
    border-radius: 20px;
  }
  .texts {
    margin-top: 20px;
    font-size: 26px;
  }
  .content {
    padding: 80px 0 30px;
    font-size: 36px;
  }
  .content2 {
    padding: 60px 0 30px;
    font-size: 36px;
    margin: 0 40px;
  }
}

:deep(.dialog3) {
  width: 100%;
  background: url("@/assets/images/dialog/DI.png") no-repeat;
  background-size: 100%;
  overflow: visible;
}

.dialog3 {
  position: relative;

  .close {
    width: 64px;
    height: 64px;
    position: absolute;
    right: -10px;
    top: -15px;
    opacity: 1;
  }

  .contents {
    font-size: 24px;
    color: #bb7d58;
    display: flex;
    flex-direction: column;
    padding-inline: 60px;
    padding-bottom: 40px;

    .title {
      margin: 60px 0 20px;
      img {
        width: 300px;
      }
    }

    .profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-block: 20px;

      .openimg {
        @extend .imgbox;
      }

      .imgbox {
        position: relative;
        :deep(.van-uploader) {
          position: absolute;
          background: transparent !important;
          --van-uploader-upload-background: transparent !important;
          --van-uploader-text-color: transparent !important;
          --van-uploader-loading-icon-color: transparent !important;
          --van-uploader-mask-background: transparent !important;
          --van-uploader-mask-text-color: transparent !important;
          --van-uploader-file-name-text-color: transparent !important;
          --van-uploader-file-icon-color: transparent !important;
          --van-uploader-upload-active-color: transparent !important;
          --van-uploader-file-background: transparent !important;
          .van-badge__wrapper {
            color: transparent !important;
          }

          z-index: 999;
        }
        .img {
          width: 137px;
          height: 137px;
          border-radius: 50%;
        }

        .add {
          font-size: 100px;
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          color: #f9ead2;
        }
      }

      .text {
        font-size: 32px;
        font-weight: 500;
        color: #bb7d58;
        padding-block: 10px;
      }
    }

    .section {
      display: flex;
      flex-direction: column;

      .text {
        font-size: 30px;
        font-weight: 500;
        color: #bb7d58;
        padding-block: 20px;
      }

      .item {
        background: #f6d4a7;
        border-radius: 20px;
        position: relative;

        .box {
          background: #f6d4a7;
          border-radius: 15px;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          padding-inline: 20px;
          position: relative;
          z-index: 999;

          .text {
            font-size: 30px;
            font-weight: 500;
            color: #6b2b09;
          }

          .a {
            width: 16px;
            height: 30px;
          }
        }

        :deep(.van-picker) {
          width: 100% !important;
          position: absolute;
          z-index: 99;
          height: 274px;
          top: 50px;
          margin-top: 0px;
          transition: all ease-in-out 0.3s; // 过渡动画
          transform-origin: center top; // 缩放中心设置在面板顶部
          transform: scaleY(0); // 面板收起
          max-height: 0; // 收起时div不占高度
          &.active {
            transform: scaleY(1); // 面板展开
            max-height: 200px; // heigth:auto 无法触发过渡
          }

          .van-picker__toolbar {
            height: 0px !important;
          }

          .van-picker__columns {
            background: #f6d4a7;
            border: 1px solid #6b2b09;
            border-radius: 20px !important;
            .van-picker-column {
              .van-picker-column__item--selected {
                font-size: 30px !important;
                font-weight: 600 !important;
                color: #6b2b09 !important;
              }

              .van-picker-column__item {
                font-size: 30px;
                font-weight: 500;
                color: #d29b6c;
              }
            }

            .van-picker__mask {
              background-image: none !important;
            }
          }
        }

        :deep(.van-cell-group) {
          .van-cell {
            padding: 0px !important;
            background: #f9ead2;

            .van-field__body {
              background: #f6d4a7;
              border-radius: 15px;
              padding: 20px;
            }
          }
        }
      }
    }

    .bnt {
      width: 100%;
      height: 100px;
      border-radius: 20px;
      background: url("@/assets/images/sheepfarm/sf-boxreda.png") no-repeat;
      background-size: 100% 100%;
      font-size: 36px;
      font-weight: 500;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
    }
  }
}
</style>