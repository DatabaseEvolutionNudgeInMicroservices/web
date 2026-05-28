<script>
// Libraries
import axios from 'axios'

// Components
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'

// Helpers
import {
  CODE_BASE_URLS,
  DOWNLOAD,
  DOWNLOAD_PLACEHOLDER,
  INPUT_INCORRECTLY_FORMATTED,
  START_ENTER_GIT_URLS
} from '@/helpers/Text.helper'
import { GIT_URL_REGEX } from '@/helpers/Constants.helper'

export default {
  components: {
    UserMessage,
    Loader
  },
  data() {
    return {
      // Props.
      errorMessage: null,
      infoMessage: START_ENTER_GIT_URLS,
      loading: false,

      // Model: Git.
      gitUrls: [],
      gitUrlInputs: [''],

      // Texts.
      DOWNLOAD,
      DOWNLOAD_PLACEHOLDER,
      CODE_BASE_URLS
    }
  },
  methods: {
    addField() {
      this.gitUrlInputs.push('')
    },
    removeField(index) {
      this.gitUrlInputs.splice(index, 1)
    },
    validateUrls() {
      this.gitUrls = []
      for (const url of this.gitUrlInputs) {
        const trimmed = url.trim()
        if (!trimmed.match(GIT_URL_REGEX)) {
          return false
        }
        this.gitUrls.push(trimmed)
      }
      return this.gitUrls.length > 0
    },
    generateZipName() {
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      const hh = String(now.getHours()).padStart(2, '0')
      const min = String(now.getMinutes()).padStart(2, '0')
      const ss = String(now.getSeconds()).padStart(2, '0')
      return `denim_${yyyy}_${mm}_${dd}_${hh}_${min}_${ss}`
    },
    async onDownload() {
      this.errorMessage = null
      if (!this.validateUrls()) {
        this.errorMessage = INPUT_INCORRECTLY_FORMATTED
        return
      }
      try {
        this.onLoading(true)

        await new Promise((resolve) => setTimeout(resolve, 100))

        const response = await axios.post(
          import.meta.env.VITE_DOWNLOADING_MICROSERVICE + '/git',
          this.gitUrls,
          { responseType: 'blob' }
        )

        const blob = new Blob([response.data], { type: 'application/zip' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(DOWNLOAD, `${this.generateZipName()}.zip`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        this.infoMessage = null
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.onLoading(false)
      }
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
    <div>
      <span>{{ CODE_BASE_URLS }}:</span>
    </div>
    <div v-for="(input, index) in gitUrlInputs" :key="index" class="url-control">
      <input
        type="text"
        class="form-control"
        v-model="gitUrlInputs[index]"
        :placeholder="DOWNLOAD_PLACEHOLDER"
      />
      <button
        class="btn btn-sm btn-danger"
        @click="removeField(index)"
        v-if="gitUrlInputs.length > 1"
      >
        -
      </button>
    </div>
    <button class="btn btn-light url-control" @click="addField">+</button>
    <div>
      <button class="btn btn-light url-control" :disabled="loading" @click="onDownload">
        <i class="bi bi-download"></i>
      </button>
    </div>
  </div>
  <div :class="['top', 'text-center', loading ? '' : 'd-none']">
    <Loader :visibility="loading" />
  </div>
</template>

<style scoped>
/* Controls */
.url-control {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 10px;
}

.url-control input,
.url-control button {
  display: flex;
  margin: 5px;
}
</style>
