<template>
  <div>

    <div style="display:flex">
      <h3 v-if="orgList.length > 0" class="mt-4" style="text-align: left;">
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
          <tool-tip infoMessage="Your wallet address"></tool-tip>
          <label for="orgDid"><strong>Wallet Address<span style="color: red">*</span>: </strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="appModel.walletAddress" aria-describedby="orgNameHelp"
            disabled>
        </div>

        <div class="form-group" v-if="edit">
          <hf-buttons name="Update" class="btn btn-primary" @executeAction="createAnOrg()"></hf-buttons>
        </div>
        <div class="form-group" v-else>
          <hf-buttons name="Save" @executeAction="createAnOrg()"></hf-buttons>
        </div>
      </div>
    </StudioSideBar>

    <div class="row scroll" v-if="appList.length > 0">
      <div class="col-lg-4" v-for="eachOrg in appList" :key="eachOrg.appId">

        <b-card :title="truncate(eachOrg.appName,20)" tag="article" 
          style="max-width: 30rem; margin-top: 10px; height:13rem" class="mb-2 eventCard" img-top>
          <img style="float:right;" :src="`${getProfileIcon(eachOrg.appName)}`" class="mr-2" alt="center" width="70px"/>            
          <ul style="list-style-type: none;padding-left: 0px;min-height: 80px;">
            <li>
              <small style="color: #007bff">API Secret:</small>
              <p class="appSecret" >
                <span @click="copyToClip(eachOrg.appSecret,'APP secret')" title="Copy App Secret">
                  {{truncate(eachOrg.appSecret, 35)}}  
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
import validator from 'validator';
import Loading from "vue-loading-overlay";
import HfButtons from '../components/element/HfButtons.vue'
import ToolTip from '../components/element/ToolTip.vue'
import messages from '../mixins/messages';
import  { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      appList: state => state.mainStore.appList,
      orgList: state => state.playgroundStore.orgList,
    }),
    ...mapGetters("mainStore", ["getAppByAppId"])
  },
  data() {
    return {
      edit: false,
      flash: null,
      isAdd: true,
      controllerValue: "",
      orgStore: {
        name: "Hypermine Pvt Ltd",
        domain: "hypermine.in",
        network: "Jagrat",
        orgDid: "",
        userDid: "",
        status: "",
        controller: [],
      },
      authToken: localStorage.getItem("authToken"),
      isLoading: true,
      isProcessFinished: true,
      images: {
        greentick: require("../assets/green-tick.png"),
        redcross: require("../assets/red-cross.png"),
        loader: require("../assets/small-loader.gif"),
      },
      appModel: {
        appId: "",
        appSecret: "",
        appName:"",
        walletAddress: ""
      }
    }
  },
  components: { HfPopUp, Loading, StudioSideBar, HfButtons, ToolTip },
  methods: {
    ...mapActions('playgroundStore', ['fetchAllOrgDataOnOrgSelect']),
    ...mapMutations('playgroundStore', ['updateSideNavStatus', 'selectAnOrg']),
    selectController(id) {
      this.isAdd=false
      this.flash = id
    },
    deleteController(){
      this.orgStore.controller.splice(this.flash, 1)
      this.flash = null
      this.isAdd=true
    }
    ,
    cancelController(){
      this.flash = null
      this.isAdd=true
    
    },
    addController() {
      this.isAdd = true
      this.orgStore.controller.push(this.controllerValue)
      this.controllerValue = ""
    },
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
    editOrg(appId) {
      this.edit = true
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
      Object.assign(this.appModel, { ...this.getAppByAppId(appId) })
    },
    createAnOrg() {
      if (isEmpty(this.orgStore.name)) {
        return this.notifyErr(messages.ORGANIZATION.ORGANIZATION_NAME_EMPTY)
      } else if (isValidURL(this.orgStore.name)) {
        return this.notifyErr(messages.ORGANIZATION.INVALID_ORG_NAME)
      } else if (isEmpty(this.orgStore.domain)) {
        return this.notifyErr(messages.ORGANIZATION.DOMAIN_NAME_EMPTY)
      } else if (!this.orgStore.domain.includes('http://localhost') && !validator.isURL(this.orgStore.domain)) {
        return this.notifyErr(messages.ORGANIZATION.INVALID_DOMAIN_NAME)
      }
      try {
        this.orgStore.controller = this.orgStore.controller.split(',')
      } catch (e) {
        this.orgStore.controller = this.orgStore.controller
      }
      let url
      let method
      if (this.edit) {
        method = "PUT"
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`

      } else {
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`
        method = "POST"

      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
      this.orgStore.userDid = JSON.parse(localStorage.getItem("user")).id

      const body = { orgData: this.orgStore }

      this.isLoading = true;
      fetch(url, {
        method,
        body: JSON.stringify(body),
        headers,
      }).then((res) => res.json())
        .then((j) => {

          const { org } = j.data

          let QR_DATA = j.data.QrData
          let URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`

          if (j.error === false) {
            if (!this.edit) {
              this.$store.commit('playgroundStore/insertAnOrg', j.data.org);
              this.$store.commit('playgroundStore/selectAnOrg', j.data.org._id)
              this.isProcessFinished = true;
              this.openSlider();

              this.notifySuccess("Org Created successfull");
            }

            if (this.edit === true) {
              this.$store.commit('playgroundStore/updateAnOrg', j.data.org)
              this.notifySuccess("Org Edited successfull");
              this.$root.$emit("bv::toggle::collapse", "sidebar-right");
            }
          }


        }).catch((e) => {
          console.log(e);
          this.notifyError("Something went wrong");
        }).finally(() => {
          this.isLoading = false;
        })

      // TODO: Implement API to create an organization

      // TODO: Make a POST request to ORG API
      // Once the ORG is created just store the org in store
      //this.$store.commit('insertAnOrg', payload);
      // Close the sideba
    },
    clearAll() {
      this.appModel = {
        appId: "",
        appName: "",
        appSecret: "",
        walletAddress: ""
      }
    },
  },
  mixins: [UtilsMixin]
}
</script>

