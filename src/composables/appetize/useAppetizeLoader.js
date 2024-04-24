import { ref, onBeforeMount, computed } from 'vue'

let loader = null
let script = null

/**
 *
 * @param {Function} callback The callback to register when the appetize.io script finished loading
 * @param {Function} onError The callback to register when the appetize.io script finished with a error status
 * @param {bool} eager When true registers the loader on the onBeforeMount event of vue to start loading the script
 * @returns {object} Returns the api to interact with this composition
 */
const useAppetizeLoader = ({ callback, onError, eager }) => {
  // Onlny one loader per instance is needed no more
  if (loader == null) {
    loader = {
      callback: callback,
      loaded: ref(false),
      loading: ref(false),
      errors: ref([]),
      script: () => {
        if (script) {
          return
        }
        loader.loading.value = true
        const url = 'https://js.appetize.io/embed.js'
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url
        script.onerror = (e) => {
          // TODO think on reset possibility and retries and clean errors or continue adding them
          script.errors.value.append(e)
          if (onError && typeof onError == 'function') {
            onError(e)
          }
        }
        script.defer = true
        script.async = true

        // Register the on load callback for the script
        script.onload = () => {
          // Mark the status as it is already loaded and not loading
          loader.loaded.value = true
          loader.loading.value = false
        }

        document.head.appendChild(script)
      },
      execute: () => {
        // It has loaded let's call the callback
        if (loader.loaded.value) {
          if (callback && typeof callback == 'function') {
            callback()
          }
        }
        // Don't do anything if it's still loading
        if (loader.loading.value) {
          return
        }

        loader.script()
      }
    }
  }

  // Eager behaviour
  if (eager) {
    onBeforeMount(() => {
      loader.execute()
    })
  }

  // We will create computed properties and prevent to be mutated outside the values
  const loaded = computed(() => loader.loaded.value)
  const loading = computed(() => loader.loading.value)
  const errors = computed(() => loader.errors.value)

  return {
    loaded,
    loading,
    errors,
    execute: loader.execute
  }
}

export default useAppetizeLoader
