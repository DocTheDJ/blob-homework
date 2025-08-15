<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
// use library with many ways of drawing
import { Canvas, FabricImage, FabricObject, PencilBrush, Point, Rect, Textbox } from "fabric";
import { useElementSize } from '@vueuse/core';

// declaration and some definition of variables and references which can have hooks
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

// on mount of component, initialise the canvas and set it to fill the parent
onMounted(() => {
  canvas = new Canvas(canvasEl.value, {
    backgroundColor: "#ffffff",
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

// file upload from vuetify component
async function uploadFile(input: File[]) {
  // even if many pictures are sent, only first is used
  const file = input[0];
  const reader = new FileReader();
  const pseudoImage = new Image()
  // this image is to get size of the picture given
  pseudoImage.onload = async () => {
    // used from url way cause it the simple upload is just bad
    const image = await FabricImage.fromURL(pseudoImage.src)
    image.setXY(new Point(100, 50), "left", "top");
    // scaled to canvas
    image.scaleToHeight(canH.value)
    image.scaleToWidth(canW.value)
    addAny(image, true);
  }
  // reader function to get the url
  reader.onload = (e) => {
    const src = e.target?.result?.toString()!
    pseudoImage.src = src;
  }

  // give reader the file to make the url and put the result to canvas
  reader.readAsDataURL(file);
}

// watching for reference change, which is triggered by clicks
// could be in just two functions, but this seems safer
watch(rectDrawing, (value) => {
  if (value) {
    // listener for click down
    canvas!.on("mouse:down", (opt) => {
      // get starting point
      const pointer = canvas!.getPointer(opt.e);
      startX = pointer.x;
      startY = pointer.y;

      isDrawing = true;

      // prep changing rectangle
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

    // listener for moving mouse
    canvas!.on("mouse:move", (opt) => {
      if (!isDrawing) return;
      // getting points to change the new rectangle in real time
      const pointer = canvas!.getPointer(opt.e);

      const width = pointer.x - startX!;
      const height = pointer.y - startY!;

      // size updates
      highlightRect!.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width < 0 ? pointer.x : startX,
        top: height < 0 ? pointer.y : startY
      });

      canvas!.renderAll();
    });

    // mouse click up
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

// add simple text to canvas
// can be more variable, more action buttons required
function addText() {
  const text = new Textbox("", {
    left: 100,
    top: 50,
    width: 100,
    fontSize: 20
  });
  addAny(text);
}

// general drawing
function startDrawing() {
  // using pencil as concept
  var brush = new PencilBrush(canvas!);
  drawing.value = true
  canvas!.isDrawingMode = true;
  canvas!.freeDrawingBrush = brush;
  // size and color can vary
  canvas!.freeDrawingBrush.color = "black";
  canvas!.freeDrawingBrush.width = 5;
}

// clean up for drawing
function stopDrawing() {
  drawing.value = false
  canvas!.isDrawingMode = false;
  canvas!.freeDrawingBrush = undefined;
}

// clears all objects in the canvas
function clear() {
  canvas?.remove(...canvas?.getObjects());
}

// generalised function for adding objects
function addAny(object: FabricObject, sendBack: boolean = false) {
  canvas?.add(object)
  sendBack ? canvas?.sendObjectToBack(object) : canvas?.setActiveObject(object)
  canvas?.renderAll()
}

// function to fit the canvas to its parent
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
    <!-- component from vuetify, very pretty -->
    <v-file-upload density="compact" :model-value="files" accept="image/*"
      @update:model-value="uploadFile"></v-file-upload>
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
