<template>
  <modal v-model:visible="visible">
    <template #title><header-three>Error in run!</header-three></template>
    <template #default>
      <div class="space-y-4">
        <XMarkIcon class="w-8 h-8 mx-auto text-red-500" />
        <div>
          {{ error?.message ?? 'An unexpected error happened with the current flow' }}
        </div>
      </div>
    </template>
  </modal>
</template>
<script setup>
import { XMarkIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  error: null
})

const visible = defineModel('visible')
</script>
