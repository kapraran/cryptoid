import VueRouter from 'vue-router'
import Blocks from './components/Blocks.vue'

const routes = [
  { path: '/', component: Blocks },
  { path: '/foo', component: Blocks },
]

export const router = new VueRouter({
  routes,
})
