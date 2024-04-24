<template>
  <button
    @click="emit('click')"
    :disabled="disabled"
    class="px-2 py-2 rounded-md flex flex-col items-center w-20 hover:bg-gray-200 disabled:text-gray-400 disabled:bg-transparent"
  >
    <component :is="icon" class="w-8" />
    <div class="text-xs mt-1">{{ text }}</div>
  </button>
</template>
<script setup>
const props = defineProps({
  icon: [Object, Function],
  text: String,
  disabled: Boolean
})

const emit = defineEmits(['click'])
</script>
