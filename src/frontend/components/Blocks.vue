<template>
  <div class="component blocks">
    <span class="label">BLOCKS</span>

    <header>
      <div class="index">Index</div>
      <div class="mined">Mined</div>
      <div class="miner">Miner</div>
      <div class="hash">Hash</div>
    </header>
    <ul class="blocks">
      <BlockRow
        v-for="(block, i) in blocks"
        :key="block.hash"
        :timestamp="prevTimestamp(i)"
        :index="i"
        :block="block"
      ></BlockRow>
    </ul>
  </div>
</template>

<script>
import BlockRow from './BlockRow'

export default {
  components: {
    BlockRow,
  },

  data() {
    return {
      blocks: [],
    }
  },

  methods: {
    prevTimestamp(index) {
      if (index < 2) return 0
      return this.blocks[index - 1].timestamp
    },
  },

  mounted() {
    fetch('/api/blocks')
      .then((response) => response.json())
      .then((body) => {
        this.blocks = body
      })
  },
}
</script>

<style lang="scss" scoped>
.component.blocks {
  padding: 16px;
  margin: 16px;
  border: 2px solid #673ab7;

  .label {
    display: inline-block;
    background-color: #673ab7;
    color: #fff;
    padding: 4px 8px;
    font-size: 14px;
    font-family: monospace;
  }

  header {
    font-size: 14px;
    color: #aaa;
    text-transform: uppercase;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin: 16px 0 8px;

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

  ul {
    padding: 0;
    margin: 0;
  }
}
</style>
