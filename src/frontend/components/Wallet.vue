<template>
  <div class="component wallet">
    <span class="label">WALLET INFO</span>
    <h1 class="balance">{{ balance }} CRTC</h1>
    <h2 class="address">{{ address }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: 'sdjfioasjfiasdfjiodfji',
      balance: 9999,
    }
  },

  mounted() {
    fetch('/api/wallet-info')
      .then((response) => response.json())
      .then((body) => {
        this.address = body.address
        this.balance = body.balance
      })
  },
}
</script>

<style lang="scss" scoped>
.component.wallet {
  margin: 16px;
  border: 1px dashed #000;
  padding: 16px;

  .label {
    display: inline-block;
    font-family: monospace;
    font-size: 14px;
    margin-bottom: 16px;
    background-color: #000;
    color: #fff;
    padding: 4px;
  }

  h1.balance {
    font-size: 24px;
    height: 24px;
    line-height: 24px;
    margin: 0 0 4px;
  }

  h2.address {
    color: #999;
    margin: 0;
    font-weight: 400;
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    overflow-wrap: break-word;
    font-family: monospace;
  }
}
</style>
