import './commands'

import '@/assets/style.css'

import { mount } from 'cypress/vue'

Cypress.Commands.add('mount', mount)
