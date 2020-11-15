import VueRouter from 'vue-router'
import Blocks from './components/Blocks.vue'
import Block from './components/Block.vue'

const routes = [
  { path: '/', component: Blocks },
  { path: '/blocks/:index', component: Block },
]

export const router = new VueRouter({
  routes,
})
