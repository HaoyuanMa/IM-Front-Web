import { createRouter, createWebHistory } from 'vue-router'
import Chat from "@/views/Chat";
import BroadcastHost from "@/views/BroadcastHost";
import ChatRoom from "@/views/ChatRoom";
import Login from "@/views/Login";
import BroadcastReceive from "@/views/BroadcastReceive";
import Monitor from "@/views/Monitor";

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/BroadcastHost',
    name: 'BroadcastHost',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: BroadcastHost
  },
  {
    path: '/BroadcastReceive',
    name: 'BroadcastReceive',
    component: BroadcastReceive
  },
  {
    path: '/ChatRoom',
    name: 'ChatRoom',
    component: ChatRoom
  },
  {
    path: '/Monitor',
    name: 'Monitor',
    component: Monitor
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
