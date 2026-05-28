<script>
// Libraries
import axios from 'axios'

// Components
import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'
import DifferenceTreemap from '@/components/DifferenceTreemap.component.vue'

// Helpers
import { DEMO, START_UPLOAD_JSON } from '@/helpers/Text.helper'
import { DEMO_DIFFERENCE_TREEMAP_1, DEMO_DIFFERENCE_TREEMAP_2 } from '@/helpers/Constants.helper'

export default {
  components: {
    DifferenceTreemap,
    JsonFileUploader,
    UserMessage,
    Loader
  },
  data() {
    return {
      // Demo.
      DEMO_DIFFERENCE_TREEMAP_1,
      DEMO_DIFFERENCE_TREEMAP_2,

      // Texts.
      DEMO,

      // Props.
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,
      treemap1: null,
      treemap2: null,
      jsonData1: null,
      jsonData2: null,
      differences: null
    }
  },
  methods: {
    async onDemo() {
      try {
        const response1 = await fetch(DEMO_DIFFERENCE_TREEMAP_1)
        const content1 = await response1.text()
        const response2 = await fetch(DEMO_DIFFERENCE_TREEMAP_2)
        const content2 = await response2.text()
        await this.onJsonFile1(JSON.parse(content1))
        await this.onJsonFile2(JSON.parse(content2))
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    async onJsonFile1(jsonData) {
      this.onLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 100)) // Voluntary delay for loader display.

      this.jsonData1 = jsonData
      let self = this

      // Treemap (via visualization microservice).
      const treemap1Promise = axios
        .post(import.meta.env.VITE_VISUALIZING_MICROSERVICE + '/treemap', jsonData)
        .then(function (response) {
          self.treemap1 = response.data
          self.treemap2 = []
          self.differences = []
        })

      Promise.all([treemap1Promise])
        .then(() => {
          this.infoMessage = null
          this.errorMessage = null
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
        .finally(() => {
          this.onLoading(false)
        })
    },
    async onJsonFile2(jsonData) {
      this.onLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 100)) // Voluntary delay for loader display.

      this.jsonData2 = jsonData
      let self = this

      // Treemap (via visualization microservice).
      const treemap2Promise = axios
        .post(import.meta.env.VITE_VISUALIZING_MICROSERVICE + '/treemap', jsonData)
        .then(function (response) {
          self.treemap2 = response.data
        })

      // Difference (via evolution microservice).
      const differencePromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/coupling/evolutionary/difference', [
          this.jsonData1,
          this.jsonData2
        ])
        .then(function (response) {
          self.differences = response.data
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
        .finally(() => {
          this.onLoading(false)
        })

      Promise.all([treemap2Promise, differencePromise])
        .then(() => {
          this.infoMessage = null
          this.errorMessage = null
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
        .finally(() => {
          this.onLoading(false)
        })
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
  <div class="container top text-center mirror">
    <JsonFileUploader @onJsonFile="onJsonFile1" class="w-50 right" />
    <JsonFileUploader @onJsonFile="onJsonFile2" class="w-50 left" />
  </div>
  <div :class="['top', 'text-center', loading ? '' : 'd-none']">
    <Loader :visibility="loading" />
  </div>
  <div class="top visualization">
    <DifferenceTreemap
      v-if="treemap1 && treemap2 && differences"
      :treemap1="treemap1"
      :treemap2="treemap2"
      :differences="differences"
    />
  </div>
  <div class="container top text-center">
    <span class="large-button top bottom" @click="onDemo()">{{ DEMO }}</span>
  </div>
</template>
