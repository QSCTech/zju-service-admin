<template>
  <n-card style="margin-block: 20px">
    <n-input-group style="display: flex; justify-content: right;">
      <n-input :style="{width: '30%'}" placeholder="搜索求助" v-model:value="searchText"></n-input>
      <n-button type="primary" ghost @click="search()">搜索</n-button>
      <n-button type="primary" ghost @click="clear()">清空</n-button>
    </n-input-group>
    <n-tabs type="line" animated @update:value="handleUpdateValue">
      <n-tab-pane name="Unanswered" tab="未回答">
        <n-data-table
          remote
          :single-line="false"
          :columns="cols"
          :data="infos"
          :loading="formLoading"
          :pagination="pagination"
          @update:page="handleUpdatePagination"
        ></n-data-table>
      </n-tab-pane>
      <n-tab-pane name="Answered" tab="已回答">
        <n-data-table
          remote
          :single-line="false"
          :columns="cols"
          :data="infos"
          :loading="formLoading"
          :pagination="pagination"
          @update:page="handleUpdatePagination"
        ></n-data-table>
      </n-tab-pane>
    </n-tabs>
  </n-card>

  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="详情"
    positive-text="确认"
    negative-text="编辑回答"
    @positive-click="onPositiveClickInfo"
    @negative-click="onNegativeClickInfo"
  >
    <n-card>
      <n-h3 style = "margin-bottom: 10px;">{{nowQue.title}}</n-h3>
      <n-tag size = "small" round :color="{color: '#6963ed', textColor: 'white'}" style = "margin-right: 5px;" :bordered="false">{{ nowQue.college }}</n-tag>
      <n-tag size = "small" round :color="{color: '#6963ed', textColor: 'white'}" style = "margin-right: 5px;" :bordered="false">{{ nowQue.type }}</n-tag>
      <div style = "margin-top: 5px; margin-bottom: 5px;">是否隐藏：{{ nowQue.visibility }}</div>
      <div style = "margin-top: 5px; margin-bottom: 5px;">{{ nowQue.content }}</div>
      <div style = "margin-top: 5px; margin-bottom: 5px;">回答：{{ nowQue.response }}</div>
    </n-card>
  </n-modal>

  <n-modal
    v-model:show="showModalDelete"
    :mask-closable="false"
    preset="dialog"
    title="确认删除"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onPositiveClickDelete"
    @negative-click="onNegativeClickDelete"
  >
    <n-card>
      <n-h3 style = "margin-bottom: 10px;">{{nowQue.title}}</n-h3>
      <n-tag size = "small" round :color="{color: '#6963ed', textColor: 'white'}" style = "margin-right: 5px;" :bordered="false">{{ nowQue.college }}</n-tag>
      <n-tag size = "small" round :color="{color: '#6963ed', textColor: 'white'}" style = "margin-right: 5px;" :bordered="false">{{ nowQue.type }}</n-tag>
      <div style = "margin-top: 5px; margin-bottom: 5px;">是否隐藏：{{ nowQue.visibility }}</div>
      <div style = "margin-top: 5px; margin-bottom: 5px;">{{ nowQue.content }}</div>
      <div style = "margin-top: 5px; margin-bottom: 5px;">回答：{{ nowQue.response }}</div>
    </n-card>
  </n-modal>

  <n-modal
    v-model:show="showModalEdit"
    :mask-closable="false"
    preset="dialog"
    title="编辑回答"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onPositiveClickEdit"
    @negative-click="onNegativeClickEdit"
  >
    <n-card>
      <n-h3 style = "margin-bottom: 10px;">{{nowQue.title}}</n-h3>
      <n-tag size = "small" round :color="{color: '#6963ed', textColor: 'white'}" style = "margin-right: 5px;" :bordered="false">{{ nowQue.college }}</n-tag>
      <n-tag size = "small" round :color="{color: '#6963ed', textColor: 'white'}" style = "margin-right: 5px;" :bordered="false">{{ nowQue.type }}</n-tag>
      <div style = "margin-top: 5px;">{{ nowQue.content }}</div>
      <n-h4 style="margin: 5px 0px;">回答</n-h4>
      <n-input type="textarea" v-model:value="nowQue.response" show-count :autosize="{minRows: 3}"></n-input>
      <n-tag checkable v-model:checked="nowQue.isHide" round style = "margin-top: 5px; margin-bottom: 5px; border: 1px solid #6963ed;">隐藏</n-tag>
    </n-card>
  </n-modal>
</template>

<script setup>
import {
  NCalendar,
  NCard,
  NGrid,
  NGi,
  NInputNumber,
  NButton,
  NSpace,
  NRadioGroup,
  NRadioButton,
  NTabs,
  NTag,
  NTabPane,
  useDialog,
  NDataTable,
  useMessage,
  NModal,
  NH3,
  NH4,
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NDatePicker,
  NUpload,
} from "naive-ui";
import { onMounted, reactive, ref, h } from "vue";
import getDateStamp from "@/common/getDateStamp";
import request from "@/common/request";
import { useStore } from "vuex";
import { computed } from "@vue/reactivity";
const store = useStore();
const dialog = useDialog();
const message = useMessage();

const college = ref([]);
onMounted(async () => {
  if(shortName != "校会") college.value = [shortName];
  else college.value = null;
  try {
    pagination.pageSize = props.lines;
    getList(1);
  } catch (e) {
    console.error(e);
  }
})

const status = ref("Unanswered");
const formLoading = ref(false);
const orgName = store.state.loginUser.orgName;
const shortName = store.state.loginUser.shortName;
function handleUpdateValue(value){
  status.value = value;
  getList(1);
}

const cols = ref([
  {
    title: "标题",
    key: "title",
  },
  {
    title: '学院',
    key: 'college',
  },
  {
    title: "类型",
    key: "type",
  },
  {
    title: "回答时间",
    key: "answerTime",
  },
  {
    title: "隐藏",
    key: "visibility",
  },
  {
    title: '详情',
    key: 'showQue',
    render (row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => showQue(row)
        },
        { default: () => '详情' }
      )
    }
  },
  {
    title: '删除',
    key: 'deleteQue',
    render (row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => deleteQue(row)
        },
        { default: () => '删除' }
      )
    }
  }
]);

const infos = ref([]);
function infoAdapter(list) {
  if (list) {
    infos.value = list.map((que) => {
      const visibility = que.isHide? "是": "否";
      const answerTime = new Date(que.updateTime*1000);
      return {
        key: que.id,
        title: que.title,
        college: que.college,
        type: que.type,
        visibility: visibility,
        answerTime: answerTime.toLocaleDateString()+" "+answerTime.toLocaleTimeString(),
      };
    });
  } else {
    infos.value = [];
  }
}

async function getList(currentPage) {
  try {
    getTotal();
    const list = await request(
      "/question/list",
      {
        pageSize: pagination.pageSize,
        pageNum: currentPage,
        status: [status.value],
        context: searchText.value,
        college: college.value,
      },
      "获取求助"
    );
    console.log(list);
    pagination.page = currentPage;
    infoAdapter(list);
  } catch (e) {
    throw e;
  }
}

const props = defineProps({
  lines: {
    type: Number,
    default: 10,
  },
});
const total = ref(0);
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showQuickJumper: true,
  pageCount: 100,
  prefix() {
    return `共 ${total.value} 条`;
  },
});

async function getTotal() {
  try {
    const count = await request(
      "/question/list/count",
      {
        status: [status.value],
        context: searchText.value,
        college: college.value,
      },
      "获取求助数量"
    );
    total.value = count;
    pagination.pageCount = Math.ceil(count / pagination.pageSize);
    if(pagination.page < pagination.pageCount) pagination.page = pagination.pageCount;
  } catch (e) {
    throw e;
  }
}

async function handleUpdatePagination(currentPage) {
  formLoading.value = true;
  try {
    getList(currentPage);
    formLoading.value = false;
  } catch (e) {
    console.error(e);
    formLoading.value = false;
  }
}

const showModal = ref(false);
const showModalEdit = ref(false);
const nowQue = ref(null);
async function showQue(row){
  const que = await request("/question/get?qid=" + row.key, null, "获取求助");
  nowQue.value = que;
  nowQue.value.visibility = row.visibility;
  showModal.value = true;
}
function onNegativeClickInfo () {
  showModal.value = false;
  showModalEdit.value = true;
}
function onPositiveClickInfo () {
  showModal.value = false;
}

const showModalDelete = ref(false);
async function deleteQue(row){
  const que = await request("/question/get?qid=" + row.key, null, "获取求助");
  nowQue.value = que;
  nowQue.value.visibility = row.visibility;
  showModalDelete.value = true;
}
function onNegativeClickDelete(){
  showModalDelete.value = false;
}
async function onPositiveClickDelete(){
  await request("/admin/question/delete?qid=" + nowQue.value.id, null, "删除求助");
  getList(pagination.page);
  message.success("删除求助成功");
  showModalDelete.value = false;
}

function onNegativeClickEdit () {
  showModalEdit.value = false;
}
async function onPositiveClickEdit () {
  if(nowQue.value.response.length < 10){
    message.error("回答至少十字");
    return false;
  }
  nowQue.value.responder = orgName;
  nowQue.value.responderId = store.state.loginUser.id;
  nowQue.value.status = "Answered";
  nowQue.value.visibility = undefined;
  nowQue.value.answerTime = undefined;
  let newQue = JSON.parse(JSON.stringify(nowQue.value));
  console.log(newQue);
  await request("/admin/question/update", newQue, "修改求助");
  getList(pagination.page);
  message.success("修改求助成功");
  showModalEdit.value = false;
}

const searchText = ref("");
function search(){
  console.log(searchText.value);
  getList(1);
}
function clear(){
  searchText.value = "";
  getList(1);
}
</script>

<style>

</style>
