import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { findCodeBySourceMap } from './utils'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.errorHandler = (err,vm) => {
    const errorStack = ErrorStackParser.parse(err)
    findCodeBySourceMap(errorStack[0])
}

app.mount('#app')
