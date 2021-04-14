import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Presence from '@/views/Presence'
import PresenceRecap from '@/views/PresenceRecap'
import StudentData from '@/views/StudentData'
import Config from '@/views/Config'
import Accounts from '@/views/Accounts'
import GeneralConfig from '@/views/GeneralConfig'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard/presence',
    name: 'Presence',
    component: Presence
  },
  {
    path: '/dashboard/presence/recap',
    name: 'Presence Recap',
    component: PresenceRecap
  },
  {
    path: '/dashboard/student',
    name: 'Student Data',
    component: StudentData
  },
  {
    path: '/dashboard/config',
    name: 'Manage Config',
    component: Config
  },
  {
    path: '/dashboard/config/general',
    name: 'General Config',
    component: GeneralConfig
  },
  {
    path: '/dashboard/accounts',
    name: 'Manage Account',
    component: Accounts
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
