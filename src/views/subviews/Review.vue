<template>
  <n-card style="margin-block: 20px">
    <n-input-group style="display: flex; justify-content: right;">
      <n-input :style="{width: '30%'}" placeholder="搜索活动" v-model:value="searchText"></n-input>
      <n-button type="primary" ghost @click="search()">搜索</n-button>
      <n-button type="primary" ghost @click="clear()">清空</n-button>
    </n-input-group>
    <n-tabs type="line" animated @update:value="handleUpdateValue">
      <n-tab-pane name="Unreviewed" tab="待审核">
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
      <n-tab-pane name="Reviewed" tab="已发布">
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
      <n-tab-pane name="Rejected" tab="未通过">
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
    <n-button @click="addActivity">增加活动</n-button>
  </n-card>

  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="详情"
    positive-text="审核通过"
    negative-text="审核退回"
    @positive-click="onPositiveClickInfo"
    @negative-click="onNegativeClickInfo"
  >
    <n-card>
      <n-h3 style = "margin-bottom: 0px;">{{nowAct.title}}</n-h3>
      <div style = "margin-bottom: 5px;">{{ nowAct.orgName }}</div>
      <n-tag v-for="tag in nowAct.tag" :key="tag" size = "small" round :color="{color: '#6963ed', textColor: 'white'}" style = "margin-right: 5px;" :bordered="false">{{ tag }}</n-tag>
      <div>地点：{{ nowAct.position }}</div>
      <div>简介：{{ nowAct.brief }}</div>
      <div>详情：{{ nowAct.content }}</div>
      <div>推文：{{ nowAct.link }}</div>
      <div>报名链接：{{ nowAct.regLink }}</div>
      <div>时间：{{ nowAct.startText }}~{{ nowAct.endText }}</div>
      <div>人数：{{ nowAct.number }}</div>
      <div>上次审核意见：{{ nowAct.rejectReason }}</div>
      <n-button @click="downloadFile()">下载审核证明</n-button>
    </n-card>
  </n-modal>

  <n-modal
    v-model:show="showModalEdit"
    :mask-closable="false"
    preset="dialog"
    title="退回审核"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onPositiveClickEdit"
    @negative-click="onNegativeClickEdit"
  >
    <n-card>
      <n-h4 style="margin-bottom: 5px;">退回审核理由</n-h4>
      <n-input v-model:value="nowAct.rejectReason" clearable></n-input>
    </n-card>
  </n-modal>

  <n-modal
    v-model:show="showModalAdd"
    :mask-closable="false"
    preset="dialog"
    title="提交后自动审核通过"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onPositiveClickAdd"
    @negative-click="onNegativeClickAdd"
  >
    <n-card>
      <n-h4 style="margin-bottom: 5px;">标题</n-h4>
      <n-input maxlength="10" v-model:value="nowAct.title" show-count clearable></n-input>
      <n-h4 style="margin-bottom: 5px;">组织者</n-h4>
      <n-input maxlength="10" v-model:value="nowAct.orgName" show-count clearable></n-input>
      <n-h4 style="margin: 5px 0px;">标签</n-h4>
      <n-tag v-for="tag in allTags" :key="tag.key" checkable v-model:checked="tag.checked" size = "small" round style = "margin-right: 5px; margin-bottom: 5px; border: 1px solid #6963ed;">{{ tag.key }}</n-tag>
      <n-h4 style="margin: 5px 0px;">地点</n-h4>
      <n-input maxlength="10" v-model:value="nowAct.position" show-count clearable></n-input>
      <n-h4 style="margin: 5px 0px;">简介</n-h4>
      <n-input maxlength="20" v-model:value="nowAct.brief" show-count clearable></n-input>
      <n-h4 style="margin: 5px 0px;">详情</n-h4>
      <n-input maxlength="140" type="textarea" v-model:value="nowAct.content" show-count :autosize="{minRows: 3}"></n-input>
      <n-h4 style="margin: 5px 0px;">推文链接</n-h4>
      <n-input v-model:value="nowAct.link" clearable></n-input>
      <n-h4 style="margin: 5px 0px;">报名链接（无链接留空）</n-h4>
      <n-input v-model:value="nowAct.regLink" clearable></n-input>
      <n-h4 style="margin: 5px 0px;">起止时间</n-h4>
      <n-date-picker v-model:value="nowAct.range" type="datetimerange" clearable/>
      <n-h4 style="margin: 5px 0px;">人数</n-h4>
      <n-input-number v-model:value="nowAct.number" clearable/>
      <n-h4 style="margin: 5px 0px;">审核证明</n-h4>
      <n-upload
        :action="uploadURL"
        @before-upload="beforeUpload"
        accept="image/*"
        :max="1"
        method="PUT"
        @finish="finishUpload"
        @remove="removeFile"
        :with-credentials="true"
      >
        <n-button>上传图片</n-button>
      </n-upload>
    </n-card>
  </n-modal>
</template>

<script setup>
import {
  NCard,
  NButton,
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
  NDatePicker,
  NInputNumber,
  NUpload,
} from "naive-ui";
import { onMounted, reactive, ref, h } from "vue";
import request from "@/common/request";
import { useStore } from "vuex";
const store = useStore();
const dialog = useDialog();
const message = useMessage();

onMounted(async () => {
  try {
    pagination.pageSize = props.lines;
    getList(1);
  } catch (e) {
    console.error(e);
  }
})

const status = ref("Unreviewed");
const formLoading = ref(false);
function handleUpdateValue(value){
  status.value = value;
  getList(1);
}

const cols = ref([
  {
    title: "活动",
    key: "title",
  },
  {
    title: '标签',
    key: 'tag',
    render (row) {
      const tag = row.tag.map((tagKey) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px',
              marginBottom: '5px',
              marginTop: '5px',
            },
            type: 'info',
            bordered: false,
            color: {color: '#6963ed', textColor: 'white'},
            round: true,
          },
          {
            default: () => tagKey
          }
        )
      })
      return tag
    }
  },
  {
    title: "开始时间",
    key: "startTime",
  },
  {
    title: "结束时间",
    key: "endTime",
  },
  {
    title: '详情',
    key: 'showAct',
    render (row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => showAct(row)
        },
        { default: () => '详情' }
      )
    }
  },
]);

const infos = ref([]);
function infoAdapter(list) {
  if (list) {
    infos.value = list.map((act) => {
      const startTime = new Date(act.startTime*1000);
      const endTime = new Date(act.endTime*1000);
      return {
        key: act.id,
        title: act.title,
        tag: act.tag,
        startTime: startTime.toLocaleDateString()+" "+startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleDateString()+" "+endTime.toLocaleTimeString(),
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
      "/activity/list",
      {
        pageSize: pagination.pageSize,
        pageNum: currentPage,
        status: [status.value],
        title: searchText.value,
      },
      "获取活动"
    );
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
      "/activity/list/count",
      {
        status: [status.value],
        title: searchText.value,
      },
      "获取活动数量"
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
const nowAct = ref(null);
async function showAct(row){
  const act = await request("/activity/get?aid=" + row.key, null, "获取活动");
  nowAct.value = act;
  nowAct.value.range = [nowAct.value.startTime*1000, nowAct.value.endTime*1000];
  nowAct.value.startText = row.startTime;
  nowAct.value.endText = row.endTime;
  if(nowAct.value.rejectReason == "") nowAct.value.rejectReason = "无";
  showModal.value = true;
}
function onNegativeClickInfo () {
  showModal.value = false;
  showModalEdit.value = true;
}
async function onPositiveClickInfo () {
  const act = await request("/activity/get?aid=" + nowAct.value.id, null, "获取活动");
  act.status = "Reviewed";
  await request("/admin/activity/update", act, "通过审核");
  getList(pagination.page);
  message.success("通过审核成功");
  showModal.value = false;
}

async function downloadFile(){
  if(parseInt(nowAct.value.oid) == 0){
    message.error("无审核材料");
    return;
  }
  const fileURL = await request("/admin/object/get?oid=" + nowAct.value.oid, null, "下载审核证明");
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = fileURL;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function onNegativeClickEdit () {
  showModalEdit.value = false;
}
async function onPositiveClickEdit () {
  if(nowAct.value.rejectReason == "无" || nowAct.value.rejectReason == ""){
    message.error("请填写审核不通过原因");
    return false;
  }
  const act = await request("/activity/get?aid=" + nowAct.value.id, null, "获取活动");
  act.status = "Rejected";
  act.rejectReason = nowAct.value.rejectReason;
  await request("/admin/activity/update", act, "退回审核");
  getList(pagination.page);
  message.success("退回审核成功");
  showModalEdit.value = false;
}

const uploadURL = ref("");
const oid = ref("");
const oidBefore = ref("");
async function beforeUpload(data){
  const res = await request("/admin/object/add?name=" + data.file.file?.name, null, "获取URL");
  uploadURL.value = res.url;
  oid.value = res.id;
  return true;
}
function finishUpload(data){
  oidBefore.value = nowAct.value.oid;
  nowAct.value.oid = oid.value;
}
function removeFile(data){
  nowAct.value.oid = oidBefore.value;
  return true;
}

const allTags = ref([
  {key: "综素", checked: false},
  {key: "二课", checked: false},
  {key: "体育", checked: false},
  {key: "美育", checked: false},
  {key: "志愿服务", checked: false},
  {key: "社团", checked: false},
  {key: "学生组织", checked: false},
]);
const showModalAdd = ref(false);
function addActivity(){
  nowAct.value = {
    brief: "",
    content: "",
    endTime: 0,
    id: "",
    link: "",
    regLink: "",
    number: null,
    oid: "0",
    orgName: "",
    position: "",
    range: null,
    rejectReason: "",
    startTime: 0,
    status: "UnReviewed",
    tag: [],
    title: "",
  };
  showModalAdd.value = true;
}
function onNegativeClickAdd () {
  showModalAdd.value = false;
  for(let i = 0; i < allTags.value.length; i++){
    allTags.value[i].checked = false;
  }
}
async function onPositiveClickAdd () {
  nowAct.value.tag = [];
  for(let i = 0; i < allTags.value.length; i++){
    if(allTags.value[i].checked) nowAct.value.tag.push(allTags.value[i].key);
  }
  if(nowAct.value.title.length < 2){
    message.error("标题至少两字");
    return false;
  }
  if(nowAct.value.orgName.length < 1){
    message.error("请填写组织者");
    return false;
  }
  if(!nowAct.value.tag.length){
    message.error("需要至少选择一个标签");
    return false;
  }
  if(!nowAct.value.position){
    message.error("请填写地点");
    return false;
  }
  if(nowAct.value.brief.length < 1){
    message.error("请填写简介");
    return false;
  }
  if(nowAct.value.content.length < 1){
    message.error("请填写活动详情");
    return false;
  }
  if(!nowAct.value.range){
    message.error("请选择活动时间");
    return false;
  }
  if(!nowAct.value.number){
    message.error("请输入活动人数");
    return false;
  }
  if(nowAct.value.link == ""){
    message.error("请提供推文链接");
    return false;
  }
  if(parseInt(nowAct.value.oid) == 0){
    message.error("请提供活动学校审核通过证明");
    return false;
  }
  nowAct.value.status = "Reviewed";
  nowAct.value.startTime = nowAct.value.range[0]/1000;
  nowAct.value.endTime = nowAct.value.range[1]/1000;
  nowAct.value.startText = undefined;
  nowAct.value.endText = undefined;
  nowAct.value.range = undefined;
  nowAct.value.rejectReason = "";
  let newAct = JSON.parse(JSON.stringify(nowAct.value));
  await request("/admin/activity/add", newAct, "新建活动");
  message.success("活动已上传");
  getList(pagination.page);
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
