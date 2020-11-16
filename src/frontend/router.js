import VueRouter from 'vue-router'
import Blocks from './components/Blocks.vue'
import Block from './components/Block.vue'
import SendMoney from './components/SendMoney.vue'
import PoolMap from './components/PoolMap.vue'

const routes = [
  { path: '/', component: Blocks },
  { path: '/blocks/:index', component: Block },
  { path: '/create-transaction', component: SendMoney },
  { path: '/transaction-pool', component: PoolMap },
]

export const router = new VueRouter({
  routes,
})
