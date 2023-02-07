import Vue from 'vue';
import Vuex from 'vuex';
import playgroundStore from './store';
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        playgroundStore
    }
})

