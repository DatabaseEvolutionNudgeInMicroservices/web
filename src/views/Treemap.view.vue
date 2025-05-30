<script>
// Libraries

import axios from 'axios'

// Components

import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import Treemap from '@/components/Treemap.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'

// Helpers

import { START_UPLOAD_JSON } from '@/helpers/Text.helper'

export default {
  components: {
    JsonFileUploader,
    Treemap,
    UserMessage,
    Loader
  },
  data() {
    return {
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,
      treemap: null,
      technologies: null,
      operations: null,
      concepts: null
    }
  },
  methods: {
    async onJsonFile(jsonData) {
      this.onLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 100)) // Volontary delay for loader display.

      // Treemap (via visualization microservice).

      let self = this
      axios
        .post(import.meta.env.VITE_VISUALIZATION_MICROSERVICE + '/treemap', jsonData)
        .then(function (response) {
          self.treemap = response.data
        })

      // Technology list (via evolution microservice)

      axios
        .post(import.meta.env.VITE_EVOLUTION_MICROSERVICE + '/technologies', jsonData)
        .then(function (response) {
          self.technologies = response.data
        })

      // Operation list (via evolution microservice)

      axios
        .post(import.meta.env.VITE_EVOLUTION_MICROSERVICE + '/operations', jsonData)
        .then(function (response) {
          self.operations = response.data
        })

      // Concept list (via evolution microservice)

      axios
        .post(import.meta.env.VITE_EVOLUTION_MICROSERVICE + '/concepts', jsonData)
        .then(function (response) {
          self.concepts = response.data
        })

      try {
        // Error messages
        this.infoMessage = null
        this.errorMessage = null
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
    <UserMessage v-if="infoMessage" :message="infoMessage" type="info" />
    <UserMessage v-if="errorMessage" :message="errorMessage" type="danger" />
  </div>
  <div class="container top text-center">
    <JsonFileUploader @onJsonFile="onJsonFile" />
  </div>
  <div :class="['top', 'text-center', loading ? '' : 'd-none']">
    <Loader :visibility="loading" />
  </div>
  <div class="top visualization">
    <Treemap
      v-if="treemap"
      :treemap="treemap"
      :technologies="technologies"
      :operations="operations"
      :concepts="concepts"
    />
  </div>
</template>

<style scoped>
.visualization {
  width: 100%;
}
</style>
