<template>
  <div class="container">
    <Header></Header>
    <Wallet></Wallet>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './Header'
import Wallet from './Wallet'
import Blocks from './Blocks'
import Vue from 'vue'

export default Vue.extend({
  components: {
    Header,
    Wallet,
    Blocks,
  },

  data() {
    return {
      bundler: 'Parcel',
    }
  },
})
</script>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  word-wrap: break-word;
}
</style>
