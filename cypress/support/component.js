import './commands'

import '@/assets/style/style.css'

import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount)
