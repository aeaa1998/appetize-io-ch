import { reactive, inject, provide } from 'vue'
import { notificationKey } from '@/utils/keys.js'

let notificationTimeout = null

const useNotification = () => {
  const injected = inject(notificationKey)

  // There is a state injected lets use it
  if (injected) {
    return injected
  }

  // Creates the state of the notification
  const notification = reactive({
    show: false,
    title: '',
    message: '',
    type: '',
    showNotification: (title, message, type) => {
      // There is a notification lets hide it
      if (notification.show) {
        notification.show = false
      }
      // Clear the timeout to hide the notification
      if (notificationTimeout) {
        clearTimeout(notificationTimeout)
      }
      notification.title = title
      notification.message = message
      notification.type = type
      notification.show = true

      // After three seconds hide notification
      notificationTimeout = setTimeout(() => {
        notification.show = false
      }, 3000)
    },
    showSuccess: (title, message) => {
      notification.showNotification(title, message, 'success')
    }
  })

  // Inject the state so following views get the same instance
  provide(notificationKey, notification)

  return notification
}

export default useNotification
