<template>
  <div id="app">
    <myHeader></myHeader>
    <div class="main">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import myHeader from './components/myHeader'

export default {
  name: 'App',
  components: {
    myHeader
  }
}
</script>

<style lang="scss">
@import "./assets/css/reset.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.main{
  width: 90%;
  max-width: 1400px;
  min-width: 960px;
  margin: 15px auto;
  min-height: 400px;
  margin-top: 60px;
}
</style>
