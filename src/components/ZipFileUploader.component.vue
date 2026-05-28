<script>
// Components
import UserMessage from '@/components/UserMessage.component.vue'

// Helpers
import { INVALID_ZIP, SELECT_FILE, UNREADABLE_ZIP } from '@/helpers/Text.helper'

export default {
  components: {
    UserMessage
  },
  data() {
    return {
      // Model: Errors.
      errorMessage: null,
      loading: false,

      // Model: File.
      zipData: null,
      fileName: '',

      // Texts.
      SELECT_FILE
    }
  },
  methods: {
    /**
     * Reacts and propagates the ZIP file uploaded event.
     * @param event The ZIP file uploaded event.
     */
    async onZipFile(event) {
      this.errorMessage = null
      const file = event.target.files[0]

      if (file && (file.type === 'application/zip' || file.name.endsWith('.zip'))) {
        this.fileName = file.name
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            this.zipData = e.target.result
            this.$emit('onZipFile', this.zipData)
          } catch (error) {
            this.errorMessage = UNREADABLE_ZIP
            this.zipData = null
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        this.errorMessage = INVALID_ZIP
        this.zipData = null
      }
    }
  }
}
</script>

<template>
  <div class="uploader">
    <UserMessage v-if="errorMessage" :message="errorMessage" type="danger" />

    <div class="controls">
      <label class="btn btn-light form-control settings-button">
        <i class="bi bi-file-zip"></i>
        <input type="file" @change="onZipFile" accept=".zip" hidden />
        <span class="file-name">
          {{ fileName || SELECT_FILE }}
        </span>
      </label>
    </div>
  </div>
</template>

<style scoped>
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
</style>
