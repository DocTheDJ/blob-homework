<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, stop, useTemplateRef, watch } from 'vue';
import { Canvas, FabricImage, FabricObject, filters, getEnv, PatternBrush, PencilBrush, Point, Rect, Textbox } from "fabric";
import { useElementSize } from '@vueuse/core';

const canvasEl = ref(undefined);
const canvasWrapper = useTemplateRef('canvasWrapper');
const { width: canW, height: canH } = useElementSize(canvasWrapper);
const drawing = ref(false)
let highlightRect: Rect | null = null;
let isDrawing = false;
let startX: number | null
let startY: number | null;
const rectDrawing = ref(false)

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
  const reader = new FileReader();
  const t = new Image()
  t.onload = async () => {
    const image = await FabricImage.fromURL(t.src)
    image.setXY(new Point(100, 50), "left", "top");
    image.scaleToHeight(canH.value)
    image.scaleToWidth(canW.value)
    addAny(image, true);
  }
  reader.onload = (e) => {
    const src = e.target?.result?.toString()!
    t.src = src;
  }

  reader.readAsDataURL(file);
}

watch(rectDrawing, (value) => {
  if (value) {
    canvas!.on("mouse:down", (opt) => {
      const pointer = canvas!.getPointer(opt.e);
      startX = pointer.x;
      startY = pointer.y;

      isDrawing = true;

      highlightRect = new Rect({
        left: startX,
        top: startY,
        fill: "rgba(255, 0, 0, 0.3)",
        width: 0,
        height: 0,
        selectable: false,
        evented: false
      });

      canvas!.add(highlightRect);
    });

    canvas!.on("mouse:move", (opt) => {
      if (!isDrawing) return;
      const pointer = canvas!.getPointer(opt.e);

      const width = pointer.x - startX!;
      const height = pointer.y - startY!;

      highlightRect!.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width < 0 ? pointer.x : startX,
        top: height < 0 ? pointer.y : startY
      });

      canvas!.renderAll();
    });

    canvas!.on("mouse:up", () => {
      isDrawing = false;
      highlightRect = null;
    });
  }else{
    canvas!.off("mouse:down")
    canvas!.off("mouse:move")
    canvas!.off("mouse:up")
  }
})

function addText() {
  const text = new Textbox("", {
    left: 100,
    top: 50,
    width: 100,
    fontSize: 20
  });
  addAny(text);
}

function startDrawing() {
  var brush = new PencilBrush(canvas!);
  drawing.value = true
  canvas!.isDrawingMode = true;
  canvas!.freeDrawingBrush = brush;
  canvas!.freeDrawingBrush.color = "black";
  canvas!.freeDrawingBrush.width = 5;
}

function stopDrawing() {
  drawing.value = false
  canvas!.isDrawingMode = false;
  canvas!.freeDrawingBrush = undefined;
}

function clear() {
  canvas?.remove(...canvas?.getObjects());
}

function addAny(object: FabricObject, sendBack: boolean = false) {
  canvas?.add(object)
  sendBack ? canvas?.sendObjectToBack(object) : canvas?.setActiveObject(object)
  canvas?.renderAll()
}

function resizeCanvas() {
  canvas?.setDimensions({ width: canW.value, height: canH.value });
  canvas?.renderAll()
}

function toggleRectangle() {
  rectDrawing.value = !rectDrawing.value;
}

</script>

<template>
  <div class="wrapper">
    <v-file-upload density="compact" :model-value="files" accept="image/*"
      @update:model-value="uploadFile"></v-file-upload>
    <!-- <v-file-input accept="image/*" label="Image input" @update:model-value="uploadFile" :model-value="files" :show-size="true" ></v-file-input> -->
    <div class="controls">
      <v-btn @click.prevent="clear">Clear</v-btn>
      <v-btn @click.prevent="toggleRectangle" v-if="!rectDrawing">Draw Rectangle</v-btn>
      <v-btn @click.prevent="toggleRectangle" v-else>Stop Draw Rectangle</v-btn>
      <v-btn @click.prevent="addText">Textbox</v-btn>
      <v-btn @click.prevent="startDrawing" v-if="!drawing">Draw</v-btn>
      <v-btn @click.prevent="stopDrawing" v-else>Stop draw</v-btn>
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
