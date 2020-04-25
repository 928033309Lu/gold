const screen = {
  state: {
    screenWidth: null,
    loadingObj: {
      loading: null,
      text: '拼命加载中，请稍后...'
    }
  },
  mutations: {
    setScreen (state, data) {
      state.screenWidth = data
    },
    setLoading (state, data) {
      state.loadingObj.loading = data.loading
      if (data.text) {
        state.loadingObj.text = data.text
      }
      // console.log(state.loadingObj.loading)
    }
  },
  actions: {
    handleResize ({ commit, state }, data) {
      commit('setScreen', data)
    },
    handleLoading ({ commit, state }, data) {
      commit('setLoading', data)
    }
  }
}

export default screen
