<script>
// Components
import UserMessage from '@/components/UserMessage.component.vue'

// Helpers
import { INVALID_JSON, SELECT_FILE, UNREADABLE_JSON } from '@/helpers/Text.helper'

export default {
  components: {
    UserMessage
  },
  data() {
    return {
      // Model: Error.
      errorMessage: null,

      // Model: JSON.
      jsonData: null,
      jsonVisibility: false,

      // Model: File.
      fileName: '',

      // Texts.
      SELECT_FILE,
      INVALID_JSON,
      UNREADABLE_JSON
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
        this.fileName = file.name
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
  <div class="uploader">
    <UserMessage v-if="errorMessage" :message="errorMessage" type="danger" />
    <div class="controls">
      <label class="btn btn-light form-control settings-button">
        <i class="bi bi-paperclip"></i>
        <input type="file" @change="onJsonFile" accept=".json" hidden />
        <span class="file-name">
          {{ fileName || SELECT_FILE }}
        </span>
      </label>
      <button v-if="jsonData" class="btn btn-light json-button" @click="toggleJsonVisibility">
        <i :class="jsonVisibility ? 'bi-x' : 'bi bi-filetype-json'"></i>
      </button>
    </div>
    <div v-if="jsonVisibility" class="json-content">
      <pre>{{ JSON.stringify(jsonData, null, 2) }}</pre>
    </div>
  </div>
</template>

<style>
.uploader {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.controls {
  display: flex;
}

.file-name {
  margin-left: 5px;
}

.json-button {
  margin-left: 5px;
}

.json-content {
  border: 1px solid #dee2e6;
  border-radius: 5px;
  overflow: auto;
  margin: 5px;
  padding: 5px;
}

.json-content pre {
  text-align: left;
}
</style>
