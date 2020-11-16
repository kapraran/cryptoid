<template>
  <div class="component pool-map">
    <header>
      <h1 class="title">Transaction Pool</h1>
      <button @click="mineTransactions">
        <i class="fa fa-wrench" aria-hidden="true"></i> Mine
      </button>
    </header>

    <div class="transactions">
      <Transaction
        v-for="transaction in transactionPoolMap"
        :key="transaction.id"
        :transaction="transaction"
      ></Transaction>
    </div>
  </div>
</template>

<script>
import { POLL_TRANSACTION_MAP_INTERVAL } from '../../config'
import Transaction from './Transaction'

export default {
  components: {
    Transaction,
  },
  data() {
    return {
      transactionPoolMap: {},
      pollInterval: null,
    }
  },

  mounted() {
    this.fetchPoolMap()
    this.pollInterval = setInterval(
      this.fetchPoolMap.bind(this),
      POLL_TRANSACTION_MAP_INTERVAL
    )
  },

  beforeUnmount() {
    clearInterval(this.pollInterval)
  },

  beforeRouteLeave(to, from, next) {
    clearInterval(this.pollInterval)
    next()
  },

  methods: {
    fetchPoolMap() {
      fetch('/api/transaction-pool-map')
        .then((response) => response.json())
        .then((body) => {
          if (body.type !== 'error') this.transactionPoolMap = body.map
        })
    },

    mineTransactions() {
      fetch('/api/mine-transactions')
        .then((response) => response.json())
        .then((body) => {
          this.transactionPoolMap = {}
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.component.pool-map {
  padding: 16px;

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    h1.title {
      padding: 0;
      margin: 0 0 16px;
      font-size: 28px;
      font-weight: 600;
    }
    button {
      border: 1px solid #673ab7;
      background-color: #673ab7;
      color: #fff;
      font-size: 16px;
      padding: 8px 16px;
      cursor: pointer;

      i {
        margin-right: 8px;
      }
    }
  }
}
</style>
