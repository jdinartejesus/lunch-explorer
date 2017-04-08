import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '@/container/SignIn'
import Restaurants from '@/container/Restaurants'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Restaurants',
      component: Restaurants
    },
    {
      path: '/login',
      name: 'SignIn',
      component: SignIn
    }
  ]
})
