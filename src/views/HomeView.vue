<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- The navbar/header of the view -->
    <div class="w-full flex flex-row bg-black px-4 py-6 items-center space-x-8">
      <img
        @click="router.push('/')"
        class="cursor-pointer h-8"
        src="@/assets/svg/appetize_logo_white.svg"
      />
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
