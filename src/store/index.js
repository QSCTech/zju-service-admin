import request from "@/common/request";
import { createStore } from "vuex";

export default createStore({
  state: {
    loginUser: {},
    appAmount: 0,
  },
  mutations: {
    setLoginUser(state, user) {
      state.loginUser = user;
    },
    setAppAmount(state, amount) {
      state.appAmount = amount;
    },
    clear(state) {
      (state.loginUser = {});
    },
  },
  actions: {
    async login({ commit }, loginInfo) {
      try {
        console.log("login");
        const user = await request(
            "/admin/login",
            loginInfo,
            "登录"
          );
        console.log(user);
        commit("setLoginUser", user);
        return user;
      } catch (e) {
        throw e;
      }
    },
  },
});
