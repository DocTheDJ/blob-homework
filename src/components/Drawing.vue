<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { Canvas, FabricImage, FabricObject, filters, Point, Rect, Textbox } from "fabric";
import { useElementSize } from '@vueuse/core';

const canvasEl = ref(undefined);
const canvasWrapper = useTemplateRef('canvasWrapper');
const { width: canW, height: canH } = useElementSize(canvasWrapper);

let canvas: Canvas | null = null;
const files = ref<File | File[]>([])

onMounted(() => {
  canvas = new Canvas(canvasEl.value, {
    backgroundColor: "#ffffff",
    selection: true,
    preserveObjectStacking: true,
  })
  resizeCanvas()
})

watch([canW, canH], resizeCanvas);

onBeforeUnmount(() => {
  if (canvas) {
    canvas.dispose();
    canvas = null;
  }
})

async function uploadFile(input: File[]) {
  const file = input[0];
  console.log(file)
  const reader = new FileReader();
  const t = new Image()
  t.onload = async () => {
    const image = await FabricImage.fromURL(t.src)
    image.setXY(new Point(100, 50), "left", "top");
    image.scaleToHeight(canH.value)
    image.scaleToWidth(canW.value)
    addAny(image);
  }
  reader.onload = (e) => {
    const src = e.target?.result?.toString()!
    t.src = src;
  }
  reader.readAsDataURL(file);
}

function addRectangle() {
  const rect = new Rect({
    left: 100,
    top: 50,
    fill: 'yellow',
    width: 200,
    height: 100
  })
  addAny(rect);
}

function addText() {
  const text = new Textbox("", {
    left: 100,
    top: 50,
    width: 100,
    fontSize: 20
  });
  addAny(text);
}

function addAny(object: FabricObject) {
  canvas?.add(object)
  canvas?.setActiveObject(object)
  canvas?.renderAll()
}

function resizeCanvas() {
  canvas?.setDimensions({ width: canW.value, height: canH.value });
  canvas?.renderAll()
}

</script>

<template>
  <div class="wrapper">
    <v-file-upload density="compact" :model-value="files" accept="image/*"
      @update:model-value="uploadFile"></v-file-upload>
    <!-- <v-file-input accept="image/*" label="Image input" @update:model-value="uploadFile" :model-value="files" :show-size="true" ></v-file-input> -->
    <div class="controls">
      <v-btn>Clear</v-btn>
      <v-btn @click.prevent="addRectangle">Rectangle</v-btn>
      <v-btn @click.prevent="addText">Textbox</v-btn>
    </div>
    <div class="my-canvas-wrapper" ref="canvasWrapper">
      <canvas ref="canvasEl"></canvas>
    </div>
  </div>
</template>

<style lang="css" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
