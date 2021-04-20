<template>
<div class="content">
  <div class="chat-header">
    <a class="chat-title">{{winTitle}}</a>
  </div>
  <div class="chat-win">
    <ul class="list-group list-group-flush">
      <li v-for="record in records" v-bind:key="record" class="list-group-item record-item">
        <span  class="record" >{{record.content}}</span>
      </li>
    </ul>
  </div>
  <div class="menu">
    tt
  </div>
  <div class="send-msg">
    <textarea v-model="message" class="msg"></textarea>
  </div>
  <div class="send">
    <button @click="send" class="btn btn-primary btn-sm">Send</button>
  </div>
  <div class="footer"></div>
</div>
</template>

<script>
export default {
  name: "ChatWindow",
  data(){
    return{
      message:""
    }
  },
  computed:{
    winTitle(){
      switch (this.$store.state.model) {
        case "chat": return this.$store.state.chatTo
        case "broadcast": return this.$store.state.BroadcastHost
        case "chatroom": return "ChatRoom"
        default: return []
      }
    },
    records(){
      switch (this.$store.state.model) {
        case "chat": return this.$store.state.chatRecords
        case "broadcast": return this.$store.state.BroadcastRecords
        case "chatroom": return this.$store.state.ChatRoomRecords
        default: return []
      }
    }
  },
  methods:{
    send:function (){
      let to = []
      switch (this.$store.state.model) {
        case "chat": to = [this.$store.state.chatTo]
              break
        case "broadcast": to = this.$store.state.BroadcastUsers
              break
        case "chatroom": break
        default: break
      }
      let msg = {
        "type":this.$store.state.model,
        "from":this.$store.state.userEmail,
        "to": to,
        "content":this.message
      }
      this.message = ""
      this.$store.dispatch("SendMessage",msg)
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
