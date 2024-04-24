<template>
  <div>
    <v-label>Select the device you want to use</v-label>
    <v-select
      v-model="device"
      :items="devices"
      by="identifier"
      title="name"
      value="identifier"
      key="identifier"
    >
      <template #display>
        <span class="block truncate">{{
          device ? deviceNameByIdentifier[device] : 'No item selected'
        }}</span>
      </template>
    </v-select>
  </div>
</template>
<script setup>
import { deviceNameByIdentifier } from '@/libs/constants.js'
import { ListboxOption } from '@headlessui/vue'
import VSelectOption from '@/components/inputs/vselect/VSelectOption.vue'
const props = defineProps({
  // The list of devices we can actually use
  devices: Array
})
const device = defineModel('device')
</script>
