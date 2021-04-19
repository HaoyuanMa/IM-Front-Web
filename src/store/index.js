import { createStore } from 'vuex'

export default createStore({
  state: {
    connection:null,
    token:"",
    chatUsers:[
        {id:1,name:"aa",email:"AA"},
        {id:1,name:"aa",email:"AA"},
        {id:1,name:"aa",email:"AA"}
    ],
    chatTo:"",
    chatRecords:[],
    BroadcastUsers:[],
    BroadcastRecords:[],
    BroadcastHost:"",
    ChatRoomUsers:[],
    ChatRoomRecords:[]


  },
  mutations: {

  },
  actions: {
  },
  modules: {
  }
})
