<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { Canvas } from 'fabric';
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import Dash from "./Dash/index.vue";

// declaration and some definition of variables and references which can have hooks
const canvasEl = ref(undefined);
const canvasWrapper = useTemplateRef('canvasWrapper');
const { width: canW, height: canH } = useElementSize(canvasWrapper);
let canvas: Canvas | null = null;

onMounted(() => {
  canvas = new Canvas(canvasEl.value, {
    backgroundColor: "#212121",
    selection: true,
    preserveObjectStacking: true,
  })
  resizeCanvas()
})

// watching for changes in size of page, so that canavas would change it size as well
watch([canW, canH], resizeCanvas);

// clean up
onBeforeUnmount(() => {
  if (canvas) {
    canvas.dispose();
    canvas = null;
  }
})

// function to fit the canvas to its parent
function resizeCanvas() {
  canvas?.setDimensions({ width: canW.value, height: canH.value });
  canvas?.renderAll()
}

</script>

<template>
  <div class="wrapper">
    <Dash :canvas="canvas"/>
    <div class="my-canvas-wrapper" ref="canvasWrapper">
      <canvas ref="canvasEl"></canvas>
    </div>
  </div>
</template>

<style lang="css" scoped>
.wrapper {
  /* display: flex;
  flex-direction: column;
  gap: 1rem; */
  height: 100%;
}

.controls {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.my-canvas-wrapper {
  height: 100%;
  width: 100%;
}
</style>
