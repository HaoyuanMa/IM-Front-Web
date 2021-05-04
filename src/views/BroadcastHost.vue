<template>
  <div class="container">
    <div class="row">
      <div class="col col-lg-2">
        <UserList></UserList>
      </div>
      <div class="col col-lg-10">
        <chat-window></chat-window>
      </div>
    </div>
  </div>
</template>

<script>
import ChatWindow from "@/components/ChatWindow";
import UserList from "@/components/UserList";

export default {
  name: "BroadcastHost",
  components: {ChatWindow, UserList},
  beforeCreate() {
    console.log("beforeCreate")
  },
  created() {
    console.log("created")
  },
  computed:{

  },
  mounted() {
    this.$store.commit("BuildConnection")
    //bind func
    this.$store.commit("Bind")
    this.$store.commit("SetMode","broadcast")
    this.$store.state.isHost = true
    //this.$store.dispatch("StartConnection")
    this.$store.dispatch("SetOnline","broadcast")
  },
  unmounted() {
    this.$store.dispatch("StopConnection")
  }
}
</script>

<style scoped>
.container{
  margin-top: 50px;
  width: 65%;
  border:solid 2px deepskyblue;
  height: 550px;
}
.row{
  height: 100%;
}
.col-lg-2{
  padding: 0;
  height: 100%;
}
.col-lg-10{
  width: 100%;
  height: 100%;
  padding: 0;
  background: azure;
}
</style>
