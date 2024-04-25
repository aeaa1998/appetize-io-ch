<template>
  <Listbox as="div" v-model="selectedItem" :by="by">
    <div class="relative">
      <ListboxButton
        class="relative w-full cursor-default rounded-full bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6"
      >
        <slot name="display">
          <span class="block truncate">{{
            selectedFromList ? resolve(title, selectedFromList) : 'No item selected'
          }}</span>
        </slot>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <slot name="options">
            <ListboxOption
              as="template"
              v-for="item in items"
              :key="resolve(getKey, item)"
              :value="resolve(value, item)"
              v-slot="{ active, selected }"
            >
              <slot :name="`select-item-${resolve(getKey, item)}`">
                <VSelectOption :selected="selectedItem == resolve(value, item)" :active="active">
                  {{ resolve(title, item) }}
                </VSelectOption>
              </slot>
            </ListboxOption>
          </slot>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import VSelectOption from './VSelectOption.vue'

const props = defineProps({
  by: {
    type: [Function, String],
    default: () => (item) => item
  },
  title: {
    type: [Function, String],
    default: () => (item) => item
  },
  value: {
    type: [Function, String],
    default: () => (item) => item
  },
  getKey: {
    type: [Function, String],
    default: () => (item) => item
  },
  items: {
    type: [Array, Object]
  }
})

const selectedItem = defineModel()

const selectedFromList = computed(() => {
  if (!selectedItem.value) return null
  return props.items.find((item) => resolve(props.value, item) == selectedItem.value)
})

const resolve = (prop, item) => {
  if (typeof prop === 'function') {
    return prop(item)
  }
  return item[prop]
}
</script>
