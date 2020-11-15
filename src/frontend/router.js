import VueRouter from 'vue-router'
import Blocks from './components/Blocks.vue'
import Block from './components/Block.vue'
import SendMoney from './components/SendMoney.vue'

const routes = [
  { path: '/', component: Blocks },
  { path: '/blocks/:index', component: Block },
  { path: '/send-money', component: SendMoney },
]

export const router = new VueRouter({
  routes,
})
