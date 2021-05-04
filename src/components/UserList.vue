<template>
  <div class="list-header">
    <h6 class="list-title">Users</h6>
  </div>
  <ul class="list-group list-group-flush">
    <li v-for="user in users" v-bind:key="user" class="list-group-item ">
      <a @click="ChatTo(user)" class="user" >{{user}}</a>
    </li>
  </ul>
</template>

<script>

export default {
  name: "UserList",
  computed:{
    users(){
      switch (this.$store.state.mode) {
        case "chat": return this.$store.state.chatUsers
        case "broadcast": return this.$store.state.broadcastUsers
        case "chatroom": return this.$store.state.chatRoomUsers
        default: return []
      }

    }
  },
  methods:{
    ChatTo:function(user){
      if (this.$store.state.mode !== "chat" || this.$store.state.userEmail === user)
        return
      this.$store.state.chatTo = user
      console.log("set chatTo: " + this.$store.state.chatTo)
    }
  }
}
</script>

<style scoped>
  .user{
    text-align: center;
    margin-left: 5%;
  }
  .user:link{
    text-decoration: none;
  }
  .user:visited{
    text-decoration: none;
  }
  .user:hover{
    text-decoration: none;
    cursor: pointer;
  }
  .list-header{
    height: 50px;
    padding-top: 10px;
    border-bottom: deepskyblue 1px solid;
    border-right: 1px cornflowerblue solid;
  }
  .list-title{
    text-align: center;
    margin-left: 1%;
  }
  .list-group{
    padding: 0;
    height: calc(100% - 50px);
    border-right: 2px cornflowerblue solid;
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
