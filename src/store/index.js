import Vue from 'vue';
import Vuex from 'vuex';
import playgroundStore from './playgroundStore';
import mainStore from './mainStore';
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        playgroundStore,
        mainStore,
    }
})

