<template>
  <div class="container">
    <div class="content">
      <div class="monitor-header">
        <a class="monitor-title">Monitor</a>
      </div>
      <div class="monitor-win">
        <ul class="list-group list-group-flush" id="record-list">
          <li v-for="record in records" v-bind:key="record" class="list-group-item record-item">
            <div class="msg">
                {{record}}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Monitor",
  data(){
    return{
      record:[]
    }
  },
  computed:{
    records(){
      let rec = []
      this.record.forEach(record => {
        rec.push(record)
      })
      return rec
    }
  },
  watch:{
    records(){
      console.log("watch")
      this.$nextTick(() => {
        let container = this.$el.querySelector("#record-list");//#chat-list为ul的id
        container.scrollTop = container.scrollHeight
      })
    }
  },
  async mounted() {

    await this.$store.commit("BuildConnection")
    await this.$store.dispatch("StartConnection")
    this.$store.dispatch("Subscribe",this.record)
  },
  async unmounted(){
    await this.$store.dispatch("StopConnection")
    this.record.splice(0,this.record.length)
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
.content{
  height: 100%;
}
.monitor-header{
  height: 38px;
  padding-top: 5px;

}
.monitor-title{
  text-align: center;
  margin-left: 2%;
}
.monitor-win{
  height: calc(100% - 38px - 10px);
  border: 1px cornflowerblue solid;
  background: azure;
}
.record-item{
  background: azure;
  padding: 5px;
  border: 0;
}
.msg{
  margin-left: 10px;
  border: 0;
  height: 100%;
  width: 100%;
  resize: none;
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
