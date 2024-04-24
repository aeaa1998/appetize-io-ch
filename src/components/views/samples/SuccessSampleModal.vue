<template>
  <modal v-model:visible="visible">
    <template #title><header-three>Successfull run</header-three></template>
    <template #default>
      <div class="space-y-4">
        <CheckIcon class="w-8 h-8 mx-auto" />
        <div>
          <slot>The flow was executed successfully!</slot>
        </div>
      </div>
    </template>
  </modal>
</template>
<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'

const visible = defineModel('visible')
</script>
