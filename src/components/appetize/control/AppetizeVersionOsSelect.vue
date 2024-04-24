<template>
  <div>
    <v-label>Select the version os for the device you want to use</v-label>
    <v-select v-model="version" :items="items"> </v-select>
  </div>
</template>
<script setup>
const props = defineProps({
  items: Array
})
const version = defineModel('version')
</script>
