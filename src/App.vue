<template>
  <!-- Appetize io library is loading -->
  <div v-if="loading">
    <page-loader />
  </div>
  <!-- Library was loaded successfully -->
  <div v-else-if="loaded">
    <RouterView />
  </div>
  <div class="text-center flex-col items-center justify-center" v-else>
    <header-one>Error!</header-one>
    <div>There was an error while loading the Appetize SDK please reload the page</div>
  </div>
  <notification
    v-model:show="notification.show"
    :title="notification.title"
    :message="notification.message"
    :type="notification.type"
  />
</template>

<script setup>
import { PageLoader } from './components/loaders'
import useAppetizeLoader from '@/composables/appetize/useAppetizeLoader.js'
import Notification from '@/components/notifications/Notification.vue'
import useNotification from '@/composables/notifications/useNotification'

const notification = useNotification()

const { loading, loaded } = useAppetizeLoader({
  eager: true
})
</script>
