<template>
  <div class="component block">
    <div class="index">
      <a href="#">{{ index }}</a>
    </div>
    <div class="mined">
      {{ timeToMine }}
    </div>
    <div class="miner">{{ minerHash }}...</div>
    <div class="hash">
      <a href="#">{{ partialHash }}...</a>
    </div>
  </div>
</template>

<script>
import Block from '../../blockchain/block'

export default {
  props: {
    index: Number,
    block: Object,
    timestamp: Number,
  },

  computed: {
    partialHash() {
      return this.block.hash.substring(0, 16)
    },

    minerHash() {
      if (this.index === 0) return 'genesis'

      const transactions = this.block.data
      return Object.keys(
        transactions[transactions.length - 1].outputMap
      )[0].substring(0, 16)
    },

    timeToMine() {
      if (this.timestamp < 1) return '-'
      return `${this.block.timestamp - this.timestamp} ms`
    },
  },
}
</script>

<style lang="scss" scoped>
.component.block {
  display: flex;
  flex-direction: row;
  padding: 4px 0;
  box-sizing: border-box;

  a {
    color: blue;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  .index {
    width: 12%;
  }

  .mined {
    width: 24%;
  }

  .miner {
    width: 32%;
  }

  .hash {
    width: 32%;
  }
}
</style>
