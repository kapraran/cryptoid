<template>
  <div class="component blocks">
    <span class="label">BLOCKS</span>

    <ul class="blocks">
      <li class="block" v-for="(block, i) in blocks" :key="i">
        {{ block.hash }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
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
}
</style>
