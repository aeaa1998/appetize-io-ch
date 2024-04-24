<template>
  <card>
    <template #header>
      <slot name="header" />
    </template>

    <template #default>
      <modal v-model:visible="selectedImageModalState.visible">
        <template #body>
          <img :src="selectedImageModalState.selected.data" class="w-full" />
        </template>
      </modal>
      <div class="flex flex-wrap gap-x-6 gap-y-8">
        <card v-for="screenshot in screenshots" :key="screenshot">
          <template #body>
            <div class="px-2 py-4 flex justify-between">
              <div class="text-md font-semibold">
                {{ screenshot.name }}
              </div>
              <div class="shrink-0 space-x-2">
                <button @click="downloadFileFromBase64(screenshot.name, screenshot.data)">
                  <cloud-arrow-down-icon class="text-primary-600 h-6 w-6" />
                </button>
              </div>
            </div>
            <img
              @click="selectedImageModalState.show(screenshot)"
              :src="screenshot.data"
              class="object-contain w-64 cursor-pointer border"
            />
          </template>
        </card>

        <!-- Empty state -->
        <div v-if="screenshots.length == 0">
          <slot name="empty">
            <p class="text-sm text-gray-600">
              No screenshots are available yet click on screenshot to start taking them
            </p>
          </slot>
        </div>
      </div>
    </template>
  </card>
</template>
<script setup>
import { Card } from '@/components/cards'
import useFiles from '@/composables/files/useFiles.js'
import { CloudArrowDownIcon, EyeIcon } from '@heroicons/vue/20/solid'
import { reactive } from 'vue'
const props = defineProps({
  // The array of screenshots in base64
  screenshots: Array
})

const { downloadFileFromBase64 } = useFiles()

const selectedImageModalState = reactive({
  visible: false,
  selected: null,
  show: (image) => {
    selectedImageModalState.selected = image
    selectedImageModalState.visible = true
  },
  hide: () => {
    selectedImageModalState.visible = false
    selectedImageModalState.selected = null
  }
})
</script>
