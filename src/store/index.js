import { createStore } from 'vuex'

export default createStore({
    state: {
        env:"go",
        mode:"",
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
        SetMode(state,m){
            console.log("set mode: "+ m)
            state.mode = m
        },
        BuildConnection(state) {
            state.connection = new WebSocket("ws://localhost:5202/status/BuildConnection")
            console.log("buid connection")
        },
        Bind(state){
            state.connection.onmessage = function (evt){
                console.log(evt)
                console.log(evt.data)
                let callBack = JSON.parse(evt.data)
                console.log(callBack)
                switch (callBack.method) {
                    case "RemoveUser":
                        RemoveUser(callBack.params)
                        break
                    case "ReceiveMessage":
                        ReceiveMessage(callBack.params)
                        break
                    case "GetChatUsers":
                        GetChatUsers(callBack.params)
                        break
                    case "GetBroadcastUsers":
                        GetBroadcastUsers(callBack.params)
                        break
                    case "GetChatRoomUsers":
                        GetChatRoomUsers(callBack.params)
                        break

                    default:break
                }
            }


            let RemoveUser = function (user) {
                let array1 = state.chatUsers;
                for (let i = 0; i < array1.length; i++) {
                    if (array1[i] === user)
                        array1.splice(i, 1);
                }
                let array2 = state.BroadcastUsers;
                for (let i = 0; i < array2.length; i++) {
                    if (array2[i] === user)
                        array2.splice(i, 1);
                }
                let array3 = state.ChatRoomUsers;
                for (let i = 0; i < array3.length; i++) {
                    if (array3[i] === user)
                        array3.splice(i, 1);
                }
                console.log("remove user: " + user);
            }

            let ReceiveMessage = function (x)   {
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
            }

            let GetChatUsers = function (users) {
                console.log(users)
                users.forEach(user => {
                    state.chatUsers.push(user);
                    //console.log(state.chatUsers)
                });
            }

            let GetBroadcastUsers = function (users) {
                users.forEach(user => {
                    state.BroadcastUsers.push(user);
                });
            }

            let GetChatRoomUsers = function (users) {
                users.forEach(user => {
                    state.ChatRoomUsers.push(user);
                });
            }
        },
    },
    actions: {
        StopConnection(){

            this.state.chatUsers.splice(0,this.state.chatUsers.length)
            this.state.BroadcastUsers.splice(0,this.state.BroadcastUsers.length)
            this.state.ChatRoomUsers.splice(0,this.state.ChatRoomUsers.length)

            this.state.connection.close()
            console.log("stop connection")
        },
        SetOnline(context,type){
            let self = this
            console.log(type)
            this.state.connection.onopen = async function () {
                let call = {
                    "Method": "SetOnline",
                    "Params": {
                        "token": "Bearer " + self.state.token,
                        "loginType": type
                    }
                }
                console.log(call)
                let msg = JSON.stringify(call)
                console.log(msg)
                await self.state.connection.send(msg)
                console.log(self.state.connection)
                console.log("set online")
            }

        },
        async SendMessage(context,msg){
            this.state.chatRecords.push(msg)
            let call = {
                "Method":"SendMessage",
                "Params":{
                    "token": "Bearer " + this.state.token,
                    "msg":JSON.stringify(msg)
                }
            }
            console.log(call)
            let message = JSON.stringify(call)
            console.log(message)
            await this.state.connection.send(message)
            console.log("send message: ")
            console.log(msg)
        }
    },
    modules: {
    }
})
