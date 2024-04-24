<template>
  <li
    :class="[
      active ? 'bg-primary-600' : 'text-gray-900',
      'relative cursor-default select-none py-2 pl-3 pr-9'
    ]"
  >
    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
      <slot />
    </span>

    <span
      v-if="selected"
      :class="[
        active ? '' : 'text-primary-600',
        'absolute inset-y-0 right-0 flex items-center pr-4'
      ]"
    >
      <CheckIcon class="h-5 w-5" aria-hidden="true" />
    </span>
  </li>
</template>
<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'
const props = defineProps({
  active: Boolean,
  selected: null
})
</script>
