<template>
  <v-app>
    <v-main>
      <div class="wrapper">
        <!-- <HelloWorld /> -->
        <Drawing/>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Drawing from './components/Drawing.vue';

</script>

<style lang="css" scoped>
.wrapper{
  padding: 1rem;
  height: 100%;
}
</style>
