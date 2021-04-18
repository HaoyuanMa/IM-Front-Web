<template>
  <nav>
    <div class="nav nav-tabs justify-content-center" id="nav-tab" role="tablist">
      <router-link class="nav-link active"  data-toggle="tab"  role="tab"  aria-selected="true" to="/Chat">Chat</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/BroadcastHost">BroadcastHost</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/BroadcastReceive">BroadcastReceive</router-link>
      <router-link class="nav-link"  data-toggle="tab"  role="tab"  aria-selected="false" to="/ChatRoom">ChatRoom</router-link>
    </div>
  </nav>
  <div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" data-show="true" data-focus="true" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Login</h5>
          <!--
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          -->
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" >Email</span>
            </div>
            <input :value="email" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" >Password</span>
            </div>
            <input :value="password" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
          </div>
        </div>
        <div class="modal-footer">
          <button @click="Login" type="button" class="btn btn-primary">Login</button>
        </div>
      </div>
    </div>
  </div>
  <router-view/>
</template>

<style>




</style>


<script>
  import {onMounted} from "vue";
  import $ from "jquery"


  export default {
    name:"App",
    data(){
      return{
        email:"email",
        password:"password"
      }
    },
    methods:{
      Login:function (){
        //login to do
        console.log(this.email+"   "+this.password)
        $("#staticBackdrop").modal("hide")
      }
    },
    setup(){
      onMounted(()=>{
        $("#staticBackdrop").modal("show")
      })
    }
  }
</script>
