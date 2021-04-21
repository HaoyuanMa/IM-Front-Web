import { createStore } from 'vuex'
import * as signalR from "@microsoft/signalr";

export default createStore({
  state: {
    model:"",
    connection:null,
    userEmail:"",
    token:"",
    chatUsers:[],
    chatTo:"",
    chatRecords:[],
    BroadcastUsers:[],
    BroadcastRecords:[],
    BroadcastHost:"",
    IsHost:false,
    ChatRoomUsers:[],
    ChatRoomRecords:[]


  },
  mutations: {
    SetModel(state,m){
      console.log("set model: "+ m)
      state.model = m
    },
    BuildConnection(state){
      state.connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:12165/Hubs/MessageHub", { accessTokenFactory: () => this.state.token }).build();
      console.log("build connection")
      },
    Bind(state){
      state.connection.on("RemoveUser", function (user) {
        let array1 = state.chatUsers;
        for (let i = 0; i < array1.length; i++) {
          if (array1[i] == user)
            array1.splice(i, 1);
        }
        let array2 = state.BroadcastUsers;
        for (let i = 0; i < array2.length; i++) {
          if (array2[i] == user)
            array2.splice(i, 1);
        }
        let array3 = state.ChatRoomUsers;
        for (let i = 0; i < array3.length; i++) {
          if (array3[i] == user)
            array3.splice(i, 1);
        }
        console.log("remove user: " + user);
      })

      state.connection.on("ReceiveMessage", function (x)   {
        //let m = x.from+" says: "+x.content;
        switch (x.type) {
          case "chat": state.chatRecords.push(x)
              state.chatTo = x.from
                break
          case "broadcast": state.BroadcastRecords.push(x)
              state.BroadcastHost = x.from
                break
          case "chatroom": state.ChatRoomRecords.push(x)
                break
          default : break
        }
        console.log("receive: ");
        console.log(x);
        console.log(state.chatRecords)
      });
      console.log("bind public")

      state.connection.on("GetChatUsers", function (users) {
        console.log(users)
        users.forEach(user => {
          state.chatUsers.push(user);
          //console.log(state.chatUsers)
        });
      });
      console.log("bind chat")

      state.connection.on("GetBroadcastUsers", function (users) {
        users.forEach(user => {
          state.BroadcastUsers.push(user);
        });
      });
      console.log("bind Broadcast")
    },
  },
  actions: {
    async StartConnection(){
      await this.state.connection.start()
      return console.log("start connection")
    },
    async StopConnection(){

      this.state.chatUsers.splice(0,this.state.chatUsers.length)
      this.state.BroadcastUsers.splice(0,this.state.BroadcastUsers.length)
      this.state.ChatRoomUsers.splice(0,this.state.ChatRoomUsers.length)

      await this.state.connection.stop()
      console.log("stop connection")
    },
    async SetOnline({dispatch},type){
      await dispatch("StartConnection")
      this.state.connection.invoke("SetOnline",type)
      return  console.log("set online")
    },
    async SendMessage(context,msg){
      this.state.chatRecords.push(msg)
      await this.state.connection.invoke("SendMessage",msg)
      console.log("send message: ")
      console.log(msg)
    }
  },
  modules: {
  }
})
