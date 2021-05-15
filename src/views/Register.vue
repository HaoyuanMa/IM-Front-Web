<template>
  <div class="modal fade" id="staticBackdrop" data-keyboard="false" data-show="true" data-focus="true" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Register</h5>
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
          <button @click="Register" id="login" type="button" class="btn btn-primary">Register</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";

export default {
  name: "Login",
  data(){
    return{
      email:"",
      password:""
    }
  },
  methods:{
    Register:function (){
      let self = this
      $("#login").addClass("disabled")
      //$("#login").setAttribute("aria-disabled","true")
      //login to do
      //var sendData = JSON.stringify(loginModle)
      console.log(self.email+"   "+self.password)

      let address = ""
      let jsonData = null
      if(self.$store.state.env === "go"){
        address = "http://182.92.183.106:12165/Account/Register"
        jsonData = {
          "username":self.email,
          "password":self.password
        }
      }else {
        address = "http://182.92.183.106:12165/Account/Register"
        jsonData = {
          "Email":self.email,
          "Password":self.password
        }
      }

      axios({
        method:"post",
        url:address,
        headers:{
          "Access-Control-Allow-Origin": "http://182.92.183.106:5000",
          "Content-Type":"application/json;charset=UTF-8",
          "Data-Type":"text"
        },
        data:JSON.stringify(jsonData)
      }).then(function (response){
        if(response.status === 200){
          alert("success")
        }else{
          alert("failed")
        }

        $("#staticBackdrop").modal("hide")

        console.log(self.$store.state.token)
        console.log(self.$store.state.connection)
      })


      //
    }
  },
  mounted() {
    $("#staticBackdrop").modal("show")
    // console.log(this.$store.state.connection)
  }
}
</script>

<style scoped>

</style>
