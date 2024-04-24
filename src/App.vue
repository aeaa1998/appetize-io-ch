<template>
  <!-- Appetize io library is loading -->
  <div v-if="loading">
    <page-loader />
  </div>
  <!-- Library was loaded successfully -->
  <div v-else-if="loaded">
    <RouterView />
  </div>
  <div v-else>
    <!-- TODO: Handle error not loading -->
  </div>
</template>

<script setup>
import { PageLoader } from './components/loaders'
import { RouterLink, RouterView } from 'vue-router'
import useAppetizeLoader from '@/composables/appetize/useAppetizeLoader.js'

const { loading, loaded } = useAppetizeLoader({
  eager: true
})
</script>
