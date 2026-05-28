<script>
// Libraries
import axios from 'axios'

// Components
import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'
import EvolutionaryTreemap from '@/components/EvolutionaryTreemap.component.vue'

// Helpers
import { DEMO, START_UPLOAD_JSON } from '@/helpers/Text.helper'
import { DEMO_EVOLUTIONARY_TREEMAP } from '@/helpers/Constants.helper'

export default {
  components: {
    EvolutionaryTreemap,
    JsonFileUploader,
    UserMessage,
    Loader
  },
  data() {
    return {
      // Demo.
      DEMO_EVOLUTIONARY_TREEMAP,

      // Texts.
      DEMO,

      // Props.
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,
      treemap: null,
      jsonData: null,
      locations: [],
      coChangedFiles: [],
      coChangedConcepts: null
    }
  },
  methods: {
    async onDemo() {
      try {
        const response = await fetch(DEMO_EVOLUTIONARY_TREEMAP)
        const content = await response.text()
        await this.onJsonFile(JSON.parse(content))
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    async onJsonFile(jsonData) {
      this.onLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 100)) // Voluntary delay for loader display.

      this.jsonData = jsonData
      let self = this

      // Treemap (via visualization microservice).
      const treemapPromise = axios
        .post(import.meta.env.VITE_VISUALIZING_MICROSERVICE + '/treemap', jsonData)
        .then(function (response) {
          self.treemap = response.data
        })

      // Locations list (via evolution microservice).
      const locationsListPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/locations', jsonData)
        .then(function (response) {
          self.locations = response.data
        })

      Promise.all([treemapPromise, locationsListPromise])
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
    },
    onVersionalEvolutionaryCoupling(location) {
      this.onLoading(true)
      // Co-changed files (via evolution microservice).
      let self = this
      axios
        .post(
          import.meta.env.VITE_EVOLVING_MICROSERVICE +
            '/coupling/evolutionary/versional/path/' +
            encodeURIComponent(location),
          this.jsonData
        )
        .then(function (response) {
          self.coChangedFiles = response.data
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
        .finally(() => {
          this.onLoading(false)
        })
    },
    onConceptualEvolutionaryCoupling(location) {
      this.onLoading(true)
      // Co-changed concepts (via evolution microservice).
      let self = this
      axios
        .post(
          import.meta.env.VITE_EVOLVING_MICROSERVICE +
            '/coupling/evolutionary/conceptual/path/' +
            encodeURIComponent(location),
          this.jsonData
        )
        .then(function (response) {
          self.coChangedConcepts = response.data
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
        .finally(() => {
          this.onLoading(false)
        })
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
    <EvolutionaryTreemap
      v-if="treemap"
      :treemap="treemap"
      :locations="locations"
      :coChangedFiles="coChangedFiles"
      :coChangedConcepts="coChangedConcepts"
      @onVersionalEvolutionaryCoupling="onVersionalEvolutionaryCoupling"
      @onConceptualEvolutionaryCoupling="onConceptualEvolutionaryCoupling"
    />
  </div>
  <div class="container top text-center">
    <span class="large-button top bottom" @click="onDemo()">{{ DEMO }}</span>
  </div>
</template>
