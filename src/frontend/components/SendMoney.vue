<template>
  <div class="component send-money">
    <h1 class="title">Send Money</h1>

    <form @submit.prevent="sendMoney">
      <input type="text" v-model="address" placeholder="address" />
      <input type="text" v-model="amount" placeholder="amount" />

      <button>Send</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: null,
      amount: null,
    };
  },

  methods: {
    sendMoney() {
      if (!this.address || this.address.trim().length < 6) return;
      if (!this.amount || (this.amount | 0) <= 0) return;

      const recipient = this.address.trim();
      const amount = this.amount | 0;

      fetch(`/api/transact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient, amount }),
      })
        .then((response) => response.json())
        .then((body) => {
          this.$router.push('/transaction-pool');
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.component.send-money {
  padding: 16px;

  h1.title {
    padding: 0;
    margin: 0 0 16px;
    font-size: 28px;
    font-weight: 600;
  }

  form {
    display: flex;
    flex-direction: column;
    max-width: 500px;

    input {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid #777;
      font-size: 18px;
      padding: 8px 16px;
      outline: none;
      font-family: 'Roboto Mono', consolas, monospace;
      margin-bottom: 12px;
    }

    button {
      border: 1px solid #673ab7;
      background-color: #673ab7;
      color: #fff;
      font-size: 16px;
      padding: 8px 16px;
      cursor: pointer;
    }
  }
}
</style>
