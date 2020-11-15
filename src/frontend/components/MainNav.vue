<template>
  <nav class="main-nav">
    <router-link :to="`/`">Home</router-link>
    <router-link :to="`/send-money`">Send Money</router-link>
  </nav>
</template>

<style lang="scss" scoped>
nav.main-nav {
  display: flex;
  flex-direction: row;
  padding: 0 16px;

  a {
    display: block;
    border: 2px solid #eee;
    padding: 4px 8px;
    text-decoration: none;
    margin-right: 16px;
    color: blue;

    &:hover {
      background-color: #eee;
    }
  }
}
</style>
