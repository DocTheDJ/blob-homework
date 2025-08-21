<script setup lang="ts">
import { inject, ref } from 'vue';
import { Providing } from './common';

const uploadFile = ref<HTMLInputElement | null>(null);

const openFiles = () => uploadFile.value?.click()

const upload = inject<(payload: Event) => void>(Providing.uploadImage)!
</script>

<template>
  <input ref="uploadFile" type="file" hidden accept="image/*" v-on:change="upload"></input>
  <v-btn icon="mdi-upload-outline" @click.prevent="openFiles"></v-btn>
</template>
