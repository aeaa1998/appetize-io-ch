<template>
  <div
    class="w-full px-2 py-4 flex flex-row space-x-4 rounded-md bg-white items-center md:space-y-4 md:flex-col md:w-fit md:space-x-0"
  >
    <popover>
      <appetize-control-button text="device" :icon="DevicePhoneMobileIcon" />
      <template #content>
        <div class="p-2 space-y-4">
          <p class="text-lg font-semibold">Device configuration</p>
          <appetize-device-select v-model:device="device" :devices="devices[os]" />
          <appetize-version-os-select
            v-model:version="version"
            :items="deviceOsByIdentifier[device]"
          />
        </div>
      </template>
    </popover>
    <appetize-control-button
      :disabled="!meta.sessionLoaded"
      text="screenshot"
      :icon="PhotoIcon"
      @click="takeScreenShot"
    />
    <!-- TODO ADD SETTINGS FUNCTIONALITY -->
    <!-- <appetize-control-button text="settings" :icon="CogIcon" /> -->
  </div>
</template>
<script setup>
import { appetizeClientKey } from '@/utils/keys.js'
import { deviceOsByIdentifier, deviceByIdentifier, devices } from '@/libs/constants.js'
import { watch, inject } from 'vue'
import { CogIcon, DevicePhoneMobileIcon, PhotoIcon } from '@heroicons/vue/20/solid'
import Popover from '@/components/popover/Popover.vue'
import AppetizeControlButton from './AppetizeControlButton.vue'
import AppetizeDeviceSelect from './AppetizeDeviceSelect.vue'
import AppetizeVersionOsSelect from './AppetizeVersionOsSelect.vue'

const props = defineProps({
  os: String
})

const device = defineModel('device')
const version = defineModel('version')

// Get state if we are using a useAppetizeClient compose
// TODO: Support it by also passing the client
const { meta, actions } = inject(appetizeClientKey)

const takeScreenShot = async () => {
  await actions?.takeScreenshot()
}

// When the device changes we want to make sure the selected os is compatible else use the deault one
watch(device, (device) => {
  const selectedDeviceObject = deviceByIdentifier[device]
  const compatible = selectedDeviceObject.os
  if (!compatible.includes(device)) {
    version.value = selectedDeviceObject.defaultOs
  }
})
</script>
