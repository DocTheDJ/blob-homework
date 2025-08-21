<script setup lang="ts">
import { DrawTypes, useCanvas, useDrawing } from './common';

const canvas = useCanvas()
const drawing = useDrawing()

function clear() {
  const selected = canvas.value?.getActiveObjects()
  if(selected?.length === 0){
    canvas.value?.remove(...canvas.value?.getObjects());
    drawing.value = DrawTypes.none;
  }else{
    canvas.value?.remove(...selected ?? []);
  }
}

</script>
<template>
  <v-btn @click.prevent="clear" icon="mdi-delete-outline" />
</template>
