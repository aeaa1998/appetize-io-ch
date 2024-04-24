<template>
  <div>
    <card>
      <template #body>
        <div class="flex flex-nowrap text-center divide-x">
          <button
            v-for="system in systems"
            :key="system"
            class="flex-1 py-4"
            :class="{ 'bg-primary-600': applications[system] == selectedApplication?.publicKey }"
            @click="setSelectedApplication(system)"
          >
            {{ systemNames[system] }}
          </button>
        </div>
      </template>
    </card>
    <div class="flex flex-col items-start justify-start md:space-x-6 md:flex-row">
      <div
        class="relative"
        :style="{
          width: width,
          height: height
        }"
      >
        <iframe
          v-bind="$attrs"
          :height="height"
          style="overflow: hidden"
          :width="width"
          class="relative"
        />
        <div v-if="isLoading" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <spinner color="text-black" />
        </div>
      </div>
      <appetize-controls
        v-if="controls"
        v-model:device="device"
        v-model:version="version"
        class="mt-8"
        :os="selectedApplication.os"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import { appetizeClientKey } from '@/utils/keys.js'
import { getSelectedApplicationFromSystem } from '@/libs/constants.js'
import { Card } from '@/components/cards'
import AppetizeControls from './control/AppetizeControls.vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  // The systems that this client will support
  applications: {
    type: Object,
    validator: (value) => {
      const systems = Object.keys(value)
      const acceptedValues = ['android', 'ios']
      const correctLength = systems?.length <= acceptedValues.length ?? true
      const allProvidedAreValid =
        systems?.every((system) => acceptedValues.includes(system)) ?? true
      return correctLength && allProvidedAreValid
    }
  },
  width: {
    type: String,
    default: '300px'
  },
  height: {
    type: String,
    default: '700px'
  },
  // When true shows a loading spinner over the client until done
  loading: {
    type: Boolean,
    default: false
  },
  // When false does not render the controls
  controls: {
    type: Boolean,
    default: true
  }
})

const systemNames = {
  android: 'Android',
  ios: 'iOS'
}

// Set up bindings for vue
const device = defineModel('device')
const version = defineModel('version')
const selectedApplication = defineModel('application')

// Get state if we are using a useAppetizeClient compose
const state = inject(appetizeClientKey)

const systems = computed(() => Object.keys(props.applications ?? {}))
const isLoading = computed(() => props.isLoading || state?.meta.isLoadingClient)

const setSelectedApplication = (system) => {
  selectedApplication.value = getSelectedApplicationFromSystem(system)
}
</script>
