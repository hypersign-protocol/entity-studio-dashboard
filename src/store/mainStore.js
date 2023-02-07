import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config'
import UtilsMixin from '../mixins/utils.js'

const { apiServer }  = config;
const apiServerBaseUrl = apiServer.host + apiServer.basePath;
Vue.use(Vuex)

const mainStore = {
    namespaced: true,
    mixin: [UtilsMixin],
    state: {
        appList: [
            {
              "appName": "demo app",
              "appId": "93cda113-66ba-4ac5-9055-aaa32d42e72c",
              "edvId": "hs:apiservice:edv:6bdcbcfd-a998-4959-93b2-278f0ac76915",
              "walletAddress": "hid1a7up029duz8aghq50cflzadcuaxxejp4pzyuy0",
              "appSecret": "71bf4ff7-2848-4546-9dd2-90a2140b5ff1",
            },
            {
              "appName": "demo app2",
              "appId": "0c06ea65-2a8e-4911-bca8-105300ee72a5",
              "edvId": "hs:apiservice:edv:69709a85-afc1-410f-8c03-f5b177931d8b",
              "walletAddress": "hid1wuzcm2r00p6c4545g9zxea87s6j8392hnx0yq4",
              "appSecret": "71bf4ff7-2848-4546-9dd2-90a2140b5ff1",
            }
          ]
    },
    getters: {
        getAppByAppId: (state) => (appId) =>{
            return state.appList.find(x => x.appId === appId);
        },

    },
    mutations: {},
    actions: {}
}

export default mainStore;
