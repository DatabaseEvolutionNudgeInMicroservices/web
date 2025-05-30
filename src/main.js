// Style

import './assets/style.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// App

import { createApp } from 'vue'
import App from './App.vue'

// Router

import router from './routers'

// Store

import { createPinia } from 'pinia'

// App

const app = createApp(App)

// Router

app.use(router)
app.mount('#app')

// Store

const pinia = createPinia()
app.use(pinia)
