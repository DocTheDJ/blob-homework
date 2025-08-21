<script setup lang="ts">
import { DrawTypes, Providing, useCanvas } from './common';
import Clear from './Clear.vue';
import Rectangle from './Rectangle.vue';
import Pencil from './Pencil.vue';
import { provide, ref} from 'vue';

const canvas = useCanvas();

const isDrawing = ref(DrawTypes.none);
provide(Providing.drawing, isDrawing)

</script>

<template>
  <v-toolbar rounded="lg" floating absolute style="z-index: 10;" v-if="canvas != undefined">
    <v-btn icon="mdi-home"></v-btn>
    <Clear />
    <Rectangle/>
    <Pencil/>
  </v-toolbar>
</template>

<style lang="css" scoped>
.controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>
