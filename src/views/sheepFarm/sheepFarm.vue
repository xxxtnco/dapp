<template>
  <div class='page'>
    <div class='page-box'>
      <van-pull-refresh v-model='loading' @refresh='onRefresh' loading-text='加载中'>
        <div class='title width-full'>
          <my-nav></my-nav>
          <div class='content-b flex'>
            <div class='output flex-center'>
              今日产出 : {{ homedata.homedata || 0 }}
            </div>
            <div class='progressbar flex' @click='showAddaa = true'>
              <div class='textbox flex'>
                <img src='@/assets/images/sheepfarm/sf-long.png' class='img' alt=''>
                <div class='text'>{{ wolfdata.wolfNum || 0 }}只狼正在路上</div>
                <van-icon name="question-o" />
              </div>
              <div class='item'>
                <van-progress :percentage="progress" pivot-text="" pivot-color="#F4AD20" color="linear-gradient(to right, #F4AD20, #F4AD20)" />
              </div>
            </div>
          </div>
          <div class='content-c'>
            <img class='help' @click='openshowa' src='@/assets/images/icon/sf-icon.png' alt=''>
            <div class='box'>
              <div class='item'>1、水晶 crystal是MAGIC META系统通行证</div>
              <div class='item'>2、用户购买的羊可以每天产一个水晶 crystal 70天后将不在生产水晶。用户可以复购羊群生产</div>
              <div class='item'>3、持有25只羊的用户，可以申请牧羊人身份， 开建自己的牧羊场。同时开放对外羊群加入。</div>
            </div>
            <div class='bottoma flex-center' @click='addopen'>快来创建你的牧羊场</div>
          </div>
          <div class='ranking flex-center'>
            牧羊场排名
          </div>
        </div>
        <div class='content'>
          <div class='sheepyard flex'>
            <template v-if='!!rankinglist.length'>
              <div class='itema' v-for='(i,j) in rankinglist' :key='j'>
                <div class='hader flex'>
                  <div class='a break-ellipsis'>
                    {{ i.name }}
                  </div>
                  <div class='b flex-center'>
                    <span v-if="i.grade === 1">小型</span>
                    <span v-if="i.grade === 2">中型</span>
                    <span v-if="i.grade === 3">大型</span>
                    <span v-if="i.grade === 4">超级</span>
                  </div>
                </div>
                <div class='division'>
                </div>
                <div class='textbox flex' style="margin-top: 10px;">
                  <div class='text-item'>
                    羊群数量：{{ i.sheepTotail || 0 }}只
                  </div>
                  <div class='text-item'>
                    加速产出：{{ i.speedUpRate * 100 || 0 }}%
                  </div>
                  <div class='text-item'>
                    牧羊分成：{{ i.sheepwalkShareRate * 100 || 0 }}%
                  </div>
                </div>
                <div class='bottom flex-center' @click='openwalk(i.id)'>
                  立即加入
                </div>
              </div>
            </template>

            <div class='nothing' v-else>
              <van-empty image="network" description="暂无数据~~" />
            </div>

          </div>
          <div class='check' @click='torankingList'>
          </div>
          <div class='division'>
          </div>
          <div class='datalist'>
            <div class='item flex-center' v-for='(i,j) in datalist' :key='j' :class='i.actvit?"actvit":" "' @click='datalistclick(i,j)'>
              {{ i.title }}
            </div>
          </div>
          <div class='input-box' @click='tosearch'>
            <div class='input-boxa'>
              <img src='@/assets/images/sheepfarm/search.png' class='img' alt=''>
              <div class='text'>输入内容~</div>
            </div>
            <div class='seach'>
            </div>
          </div>
          <div class='bottomdata'>
            <template v-if='!!records.length'>
              <div class='item' v-for='(i,j) in records' :key='j'>
                <div class='title'>
                  <div class='left'>
                    <img class='img' :src='i.avatar'>
                    <div class='tetx break-ellipsis'>
                      {{ i.name }}
                    </div>
                    <div class='b flex-center'>
                      <span v-if="i.grade === 1">小型</span>
                      <span v-if="i.grade === 2">中型</span>
                      <span v-if="i.grade === 3">大型</span>
                      <span v-if="i.grade === 4">超级</span>
                    </div>
                  </div>
                  <div class='right'>
                    加速{{ i.speedUpRate * 100 || 0 }}%
                  </div>
                </div>
                <div class='contenta'>
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
                      {{ i.addressNum || 0 }} 个地址加入
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div class='nothing' v-else>
              <van-empty image="network" description=" 暂无数据~~" />
            </div>

          </div>
        </div>
      </van-pull-refresh>
    </div>
    <van-dialog class='dialog' v-model:show='show' :show-confirm-button='false'>
      <div class='contenta'>
        <div class='closea' @click='show = false'></div>
        <div class='title flex'>
          <div>牧羊场级别</div>
          <div>申请人持有下线</div>
          <div>最少羊只</div>
          <div>最多羊只</div>
          <div>牧场加成</div>
          <div>牧场分成</div>
        </div>
        <div class='line flex' v-for='(i,j) in gradedata' :key='j'>
          <div>{{ i.configName || 0 }}</div>
          <div>{{ i.applicantHoldLimit || 0 }}</div>
          <div>{{ i.minSheep || 0 }}</div>
          <div>{{ i.maxSheep || 0 }}</div>
          <div>{{ i.outputRate * 100 || 0 }}%</div>
          <div>{{ i.sheepwalkShareRate * 100 || 0 }}%</div>
        </div>
      </div>
    </van-dialog>
    <!--    创建牧羊场-->
    <van-popup v-model:show='addshow' position='bottom' class='dialog3'>
      <div class='contenta'>
        <div class='title flex'></div>
        <div class='profile'>
          <div class='openimg' v-if='!!sgeepdata.avatar'>
            <van-uploader :after-read='afterRead' @click-upload='clickupload' accept='image/*' />
            <img :src='sgeepdata.avatar' class='img'>
          </div>
          <div class='imgbox' v-else>
            <van-uploader :after-read='afterRead' @click-upload='clickupload' accept='image/*' />
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
            <van-picker :columns='columns' @confirm='onConfirm' @change='onChange' confirm-button-text=' ' cancel-button-text=' ' option-height='25' :class="expandVisible?'active':''" />
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
          确定创建牧羊场
        </div>
      </div>
    </van-popup>

    <my-dialog v-model:show="showAdd" @confirm="contactCopy(mailbox)" :showClose="true">
      <div class="dialog7">
        <div class="contentc text-center">
          本期{{wolfdata.wolfNum||0}}个狼王共吃掉{{Math.ceil(wolfdata.totalEatEarning)||0}}水晶。你被 掠夺了{{Math.ceil(wolfdata.userEatEarning)||0}}水晶。
        </div>
      </div>
    </my-dialog>

    <my-dialog v-model:show="showAddaa" :showClose="true">
      <div class="dialog7">
        <div class="contentc no">
          当达到99只狼，当天80%牧羊场产生的水晶将被狼群划分。
        </div>
      </div>
    </my-dialog>

    <!--  加入牧羊场-->
    <my-dialog v-model:show='showAdda' confirmBtn='申请加入' @confirm='applyAdd' :showClose='true'>
      <div class='dialog4'>
        <div class='content2'>
          <div class='titles center'><img src='@/assets/images/sheepfarm/apply.png' alt=''></div>
          <div class='name'>加入羊数量</div>
          <van-field class='input2' v-model='addNumber' />
          <div class='texts'>当前羊：{{ mySheepNum }}只</div>
        </div>
      </div>
    </my-dialog>

    <my-menu></my-menu>
  </div>
</template>
<script setup>
import { showToast, showNotify } from "vant";
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useWalletStore } from "@/stores";
import req from "@/libs/req";
const addNumber = ref("");
const mySheepNum = ref("");
const walletStore = useWalletStore();
const isLogin = computed(() => walletStore.isConnection);
const loading = ref(false);
const progress = ref(0);
const showAddaa = ref(false);
const onRefresh = async () => {
  if (isLogin.value) {
    await getInfo();
    await homelist(0);
  }
  setTimeout(() => {
    datalist.value.map((i, j) => (i.actvit = false));
    datalist.value[0].actvit = true;
    showToast("刷新成功");
    loading.value = false;
  }, 1000);
};

//基本配置
const gradedata = ref([]);
//狼来了
const wolfdata = ref({});
//排行榜
const rankinglist = ref([]);
//首页列表&参数
const homedata = ref({});

const listdata = ref({
  searchNum: "0",
});

//创建牧羊场
const sgeepdata = ref({
  sheepWalkId: "",
  name: "",
  avatar: "",
  grade: "",
  introduce: "",
});

const expandVisible = ref(false);
const selectedValues = ref("");
const columns = ref([
  // {text: '小型牧羊场', value: 'Hangzhou'},
  // {text: '中型牧羊场', value: 'Ningbo'},
  // {text: '大型牧羊场', value: 'Wenzhou'},
  // {text: '超级牧羊场', value: 'Shaoxing'},
  // {text: '超超级牧羊场', value: 'Huzhou'},
]);
const formdata = ref({
  phone: "",
});

const records = ref([]);
const router = useRouter();
const show = ref(false);
const showAdd = ref(false);
const showAdda = ref(false);
const addshow = ref(false);

const datalist = ref([
  {
    title: "牧羊场",
    actvit: true,
    id: 0,
  },
  {
    title: "产出量",
    actvit: false,
    id: 1,
  },
  {
    title: "我的",
    actvit: false,
    id: 2,
  },
]);

//图片文件
const imgfile = ref({});

watch(
  () => isLogin.value,
  (n) => {
    if (!!n) {
      homelist(0);
      getInfo();
    } else {
      showToast("请连接钱包");
    }
  }
);

const ida = ref("");

function openwalk(id) {
  showAdda.value = true;
  addNumber.value = "";
  ida.value = id;
}

async function applyAdd() {
  if (!addNumber.value) return showToast("请输入羊数量");
  if (Number(mySheepNum.value) < Number(addNumber.value))
    return showToast("我的羊不足");
  await req.post(
    "/api/SheepWalk/join",
    {
      num: addNumber.value,
      sheepWalkId: ida.value,
    },
    { loading: true }
  );
  showToast("加入牧羊场成功");
  showAdda.value = false;
  await getInfo();
}

function openshowa() {
  if (!!isLogin.value) {
    show.value = true;
  } else {
    showToast("请连接钱包");
  }
}

function todetaili(id) {
  if (!!isLogin.value) {
    router.push(`/sheepFarmDetail?id=${id}`);
  } else {
    showToast("请连接钱包");
  }
}

function tosearch() {
  if (!!isLogin.value) {
    router.push("/sheepFarmSearch");
  } else {
    showToast("请连接钱包");
  }
}

function torankingList() {
  if (!!isLogin.value) {
    router.push("/rankingList");
  } else {
    showToast("请连接钱包");
  }
}

function addopen() {
  if (!!isLogin.value) {
    addshow.value = true;
  } else {
    showToast("请连接钱包");
  }
}

function afterRead(file) {
  // 此时可以自行将文件上传至服务器
  try {
    console.log(file, "上传图片----------");
    imgfile.value = file.file;
    sgeepdata.value.avatar = file.objectUrl;
  } catch (e) {
    console.log(e, "上次失敗----------------");
  }
}

//点击图片上传组件方法
function clickupload(e) {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      /* 使用这个 stream stream */
      console.log(stream, "stream--------------成功");
    })
    .catch(function (err) {
      /* 处理 error */
      console.log(err, "error--------------失败");
    });
}

async function submint(options) {
  if (!sgeepdata.value.avatar) return showToast("请上传头像");
  if (!sgeepdata.value.name) return showToast("请输入名称");
  if (!sgeepdata.value.introduce) return showToast("请输入介绍");
  if (!sgeepdata.value.grade) {
    sgeepdata.value.grade = columns.value[0].value;
  }
  // console.log(sgeepdata.value,"提交参数-已验证")
  try {
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
    await req.post("/api/SheepWalk/create", sgeepdata.value, {
      loading: true,
    });
    addshow.value = false;
    showNotify({ type: "success", message: `${"创建成功"}` });
    await homelist(0);
    await getInfo();
  } catch (e) {
    showNotify({ type: "danger", message: `${e + "-请重试"}` });
  } finally {
    for (const val in sgeepdata.value) {
      sgeepdata.value[val] = "";
    }
  }
}

const onConfirm = ({ selectedValues }) => {};

const onChange = ({ selectedOptions }) => {
  selectedValues.value = selectedOptions[0].text;
  sgeepdata.value.grade = selectedOptions[0].value;
  setTimeout(() => (expandVisible.value = false), 500);
  // showToast(`当前值2: ${selectedValues.join(',')}`);
};

const handleBtnClick = () => {
  expandVisible.value = !expandVisible.value;
};

const datalistclick = (i, j) => {
  if (!isLogin.value) return showToast("请连接钱包");
  homelist(i.id);
  datalist.value.map((item) => (item.actvit = false));
  datalist.value[j].actvit = true;
};

function openimg() {
  console.log("打开相册----------");
  uni.chooseMedia({
    count: 9,
    mediaType: ["image"],
    sourceType: ["album", "camera"],
    maxDuration: 30,
    camera: "back",
    success(res) {
      console.log(res.tempFiles);
    },
  });
}

async function getInfo() {
  try {
    rankinglist.value = await req.post("/api/SheepWalk/rank");
    gradedata.value = await req.post("/api/SheepWalk/config/list");
    wolfdata.value = await req.post("/api/SheepWalk/wolf/come");
    mySheepNum.value = await req.post("/api/wallet/my/loose/sheep");
    // console.log(res, "-----------------------成功-配置")
    // console.log(ress, "-----------------------成功-狼来了")
    // console.log(resss, "-----------------------成功-排行榜")
    if (wolfdata.value.wolfNum) {
      progress.value = wolfdata.value.wolfNum;
      if (wolfdata.value.wolfNum == 99) {
        progress.value = 100;
      }
    }
    if (wolfdata.value.userEatEarning != null) {
      showAdd.value = true;
    }
    if (!!columns.value.length) {
      return;
    } else {
      gradedata.value.map((i, j) =>
        columns.value.push({ text: i.configName, value: i.id })
      );
      selectedValues.value = columns.value[0].text;
    }
  } catch (e) {
    console.log(e, "-----------------------失败-all");
  }
}

async function homelist(id) {
  console.log(id, "searchNum列表参数");
  listdata.value.searchNum = id || 0;
  const res = await req.post(
    "/api/SheepWalk/list",
    {
      searchNum: listdata.value.searchNum,
    },
    { loading: true }
  );
  try {
    homedata.value = res;
    records.value = homedata.value.page.records || [];
    console.log(
      records.value[0].avatar,
      "-----------------------成功-首页列表"
    );
  } catch (e) {
    console.log(e, "-----------------------失败-all");
  }
}

onMounted(async () => {
  if (isLogin.value) {
    homelist(0);
    getInfo();
  }
});
</script>

<style scoped lang='scss'>
.page {
  width: 100%;
  max-width: 800px;
  color: #ffffff;
  overflow: auto;
  height: calc(100vh - 150px);
  background: #34ab75;

  .page-box {
    background: url("@/assets/images/home/bg.png") no-repeat;
    background-size: 100% 100%;
  }

  //内容开始
  .content {
    border-radius: 40px 40px 0px 0px;
    background: #34ab75;
    position: relative;
    top: -10px;
    z-index: 100;
    min-height: 2800px;
    padding: 50px 20px;

    .sheepyard {
      width: 100%;
      overflow-x: auto;
      display: flex;
      white-space: nowrap;
      border-radius: 30px;
      .nothing {
        margin: 145px auto;
        :deep(.van-empty__description) {
          font-size: 32px;
          color: #fff;
        }
      }

      .itema {
        height: 100%;
        background: url("@/assets/images/sheepfarm/sf-box.png") no-repeat;
        background-size: 100% 100%;
        margin-right: 15px;
        padding-block: 20px;

        .hader {
          padding: 20px 30px;
          flex-wrap: nowrap;
          align-items: center;
          margin: auto;
          .a {
            width: 170px;
            margin-right: 10px;
            font-size: 30px;
            font-weight: 600;
            color: #6b2b09;
            line-height: 43px;
          }

          .b {
            background: #e2b079;
            border: 1px solid #91461e;
            border-radius: 26px;
            font-size: 22px;
            color: #fdfef5;
            padding: 0px 10px;
          }
        }

        .division {
          width: 100%;
          height: 7px;
          background: #c2a583;
          background-size: 100% 100%;
        }

        .textbox {
          flex-direction: column;
          margin-left: 30px;
          .text-item {
            font-size: 26px;
            color: #91461e;
            padding-bottom: 5px;
          }
        }

        .bottom {
          width: 172px;
          height: 53px;
          background: url("@/assets/images/sheepfarm/sf-mixbox.png") no-repeat;
          background-size: 100% 100%;
          font-size: 27px;
          color: #ffffff;
          margin: 10px 0 0 30px;
        }
      }
    }

    .check {
      width: 363px;
      height: 90px;
      background: url("@/assets/images/sheepfarm/sf-chakan.png") no-repeat;
      background-size: 100% 100%;
      margin: auto;
      margin-block: 50px;
    }

    .division {
      width: 100%;
      height: 10px;
      background: url("@/assets/images/sheepfarm/sf-bor.png") no-repeat;
      background-size: 100% 100%;
    }

    .datalist {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-evenly;
      margin-block: 50px;

      .item {
        width: 222px;
        height: 77px;
        background: url("@/assets/images/sheepfarm/sf-actiona.png") no-repeat;
        background-size: 100% 100%;
        font-size: 36px;
        color: #bb7a2a;
      }

      .actvit {
        @extend .item;
        background: url("@/assets/images/sheepfarm/sf-action.png") no-repeat;
        background-size: 100% 100%;
      }
    }

    .input-box {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;

      .input-boxa {
        width: 551px;
        height: 70px;
        background: url("@/assets/images/sheepfarm/seachbox.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;

        .img {
          width: 30px;
          height: 30px;
          margin-inline: 25px;
        }

        .text {
          font-size: 24px;
          color: #6b2b09;
        }
      }

      .seach {
        width: 136px;
        height: 65px;
        background: url("@/assets/images/sheepfarm/openseach.png") no-repeat;
        background-size: 100% 100%;
      }
    }

    .bottomdata {
      display: flex;
      flex-direction: column;

      .nothing {
        margin: 145px auto;
        :deep(.van-empty__description) {
          font-size: 32px;
          color: #fff;
        }
      }

      .item {
        width: 692px;
        height: 304px;
        background: #ffe7ce;
        border: 2px solid #7c7b6e;
        border-radius: 20px;
        margin: auto;
        margin-block: 20px;

        .contenta {
          font-size: 28px;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          padding-inline: 40px;
          margin-top: 20px;

          .left {
            font-size: 28px;
            font-weight: 600;
            color: #91461e;
            line-height: 43px;
          }

          .right {
            text-align: center;

            .top {
              width: 228px;
              height: 77px;
              background: url("@/assets/images/sheepfarm/sf-mixbox.png")
                no-repeat;
              background-size: 100% 100%;
              font-size: 36px;
              color: #ffffff;
            }

            .bottom {
              font-size: 26px;
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
          align-items: center;
          justify-content: space-between;
          padding-inline: 30px;

          .left {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            .img {
              width: 86px;
              height: 86px;
              background: #6b2b09;
              border-radius: 50%;
              margin-inline: 10px;
            }

            .tetx {
              font-size: 32px;
              color: #161612;
            }

            .b {
              background: #e2b079;
              border: 1px solid #91461e;
              border-radius: 40px;
              margin-left: 10px;
              font-size: 22px;
              color: #fdfef5;
              margin-inline: 10px;
              padding: 0px 10px;
            }
          }

          .right {
            font-size: 28px;
            color: #ee8447;
            line-height: 43px;
          }
        }
      }
    }
  }
  //内容结束

  //头部
  .title {
    font-size: 36px;

    .conntent-a {
      flex-wrap: nowrap;
      justify-content: space-between;
      padding-block: 20px;
      padding-inline: 30px;

      .icon {
        width: 50px;
        height: 50px;
        background-color: #999999;
        border-radius: 50%;
      }

      .right {
        .right-a {
          background: #738b95;
          border-radius: 20px;
          padding: 0px 20px;
          margin-inline: 20px;
        }

        .right-b {
          background: #738b95;
          border-radius: 20px;
          padding: 0px 20px;
        }
      }
    }

    .content-b {
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      .output {
        width: 264px;
        height: 77px;
        background: url("@/assets/images/sheepfarm/sf-action.png") no-repeat;
        background-size: 100% 100%;
        margin-left: -15px;
        font-size: 30px;
        color: #bb7a2a;
      }

      .progressbar {
        flex-direction: column;
        position: relative;

        .textbox {
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: #ffffff;
          position: absolute;
          top: -45px;
          left: 20px;
          .help {
            width: 30px;
            height: 30px;
            position: absolute;
            right: -25px;
          }
          .img {
            width: 70px;
            height: 59px;
          }

          .text {
            padding-inline: 10px;
          }
        }

        .item {
          width: 325px;
          height: 52px;
          background: url("@/assets/images/sheepfarm/sf-jindu.png") no-repeat;
          background-size: 100% 100%;
          :deep(.van-progress) {
            --van-progress-height: 16px !important;
            --van-progress-pivot-line-height: 5px;
            position: relative;
            top: 20px;
            margin-left: 26px;
            border-radius: 30px;
            overflow: hidden;
          }
        }
      }
    }

    .content-c {
      margin: auto;
      margin-block: 30px;
      width: 97%;
      height: 430px;
      background: url("@/assets/images/sheepfarm/sf-bg.png") no-repeat;
      background-size: 100% 100%;
      position: relative;

      .help {
        position: absolute;
        left: 58%;
        top: 30px;
        width: 19px;
        height: 19px;
      }

      .box {
        padding: 100px 100px;
        height: 250px;
        font-size: 22px;
        color: #874419;
        line-height: 40px;

      }

      .bottoma {
        width: 425px;
        height: 79px;
        background: url("@/assets/images/sheepfarm/sf-boxreda.png") no-repeat;
        background-size: 100% 100%;
        font-size: 36px;
        color: #ffffff;
        margin: 70px auto;
      }
    }

    .ranking {
      width: 528px;
      height: 107px;
      background: url("@/assets/images/sheepfarm/sf-boxred.png") no-repeat;
      background-size: 100% 100%;
      font-size: 42px;
      font-weight: 900;
      color: #ffffff;
      margin: auto;
      position: relative;
      z-index: 101;
      text-shadow: 2px 2px 2px #de5d35;
    }
  }

  //  结束
}

:deep(.van-dialog.dialog) {
  width: 733px;
  padding-bottom: 50px;
  background: url("@/assets/images/dialog/bg2.png") no-repeat;
  background-size: 100% 100%;
}

.dialog {
  position: relative;

  .closea {
    width: 64px;
    height: 64px;
    position: absolute;
    right: 0px;
    top: 40px;
    opacity: 0;
  }

  .contenta {
    font-size: 24px;
    color: #bb7d58;
    margin-top: 140px;
    padding: 0 38px 0 18px;

    .title,
    .line {
      font-size: 24px;
      border-top: 1px solid #edc692;

      div:first-child {
        border-left: 0;
      }

      div {
        height: 100px;
        width: 105px;
        border-left: 1px solid #edc692;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .line-bottom {
      border-bottom: 1px solid #edc692;
    }
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

  .closea {
    width: 64px;
    height: 64px;
    position: absolute;
    right: -10px;
    top: -15px;
    opacity: 1;
  }

  .contenta {
    font-size: 24px;
    color: #bb7d58;
    display: flex;
    flex-direction: column;
    padding-inline: 60px;
    padding-bottom: 40px;

    .title {
      width: 276px;
      height: 65px;
      background: url("@/assets/images/sheepfarm/addmuyangchang.png") no-repeat;
      background-size: 100%;
      margin: 30px auto;
      margin-top: 50px;
    }

    .profile {
      display: flex;
      flex-direction: column;
      align-items: center;
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

.dialog4 {
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

.dialog7 {
  color: #bb7d58;
  padding-inline: 30px;
  .title {
    padding: 60px 0 20px;
    img {
      width: 267px;
      height: 70px;
    }
  }
  .name {
    padding-top: 20px;
  }
  .rechargepopup-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 36px;
  }
  .contentc {
    padding: 80px 20px;
    font-size: 36px;
    &.no {
      font-size: 32px;
    }
  }
}
:deep(.van-dialog) {
  width: 80vw;
}
</style>