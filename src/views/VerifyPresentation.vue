<style scoped>

h5 {
  width: 80%;
  text-align: center;
  border-bottom: 1px solid #80808045;
  line-height: 0.1em;
  margin: 10px 0 20px;
  display: inline-block;
}

h5 span {
  background: #fff;
  padding: 0 10px;
}

.button-theme {
 background-color: #f1b319;
  border-collapse: #f1b319;
  color: black;
  border: 0;
}

.leafygreen-ui-196mwvg {
  border: 1px solid rgb(232, 237, 235);
  border-radius: 12px;
  overflow: hidden;
}

.leafygreen-ui-mlc9qv {
  position: relative;
  display: grid;
  grid-template-areas:
  "code panel";
  grid-template-columns: auto 38px;
  border-radius: inherit;
  z-index: 0;
}

.css-1sdjnkx {
  word-break: break-word;
}

.leafygreen-ui-vbfbru {
  grid-area: code;
  overflow-x: auto;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border: 0px none rgb(232, 237, 235);
  /* padding-top: 8px;
  padding-bottom: 8px; */
  margin: 0px;
  position: relative;
  transition: box-shadow 100ms ease-in-out 0s;
  white-space: pre;
  background-color: rgb(249, 251, 250);
  color: rgb(0, 30, 43);
}

.leafygreen-ui-y7nvfm {
  color: inherit;
  font-family: "Source Code Pro", Menlo, monospace;
  line-height: 12px;
  font-size: 13px;
}


.leafygreen-ui-16sacod {
  display: flex;
  -moz-box-align: center;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  padding: 6px;
  border-left: 1px solid rgb(232, 237, 235);
    border-left-color: rgb(232, 237, 235);
  background-color: rgb(255, 255, 255);
  border-color: rgb(232, 237, 235);
  z-index: 2;
  grid-area: panel;
}

</style>

<template>
    <div :class="isContainerShift ?'homeShift':'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
        <div class="col-md-12" style="text-align: left">
            <div class="form-group" style="display:flex">
                <h3 class="mt-4" style="text-align: left;">
                Credential Verification</h3>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-4">
            <div class="form-group">
                <label>Select a presentation template: </label> 
                <hf-select-drop-down
                    :options="selectOptions"
                    @selected="e =>{OnTemplateSelectDropDownChange(e)}"
                ></hf-select-drop-down>
            </div>  
            <div class="form-group">
                <label>Or Enter a presentation template Id : </label> 
                <input  class="form-control" type="text" name="" v-model="presentantionTemplateId" placeholder="63c518ec4eca295bd017bf57" />
            </div>
            <div class="">
                <hf-buttons 
                    name="Request"
                    class="ml-auto mt-4"
                    @executeAction="requestPresentation()"
                ></hf-buttons>
            </div>
                     
        </div>

        <div class="col-md-4" v-if="presentantionTemplateId != '' && showQR">
            <div class="leafygreen-ui-196mwvg">
                <div class="leafygreen-ui-mlc9qv">
                    <pre class="css-1sdjnkx e5i1odf0 leafygreen-ui-vbfbru" tabindex="-1">
                        <code class="lg-highlight-hljs-light none leafygreen-ui-y7nvfm">
                            {{ getCodeSnippet }}
                        </code>
                    </pre>
                    <div class="leafygreen-ui-16sacod" data-testid="leafygreen-code-panel">
                        <i class="far fa-copy"
                            style="cursor:pointer;"
                            title="Click to copy the code snippet"
                            @click="copyToClip(getCodeSnippet,'code snippet')"
                        ></i>
                    </div>
                </div>
            </div>
            <div style="text-align: center;">
                <label style="font-size:small; color:grey;">Read our <a href="https://docs.hypersign.id" target="_blank">documentation </a> for integration</label>
            </div>
        </div>

        <div class="col-md-4" v-if="presentantionTemplateId != '' && showQR">
            <div class="justify-content-center" style="text-align: center;">
                <canvas id="studio-qr"></canvas>
                <label style="font-size:small; color:grey;">Scan the QR code using Hypersign Identity Wallet</label>
                <div class="justify-content-center" style="text-align: center;"><h5><span>OR</span></h5></div>
                <div id="studio-btn" class="justify-content-center" style="text-align: center;"></div>
            </div>           
        </div> 
    </div>

    <div id="load-script"></div>

    <hf-pop-up  Header="Verification Result">
        <div class="card" v-for="eachcredential in verfiableCredentials">
            <div class="card-header">
                <span>{{eachcredential.type[1]}}</span>
                <span class="card-title" style="float:right">
                    <img :src="images.greentick" height="21" width="21"/>
                </span>
            </div>
            <div class="card-body">
                Issuer: {{ eachcredential.issuer }}
                <div class="" v-for="eachSubjectField in Object.keys(eachcredential.credentialSubject)">
                    <span>{{eachSubjectField}} : {{eachcredential.credentialSubject[eachSubjectField]}}</span>
                </div>
            </div>
            <!-- <div class="card-footer"></div> -->
        </div>
    </hf-pop-up>


    
    </div>
</template>

<script>
import UtilsMixin from '../mixins/utils';
import HfPopUp from "../components/element/hfPopup.vue";
import Loading from "vue-loading-overlay";
import HfSelectDropDown from "../components/element/HfSelectDropDown.vue"
import VueQr from "vue-qr";
import HfButtons from "../components/element/HfButtons.vue"
import EventBus from "../eventbus"
export default {
    name: "VerifyPresentation",
    components: { HfPopUp, Loading, VueQr, HfButtons, HfSelectDropDown }, 
    computed:{
        isContainerShift() {
            return this.$store.state.containerShift
        },
        selectOptions(){
            return this.$store.getters.listOfPresentationTemplateOptions;
        },
        getCodeSnippet(){
        return `
                <div>
                    <div id='studio-btn'><\/div>
                    <canvas id='studio-qr'><\/canvas>
                    <script
                        type="text/javascript"
                        src="https://cdn.jsdelivr.net/gh/hypersign-protocol/studio/js-sdk/build/index.js"
                        data-button-text="Present Presentation"
                        data-button-css-class="btn btn-primary"
                        data-presentation-template-id="${this.presentantionTemplateId}"
                    ><\/script>
                <\/div>
                `;  
        }
    },
    mounted() {
        
        const that = this;
        
        document.addEventListener('studio-success', async function (e) {
            console.log('inside studio-success')
            if (e.detail.accessToken) {
                console.log(e.detail.accessToken)
                const url = 'https://stage.hypermine.in/studioserver/api/v1/presentation/request/info';
                const accessToken = e.detail.accessToken;
                const resp =  await fetch(url, { 
                    headers: { accessToken },
                    method: 'GET'
                });

                const json =  await resp.json();

                console.log(json)
                const { message, data } = json;
                if(message == 'success' &&  data != null){
                    that.verfiableCredentials = data.verifiableCredential;
                    EventBus.$emit("resetOption",that.presentantionTemplateId)
                    that.presentantionTemplateId = ""
                    that.showQR = false;
                    that.qrData = "";
                    that.$root.$emit('modal-show');
                } else {
                    console.log('Else  message =' +  message)
                }
            } else {
                console.error('No access token found')
            }
        });

        document.addEventListener('studio-wait', function (e) {
            console.log('inside studio-wait')
            console.log(e.detail);
        });

        document.addEventListener('studio-error', function (e) {
            console.log('inside studio-error')
            console.error(e.detail);
        });
    },  
    data() {
        return {
            showQR: false,
            presentantionTemplateId: "",
            fullPage: true,
            isLoading: false,
            authToken: localStorage.getItem("authToken"),
            qrData: "",
            verfiableCredentials: null,
            images: {
                greentick: require("../assets/green-tick.png"),
            }
        }
    },
    methods: {
        OnTemplateSelectDropDownChange(event) {
            if (event) {     
                console.log('inside event of OnTemplateSelectDropDownChange eventvalue = '+ event.value)
                this.presentantionTemplateId = event
            } else {
                this.presentantionTemplateId = ""
                this.showQR = false;
                this.qrData = ""
            }
        },
        requestPresentation(){
            if(!this.presentantionTemplateId){
                return  this.notifyErr('Select a presentation or enter presentationId')
            }
            

            this.showQR = true;
            let divScripts = document.getElementById('load-script');
            if(divScripts){
                let newScript = document.createElement('script');
                newScript.setAttribute('src', '/hs-sdk.js')
                newScript.setAttribute('data-button-text', 'Present Credential')
                newScript.setAttribute('data-button-css-class', 'btn button-theme')
                newScript.setAttribute('data-hs-wallet-base-url', 'https://wallet-stage.hypersign.id')
                newScript.setAttribute('data-presentation-request-endpoint', 'https://stage.hypermine.in/studioserver/api/v1/presentation/request/')
                newScript.setAttribute('data-presentation-template-id', this.presentantionTemplateId)
                divScripts.appendChild(newScript);
            } else {
                console.log('divScripts = ' + divScripts)
            }

        }

    },
    mixins: [UtilsMixin],

}
</script>
