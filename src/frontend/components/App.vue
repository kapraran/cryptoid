<template>
  <div class="container">
    <Wallet></Wallet>
    <Blocks></Blocks>
  </div>
</template>

<script>
import Wallet from './Wallet'
import Blocks from './Blocks'
import Vue from 'vue'

export default Vue.extend({
  components: {
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
  font-family: sans-serif;
}
</style>
