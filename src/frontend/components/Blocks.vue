<template>
  <div class="component blocks">
    <span class="label">BLOCKS</span>

    <ul class="blocks">
      <Block v-for="block in blocks" :key="block.hash" :block="block"></Block>
    </ul>
  </div>
</template>

<script>
import Block from './Block'

export default {
  components: {
    Block,
  },

  data() {
    return {
      blocks: [],
    }
  },

  mounted() {
    fetch('/api/blocks')
      .then((response) => response.json())
      .then((body) => {
        console.log(body)
        this.blocks = body
      })
  },
}
</script>

<style lang="scss" scoped>
.component.blocks {
  padding: 16px;
  margin: 16px;
  border: 2px solid purple;

  .label {
    display: inline-block;
    background-color: purple;
    color: #fff;
    padding: 4px;
    font-size: 14px;
    font-family: monospace;
  }

  ul {
    padding: 0;
    margin: 0;
  }
}
</style>
