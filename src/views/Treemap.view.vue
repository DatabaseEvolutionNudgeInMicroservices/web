<script>
// Libraries
import axios from 'axios'

// Components
import JsonFileUploader from '@/components/JsonFileUploader.component.vue'
import Treemap from '@/components/Treemap.component.vue'
import UserMessage from '@/components/UserMessage.component.vue'
import Loader from '@/components/Loader.component.vue'

// Helpers
import { DEMO, START_UPLOAD_JSON } from '@/helpers/Text.helper'
import { DEMO_TREEMAP } from '@/helpers/Constants.helper'

export default {
  components: {
    JsonFileUploader,
    Treemap,
    UserMessage,
    Loader
  },
  data() {
    return {
      // Demo.
      DEMO_TREEMAP,

      // Texts.
      DEMO,

      // Props.
      errorMessage: null,
      infoMessage: START_UPLOAD_JSON,
      loading: false,
      jsonData: null,
      treemap: null,
      technologies: [],
      operations: [],
      locations: [],
      methods: [],
      concepts: [],
      conceptsMatrix: null,
      directoriesNumber: 0,
      filesNumber: 0,
      codeFragmentsNumber: 0,
      conceptsNumber: 0,
      operationsTechnologiesBreakdown: 0,
      conceptsBreakdown: null,
      loc: 0,
      tir: 0,
      cir: 0,
      filteredCodeFragments: []
    }
  },
  methods: {
    async onDemo() {
      try {
        const response = await fetch(DEMO_TREEMAP)
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

      // Technology list (via evolution microservice).
      const technologiesListPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/technologies', jsonData)
        .then(function (response) {
          self.technologies = response.data
        })

      // Operation list (via evolution microservice).
      const operationsListPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/operations', jsonData)
        .then(function (response) {
          self.operations = response.data
        })

      // Methods list (via evolution microservice).
      const methodsListPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/methods', jsonData)
        .then(function (response) {
          self.methods = response.data
        })

      // Concepts list (via evolution microservice).
      const conceptsListPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/list/concepts', jsonData)
        .then(function (response) {
          self.concepts = response.data
        })

      // Concepts matrix (via evolution microservice).
      const conceptsMatrixPromise = axios
        .post(
          import.meta.env.VITE_EVOLVING_MICROSERVICE + '/coupling/similarity/conceptual',
          jsonData
        )
        .then(function (response) {
          self.conceptsMatrix = response.data
        })

      // Directories number (via evolution microservice).
      const directoriesNumberPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/number/directories', jsonData)
        .then(function (response) {
          self.directoriesNumber = response.data
        })

      // Files number (via evolution microservice).
      const filesNumberPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/number/files', jsonData)
        .then(function (response) {
          self.filesNumber = response.data
        })

      // Code fragments number (via evolution microservice).
      const codeFragmentsNumberPromise = axios
        .post(
          import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/number/code-fragments',
          jsonData
        )
        .then(function (response) {
          self.codeFragmentsNumber = response.data
        })

      // Concepts number (via evolution microservice).
      const conceptsNumberPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/number/concepts', jsonData)
        .then(function (response) {
          self.conceptsNumber = response.data
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

      // Concepts breakdown (via evolution microservice).
      const conceptsBreakdownPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/breakdown/concepts', jsonData)
        .then(function (response) {
          self.conceptsBreakdown = response.data
        })

      // LoC (via evolution microservice).
      const locPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/loc', jsonData)
        .then(function (response) {
          self.loc = response.data
        })

      // TIR (via evolution microservice).
      const tirPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/tir', jsonData)
        .then(function (response) {
          self.tir = response.data
        })

      // CIR (via evolution microservice).
      const cirPromise = axios
        .post(import.meta.env.VITE_EVOLVING_MICROSERVICE + '/metric/cir', jsonData)
        .then(function (response) {
          self.cir = response.data
        })

      Promise.all([
        treemapPromise,
        locationsListPromise,
        technologiesListPromise,
        operationsListPromise,
        methodsListPromise,
        conceptsListPromise,
        conceptsMatrixPromise,
        directoriesNumberPromise,
        filesNumberPromise,
        codeFragmentsNumberPromise,
        conceptsNumberPromise,
        operationsTechnologiesBreakdownPromise,
        conceptsBreakdownPromise,
        locPromise,
        tirPromise,
        cirPromise
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
          this.jsonData
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
    <Treemap
      v-if="treemap"
      :treemap="treemap"
      :locations="locations"
      :technologies="technologies"
      :operations="operations"
      :methods="methods"
      :concepts="concepts"
      :conceptsMatrix="conceptsMatrix"
      :directoriesNumber="directoriesNumber"
      :filesNumber="filesNumber"
      :codeFragmentsNumber="codeFragmentsNumber"
      :conceptsNumber="conceptsNumber"
      :operationsTechnologiesBreakdown="operationsTechnologiesBreakdown"
      :conceptsBreakdown="conceptsBreakdown"
      :loc="loc"
      :tir="tir"
      :cir="cir"
      :filteredCodeFragments="filteredCodeFragments"
      @onFilterCodeFragments="onFilterCodeFragments"
    />
  </div>
  <div class="container top text-center">
    <span class="large-button top bottom" @click="onDemo()">{{ DEMO }}</span>
  </div>
</template>
