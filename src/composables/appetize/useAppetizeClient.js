import { onBeforeMount, watch, reactive, provide, markRaw } from 'vue'
import { appetizeClientKey } from '@/utils/keys.js'
import { deviceByIdentifier, devices } from '@/libs/constants.js'

export const makeApplictionControls = ({ application, device, initialOs, launchUrl }) => reactive({
    // The selected application
    application: application,
    // The device to be used e.g. Nexus 5, iPhone 15 pro
    device: device,
    // The version os for the application e.g. Android 10, iOS 16.0
    version: initialOs,
    // The launch url path we are going to use
    launchUrl: launchUrl
  })

/**
 *
 * @param {string} selector The css selector for the iframe. e.g. #iFrameId
 * @param {object} application The application object which has the publicKey and os values. e.g. { publicKey: <pub_key>, os: ios }
 * @param {object} sessionConfiguration  The configuration object which will be used to start a new sesion
 * @returns { object } Returns the api that this compositions provides
 */
const useAppetizeClient = (selector, application, sessionConfiguration) => {
  const initialDevice = sessionConfiguration.device
  const initialOs = sessionConfiguration.version ?? deviceByIdentifier[initialDevice]?.defaultOs

  let screenshotTakenCallbacks = []
  let appetize = {
    client: null,
    session: null
  }

  // Contains more information about the status of the current page like if the client is loaded or
  // if the session has been loaded
  const meta = reactive({
    isLoadingClient: true,
    sessionLoaded: false
  })

  const clientPromise = new Promise(async (resolve) => {
    if (appetize.client) {
      return appetize.client
    }
    const clientResolved = await window.appetize.getClient(selector, {
      ...sessionConfiguration,
      publicKey: application.publicKey,
      osVersion: initialOs
    })
    meta.isLoadingClient = false
    resolve(clientResolved)
  })


  const appetizeControls = makeApplictionControls({
    application,
    device: sessionConfiguration.device,
    version: initialOs,
    launchUrl: sessionConfiguration.launchUrl
  })

  /**
   * Provides a clear way for components to know what to do when a session has started
   * @param {function} callback The callback to be used when the session has started in the client
   */
  const onSessionStarted = async (callback) => {
    const client = await clientPromise
    client.on('session', (session) => {
      meta.sessionLoaded = true
      appetize.session = session
      callback(session)
    })
  }

  /**
   * Register a callback when the screenshot in the screenshot taken callbacks
   * @param {function} callback The callback to be invoked on this event
   */
  const onScreenshotTaken = (callback) => {
    screenshotTakenCallbacks.push(callback)
  }

  /**
   * Wrapper to take a screenshot and emit a event so we can setup callers on other sites of the application,
   * We need to have the session properly set in order to be able to take it
   * @param {string} format The type it can be buffer or base64. Depends on the needs
   * @returns {}
   */
  const takeScreenshot = async (format = null) => {
    if (!appetize.session) return null
    const { data, mimeType } = await appetize.session.screenshot(format)
    screenshotTakenCallbacks.forEach((callback) => {
      if (typeof callback == 'function') {
        // Pass the whole context for this screenshot
        callback(data, mimeType, format)
      }
    })
  }

  /**
   * Starts the session on the client with the desired configuration
   * @param {object} configuration The configuration object for this session to be started
   */
  const startSession = async (configuration) => {
    appetize.session = markRaw(await clientPromise.startSession(configuration))
    meta.sessionLoaded = true
  }

  /**
   * Ends the current session if one is present
   */
  const endSession = async () => {
    if (!appetize.session) return
    await appetize.client.endSession()
    appetize.session = null
    meta.sessionLoaded = false
  }

  /**
   * Restarts a session with the passed configuration
   * @param {object} configuration The configuration to be used
   */
  const restartSession = async (configuration) => {
    await endSession()
    await startSession(configuration)
  }

  // Watch on the device to update the iframe
  watch(
    () => appetizeControls.device,
    async (device) => {
      ;(await clientPromise).setConfig({
        device: device
      })
    }
  )

  watch(
    () => appetizeControls.version,
    async (version) => {
      ;(await clientPromise).setConfig({
        osVersion: version
      })
    }
  )

  // When the publicKey has been updated let's change the app
  watch(
    () => appetizeControls.application,
    async ({ publicKey, os }) => {
      const firstDevice = devices[os][0]
      appetizeControls.device = firstDevice.identifier
      appetizeControls.version = firstDevice.defaultOs
      ;(await clientPromise).setConfig({
        publicKey: publicKey
      })
    }
  )

  onBeforeMount(async () => {
    // Mark it as raw to prevent it to be reactive
    appetize.client = markRaw(await clientPromise)
  })

  // Injection to the component
  provide(appetizeClientKey, {
    controls: appetizeControls,
    meta,
    selector,
    actions: {
      takeScreenshot
    }
  })

  return {
    appetize,
    startSession,
    endSession,
    restartSession,
    onSessionStarted,
    appetizeControls,
    takeScreenshot,
    onScreenshotTaken
  }
}

// Same bahvior but specify that the selector used will be an id
export const useAppetizeClientFromId = (id, application, sessionConfiguration) =>
  useAppetizeClient(`#${id}`, application, sessionConfiguration)

export default useAppetizeClient
