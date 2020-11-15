<template>
  <div class="container">Hello Parcel</div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
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
