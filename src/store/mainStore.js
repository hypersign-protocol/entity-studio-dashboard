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
        appList: []
    },
    getters: {
        getAppByAppId: (state) => (appId) =>{
            return state.appList.find(x => x.appId === appId);
        },

    },
    mutations: {
        resetMainStore(state){
            state.appList = [];
        },
        insertAllApps(state, payload){
            state.appList = payload;
        },
        insertAnApp(state, payload) {
            if (!state.appList.find(x => x.appId === payload.appId)) {
                state.appList.unshift(payload);
            } else {
                console.log('already exists appId id =' + payload.appId);
                this.commit('updateAnApp', payload);
            }
        },
        updateAnApp(state,payload) {
            const tempToUpdateIndex = state.appList.findIndex(x => x.appId === payload.appId);
            Object.assign(state.appList[tempToUpdateIndex], {...payload});
        },
    },
    actions: {
        saveAnAppOnServer: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                const url = `${apiServerBaseUrl}/app`;
                // TODO: // use proper authToken
                const headers = UtilsMixin.methods.getHeader('xyz');
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                }).then(response => response.json()).then(json => {
                    commit('insertAnApp', json);
                    resolve(json)
                }).catch((e) => {
                    reject(new Error(`while updating an app  ${e}`))
                })
            })
        },
        updateAnAppOnServer: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                const { appId } = payload;
                if(!appId) {
                    reject(new Error(`appId is not specified`))
                }
                const url = `${apiServerBaseUrl}/app/${appId}`;
                // TODO: // use proper authToken
                const headers = UtilsMixin.methods.getHeader('xyz');
                fetch(url, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload)
                }).then(response => response.json()).then(json => {
                    // TODO: remoe this dummy app secret..
                    // if(!json.appSecret){
                    //     json.appSecret = "71bf4ff7-2848-4546-9dd2-90a2140b5ff1"
                    // }
                    commit('updateAnApp', json);
                    resolve(json)
                }).catch(e => {
                    reject(new Error(`while updating an app   ${e}`))
                })
            })
            
        },
        fetchAppsListFromServer: ({commit }) => {
            console.log('inside fetchAppsListFromServer .... ')
            // TODO: Get list of orgs 
            const url = `${apiServerBaseUrl}/app`;
            // TODO: // use proper authToken
            const headers = UtilsMixin.methods.getHeader('xyz');
            fetch(url, {
                headers
            }).then(response => response.json()).then(json => {
                commit('insertAllApps', json);
            }).catch((e) => {
                console.error(`Error while fetching apps ` + e.message);
            })
        }
    }
}

export default mainStore;
