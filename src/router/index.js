import { createRouter, createWebHistory } from 'vue-router'
import Chat from "@/views/Chat";
import Broadcast from "@/views/BroadcastHost";
import ChatRoom from "@/views/ChatRoom";

const routes = [
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/Broadcast',
    name: 'Broadcast',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Broadcast
  },
  {
    path: '/ChatRoom',
    name: 'ChatRoom',
    component: ChatRoom
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
