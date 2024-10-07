<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { onMounted } from 'vue'

onMounted(() => {
  let testNum = null
  if(testNum.length) {
     console.log('length')
  }
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/trigger">触发js异常</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style>

#app {
   display: flex;
   flex-direction: column;
   padding-top: 30px;
}
</style>
