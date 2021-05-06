<template>
<div class="content">
  <div class="chat-header">
    <a class="chat-title">{{winTitle}}</a>
  </div>
  <div class="chat-win">
    <ul class="list-group list-group-flush" id="record-list">
      <li v-for="record in records" v-bind:key="record" class="list-group-item record-item">
        <div class="msg">
          <span class="record-from">{{record.from}}</span>
          <br>
          <span v-if="record.contentType === 'text'" class="record-content" >{{record.content}}</span>
          <img v-if="record.contentType === 'image'" :src="record.content" class="record-content" style="width: 55%;">
          <div class="card mb-3" v-if="record.contentType === 'file'" style="width: 55%;height: 100px">
            <div class="row no-gutters" style="height: 100%">
              <div class="col-md-3" style="height: 100%;border-right: cornflowerblue solid 1px">
                <font-awesome-icon :icon="['fas','file']" class="record-file"></font-awesome-icon>
              </div>
              <div class="col-md-9" style="height: 100%;padding-left: 20px">
                <div class="card-body" style="height: 100%; padding: 10px">
                  <span class="record-content" :title=record.content>{{cutTitle(record.content)}}</span>
                  <div v-if="record.from === me" class="progress" style="width: 90%; margin-top: 10%">
                    <div class="progress-bar" role="progressbar" :style="'width: ' + getProgressWidth(record.content)" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <div v-if="record.from !== me" style="width: 90%; margin-top: 10%">
                    <a @click="downloadFile(host + '/UploadFiles/' + record.from + '/' + record.content,record.content)" href="#">下载</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div class="menu">
    <font-awesome-icon :icon="['fas','image']" @click="showSendImage" class="img"></font-awesome-icon>
    <font-awesome-icon :icon="['fas','folder']" @click="showSendFile" class="file"></font-awesome-icon>
  </div>
  <div class="send-msg">
    <textarea v-model="message" class="msg"></textarea>
  </div>
  <div class="send">
    <button @click="sendText" v-if="isHost" class="btn btn-primary btn-sm">Send</button>
  </div>
  <div class="footer"></div>

  <div class="modal fade" id="liveBackdrop-img"  tabindex="-1" aria-labelledby="liveBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel-img">Send Image</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <div class="custom-file">
              <input @change="setImageTitle" type="file" accept="image/*" class="custom-file-input" id="inputGroupImg" aria-describedby="inputGroupFileAddon">
              <label class="custom-file-label" for="inputGroupImg">{{fileLabel}}</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="sendImage" type="button" class="btn btn-primary">Send</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="liveBackdrop-file"  tabindex="-1" aria-labelledby="liveBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel-file">Send File</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <div class="custom-file">
              <input @change="setFileTitle" type="file" class="custom-file-input" id="inputGroupFile" aria-describedby="inputGroupFileAddon">
              <label class="custom-file-label" for="inputGroupFile">{{fileLabel}}</label>
            </div>
          </div>


        </div>
        <div class="modal-footer">
          <button @click="sendFile" type="button" class="btn btn-primary">Send</button>
        </div>
      </div>
    </div>
  </div>


</div>
</template>

<script>
import $ from "jquery";
import {compressAccurately} from "image-conversion"
import axios from "axios";

export default {
  name: "ChatWindow",
  data() {
    return {
      message: "",
      fileLabel: "Choose File",
      file: null,
      image:null,
      progress: {count:0}
    }
  },
  computed: {
    host(){
      return this.$store.state.host
    },
    me(){
      return this.$store.state.userEmail
    },
    isHost() {
      return this.$store.state.isHost || this.$store.state.mode !== "broadcast"
    },
    winTitle() {
      switch (this.$store.state.mode) {
        case "chat":
          return this.$store.state.chatTo
        case "broadcast":
          return this.$store.state.broadcastHost + "  is saying"
        case "chatroom":
          return "ChatRoom"
        default:
          return []
      }
    },
    records() {
      let rec = []
      let me = this.$store.state.userEmail
      let chatTo = this.$store.state.chatTo
      switch (this.$store.state.mode) {
        case "chat":
          this.$store.state.chatRecords.forEach(record => {
            if ((record.from === me && record.to[0] === chatTo) || (record.from === chatTo && record.to[0] === me)) {
              rec.push(record)
            }
          })
          break
        case "broadcast":
          this.$store.state.broadcastRecords.forEach(record => {
            rec.push(record)
          })
              break
        case "chatroom":
          this.$store.state.chatRoomRecords.forEach(record => {
              rec.push(record)
          })
              break
        default:
          break
      }
      return rec
    }
  },
  methods: {
    downloadFile: function (fileUrl,fileName) {
      axios({
        method: "get",
        url: fileUrl,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:8080",
        },
        responseType:"blob",
      }).then(function (response) {
        let data = response.data
        //let b = new Blob(response.data)
        console.log(data)
        let url = window.URL.createObjectURL(data)
        let a = document.createElement('a');
        a.href = url
        a.download = fileName
        a.click()
      })
    },
    getProgressWidth(fileName){
      if(this.file == null || this.file.name !== fileName){
        return "100%"
      }
      return  this.progress.count.toString() + '%'
    },
    cutTitle: function (title){
      if(title.length > 20){
        return title.slice(0,20) + "..."
      }
      return title
    },
    sendText: function () {
      let to = []
      switch (this.$store.state.mode) {
        case "chat":
          to = [this.$store.state.chatTo]
          break
        case "broadcast":
          to = this.$store.state.broadcastUsers
          break
        case "chatroom":
          break
        default:
          break
      }
      let msg = {
        "type": this.$store.state.mode,
        "from": this.$store.state.userEmail,
        "to": to,
        "contentType": "text",
        "content": this.message
      }
      this.message = ""
      this.$store.dispatch("SendMessage", msg)
    },
    showSendImage: function () {
      $("#liveBackdrop-img").modal("show")
    },
    showSendFile: function () {
      if(this.file){
        alert("some file is sending, please wait to finish")
        return
      }
      $("#liveBackdrop-file").modal("show")
    },
    setImageTitle : function (res){
      let files = res.target.files
      console.log(files[0])
      if (files.length > 0) {
        this.fileLabel = files[0].name
        this.image = files[0]
      } else {
        this.fileLabel = "Choose File"
      }
    },
    setFileTitle: function (res) {
      let files = res.target.files
      console.log(files[0])
      if (files.length > 0) {
        this.fileLabel = files[0].name
        this.file = files[0]
      } else {
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
            to = self.$store.state.broadcastUsers
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
        self.fileLabel = "Choose File"
        self.$store.dispatch("SendMessage", msg)
        $("#liveBackdrop-img").modal("hide")
      }
    },
    sendFile: async function () {
      console.log("sendFile")

      let self = this
      let file = self.file
      let size = file.size
      let to = []
      switch (self.$store.state.mode) {
        case "chat":
          to = [self.$store.state.chatTo]
          break
        case "broadcast":
          to = self.$store.state.broadcastUsers
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
        "contentType": "file",
        "content": file.name,
        "fileSize": size
      }
      switch (self.$store.state.mode){
        case "chat":
          self.$store.state.chatRecords.push(msg)
              break
        case "broadcast":
          self.$store.state.broadcastRecords.push(msg)
              break
        case "chatroom":
          self.$store.state.chatRoomRecords.push(msg)
              break
        default:break
      }
      //console.log("pushed")
      $("#liveBackdrop-file").modal("hide")
      console.log("befor upload stream")
      console.log(self.progress)
      await self.$store.dispatch("UploadFile", {file:file,progress:self.progress})
      console.log("after upload stream")
      await self.$store.dispatch("SendMessage", msg)
      self.file = null
      self.fileLabel = "Choose File"
      self.progress.count = 0
    }
  },
  watch:{
    records(){
      //console.log("watch")
      this.$nextTick(() => {
        let container = this.$el.querySelector("#record-list");//#chat-list为ul的id
        container.scrollTop = container.scrollHeight
      })
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
  }.msg{
    border: 0;
    height: 100%;
    width: 100%;
    resize: none;
  }
  .record-item{
    background: azure;
    padding: 5px;
    border: 0;
  }
  .record-content{
    padding-left: 0;
  }
  .img,.file{
    color: cornflowerblue;
    margin-left: 10px;
    margin-top: 8px;
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
  .record-file{
    color: cornflowerblue;
    margin-top: 15%;
    margin-left: 15%;
    height: 70%;
    width: 70%;
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
