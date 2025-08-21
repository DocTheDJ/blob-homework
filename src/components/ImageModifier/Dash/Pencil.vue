<script setup lang="ts">
import { watch } from 'vue';
import { useCanvas, useDrawing, DrawTypes } from './common';
import { PencilBrush } from 'fabric';

const canvas = useCanvas()
const drawing = useDrawing()

function activate() {
  drawing.value = (drawing.value == DrawTypes.line) ? DrawTypes.none : DrawTypes.line;
}

watch(drawing, (value) => {
  if (value === DrawTypes.line) {
    // using pencil as concept
    var brush = new PencilBrush(canvas.value!);
    canvas.value!.isDrawingMode = true;
    canvas.value!.freeDrawingBrush = brush;
    // size and color can vary
    canvas.value!.freeDrawingBrush.color = "black";
    canvas.value!.freeDrawingBrush.width = 5;
  } else {
    canvas.value!.isDrawingMode = false;
    canvas.value!.freeDrawingBrush = undefined;
  }
})
</script>

<template>
  <v-btn @click.prevent="activate" :disabled="canvas == null" icon="mdi-pencil-outline"
    v-if="drawing !== DrawTypes.line" />
  <v-btn @click.prevent="activate" :disabled="canvas == null" icon="mdi-pencil" v-else />

</template>
