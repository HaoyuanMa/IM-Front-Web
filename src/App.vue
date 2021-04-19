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
            <input v-model="email" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" >Password</span>
            </div>
            <input v-model="password" type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
          </div>
        </div>
        <div class="modal-footer">
          <button @click="Login" id="login" type="button" class="btn btn-primary">Login</button>
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
  import * as signalR from "@microsoft/signalr";
  import axios from "axios";


  export default {
    name:"App",
    data(){
      return{
        email:"",
        password:""
      }
    },
    methods:{
      Login:function (){
        var self = this
        $("#login").addClass("disabled")
        //$("#login").setAttribute("aria-disabled","true")
        //login to do
        //var sendData = JSON.stringify(loginModle)
        console.log(self.email+"   "+self.password)
        axios({
          method:"post",
          url:"http://localhost:12165/Account/Login",
          headers:{
            "Access-Control-Allow-Origin": "http://localhost:8080",
            "Content-Type":"application/json;charset=UTF-8",
            "Data-Type":"text"
          },
          data:JSON.stringify({
            "Email":self.email,
            "Password":self.password
          })
        }).then(function (response){
          self.$store.state.token = response.data
          self.$store.state.connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:12165/Hubs/MessageHub", { accessTokenFactory: () => self.$store.state.token }).build();
          $("#staticBackdrop").modal("hide")

          //bind func

          self.$store.state.connection.start()
          console.log(self.$store.state.token)
          console.log(self.$store.state.connection)
        })


        //
      }
    },
    setup(){
      onMounted(()=>{
        $("#staticBackdrop").modal("show")
      })
    }
  }
</script>
