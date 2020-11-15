<template>
  <div class="component block">
    <div class="hash">{{ partialHash }}...</div>
  </div>
</template>

<script>
import Block from '../../blockchain/block'

export default {
  props: {
    block: Block,
  },

  computed: {
    partialHash() {
      return this.block.hash.substring(0, 16)
    },
  },
}
</script>

<style lang="scss" scoped>
.component.block {
}
</style>
