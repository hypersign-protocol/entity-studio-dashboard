<template>
  <div>
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div style="display:flex">
      <h3 v-if="appList.length > 0" class="mt-4" style="text-align: left;">
        <i class="fa fa-rocket mr-2" aria-hidden="true"></i>Your Applications
      </h3>
      <h4 v-else class="mt-4" style="text-align: left;">Create your first organization!</h4>

      <hf-buttons name="+ Create" style="text-align: right;" class="ml-auto mt-4" @executeAction="openSlider()">
      </hf-buttons>
    </div>
    
    <StudioSideBar :title="edit ? 'Edit Organization' : 'Add Organization'">
      <div class="container">

        <div class="form-group">
          <tool-tip infoMessage="Your Application Name"></tool-tip>
          <label for="orgName"><strong>Name<span style="color: red">*</span>:</strong></label>
          <input type="text" class="form-control" id="orgName" v-model="appModel.appName" aria-describedby="orgNameHelp"
            placeholder="Enter your app name">
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Organization DID"></tool-tip>
          <label for="orgDid"><strong>App Id<span style="color: red">*</span>: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.appId" aria-describedby="orgNameHelp"
            disabled>
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Application Name"></tool-tip>
          <label for="orgName"><strong>App Secret<span style="color: red">*</span>:</strong></label>
          <input type="text" class="form-control" id="orgName" v-model="appModel.appSecret" aria-describedby="orgNameHelp"
            placeholder="Enter your app name" disabled>
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Encrypted Data Vault id"></tool-tip>
          <label for="orgDid"><strong>Encrypted Data Vault<span style="color: red">*</span>: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.edvId" aria-describedby="orgNameHelp"
            disabled>
        </div>

        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your wallet address"></tool-tip>
          <label for="orgDid"><strong>Wallet Address<span style="color: red">*</span>: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.walletAddress" aria-describedby="orgNameHelp"
            disabled>
        </div>

        <div class="form-group" v-if="edit">
          <hf-buttons name="Update" class="btn btn-primary" @executeAction="updateAnApp()"></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" @executeAction="createAnApp()"></hf-buttons>
        </div>
      </div>
    </StudioSideBar>

    <div class="row scroll" v-if="appList.length > 0">
      <div class="col-lg-4" v-for="eachOrg in appList" :key="eachOrg.appId">
        <b-card :title="truncate(eachOrg.appName,20)" tag="article" class="mb-2 eventCard appCard" img-top>
          <img style="float:right;" :src="`${getProfileIcon(eachOrg.appName)}`" class="mr-2" alt="center" width="70px"/>            
          <ul style="list-style-type: none;padding-left: 0px;min-height: 80px;">
            <li>
              <small style="color: #007bff">APP Secret:</small>
              <p class="appSecret" >
                <span @click="copyToClip(eachOrg.appSecret,'APP secret')" title="Copy App Secret">
                  {{truncate(eachOrg.appSecret, 32)}}  
                  <i class="far fa-copy" style="float:right"></i>
                </span>
              </p>
            </li>         
            <!-- <li>
              <small style="color: #007bff">Wallet Address:</small>
              <p class="appSecret" >
                <span @click="copyToClip(eachOrg.walletAddress,'Wallet Address')" title="Copy App Secret">
                  {{truncate(eachOrg.walletAddress, 33)}}  
                  <i class="far fa-copy" style="float:right"></i>
                </span>
              </p>
            </li>          -->
          </ul>
          <footer>
            <div class="form-group row" style="margin-bottom: 0rem;">
              <div class="col-sm-10"></div>
                <div class="pl-2">            
                <span class="ml-3"></span>
                <i class="fas fa-pencil-alt"
                  @click="editOrg(eachOrg.appId)" title="Click to edit the app" style="cursor: pointer"
                ></i>
              </div>
            </div>
          </footer>
        </b-card>
      </div>
    </div>

  </div>
</template>

<style scoped>
.appCard{
  max-width: 30rem; margin-top: 10px; height:13rem
}
.appSecret{
  width: 70%;
  padding: 5px;
  
  font-size: larger;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #99caff;
  padding-right:10px;
}
.appSecret:hover{
  font-weight:bolder;
  background: #f1f1f1;
  border: 1px solid #007bff;
}
.far {
  cursor: pointer;
  color: grey;
  display: inline;
  padding-left: 5px;
}

.container {
  padding: 20px;
  text-align: left;
}

.eventCard {
  border-left: 10px solid var(--ds-background-accent-red-subtler, rgba(241, 179, 25, 0.24));
}

.eventCard:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
  cursor: pointer;
}

.scroll {
  padding-top: 1em;
  overflow: auto;
  height: 490px;
}
</style>

<script>
import HfPopUp from "../components/element/hfPopup.vue";
import StudioSideBar from "../components/element/StudioSideBar.vue";
import UtilsMixin from '../mixins/utils';
import { isEmpty, isValidURL } from '../mixins/fieldValidation'
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from "vue-loading-overlay";
import HfButtons from '../components/element/HfButtons.vue'
import ToolTip from '../components/element/ToolTip.vue'
import messages from '../mixins/messages';
import  { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      appList: state => state.mainStore.appList,
    }),
    ...mapGetters("mainStore", ["getAppByAppId"])
  },
  data() {
    return {
      edit: false,
      flash: null,
      isAdd: true,
      controllerValue: "",
      
      authToken: localStorage.getItem("authToken"),
      fullPage: true,
      isLoading: false,
      isProcessFinished: true,
      
      appModel: {
        appId: "",
        appSecret: "",
        appName:"",
        walletAddress: "",
        edvId: ""
      }
    }
  },
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, ToolTip },
  methods: {
    ...mapActions('mainStore', ['saveAnAppOnServer', 'updateAnAppOnServer']),
    getProfileIcon(name) {
      return "https://avatars.dicebear.com/api/identicon/" + name + ".svg"
    },
    copyToClip(textToCopy, contentType) {
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            this.notifySuccess(
              `${contentType} copied!`
            );
          })
          .catch((err) => {
            this.notifyErr(
              'Error while copying',
              err
            );
          });
      }
    },
    async switchOrg(orgDid) {
      localStorage.setItem('selectedOrg', orgDid)
      this.updateSideNavStatus(true)

      this.selectAnOrg(orgDid)
      this.$router.push({ name: 'playgroundCredential' })
    
      await this.fetchAllOrgDataOnOrgSelect();

      this.$store.commit('playgroundStore/shiftContainer', false)

    },
    openSlider() {
      this.edit = false
      this.clearAll();
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    closeSlider(){
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    editOrg(appId) {
      this.edit = true
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      Object.assign(this.appModel, { ...this.getAppByAppId(appId) })
    },
    async createAnApp() {
      try{
        if (isEmpty(this.appModel.appName)) {
          throw new Error(messages.APPLICATION.INVALID_APP_NAME)
        } 
        this.isLoading = true;
        const t =await this.saveAnAppOnServer({
          appName: this.appModel.appName
        })
        if(t){
          this.closeSlider();
          this.notifySuccess(messages.APPLICATION.APP_CREATE_SUCCESS)
        } else {
          throw new Error('Something went wrong')
        }
      }catch(e){
        this.notifyErr(e.message)
      } finally {
        this.isLoading = false;
      }
    },
    async updateAnApp() {
      try{
        if (isEmpty(this.appModel.appName)) {
          throw new Error(messages.APPLICATION.INVALID_APP_NAME)
        } 
        this.isLoading = true;
        const t = await this.updateAnAppOnServer({...this.appModel})
        if(t){
          this.closeSlider();
          this.notifySuccess(messages.APPLICATION.APP_UPDATE_SUCCESS)
        } else {
          throw new Error('Something went wrong')
        }
      }catch(e){
        this.notifyErr(e.message)
      } finally {
        this.isLoading = false;
      }
    },
    clearAll() {
      this.appModel = {
        appId: "",
        appName: "",
        appSecret: "",
        walletAddress: "",
        edvId: "",
      }
    },
  },
  mixins: [UtilsMixin]
}
</script>

