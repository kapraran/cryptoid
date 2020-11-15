<template>
  <div class="component block">
    <div class="block-page" v-if="block !== null">
      <h1 class="title">Block #{{ $route.params.index }}</h1>

      <div class="block-data">
        <div class="key-value-row">
          <div class="key">Timestamp</div>
          <div class="value">{{ niceTimestamp }}</div>
        </div>

        <div class="key-value-row">
          <div class="key">Difficulty</div>
          <div class="value">{{ block.difficulty }}</div>
        </div>

        <div class="key-value-row">
          <div class="key">Hash</div>
          <div class="value">{{ block.hash }}</div>
        </div>

        <div class="key-value-row">
          <div class="key">Prev. Hash</div>
          <div class="value">{{ block.prevHash }}</div>
        </div>
      </div>

      <div class="transactions">
        <h2 class="title">Transactions</h2>

        <div class="transactions-list">
          <Transaction
            v-for="transaction in block.data"
            :key="transaction.id"
            :transaction="transaction"
          ></Transaction>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Transaction from './Transaction'

export default {
  components: {
    Transaction,
  },

  data() {
    return {
      block: null,
    }
  },

  mounted() {
    fetch(`/api/blocks/${this.$route.params.index}`)
      .then((response) => response.json())
      .then((body) => {
        this.block = body.block
      })
  },

  computed: {
    niceTimestamp() {
      return new Date(this.block.timestamp)
    },
  },
}
</script>

<style lang="scss" scoped>
.component.block .block-page {
  padding: 16px;

  h1.title {
    padding: 0;
    margin: 0 0 16px;
    font-size: 28px;
    font-weight: 600;
  }

  h2.title {
    padding: 0;
    margin: 16px 0;
    font-size: 18px;
    font-weight: 600;
  }

  .key-value-row {
    display: flex;
    flex-direction: row;
    padding: 4px 0;

    .key {
      color: #aaa;
      text-transform: uppercase;
      font-size: 14px;
      width: 15%;
    }
  }
}
</style>
