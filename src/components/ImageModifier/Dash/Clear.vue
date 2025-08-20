<script setup lang="ts">
import type { ICommonProps } from './common';

const { canvas } = defineProps<ICommonProps>()

function clear() {
  canvas?.remove(...canvas?.getObjects());
}

</script>
<template>
  <v-btn @click.prevent="clear" icon="mdi-delete" />
</template>
