<script>
// Components

import UserMessage from '@/components/UserMessage.component.vue'

// Helpers

import { INVALID_JSON, UNREADABLE_JSON } from '@/helpers/Text.helper'

export default {
  components: {
    UserMessage
  },
  data() {
    return {
      errorMessage: null,
      jsonData: null,
      jsonVisibility: false
    }
  },
  methods: {
    /**
     * Reacts and propagates the JSON file uploaded event.
     * @param event The JSON file uploaded event.
     */
    onJsonFile(event) {
      this.errorMessage = null
      const file = event.target.files[0]

      if (file && file.type === 'application/json') {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            this.jsonData = JSON.parse(e.target.result)
            this.$emit('onJsonFile', this.jsonData)
          } catch (error) {
            this.errorMessage = UNREADABLE_JSON
            this.jsonData = null
          }
        }
        reader.readAsText(file)
      } else {
        this.errorMessage = INVALID_JSON
        this.jsonData = null
      }
    },
    /**
     * Toggles the JSON content visibility.
     */
    toggleJsonVisibility() {
      this.jsonVisibility = !this.jsonVisibility
    }
  }
}
</script>

<template>
  <div>
    <UserMessage v-if="errorMessage" :message="errorMessage" type="danger" />
    <div class="d-flex align-items-center">
      <input type="file" class="form-control me-2" @change="onJsonFile" accept=".json" />
      <button v-if="jsonData" class="btn btn-light json-button" @click="toggleJsonVisibility">
        <i :class="jsonVisibility ? 'bi-x' : 'bi bi-filetype-json'"></i>
      </button>
    </div>
    <div :class="['border', 'p-3', 'mt-3', { 'd-none': !jsonVisibility }]">
      <pre class="json-content">{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.border {
  border: 1px solid #dee2e6;
}

.json-content {
  text-align: left;
}
</style>
