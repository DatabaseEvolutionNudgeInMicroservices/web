<script>
// Libraries
import axios from 'axios'

// Components
import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import ZipFileUploader from '@/components/ZipFileUploader.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'

// Helpers
import {
  CODE_BASE,
  INVALID_JSON,
  INVALID_ZIP,
  OPTIONS,
  START_UPLOAD_JSON,
  START_UPLOAD_ZIP
} from '@/helpers/Text.helper'

export default {
  components: {
    JsonFileUploader,
    ZipFileUploader,
    UserMessage,
    Loader
  },
  data() {
    return {
      // Props
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,

      // Model: Analysis.
      options: null,
      zip: null,

      // Texts.
      OPTIONS,
      CODE_BASE,
      START_UPLOAD_JSON,
      START_UPLOAD_ZIP
    }
  },
  methods: {
    onJsonFile(jsonData) {
      this.options = jsonData
      this.infoMessage = START_UPLOAD_ZIP
    },
    onZipFile(arrayBuffer) {
      this.zip = arrayBuffer
    },
    async onSubmit() {
      this.errorMessage = null
      if (!this.zip) {
        this.errorMessage = INVALID_ZIP
        return
      }
      if (!this.options) {
        this.errorMessage = INVALID_JSON
        return
      }

      try {
        this.onLoading(true)

        // Codebase.
        const zipBlob = new Blob([this.zip], {
          type: 'application/zip'
        })
        const formData = new FormData()
        formData.append('file', zipBlob, 'upload.zip')

        // Options
        formData.append('options', JSON.stringify(this.options))

        const response = await axios.post(
          import.meta.env.VITE_REVERSE_ENGINEERING_MICROSERVICE + '/static/ast',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        this.downloadJson(response.data)

        this.infoMessage = null
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.onLoading(false)
      }
    },
    downloadJson(data) {
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const hh = String(now.getHours()).padStart(2, '0')
      const min = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      const fileName = `denim_${yyyy}_${mm}_${dd}_${hh}_${min}_${ss}.json`

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    onLoading(status) {
      this.loading = status
    }
  }
}
</script>

<template>
  <div class="container top text-center">
    <UserMessage
      v-if="infoMessage"
      :message="infoMessage"
      type="info"
      @close="infoMessage = null"
    />
    <UserMessage
      v-if="errorMessage"
      :message="errorMessage"
      type="danger"
      @close="errorMessage = null"
    />
  </div>
  <div class="container top text-center">
    <!-- Upload options -->
    <div>
      <span>{{ OPTIONS }}:</span>
    </div>
    <JsonFileUploader @onJsonFile="onJsonFile" class="top" />

    <!-- Upload ZIP -->
    <div class="top">
      <span>{{ CODE_BASE }}:</span>
    </div>
    <ZipFileUploader @onZipFile="onZipFile" class="top" />

    <div>
      <button class="btn btn-light analysis-control" :disabled="loading" @click="onSubmit">
        <i class="bi bi-rocket-takeoff-fill"></i>
      </button>
    </div>
  </div>
  <div :class="['top', 'text-center', loading ? '' : 'd-none']">
    <Loader :visibility="loading" />
  </div>
</template>

<style scoped>
/* Controls */
.analysis-control {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 10px;
}
</style>
