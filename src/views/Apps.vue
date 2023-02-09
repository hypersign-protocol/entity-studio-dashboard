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
    
    <StudioSideBar :title="edit ? 'Edit Application' : 'Add Application'">
      <div class="container">
        <div v-if="(edit === true) && appModel.apiKeySecret !=''" @click="onHfFlashClick()">
          <HfFlashNotification :text='`${appModel.apiKeySecret}`' type='Application Secret' description="Your Application Secret Key. Make sure to copy it."></HfFlashNotification>
        </div>

        <!-- <div style="margin-bottom: 20px;" v-if="errorMessages && errorMessages.length > 0" >
          <div v-for="m in errorMessages">
            <HFErrorMessages :message="m"></HFErrorMessages>
          </div>
        </div> -->
        
        <div class="form-group" v-if="edit === true">
          <tool-tip infoMessage="Your Application Id"></tool-tip>
          <label for="orgDid"><strong>Application Id<span style="color: red">*</span>: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.appId" aria-describedby="orgNameHelp"
            disabled>
        </div>


        <div class="form-group">
          <tool-tip infoMessage="Name of the application, upto 20 chars"></tool-tip>
          <label for="orgName"><strong>Name<span style="color: red">*</span>:</strong></label>
          <input type="text" class="form-control" id="orgName" v-model="appModel.appName"
            placeholder="Enter name of your app">
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Give a description for application, upto 100 chars"></tool-tip>
          <label for="orgName"><strong>Description:</strong></label>
          <textarea class="form-control" v-model="appModel.description" rows="3" placeholder="Enter meaningful description for your app, max 300 chars"></textarea>
        </div>

        <div class="form-group">
          <tool-tip infoMessage="Logo URL, recomended size 160*160"></tool-tip>
          <label for="orgName"><strong>Logo URL:</strong></label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1"><i class="fa fa-link"></i></span>
            </div>
            <input type="text" class="form-control" v-model="appModel.logoUrl"  placeholder="https://path-to-my-logo.png" aria-label="Username" aria-describedby="basic-addon1"> 
          </div>
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

        

        <div class="form-group">
          <tool-tip infoMessage="Listed origins allowed to make CORS requests. Enter comman seperated URLs to whitelist"></tool-tip>
          <label for="orgName"><strong>Allowed Origins (CORS):</strong></label>
          <textarea class="form-control" v-model="appModel.whitelistedCors" rows="3" placeholder="*, http://your-domain.com, http://test.com"></textarea>
        </div>

        
        

        <!-- <div class="form-group" v-if="(edit === true) && appModel.apiKeySecret !=''">
          <tool-tip infoMessage="Your Application Secret. Make sure to copy it."></tool-tip>
          <label for="orgName"><strong>App Secret<span style="color: red">*</span>:</strong></label>
          <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="appModel.apiKeySecret" aria-label="Recipient's username" aria-describedby="basic-addon2" disabled style="background-color: #e6ffec;">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2" @click="copyToClip(appModel.apiKeySecret,'Appliction Secret', true)"><i class="far fa-copy"></i></span>
            </div>
          </div>
        </div> -->
        
       

        <div class="form-group" v-if="edit">
          <hf-buttons name="Update" class="btn btn-primary" @executeAction="updateAnAppAPIServer()"></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" @executeAction="createAnApp()"></hf-buttons>
        </div>
      </div>
    </StudioSideBar>

    <div class="row scroll" v-if="appList.length > 0">
      <div class="col-lg-4" v-for="eachOrg in appList" :key="eachOrg.appId">
        <b-card :title="truncate(eachOrg.appName,20)" tag="article" class="mb-2 eventCard appCard" img-top>
          <img style="float:right;" :src="`${eachOrg.logoUrl}`" class="mr-2" alt="center" width="70px"/>            
          <ul style="list-style-type: none;padding-left: 0px;min-height: 80px;">
            <li>
              <small style="color: #007bff">Application Id:</small>
              <p class="apiKeySecret" >
                <span @click="copyToClip(eachOrg.appId,'Application Id')" title="Copy Application Id">
                  {{truncate(eachOrg.appId, 32)}}  
                  <i class="far fa-copy" style="float:right"></i>
                </span>
              </p>
            </li>         
            <li>
              <small style="color: #007bff">Wallet Address:</small>
              <p class="apiKeySecret" >
                <span @click="copyToClip(eachOrg.walletAddress,'Wallet Address')" title="Copy App Secret">
                  {{truncate(eachOrg.walletAddress, 33)}}  
                  <i class="far fa-copy" style="float:right"></i>
                </span>
              </p>
            </li>         
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

    <!-- <div style="    padding: 5px;">
      <nav aria-label="Page navigation example" style="margin: 0 auto; width: 50px;">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </a>
          </li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    </div> -->

  </div>
</template>

<style scoped>
.appCard{
  max-width: 30rem; margin-top: 10px; height:13rem;
  min-height: 100px;
}
.apiKeySecret{
  width: 70%;
  padding: 5px;
  
  font-size: larger;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #99caff;
  padding-right:10px;
}
.apiKeySecret:hover{
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
import HfFlashNotification from "../components/element/HfFlashNotification.vue"; 
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
        apiKeySecret: "",
        appName:"",
        walletAddress: "",
        edvId: "",
        description: "",
        whitelistedCors: [],
        logoUrl: "",
      }
    }
  },
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, ToolTip, HfFlashNotification },
  methods: {
    ...mapMutations('mainStore', ['updateAnApp']),
    ...mapActions('mainStore', ['saveAnAppOnServer', 'updateAnAppOnServer']),
    getProfileIcon(name) {
      return "https://avatars.dicebear.com/api/identicon/" + name + ".svg"
    },
    onHfFlashClick(){
      this.appModel.apiKeySecret = "";
      this.updateAnApp(this.appModel)
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
      this.clearAll()
    },
    editOrg(appId) {
      this.edit = true
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      Object.assign(this.appModel, { ...this.getAppByAppId(appId) })
    },
    validateFields(){
      const m = [];
      const isAppNameEmpty = isEmpty(this.appModel.appName);
      if (isAppNameEmpty) {
        m.push(messages.APPLICATION.INVALID_APP_NAME)
      }

      if(!isAppNameEmpty && (this.appModel.appName.length < 5)){
        m.push(messages.APPLICATION.CHAR_LESS_APP_NAME)
      }

      if(!isAppNameEmpty && this.appModel.appName.length > 50){
        m.push(messages.APPLICATION.CHAR_EXCEED_APP_NAME)
      }

      const isAppDescriptionEmpty = isEmpty(this.appModel.description);
      if(!isAppDescriptionEmpty && (this.appModel.description.length < 20)){
        m.push(messages.APPLICATION.CHAR_LESS_APP_DES)
      }

      if(!isAppDescriptionEmpty && (this.appModel.description.length > 100)){
        m.push(messages.APPLICATION.CHAR_EXCEED_APP_DES)
      }
      return {
        message: m
      };
    },
    async createAnApp() {
      try{
        const errorMessages = this.validateFields(); 
        if(errorMessages && errorMessages.message.length > 0){
          throw errorMessages;
        }

        this.isLoading = true;
        const t =await this.saveAnAppOnServer({
          appName: this.appModel.appName,
          whitelistedCors: this.appModel.whitelistedCors != '' ? this.appModel.whitelistedCors.split(',').filter(x => x != " "): [],
          description: this.appModel.description,
          logoUrl: this.appModel.logoUrl
        })
        if(t){
          Object.assign(this.appModel, { ...t })
          this.edit = true;
          this.notifySuccess(messages.APPLICATION.APP_CREATE_SUCCESS)
        } else {
          throw new Error('Something went wrong')
        }
      }catch(e){
        if(Array.isArray(e.message)){
          e.message.forEach(m => {
            this.notifyErr(m)      
          })
          return;
        }
        this.notifyErr(e.message)
      } finally {
        this.isLoading = false;
      }
    },
    async updateAnAppAPIServer() {
      try{

        const errorMessages = this.validateFields(); 
        if(errorMessages && errorMessages.message.length > 0){
          throw errorMessages;
        }

        this.isLoading = true;
        const t = await this.updateAnAppOnServer({
          appName: this.appModel.appName,
          whitelistedCors: this.appModel.whitelistedCors != '' ? this.appModel.whitelistedCors.split(',').filter(x => x != " "): [],
          description: this.appModel.description,
          logoUrl: this.appModel.logoUrl
        })
        if(t){
          this.closeSlider();
          this.notifySuccess(messages.APPLICATION.APP_UPDATE_SUCCESS)
        } else {
          throw new Error('Something went wrong')
        }
      }catch(e){
        if(Array.isArray(e.message)){
          e.message.forEach(m => {
            this.notifyErr(m)      
          })
          return;
        }
        this.notifyErr(e.message)
      } finally {
        this.isLoading = false;
      }
    },
    clearAll() {
      this.appModel = {
        appId: "",
        appName: "",
        apiKeySecret: "",
        walletAddress: "",
        edvId: "",
        whitelistedCors: [],
        logoUrl: "",
      }
    },
  },
  mixins: [UtilsMixin]
}
</script>

