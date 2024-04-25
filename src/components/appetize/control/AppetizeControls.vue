<template>
  <div
    class="w-full px-2 py-4 flex flex-row-reverse flex-wrap justify-between rounded-md bg-white items-center sm:flex-row sm:space-x-4 md:space-y-4 md:flex-col md:w-fit md:space-x-0"
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
    <appetize-control-button
      v-if="isDarkModeAllowed"
      :disabled="meta.sessionLoaded"
      @click="toggleAppearance"
      :text="isDarkMode ? 'dark Mode' : 'light Mode'"
      :icon="isDarkMode ? MoonIcon : SunIcon"
    />
    <appetize-control-button
      :disabled="!meta.sessionLoaded"
      @click="actions?.endSession()"
      text="stop"
      :icon="StopIcon"
    />
  </div>
</template>
<script setup>
import { appetizeClientKey } from '@/utils/keys.js'
import { deviceOsByIdentifier, deviceByIdentifier, devices } from '@/libs/constants.js'
import { watch, inject, computed } from 'vue'
import {
  SunIcon,
  MoonIcon,
  DevicePhoneMobileIcon,
  PhotoIcon,
  StopIcon
} from '@heroicons/vue/20/solid'
import Popover from '@/components/popover/Popover.vue'
import AppetizeControlButton from './AppetizeControlButton.vue'
import AppetizeDeviceSelect from './AppetizeDeviceSelect.vue'
import AppetizeVersionOsSelect from './AppetizeVersionOsSelect.vue'

const props = defineProps({
  os: String
})

const device = defineModel('device')
const version = defineModel('version')
const appearance = defineModel('appearance')

// Get state if we are using a useAppetizeClient compose
// TODO: Support it by also passing the client
const { meta, actions } = inject(appetizeClientKey)

const takeScreenShot = async () => {
  await actions?.takeScreenshot()
}

const versionNumbered = computed(() => {
  try {
    return parseFloat(version.value)
  } catch (error) {
    return 0
  }
})

const isDarkMode = computed(() => appearance.value == 'dark')
const isDarkModeAllowed = computed(() =>
  props.os == 'android' ? versionNumbered.value >= 10 : versionNumbered.value >= 13
)

const toggleAppearance = () => (appearance.value = isDarkMode.value ? 'light' : 'dark')

// When the device changes we want to make sure the selected os is compatible else use the deault one
watch(device, (device) => {
  const selectedDeviceObject = deviceByIdentifier[device]
  const compatible = selectedDeviceObject.os
  if (!compatible.includes(device)) {
    version.value = selectedDeviceObject.defaultOs
  }
})
</script>
