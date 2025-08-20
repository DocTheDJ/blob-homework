<script setup lang="ts">
import { DrawTypes, type ICommonProps } from './common';
import Clear from './Clear.vue';
import Rectangle from './Rectangle.vue';
import { ref } from 'vue';

const props = defineProps<ICommonProps>()

const drawing = ref<DrawTypes>(DrawTypes.none);

</script>

<template>
  <v-toolbar rounded="lg" floating absolute style="z-index: 10;">
    <v-btn icon="mdi-home"></v-btn>
    <Clear :canvas="props.canvas"/>
    <rectangle :canvas="props.canvas" :drawing="drawing"/>
  </v-toolbar>
</template>

<style lang="css" scoped>
.controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>
