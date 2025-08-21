<script setup lang="ts">
import { DrawTypes, useCanvas, useDrawing } from './common';

const canvas = useCanvas()
const drawing = useDrawing()

function clear() {
  canvas.value?.remove(...canvas.value?.getObjects());
  drawing.value = DrawTypes.none;
}

</script>
<template>
  <v-btn @click.prevent="clear" icon="mdi-delete-outline" />
</template>
