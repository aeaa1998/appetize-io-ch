<template>
  <modal v-model:visible="visible">
    <template #title
      ><header-three>{{ winner.os }} is the Winner!</header-three></template
    >
    <template #default>
      <div class="space-y-4">
        <div class="text-3xl">🎉</div>
        <div>
          {{ winner.os }} was the winner finishing the flow in just
          <span class="text-lg font-bold">{{ winner.time.toFixed(2) }}</span>
          seconds!
        </div>
      </div>
    </template>
  </modal>
</template>
<script setup>
const props = defineProps({
  winner: Object
})
const visible = defineModel('visible')
</script>
