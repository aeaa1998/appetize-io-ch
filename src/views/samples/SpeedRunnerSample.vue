<template>
  <winner-sample-modal v-model:visible="processState.succeeded" :winner="processState.winner" />
  <error-sample-modal v-model:visible="processState.failed" :error="processState.error" />
  <div class="flex flex-col space-y-6 items-center xl:space-y-0 xl:flex-row">
    <!-- Instructions and form -->
    <div class="flex-1 space-y-6 flex flex-col md:items-center">
      <header-two> Speedrunner (Login) </header-two>
      <div class="text-gray sm:w-2/3">
        Lets see who can finish first with login flow. (Both applications will be skipping
        onboarding).
      </div>
      <div class="w-full md:w-2/3 space-y-4">
        <div class="space-y-2">
          <v-label for="username">Username</v-label>
          <v-input class="w-full" name="username" v-model="loginForm.username" />
        </div>
        <div class="space-y-2">
          <v-label for="password">Password</v-label>
          <div class="relative w-full">
            <v-input :type="!loginForm.passwordVisible ? 'password' : 'input'" class="w-full relative" name="password"
              v-model="loginForm.password" />
            <div class="h-full absolute top-0 right-0 flex flex-col justify-center pr-2">
              <component class="h-6 w-6" :is="loginForm.passwordVisible ? EyeSlashIcon : EyeIcon"
                @click="loginForm.passwordVisible = !loginForm.passwordVisible" />
            </div>
          </div>
        </div>
        <v-button @click="startFlow" :disabled="!isValid || processState.loading" class="w-full md:min-w-72 md:w-fit">
          {{ processState.loading ? 'Loading' : 'Compare' }}
        </v-button>
      </div>
    </div>
    <div class="flex flex-col md:flex-row space-x-5">
      <appetize-client :controls="false" :id="runnerId" :applications="applications" />
      <div class="h-full flex-col space-y-16 max-w-64 pt-8">
        <card class="space-y-4 border-primary border-2 px-2 py-4 rounded-md">
          <header-two class="w-full text-center">Android</header-two>
          <div class="text-center">Time to run the flow on android in seconds</div>
          <header-three class="w-full text-center">{{ processState.androidTime.toFixed(2) }}s</header-three>
        </card>
        <card class="space-y-4 border-primary border-2 px-2 py-4 rounded-md">
          <header-two class="w-full text-center">iOS</header-two>
          <div class="text-center">Time to run the flow on iOS in seconds</div>
          <header-three class="w-full text-center">{{ processState.iosTime.toFixed(2) }}s</header-three>
        </card>
      </div>
    </div>
  </div>
</template>
<script setup>
import { AppetizeClient } from '@/components/appetize'
import { Card } from '@/components/cards'
import { WinnerSampleModal, ErrorSampleModal } from '@/components/views/samples'
import { useAppetizeClientFromId } from '@/composables/appetize/useAppetizeClient.js'
import { computed, markRaw, onMounted, reactive, ref, watch } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid'
import { applications as defaultApplications, getSelectedApplicationFromSystem } from '@/libs/constants.js'
import androidLoginFlow from '@/libs/flows/android/loginFlow.js'
import iosLoginFlow from '@/libs/flows/iOS/loginFlow.js'

const runnerId = 'speedRunner'

const initialApplication = {
  os: 'android',
  publicKey: defaultApplications.android
}

const applications = {
  android: defaultApplications.android
}

const androidSessionConfig = {
  centered: 'both',
  scale: 'auto',
  record: true,
  proxy: 'intercept',
  device: 'pixel7',
  params: {
    skipOnboarding: true
  }
}

const processState = reactive({
  loading: false,
  error: null,
  failed: false,
  succeeded: false,
  androidTime: 0.0,
  iosTime: 0.0,
  interval: markRaw(null),
  winner: null,
  // Set both times to 0 again
  resetTimes: () => {
    processState.androidTime = 0.0
    processState.iosTime = 0.0
  },
  stopWatch: () => {
    clearInterval(processState.interval)
  },
  startWatch: (system) => {
    processState.stopWatch()
    processState.interval = setInterval(() => {
      if (system == 'android') {
        processState.androidTime += 0.01
      } else {
        processState.iosTime += 0.01
      }
    }, 10)
  },
  setLoading: () => {
    processState.loading = true
    processState.error = null
    processState.succeeded = false
    processState.failed = false
  },
  showWinner: () => {
    processState.loading = false
    processState.succeeded = true
    const iosWin = processState.iosTime < processState.androidTime
    processState.winner = {
      os: iosWin ? 'iOS' : 'Android',
      time: iosWin ? processState.iosTime : processState.androidTime
    }
  },
  setFailed: (error) => {
    processState.loading = false
    processState.failed = true
    processState.error = error
  }
})

const loginForm = reactive({
  username: null,
  password: null,
  passwordVisible: false
})

// Consuming the composition we have the business logic and state to only be consumed and reduce the overhead of logic
const { appetize, onSessionStarted, appetizeControls } = useAppetizeClientFromId(
  runnerId,
  initialApplication,
  androidSessionConfig
)

// Helper to see if it's empty or null
const isNotEmptyorNull = (value) => value != null && value != ''

// It's a valid form once both fields have values
const isValid = computed(
  () => isNotEmptyorNull(loginForm.password) && isNotEmptyorNull(loginForm.username)
)

const setAndroidApplication = () => {
  appetizeControls.application = getSelectedApplicationFromSystem('android')
}

const setiOSApplication = () => {
  appetizeControls.application = getSelectedApplicationFromSystem('ios')
}

onMounted(() => {
  // Set callback once the session has started
  onSessionStarted(async (session) => {
    loginFlow(session, loginForm)
  })
})

// Start the flow programatically
const startFlow = async () => {
  if (!processState.loading) {
    processState.resetTimes()
  }
  processState.setLoading()
  await appetize.client.startSession()
}

const loginFlow = async (session, { username, password }) => {
  // Set as the flow has started
  processState.setLoading()
  processState.startWatch(appetizeControls.application.os)
  try {
    // It is android
    if (appetizeControls.application.os == 'android') {
      await androidLoginFlow(session, loginForm.username, loginForm.password)
      // Start the iOS session
      setiOSApplication()
      // Restart the flow after two seconds to give some time to client
      setTimeout(() => {
        startFlow()
      }, 2000)
    } else {
      await iosLoginFlow(session, loginForm.username, loginForm.password)
      // Back to default first runner (Android)
      setAndroidApplication()
      processState.showWinner()
    }
    // Everything went ok
  } catch (error) {
    console.error(error)
    // Something went wrong kill session
    await session.end()
    // Reset back to android
    setAndroidApplication()
    processState.setFailed(error)
  }
  processState.stopWatch()
}
</script>
