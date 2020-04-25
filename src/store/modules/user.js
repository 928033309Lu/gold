import envConfig from '@/config/env-config.js'
import { removeToken, getLocal, getToken, removeLocal } from '@/utils/auth'

const user = {
  state: {
    userInfo: {},
    token: getToken(),
  },
  mutations: {
    set_user (state, data) {
      state.userInfo = data
    },
    clear_user (state, data) {
      state.userInfo = {}
    }
  },
  actions: {
    // 前端 登出
    FedLogOut ({ commit, state, rootState }) {
      return new Promise((resolve, reject) => {
        removeToken()
        removeLocal(envConfig.appTitle + '-user')
        console.log('清空数据中...')
        rootState.app.projectInfo = null // 用户信息
        rootState.earthFan.clickEarthFan = null // 地球弹框
        commit('clear_user')
        // xxxxxx // 调方法返回地球首页
        resolve('ok')
        console.log('清空OK')
      })
    },
    // 登录后设置
    setUser ({ commit, state, rootState }, data) {
      rootState.app.projectInfo = null // 用户信息
      commit('set_user', data)
    }
  }
}

export default user
