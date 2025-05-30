import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'tests/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    defaultCommandTimeout: 10000
  },
  component: {
    specPattern: 'tests/components/**/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
})
