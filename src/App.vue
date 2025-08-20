<template>
  <v-app>
    <v-main>
      <div class="wrapper">
        <!-- <HelloWorld /> -->
        <!-- <Drawing/> -->
        <ImageModifier/>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Drawing from './components/Drawing.vue';
import ImageModifier from './components/ImageModifier/index.vue';

</script>

<style lang="css" scoped>
.wrapper{
  padding: 1rem;
  height: 100%;
}
</style>
