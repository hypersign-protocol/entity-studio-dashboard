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
        appList: [],
        totalAppCount: 0,
    },
    getters: {
        getAppByAppId: (state) => (appId) =>{
            console.log(appId);
            return state.appList.find(x => x.appId === appId);
        },
    },
    mutations: {
        resetMainStore(state){
            state.appList = [];
        },
        insertAllApps(state, payload){
            state.appList = payload.data;
            state.totalAppCount = payload.totalAppCount;
        },
        insertAnApp(state, payload) {
            if (!state.appList.find(x => x.appId === payload.appId)) {
                state.appList.unshift(payload);
            } else {
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

                // Sanatize the payload
                // payload = UtilsMixin.methods.removeEmpty(payload);
                console.log(payload)
                
                // TODO: // use proper authToken
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(json => {
                    
                    if(json.error) {
                        reject(json)
                    }

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
                console.log(payload.whitelistedCors);

                // TODO: // use proper authToken
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                delete payload.edvId
                delete payload.apiKeyScecret
                
                // Sanatize the payload
                // payload = UtilsMixin.methods.removeEmpty(payload);
                
                fetch(url, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(payload)
                }).then(response => {                    
                    return response.json()
                }).then(json => {

                    if(json.error) {
                        reject(json)
                    }

                    commit('updateAnApp', json);
                    resolve(json)
                }).catch(e => {
                    reject(new Error(`while updating an app   ${e}`))
                })
            })
            
        },
        fetchAppsListFromServer: ({commit }) => {
            // TODO: Get list of orgs 
            const url = `${apiServerBaseUrl}/app`;
            // TODO: // use proper authToken
            const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
            fetch(url, {
                headers
            }).then(response => response.json()).then(json => {
                if(json.error) {
                    reject(json)
                }
                commit('insertAllApps', json);
            }).catch((e) => {
                console.error(`Error while fetching apps ` + e.message);
            })
        },
        generateAPISecretKey: ({ commit }, payload) => {
            return new Promise((resolve, reject) => {
                const { appId } = payload;
                if(!appId) {
                    reject(new Error(`appId is not specified`))
                }
                const url = `${apiServerBaseUrl}/app/${appId}/secret/new`;
                
                // TODO: // use proper authToken
                const headers = UtilsMixin.methods.getHeader(localStorage.getItem('authToken'));
                fetch(url, {
                    method: 'POST',
                    headers,
                })
                .then(response => response.json())
                .then(json => {
                    
                    if(json.error) {
                        reject(json)
                    }
                    resolve(json)
                }).catch((e) => {
                    reject(new Error(`while generating new secret key app  ${e}`))
                })
            })
        },
    }
}

export default mainStore;
