import './assets/main.css'
import { Spinner } from '@/components/loaders'
import { VInput, VSelect } from '@/components/inputs'
import { HeaderOne, HeaderTwo, HeaderThree, VLabel } from '@/components/typography'
import { VButton } from '@/components/buttons'
import { Modal } from '@/components/modals'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app
  .component('spinner', Spinner)
  .component('VInput', VInput)
  .component('VSelect', VSelect)
  .component('HeaderOne', HeaderOne)
  .component('HeaderTwo', HeaderTwo)
  .component('HeaderThree', HeaderThree)
  .component('VLabel', VLabel)
  .component('VButton', VButton)
  .component('Modal', Modal)

app.mount('#app')
