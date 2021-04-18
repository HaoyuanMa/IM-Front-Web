<template>
  <ul class="list-group list-group-flush">
    <li v-for="user in $store.state.chatList" v-bind:key="user.id" class="list-group-item ">
      <span @click="ChatTo(user)" class="user" >{{user.name}}</span>
    </li>
  </ul>
</template>

<script>

export default {
  name: "UserList",
  methods:{
    ChatTo:function(user){
      this.$store.state.chatTo = user.email
    }
  }
}
</script>

<style scoped>
  .user{
    text-align: center;
    margin-left: 45%;
  }
  .list-group{
    padding: 0;
    height: 100%;
    border-right: 1px skyblue solid;
    overflow: scroll;
  }
  .list-group::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 3px;  /*高宽分别对应横竖滚动条的尺寸*/
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
