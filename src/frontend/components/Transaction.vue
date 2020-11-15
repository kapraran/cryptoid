<template>
  <div class="component transaction">
    <div class="meta">
      <div class="id">ID {{ transaction.id }}</div>
      <div class="time" v-if="!isReward">
        {{ niceTimestamp }}
      </div>
      <div class="reward" v-if="isReward">
        <i class="fa fa-trophy" aria-hidden="true"></i>
      </div>
    </div>

    <div class="from" v-if="!isReward">
      <i class="fa fa-circle-o" aria-hidden="true"></i>
      {{ transaction.input.address.substring(0, 48) }}...
    </div>

    <ul class="outputs">
      <li
        v-for="(amount, key) in transaction.outputMap"
        :key="key"
        class="output"
      >
        <div class="to">
          <i class="fa fa-arrow-right" aria-hidden="true"></i>
          <div class="key">{{ key.substring(0, 48) }}...</div>
        </div>
        <div class="amount">{{ fixedAmount(amount) }} CRTD</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { MINE_REWARD } from '../../config'

export default {
  props: {
    transaction: Object,
  },

  computed: {
    isReward() {
      return this.transaction.input.address === MINE_REWARD.input.address
    },

    niceTimestamp() {
      const date = new Date(this.transaction.input.timestamp)
      const dt = DateTime.fromJSDate(date)
      return dt.toLocaleString(DateTime.DATETIME_SHORT)
    },
  },

  methods: {
    fixedAmount(amount) {
      return amount.toFixed(6)
    },
  },
}
</script>

<style lang="scss" scoped>
.component.transaction {
  border: 2px solid #ccc;
  padding: 16px;
  margin-bottom: 8px;

  .meta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .id {
      background-color: #eee;
      border-radius: 4px;
      padding: 2px 4px;
      font-family: 'Roboto Mono', consolas, monospace;
      font-size: 14px;
    }
  }

  div.from {
    padding: 12px 0;

    i {
      margin-right: 12px;
    }
  }

  ul.outputs {
    padding: 0;
    margin: 0;
    list-style: none;

    li.output {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 0 4px;

      div.to {
        display: flex;
        flex-direction: row;

        i.fa-arrow-right {
          color: green;
          font-size: 16px;
          margin-right: 16px;
        }
      }

      .amount {
        display: block;
        padding: 4px;
        color: rgb(0, 135, 90);
        background: rgb(209, 240, 219);
        border: 1px solid rgb(209, 240, 219);
        border-radius: 4px;
        width: fit-content;
      }
    }
  }
}
</style>
