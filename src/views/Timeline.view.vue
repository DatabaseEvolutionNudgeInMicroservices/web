<script>
// Libraries
import axios from 'axios'

// Components
import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import Timeline from '@/components/Timeline.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'

// Helpers
import { DEMO, START_UPLOAD_JSON } from '@/helpers/Text.helper'
import { DEMO_TIMELINE } from '@/helpers/Constants.helper'

export default {
  components: {
    JsonFileUploader,
    Timeline,
    UserMessage,
    Loader
  },
  data() {
    return {
      // Demo.
      DEMO_TIMELINE,

      // Texts.
      DEMO,

      // Props.
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,
      frames: null,
      technologies: null,
      operations: null,
      operationsTechnologiesBreakdown: null
    }
  },
  methods: {
    async onDemo() {
      try {
        const response = await fetch(DEMO_TIMELINE)
        const content = await response.text()
        await this.onJsonFile(JSON.parse(content))
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    async onJsonFile(jsonData) {
      this.onLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 100)) // Voluntary delay for loader display.

      let self = this

      // Frames (via visualization microservice).
      const framesPromise = axios
        .post(import.meta.env.VITE_VISUALIZING_MICROSERVICE + '/frames', jsonData)
        .then(function (response) {
          self.frames = response.data
        })

      // Technology list (via evolution microservice).
      const technologyListPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/technologies', jsonData)
        .then(function (response) {
          self.technologies = response.data
        })

      // Operation list (via evolution microservice).
      const operationListPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/operations', jsonData)
        .then(function (response) {
          self.operations = response.data
        })

      // Operations technologies breakdown (via evolution microservice).
      const operationsTechnologiesBreakdownPromise = axios
        .post(
          import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/breakdown/operations-technologies',
          jsonData
        )
        .then(function (response) {
          self.operationsTechnologiesBreakdown = response.data
        })

      Promise.all([
        framesPromise,
        technologyListPromise,
        operationListPromise,
        operationsTechnologiesBreakdownPromise
      ])
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
  <div class="container top text-center">
    <JsonFileUploader @onJsonFile="onJsonFile" />
  </div>
  <div :class="['top', 'text-center', loading ? '' : 'd-none']">
    <Loader :visibility="loading" />
  </div>
  <div class="top visualization">
    <Timeline
      v-if="frames"
      :frames="frames"
      :technologies="technologies"
      :operations="operations"
      :operationsTechnologiesBreakdown="operationsTechnologiesBreakdown"
    />
  </div>
  <div class="container top text-center">
    <span class="large-button top bottom" @click="onDemo()">{{ DEMO }}</span>
  </div>
</template>
