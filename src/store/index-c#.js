import { createStore } from 'vuex'
import * as signalR from "@microsoft/signalr";

export default createStore({
  state: {
    env:".net",
    host:"http://localhost:12165",
    mode:"",
    connection:null,
    userEmail:"",
    token:"",
    chatUsers:[],
    chatTo:"",
    chatRecords:[],
    broadcastUsers:[],
    broadcastRecords:[],
    broadcastHost:"",
    isHost:false,
    chatRoomUsers:[],
    chatRoomRecords:[]
  },
  mutations: {
    SetMode(state,m){
      console.log("set mode: "+ m)
      state.mode = m
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
        let array2 = state.broadcastUsers;
        for (let i = 0; i < array2.length; i++) {
          if (array2[i] == user)
            array2.splice(i, 1);
        }
        let array3 = state.chatRoomUsers;
        for (let i = 0; i < array3.length; i++) {
          if (array3[i] == user)
            array3.splice(i, 1);
        }
        console.log("remove user: " + user);
      })

      state.connection.on("ReceiveMessage", function (x)   {
        switch (x.type) {
          case "chat": state.chatRecords.push(x)
              state.chatTo = x.from
                break
          case "broadcast":
            if(x.from !== state.userEmail || x.contentType !== "file"){
              state.broadcastRecords.push(x)
            }
            state.broadcastHost = x.from
            break
          case "chatroom":
            if(x.from !== state.userEmail || x.contentType !== "file") {
              state.chatRoomRecords.push(x)
            }
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
          state.broadcastUsers.push(user);
        });
      });
      console.log("bind Broadcast")

      state.connection.on("GetChatRoomUsers", function (users) {
        users.forEach(user => {
          state.chatRoomUsers.push(user);
        });
      });
      console.log("bind ChatRoom")
    },
  },
  actions: {
    async StartConnection(){
      await this.state.connection.start()
      return console.log("start connection")
    },
    async StopConnection(){
      this.state.chatUsers.splice(0,this.state.chatUsers.length)
      this.state.broadcastUsers.splice(0,this.state.broadcastUsers.length)
      this.state.chatRoomUsers.splice(0,this.state.chatRoomUsers.length)

      await this.state.connection.stop()
      console.log("stop connection")
    },
    async SetOnline({dispatch},type){
      await dispatch("StartConnection")
      this.state.connection.invoke("SetOnline",type)
      return  console.log("set online")
    },
    async SendMessage(context,msg){
      if(msg.contentType !== "file"){
        this.state.chatRecords.push(msg)
      }
      await this.state.connection.invoke("SendMessage",msg)
      console.log("send message: ")
      console.log(msg)
    },
    async UploadFile({dispatch},payload){
      console.log("upload stream ")
      console.log(payload)
      let file = payload.file
      let step = 128 * 1024
      let cursor = 0
      let size = file.size

      const subject = new signalR.Subject()
      let conn = this.state.connection
      await conn.send("UploadFile", subject)
      while (cursor < size) {
        let chunk = await file.slice(cursor, cursor + step)
        //console.log(chunk)
        let result = await dispatch("readFile",chunk)
        // console.log(result)
        let data = {
          "name":file.name,
          "from":this.state.userEmail,
          "data":result,
          "order":Math.floor(cursor/step)
        }
        await subject.next(data)
        cursor += step
        payload.progress.count = cursor/size * 100
        if (cursor > size) {
          //console.log(msg)
          subject.complete();
          break
        }
      }

    },
    readFile: function (context,chunk){
      return new Promise((resolve => {
        let reader = new FileReader()
        reader.readAsDataURL(chunk)
        reader.onloadend = function (){
          //console.log("return from readFile")
          resolve(reader.result)
        }
      }))
    },
    Subscribe: async function (contest,record){
       this.state.connection.stream("DownloadStream", 500)
          .subscribe({
            next: (item) => {
              console.log(item)
              record.push(item)
              console.log(record)
            },
            complete: () => {
              console.log("complete")
              console.log(record)
            },
            error: (err) => {
              console.log(err)
            },
          });
    }
  },
  modules: {
  }
})
