<template>
<div class="content">
  <div class="chat-header">
    <a class="chat-title">{{winTitle}}</a>
  </div>
  <div class="chat-win">
    <ul class="list-group list-group-flush">
      <li v-for="record in records" v-bind:key="record" class="list-group-item record-item">
        <div class="msg">
          <span class="record-from">{{record.from}}</span>
          <br>
          <span v-if="record.contentType === 'text'" class="record-content" >{{record.content}}</span>
          <img v-if="record.contentType === 'image'" :src="record.content" class="record-content" style="width: 55%;">
        </div>
      </li>
    </ul>
  </div>
  <div class="menu">
    <font-awesome-icon :icon="['fas','image']" @click="showSendImage" class="img"></font-awesome-icon>
  </div>
  <div class="send-msg">
    <textarea v-model="message" class="msg"></textarea>
  </div>
  <div class="send">
    <button @click="sendText" v-if="isHost" class="btn btn-primary btn-sm">Send</button>
  </div>
  <div class="footer"></div>

  <div class="modal fade" id="liveBackdrop"  tabindex="-1" aria-labelledby="liveBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">Send Image</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <!--
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          -->
        </div>
        <div class="modal-body">
          <div class="input-group">
            <div class="custom-file">
              <input @change="setFileTitle" type="file" accept="image/*" class="custom-file-input" id="inputGroupFile" aria-describedby="inputGroupFileAddon">
              <label class="custom-file-label" for="inputGroupFile">{{fileLabel}}</label>
            </div>
          </div>


        </div>
        <div class="modal-footer">
          <button @click="sendImage" type="button" class="btn btn-primary">Send</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import $ from "jquery";
import {compressAccurately} from "image-conversion"

export default {
  name: "ChatWindow",
  data(){
    return{
      message:"",
      fileLabel:"Choose File",
      image:null
    }
  },
  computed:{
    isHost(){
      return this.$store.state.IsHost || this.$store.state.mode !== "broadcast"
    },
    winTitle(){
      switch (this.$store.state.mode) {
        case "chat": return this.$store.state.chatTo
        case "broadcast": return this.$store.state.BroadcastHost + "  is saying"
        case "chatroom": return "ChatRoom"
        default: return []
      }
    },
    records(){
      let rec = []
      let me = this.$store.state.userEmail
      let chatTo = this.$store.state.chatTo
      switch (this.$store.state.mode) {
        case "chat":
              this.$store.state.chatRecords.forEach(record =>{
                if((record.from === me && record.to[0] === chatTo)||(record.from === chatTo && record.to[0] === me)){
                  rec.push(record)
                }
              })
              break
        case "broadcast": return this.$store.state.BroadcastRecords
        case "chatroom": return this.$store.state.ChatRoomRecords
        default: break
      }
      return rec
    }
  },
  methods:{
    sendText:function (){
      let to = []
      switch (this.$store.state.mode) {
        case "chat": to = [this.$store.state.chatTo]
              break
        case "broadcast": to = this.$store.state.BroadcastUsers
              break
        case "chatroom": break
        default: break
      }
      let msg = {
        "type":this.$store.state.mode,
        "from":this.$store.state.userEmail,
        "to": to,
        "contentType":"text",
        "content":this.message
      }
      this.message = ""
      this.$store.dispatch("SendMessage",msg)
    },
    showSendImage:function (){
      $("#liveBackdrop").modal("show")
    },
    setFileTitle:function (res){
      let files = res.target.files
      console.log(files[0])
      if (files.length > 0){
        this.fileLabel = files[0].name
        this.image = files[0]
      }else {
        this.fileLabel = "Choose File"
      }
    },
    sendImage: async function () {
      let self = this
      let blob = self.image
      let file = await compressAccurately(blob, 128)
      let base64Reader = new FileReader()
      base64Reader.readAsDataURL(file)
      base64Reader.onloadend = function () {
        let to = []
        switch (self.$store.state.mode) {
          case "chat":
            to = [self.$store.state.chatTo]
            break
          case "broadcast":
            to = self.$store.state.BroadcastUsers
            break
          case "chatroom":
            break
          default:
            break
        }
        let msg = {
          "type": self.$store.state.mode,
          "from": self.$store.state.userEmail,
          "to": to,
          "contentType": "image",
          "content": base64Reader.result
        }
        self.image = null
        self.$store.dispatch("SendMessage", msg)
        $("#liveBackdrop").modal("hide")
      }
    }
  }
}
</script>

<style scoped>
  .content{
    height: 100%;
  }
  .chat-header{
    height: 38px;
    padding-top: 5px;
    border-bottom: 1px cornflowerblue solid;
  }
  .chat-title{
    text-align: center;
    margin-left: 2%;
  }
  .chat-win{
    height: calc(100% - 38px - 200px);
  }
  .menu{
    height: 30px;
    border-bottom: 1px solid;
  }
  .send-msg{
    height: 130px;
  }
  .msg{
    border: 0;
    height: 100%;
    width: 100%;
    resize: none;
  }
  .record-item{
    background: azure;
    padding: 5px;

  }
  .record-content{
    padding-left: 20px;
  }
  .img{
    color: cornflowerblue;
    margin-left: 5px;
  }
  .img:hover{
    cursor: pointer;
  }
  .record-from{
    color: cornflowerblue;
  }
  textarea:focus {
    outline: none;
  }
  .send{
    width: 100%;
    height: 30px;
    background: white;
  }
  .btn{
    width: 75px;
    margin-left: 87.5%;
  }
  .footer{
    height: 10px;
    background: white;
  }
  .record-item{
    border: 0;
  }
  .list-group{
    height: 100%;
    overflow: scroll;
  }
  .list-group::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 4px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .list-group::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : skyblue;
  }
  .list-group::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background   : #ededed;
  }
</style>
