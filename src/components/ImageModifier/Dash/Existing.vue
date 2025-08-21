<script setup lang="ts">
import { ref } from 'vue';
import { useCanvas } from './common';

const menu = ref(false)
const color = ref("#1976d2")
const canvas = useCanvas()

function applyColor(){
  canvas.value?.getActiveObjects().forEach(v => {
    switch(v.get("type")){
      case "rect":
      case "text":
        v.set("fill", color.value);
        break;
      case "path":
        v.set("stroke", color.value);
        break;
      default:
        break;
    }
  })
  canvas.value?.renderAll();
  menu.value = false;
}

</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-format-color-fill" v-bind="props"></v-btn>
    </template>
    <v-card>
      <v-color-picker v-model="color"/>
      <v-card-actions class="justify-space-between">
        <v-btn text @click="menu = false">Close</v-btn>
        <v-btn text color="primary" @click.prevent="applyColor">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
