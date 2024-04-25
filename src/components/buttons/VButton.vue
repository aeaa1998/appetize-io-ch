<template>
  <button
    @click="emit('click')"
    type="button"
    class="rounded-full bg-primary-500 px-4.5 py-3.5 text-sm font-semibold hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:bg-gray-500"
  >
    <slot />
  </button>
</template>
<script setup>
const emit = defineEmits(['click'])
</script>
