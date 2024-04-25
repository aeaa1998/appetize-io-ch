<template>
  <success-sample-modal v-model:visible="processState.succeeded" />
  <error-sample-modal v-model:visible="processState.failed" :error="processState.error" />
  <div class="flex flex-col pb-8 space-y-6 lg:space-y-0">
    <div class="flex flex-col space-y-6 items-center lg:space-y-0 lg:flex-row">
      <!-- Instructions and form -->
      <div class="flex-1 space-y-6 flex flex-col md:items-center lg:items-start">
        <header-two> Open share article </header-two>
        <div class="text-gray sm:w-2/3">
          Enter the user credentials in order to be able to start the application flow. After login
          you will see the first article and trigger the share action.
        </div>
        <div class="flex flex-row space-x-4">
          <div
            v-for="option in startOptions"
            :key="option.key"
            class="px-4 py-2 rounded-full cursor-pointer"
            :class="{
              'bg-primary-600 font-bold': option.selected.value,
              'bg-primary-200 hover:bg-primary-400': !option.selected.value
            }"
            @click="option.selected.value = !option.selected.value"
          >
            {{ option.name }}
          </div>
        </div>
        <div class="w-full md:w-2/3 space-y-4">
          <div class="space-y-2">
            <v-label for="username">Username</v-label>
            <v-input class="w-full" name="username" v-model="loginForm.username" />
          </div>
          <div class="space-y-2">
            <v-label for="password">Password</v-label>
            <div class="relative w-full">
              <v-input
                :type="!loginForm.passwordVisible ? 'password' : 'input'"
                class="w-full relative"
                name="password"
                v-model="loginForm.password"
              />
              <div class="h-full absolute top-0 right-0 flex flex-col justify-center pr-2">
                <component
                  class="h-6 w-6"
                  :is="loginForm.passwordVisible ? EyeSlashIcon : EyeIcon"
                  @click="loginForm.passwordVisible = !loginForm.passwordVisible"
                />
              </div>
            </div>
          </div>
          <v-button
            @click="startFlow"
            :disabled="!isValid || processState.loading"
            class="w-full md:w-fit min-w-60"
          >
            {{ processState.loading ? 'Loading' : 'Start session' }}
          </v-button>
        </div>
      </div>
      <appetize-client :applications="applications" :id="loginSampleId" />
    </div>
    <appetize-screenshots-card :screenshots="screenshots[appetizeControls.device] ?? []">
      <template #header>
        <header-three>
          Screenshots for Wikipedia app {{ deviceByIdentifier[appetizeControls.device].name }}
        </header-three>
      </template>
    </appetize-screenshots-card>
  </div>
</template>
<script setup>
import { AppetizeClient, AppetizeScreenshotsCard } from '@/components/appetize'
import { SuccessSampleModal, ErrorSampleModal } from '@/components/views/samples'
import { useAppetizeClientFromId } from '@/composables/appetize/useAppetizeClient.js'
import { computed, markRaw, onMounted, reactive, ref, watch } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/20/solid'
import { deviceByIdentifier, applications } from '@/libs/constants.js'
import androidShareFlow from '@/libs/flows/android/shareFlow.js'
import iosShareFlow from '@/libs/flows/iOS/shareFlow.js'

const loginSampleId = 'loginSample'

// The list of possible starts for the emulator
const startOptions = [
  {
    name: 'Skip login actions',
    selected: ref(true),
    key: 'hasCredentials',
    value: () => ({
      hasCredentials: startOptions[0].selected.value,
      username: loginForm.username,
      password: loginForm.password
    })
  },
  {
    name: 'Skip onboarding',
    selected: ref(true),
    key: 'skipOnboarding',
    value: () => ({
      skipOnboarding: startOptions[1].selected.value
    })
  }
]

const initialApplication = {
  os: 'android',
  publicKey: applications.android
}

const sessionConfig = {
  device: 'pixel7',
  centered: 'both',
  scale: 'auto',
  record: true,
  proxy: 'intercept'
}

const screenshots = ref({})

const processState = reactive({
  // We will keep a track of an id because the flow can be stopped and we only want to show a dialog for the current run
  id: markRaw(0),
  loading: false,
  error: null,
  failed: false,
  succeeded: false,
  clear: () => {
    processState.loading = false
    processState.error = null
    processState.succeeded = false
    processState.failed = false
  },
  setLoading: () => {
    processState.loading = true
    processState.error = null
    processState.succeeded = false
    processState.failed = false
  },
  setSucceeded: () => {
    processState.loading = false
    processState.succeeded = true
  },
  setFailed: (error) => {
    processState.loading = false
    processState.failed = true
    processState.error = error
  }
})

const loginForm = reactive({
  username: '',
  password: '',
  passwordVisible: false
})
// Consuming the composition we have the business logic and state to only be consumed and reduce the overhead of logic
const { appetize, onSessionStarted, onScreenshotTaken, appetizeControls, onSessionEnded } =
  useAppetizeClientFromId(loginSampleId, initialApplication, sessionConfig)

// Helper to see if it's empty or null
const isNotEmptyorNull = (value) => value != null && value != ''

// It's a valid form once both fields have values
const isValid = computed(
  () => isNotEmptyorNull(loginForm.password) && isNotEmptyorNull(loginForm.username)
)

// Gets the configuration for the session
const getConfig = (startOptions) => {
  let config = {}

  config.params = startOptions.reduce((carry, { value, selected }) => {
    const result = value()
    carry = { ...carry, ...result }
    return carry
  }, {})

  return config
}

// Start the flow programatically
const startFlow = async () => {
  processState.setLoading()
  await appetize.client.startSession(getConfig(startOptions))
}

const shareFlow = async (session, id) => {
  const skipLogin = startOptions[0]
  const skipOnboarding = startOptions[1]
  // Set as the flow has started
  processState.setLoading()
  try {
    // It is android
    if (appetizeControls.application.os == 'android') {
      await androidShareFlow(session, loginForm, {
        skipLogin: skipLogin.selected.value,
        skipOnboarding: skipOnboarding.selected.value
      })
    } else {
      await iosShareFlow(session, loginForm, {
        skipLogin: skipLogin.selected.value,
        skipOnboarding: skipOnboarding.selected.value
      })
    }
    // Everything went ok
    processState.setSucceeded()
  } catch (error) {
    // It is the current run then show the dialog
    if (id == processState.id) {
      console.error(error)
      processState.setFailed(error)
    }
  }
}

watch(startOptions[0].selected, async () => {
  await appetize.client?.setConfig(getConfig(startOptions))
})

watch(startOptions[1].selected, async () => {
  await appetize.client?.setConfig(getConfig(startOptions))
})

onMounted(() => {
  // Set callback once the session has started
  onSessionStarted(async (session) => {
    processState.id += 1
    shareFlow(session, processState.id)
  })

  // Sets a listener whenever a ss was taken
  onScreenshotTaken((data) => {
    if (!screenshots.value[appetizeControls.device]) screenshots.value[appetizeControls.device] = []
    screenshots.value[appetizeControls.device].push(
      markRaw({
        data,
        name: `${new Date().getTime()}.jpg`
      })
    )
  })

  // Register when the session has ended
  onSessionEnded(() => {
    processState.id += 1
    processState.clear()
  })
})
</script>
