<template>
  <div class="overflow-hidden rounded-xl bg-white">
    <div v-if="$slots.header" class="px-4 py-5 sm:px-6 border-b">
      <CardHeader>
        <slot name="header" />
      </CardHeader>
    </div>
    <slot name="body">
      <div class="px-4 py-5 sm:p-6">
        <slot />
      </div>
    </slot>
  </div>
</template>
<script setup>
import CardHeader from './CardHeader.vue'
</script>
