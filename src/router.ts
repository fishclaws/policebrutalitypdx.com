import Vue from 'vue'
import VueRouter from 'vue-router'
import Help from './components/help.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/help', compomnent: Help}
  // { path: '/foo', component: Foo },
  // { path: '/bar', component: Bar }
]

export default new VueRouter({
  routes // short for routes: routes
})