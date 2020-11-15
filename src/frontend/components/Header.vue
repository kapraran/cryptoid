<template>
  <div class="component header">
    <div class="logo-container">
      <div class="logo">
        <i class="fa fa-money" aria-hidden="true"></i>
      </div>
      <div class="name">CRYPTOID</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.component.header {
  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .logo {
    $_sz: 72px;

    background-color: #673ab7;
    color: #fff;
    border-radius: 50%;
    width: $_sz;
    height: $_sz;
    line-height: $_sz;
    font-size: 32px;
    text-align: center;
  }

  .name {
    font-size: 24px;
    font-weight: 500;
    padding-top: 16px;
  }
}
</style>
