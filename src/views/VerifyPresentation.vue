<style scoped>

</style>

<template>
    <div :class="isContainerShift ?'homeShift':'home'">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    
    <div class="row">
        <div class="col-md-6">
            <div class="form-group">
                <label>Select a presentation : </label> 
                <hf-select-drop-down
                    :options="selectOptions"
                    @selected="e =>{OnTemplateSelectDropDownChange(e)}"
                ></hf-select-drop-down>

                <label>Or Enter the presentation Id : </label> 
                <input  class="form-control" type="text" name="" v-model="presentantionTemplateId" />

                <hf-buttons 
                    name="Request"
                    class="ml-auto mt-4"
                    @executeAction="requestPresentation()"
                ></hf-buttons>
            </div>            
        </div>
        <div class="col-md-6" >
            <div class="d-flex justify-content-center"  id="load-script">
                <div class="form-group" v-if="presentantionTemplateId != '' && showQR">
                    <canvas id="studio-qr" class="form-control"></canvas>
                    <label>Scan the QR code using Hypersign Identity Wallet</label>
                    <p>OR</p>
                    <div id="studio-btn"></div>
                    <!-- <button id="studio-btn" class="form-control"></button> -->
                </div>
            </div> 
        </div>
    </div>

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
import Info from '@/components/Info.vue'
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
