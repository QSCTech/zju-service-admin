<template>
  <div class="container">
    <n-card class="card" hoverable>
      <h2>权小潮后台</h2>
      <n-h3 style="text-align: start">欢迎登录</n-h3>
      <n-form
        ref="loginRef"
        :model="loginInfo"
        :rules="loginRules"
        style="text-align: left"
      >
        <n-form-item path="username" label="账号">
          <n-input
            size="large"
            autofocus
            v-model:value="loginInfo.username"
            placeholder="请输入账号"
          />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            size="large"
            type="password"
            show-password-on="click"
            v-model:value="loginInfo.password"
            placeholder="请输入密码"
            @keyup.enter="login"
          />
        </n-form-item>
      </n-form>
      <n-button type="primary" color = "#635ce6" :round = "true" size="large" :loading="loading" @click="login">
        登录
      </n-button>
      <n-gradient-text gradient = "linear-gradient(270deg, #bcb9f0 0%, #635ce6 80%)">
        <div>
          *申请账号，修改密码等事项
        </div>
        <div>
          请联系浙江大学求是潮邮箱
        </div>
        <div>
          tech@zjuqsc.com
        </div>
      </n-gradient-text>
    </n-card>
    <div class = "rights-text">
      Powered by QSC, all rights reserved
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  NCard,
  NH3,
  NInput,
  useMessage,
  NButton,
  NForm,
  NFormItem,
  NDivider,
  NGradientText,
} from "naive-ui";
import { onMounted, ref } from "vue";

const store = useStore();
const router = useRouter();

window.$message = useMessage();

const message = useMessage();

const windowHeight = ref("0px");

onMounted(() => {
  windowHeight.value = (window.innerHeight - 1).toString() + "px";
});

const loginRef = ref(null);
const loginInfo = ref({
  username: "",
  password: "",
});

const loginRules = ref({
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["input", "blur"],
    },
  ],
});

const loading = ref(false);



function login() {
  loading.value = true;
  loginRef.value?.validate(async (err) => {
    if (err) {
      message.warning("请正确填写登录信息");
      loading.value = false;
    } else {
      try {
        const user = await store.dispatch(
          "login",
          loginInfo.value
        );
        console.log(user);

        router.push("/home/" + user.username + "/activity");

        /*
        if (user.role === "普通医院") {
          await store.dispatch("getHospital");
          router.push("/home/" + user.username + "/normal-stats");
          loading.value = false;
        } else if (user.role === "中心医院") {
          await Promise.all([
            store.dispatch("getHospital"),
            store.dispatch("getHospitalList"),
          ]);
          router.push("/home/" + user.username + "/admin-stats");
          loading.value = false;
        } else if (user.role === "管理机构") {
          await store.dispatch("getHospitalList");
          router.push("/home/" + user.username + "/admin-stats");
          loading.value = false;
        }
        */
      } catch (e) {
        console.error(e);
        loading.value = false;
      }
    }
  });
}
</script>

<style scoped>
.container {
  width: 100%;
  height: v-bind(windowHeight);
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(../static/background.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
}
.card {
  max-width: 380px;
  border-radius: 20px;
}
.n-input {
  text-align: start;
}
.n-button {
  width: 100%;
  margin: 10px 0px 20px 0px;
}
.rights-text{
  color: #625cde;
  position: fixed;
  bottom: 20px;
}
</style>
