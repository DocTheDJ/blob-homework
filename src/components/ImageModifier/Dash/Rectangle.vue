<script setup lang="ts">
import { watch } from 'vue';
import { DrawTypes, type AnyRef, type ICommonProps } from './common';
import { Rect } from 'fabric';


const { canvas, drawing } = defineProps<ICommonProps & {
  drawing: AnyRef<DrawTypes>
}>()

let highlightRect: Rect | null = null;
let isDrawing = false;
let startX: number | null
let startY: number | null;


function activate(){
  drawing.value = (drawing.value == DrawTypes.rectangle) ? DrawTypes.none : DrawTypes.rectangle;
}

// watching for reference change, which is triggered by clicks
// could be in just two functions, but this seems safer
watch(() => drawing.value, (value) => {
  if (value == DrawTypes.rectangle) {
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

</script>

<template>
  <v-btn icon="mdi-rectangle mdi-close" @click.prevent="activate"></v-btn>
</template>
