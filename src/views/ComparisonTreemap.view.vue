<script>
// Libraries
import axios from 'axios'

// Components
import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'
import ComparisonTreemap from '@/components/ComparisonTreemap.component.vue'

// Helpers
import { DEMO, START_UPLOAD_JSON } from '@/helpers/Text.helper'
import { DEMO_COMPARISON_TREEMAP_1, DEMO_COMPARISON_TREEMAP_2 } from '@/helpers/Constants.helper'

export default {
  components: {
    ComparisonTreemap,
    JsonFileUploader,
    UserMessage,
    Loader
  },
  data() {
    return {
      // Demo.
      DEMO_COMPARISON_TREEMAP_1,
      DEMO_COMPARISON_TREEMAP_2,

      // Texts.
      DEMO,

      // Props.
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,
      jsonData1: null,
      jsonData2: null,
      treemap1: null,
      treemap2: null,
      technologies: [],
      operations: [],
      locations: [],
      methods: [],
      concepts: [],
      filteredCodeFragments: []
    }
  },
  methods: {
    async onDemo() {
      try {
        const response1 = await fetch(DEMO_COMPARISON_TREEMAP_1)
        const content1 = await response1.text()
        const response2 = await fetch(DEMO_COMPARISON_TREEMAP_2)
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
        })

      // Locations list (via evolution microservice).
      const locationsList1Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/locations', jsonData)
        .then(function (response) {
          self.locations = response.data
        })

      // Technology list (via evolution microservice).
      const technologiesList1Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/technologies', jsonData)
        .then(function (response) {
          self.technologies = response.data
        })

      // Operation list (via evolution microservice).
      const operationsList1Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/operations', jsonData)
        .then(function (response) {
          self.operations = response.data
        })

      // Methods list (via evolution microservice).
      const methodsList1Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/methods', jsonData)
        .then(function (response) {
          self.methods = response.data
        })

      // Concepts list (via evolution microservice).
      const conceptsList1Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/concepts', jsonData)
        .then(function (response) {
          self.concepts = response.data
        })

      Promise.all([
        treemap1Promise,
        locationsList1Promise,
        technologiesList1Promise,
        operationsList1Promise,
        methodsList1Promise,
        conceptsList1Promise
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

      // Locations list (via evolution microservice).
      const locationsList2Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/locations', jsonData)
        .then(function (response) {
          self.locations = [...new Set(self.technologies.concat(response.data))]
        })

      // Technology list (via evolution microservice).
      const technologiesList2Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/technologies', jsonData)
        .then(function (response) {
          self.technologies = [...new Set(self.technologies.concat(response.data))]
        })

      // Operation list (via evolution microservice).
      const operationsList2Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/operations', jsonData)
        .then(function (response) {
          self.operations = [...new Set(self.operations.concat(response.data))]
        })

      // Methods list (via evolution microservice).
      const methodsList2Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/methods', jsonData)
        .then(function (response) {
          self.methods = [...new Set(self.methods.concat(response.data))]
        })

      // Concepts list (via evolution microservice).
      const conceptsList2Promise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/concepts', jsonData)
        .then(function (response) {
          self.concepts = [...new Set(self.concepts.concat(response.data))]
        })

      Promise.all([
        treemap2Promise,
        locationsList2Promise,
        technologiesList2Promise,
        operationsList2Promise,
        methodsList2Promise,
        conceptsList2Promise
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
    onFilterCodeFragments(location, technology, operation, method, concepts) {
      this.onLoading(true)
      // Filtered code fragments (via evolution microservice).
      let locationFormatted = location ? location : '-'
      let technologyFormatted = technology ? technology : '-'
      let operationFormatted = operation ? operation : '-'
      let methodFormatted = method ? method : '-'
      let conceptsFormatted = concepts && concepts.length !== 0 ? concepts.join('&') : '-'
      let self = this
      axios
        .post(
          import.meta.env.VITE_EVOLVING_MICROSERVICE +
            `/coupling/similarity/code-fragment/path/${encodeURIComponent(locationFormatted)}/technology/${encodeURIComponent(technologyFormatted)}/operation/${encodeURIComponent(operationFormatted)}/method/${encodeURIComponent(methodFormatted)}/concepts/${encodeURIComponent(conceptsFormatted)}`,
          this.jsonData1
        )
        .then(function (response) {
          self.filteredCodeFragments = response.data
        })
        .catch((error) => {
          this.errorMessage = error.message
        })
        .finally(() => {
          this.onLoading(false)
        })
      if (this.jsonData2) {
        axios
          .post(
            import.meta.env.VITE_EVOLVING_MICROSERVICE +
              `/coupling/similarity/code-fragment/path/${encodeURIComponent(locationFormatted)}/technology/${encodeURIComponent(technologyFormatted)}/operation/${encodeURIComponent(operationFormatted)}/method/${encodeURIComponent(methodFormatted)}/concepts/${encodeURIComponent(conceptsFormatted)}`,
            this.jsonData2
          )
          .then(function (response) {
            self.filteredCodeFragments = self.filteredCodeFragments.concat(response.data)
          })
          .catch((error) => {
            this.errorMessage = error.message
          })
          .finally(() => {
            this.onLoading(false)
          })
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
  <div class="container top text-center mirror">
    <JsonFileUploader @onJsonFile="onJsonFile1" class="w-50 right" />
    <JsonFileUploader @onJsonFile="onJsonFile2" class="w-50 left" />
  </div>
  <div :class="['top', 'text-center', loading ? '' : 'd-none']">
    <Loader :visibility="loading" />
  </div>
  <div class="top visualization">
    <ComparisonTreemap
      v-if="treemap1 && treemap2"
      :treemap1="treemap1"
      :treemap2="treemap2"
      :locations="locations"
      :technologies="technologies"
      :operations="operations"
      :methods="methods"
      :concepts="concepts"
      :filteredCodeFragments="filteredCodeFragments"
      @onFilterCodeFragments="onFilterCodeFragments"
    />
  </div>
  <div class="container top text-center">
    <span class="large-button top bottom" @click="onDemo()">{{ DEMO }}</span>
  </div>
</template>
