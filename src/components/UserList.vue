<template>
  <div class="list-header">
    <h class="list-title">UserList</h>
  </div>
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
  .list-header{
    height: 50px;
    padding-top: 10px;
    border-bottom: deepskyblue 1px solid;
    border-right: 1px cornflowerblue solid;
  }
  .list-title{
    text-align: center;
    margin-left: 30%;
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
