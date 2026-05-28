<script>
// Libraries
import axios from 'axios'

// Components
import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import AnimatedHeatTreemap from '@/components/AnimatedHeatTreemap.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'

// Helpers
import { DEMO, START_UPLOAD_JSON } from '@/helpers/Text.helper'
import { DEMO_ANIMATED_HEAT_TREEMAP } from '@/helpers/Constants.helper'

export default {
  components: {
    AnimatedHeatTreemap,
    JsonFileUploader,
    UserMessage,
    Loader
  },
  data() {
    return {
      // Demo.
      DEMO_ANIMATED_HEAT_TREEMAP,

      // Texts.
      DEMO,

      // Props.
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,
      treemap: null,
      frames: null,
      minMaxFrames: null,
      operationsTechnologiesBreakdown: null
    }
  },
  methods: {
    async onDemo() {
      try {
        const response = await fetch(DEMO_ANIMATED_HEAT_TREEMAP)
        const content = await response.text()
        await this.onJsonFile(JSON.parse(content))
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    async onJsonFile(jsonData) {
      this.onLoading(true)
      this.infoMessage = null
      this.errorMessage = null
      await new Promise((resolve) => setTimeout(resolve, 100)) // Voluntary delay for loader display.
      let self = this

      // Treemap (via visualization microservice).
      const treemapPromise = axios
        .post(import.meta.env.VITE_VISUALIZING_MICROSERVICE + '/treemap', jsonData)
        .then(function (response) {
          self.treemap = response.data
        })

      // Frames (via visualization microservice).
      const framesPromise = axios
        .post(import.meta.env.VITE_VISUALIZING_MICROSERVICE + '/frames', jsonData)
        .then(function (response) {
          self.frames = response.data
        })

      // Min max calls number (via visualization microservice).
      const minMaxPromise = axios
        .post(import.meta.env.VITE_VISUALIZING_MICROSERVICE + '/minmax', jsonData)
        .then(function (response) {
          self.minMaxFrames = response.data
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
        treemapPromise,
        framesPromise,
        minMaxPromise,
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
    <AnimatedHeatTreemap
      v-if="treemap && frames && minMaxFrames"
      :treemap="treemap"
      :minMaxFrames="minMaxFrames"
      :frames="frames"
      :operationsTechnologiesBreakdown="operationsTechnologiesBreakdown"
    />
  </div>
  <div class="container top text-center">
    <span class="large-button top bottom" @click="onDemo()">{{ DEMO }}</span>
  </div>
</template>
