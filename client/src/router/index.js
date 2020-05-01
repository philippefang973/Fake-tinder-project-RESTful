import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Profil from '@/components/Profil'
import Parcourir from '@/components/Parcourir'
import Matchs from '@/components/Matchs'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/creation',
      name: 'creation',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Index
    },
    {
      path: '/profil',
      name: 'profil',
      component: Profil
    },
    {
      path: '/preference',
      name: 'preference',
      component: Profil
    },
    {
      path: '/description',
      name: 'description',
      component: Profil
    },
    {
      path: '/infos',
      name: 'infos',
      component: Profil
    },
    {
      path: '/password',
      name: 'password',
      component: Profil
    },
    {
      path: '/parcourir/new',
      name: 'parcourir-new',
      component: Profil
    },
    {
      path: '/deconnect',
      name: 'deconnect',
      component: Profil
    },
    {
      path: '/parcourir',
      name: 'parcourir',
      component: Parcourir
    },
    {
      path: '/matchs',
      name: 'matchs',
      component: Matchs
    },
    {
      path: '/like',
      name: 'like',
      component: Parcourir
    },
    {
      path: '/pass',
      name: 'pass',
      component: Parcourir
    },
    {path : "*", redirect: "/"}

  ]
})
