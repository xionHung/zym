var timer = null;
const match = {
  namespaced: true,
  timer: null,
  timer1: null,
  closeTimer: null,
  state: {
    isShow: false,
    type: 1,
    times: 10,
    data: {},
    friend: {},
    msgList: [],
    isLaunch: false,
  },
  mutations: {
    SET_ISSHOW(state, data) {
      state.isShow = data;
    },
    SET_TYPE(state, data) {
      state.type = data;
    },
    SET_DATA(state, data) {
      state.data = { ...data };
    },
    SET_FRIEND(state, data) {
      state.friend = { ...data };
    },
    SET_LIST(state, data) {
      state.msgList = data;
    },
    SET_TIMES(state, data) {
      state.times = data;
    },
    PUSH_LIST(state, data) {
      let d = JSON.parse(JSON.stringify(state.msgList))
      d.push(JSON.parse(JSON.stringify(data)))
      state.msgList = d;
    },
    POP_LIST(state) {
      let d = JSON.parse(JSON.stringify(state.msgList))
      d.shift();
      state.msgList = d;
    },
    SET_ISLAUNCH(state, data) {
      state.isLaunch = data;
    },
  },
  actions: {
    getLaunchStatus({ commit }, data) {
      commit('SET_ISLAUNCH', data);
    },
    // 显示、添加
    show({ commit }, data) {
      // console.log(getCurrentPages(), 'pages-------------')
      if (!this.state.match.isLaunch || data.type !== 'match' || data.payload.from !== 'match') return;
      let o = this.state.match.msgList.find(o => o.senderId === data.senderId);
      if (o) return;
      commit('PUSH_LIST', data);
      if (this.state.match.msgList.length == 1) {
        commit('SET_ISSHOW', true);
        commit('SET_DATA', data);
      }
      this.dispatch('match/autoHide');
    },
    // 自动关闭检测
    autoHide({ commit }, t = 10) {
      if (!this.timer) {
        this.dispatch('match/countDown');
        this.timer = setTimeout(() => {
          this.timer = null;
          commit('POP_LIST');
          commit('SET_ISSHOW', false);
          if (this.state.match.msgList.length == 0) {
          } else {
            let d = JSON.parse(JSON.stringify(this.state.match.msgList))
            setTimeout(() => {
              commit('SET_ISSHOW', true);
              commit('SET_DATA', d[0]);
              this.dispatch('match/autoHide');
            }, 300)
          }
        }, t * 1000)
      }
    },
    // 获取目标用户信息
    async findUser({ commit }) {
      let res = await getApp().globalData.$api.User.findUser({ userId: this.state.match.data.senderId })
      if (res.data.code === 0) {
        commit('SET_FRIEND', res.data.result);
      }
    },
    // 倒计时
    countDown({ commit }) {
      commit('SET_FRIEND', {});
      this.dispatch('match/findUser');
      if (this.timer1) clearInterval(this.timer1);
      let t = 10;
      commit('SET_TIMES', t)
      this.timer1 = setInterval(() => {
        commit('SET_TIMES', --t)
        if (t <= 0) clearInterval(this.timer1);
      }, 1000);
    },
    hide({ commit }, data) {
      commit('SET_ISSHOW', false);
      // commit('SET_DATA', {});
    },
    close({ commit }) {
      commit('SET_ISSHOW', false);
      clearTimeout(this.timer);
      this.timer = null;
      if (this.closeTimer) clearTimeout(this.closeTimer);
      this.closeTimer = setTimeout(() => {
        this.dispatch('match/autoHide', 0);
      }, 300)
    },
    closeAll({ commit }, data) {
      console.log(data, 11111)
      commit('SET_LIST', []);
      this.dispatch('match/hide');
      if (timer) clearTimeout(timer);
    }
  }
};
// function autoHiden() { }
export default match;
