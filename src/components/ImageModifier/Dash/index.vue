<script setup lang="ts">
import { DrawTypes, Providing, useCanvas } from './common';
import Clear from './Clear.vue';
import Rectangle from './Rectangle.vue';
import Pencil from './Pencil.vue';
import { provide, ref, watch} from 'vue';
import Existing from './Existing.vue';
import InsertImage from './InsertImage.vue';

const canvas = useCanvas();
const selectionActive = ref(false);

const isDrawing = ref(DrawTypes.none);
provide(Providing.drawing, isDrawing)

watch(canvas, (e) => {
  if(e){
    e.on("selection:created", (s) => {
      selectionActive.value = s.selected.length > 0;
    })
    e.on("selection:cleared", (s) => {
      selectionActive.value = false;
    })
  }
})

// canvas.value?.on("selection:updated", (e) => {
//   console.log(e);
// })

</script>

<template>
  <v-toolbar rounded="lg" floating absolute style="z-index: 10;" v-if="canvas != undefined">
    <v-btn icon="mdi-home"></v-btn>
    <Clear />
    <Rectangle/>
    <Pencil/>
    <InsertImage/>
    <Existing v-if="selectionActive"/>
  </v-toolbar>
</template>

<style lang="css" scoped>
.controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>
