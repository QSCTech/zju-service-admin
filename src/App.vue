<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverride"
  >
    <n-message-provider>
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import { NConfigProvider, NMessageProvider, NDialogProvider } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";

export default defineComponent({
  components: {
    NConfigProvider,
    NMessageProvider,
    NDialogProvider,
  },
  setup() {
    return {
      zhCN,
      dateZhCN,
    };
  },
  data() {
    return {
      themeOverride: {
        Checkbox: {
          border: "1px solid #000000",
          borderFocus: "1px solid #000000",
        },
        common: {
          primaryColor: "#6a63f6",
          primaryColorHover: "#635ce6",
          primaryColorPressed: "#1060C9FF",
          primaryColorSuppl: "#635ce6",
        },
      },
    };
  },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
