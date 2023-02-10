<template>
    <div class="home">
      <h2>Hi {{user.name}}, Welcome to the Entity Dashboard!</h2>

      <div class="row">
        <div class="col-md-4">
            <div class="card" style="width: 25rem;">
                <div class="card-body">
                    <h2 class="card-title"><i class="fa fa-gamepad" style="font-size:36px;"></i></h2>
                    <p class="card-text">
                        Try our Entity Studio Playground and get hands on with self sovereign identity concepts.</p>
                    <a href="#" @click.prevent="gotosubpage('playgroundDashboard')" class="btn btn-warning rounded-pill">Playground <i class="fa fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card" style="width: 25rem;">
                <div class="card-body">
                    <h5 class="card-title"><i class="fa fa-wrench" style="font-size:36px;"></i></h5>
                    <p class="card-text">Start building your identity products on our infrastructure. Explore our API documentation.</p>
                    <a href="https://docs.hypersign.id/entity-studio/api-doc" target="_blank" class="btn btn-warning rounded-pill">API Reference <i class="fa fa-arrow-right"></i></a>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card" style="width: 25rem;">
                <div class="card-body">
                    <h5 class="card-title"><i class="fa fa-graduation-cap" style="font-size:36px;"></i></h5>
                    <p class="card-text">Learn about Entity Studio to understand protocols and standard we use.</p>
                    <a href="https://docs.hypersign.id/entity-studio/introduction" target="_blank" class="btn btn-warning rounded-pill">Documentation <i class="fa fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
      </div>

      <apps/>
    </div>
 </template>
 
 
 <script>
import Apps from './Apps.vue';
 
export default {
   name: "dashboard",
   components: { 
    Apps,
   },
   data() {
     return {
        user: {},
        authToken: localStorage.getItem('authToken')
     };
   },
   created() {
    const usrStr = localStorage.getItem('user')
    this.user = JSON.parse(usrStr);
   },
   methods: {
    gotosubpage(name){
        this.$router.push({ name })
    },

     
   },
 };
 </script>
 