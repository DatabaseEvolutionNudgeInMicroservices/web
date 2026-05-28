<script>
// Libraries
import { nextTick } from 'vue'

// Components
import ColorSlider from '@/components/ColorSlider.component.vue'
import ConceptsMatrix from '@/components/ConceptsMatrix.component.vue'
import ZoomControls from '@/components/ZoomControls.component.vue'
import ToolTip from '@/components/ToolTip.component.vue'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

// Helpers
import { DataMapper } from '@/helpers/DataMapper.helper'
import {
  IMAGE_SCALE,
  IMAGE_SHIFT,
  IMAGES,
  MAX_ZOOM,
  MIN_ZOOM,
  NO_OPAQUE,
  OPAQUE,
  SVG_NS,
  ZOOM_FACTOR
} from '@/helpers/Constants.helper'
import {
  CODE_FRAGMENTS_NUMBER,
  CONCEPTS_NUMBER,
  DIRECTORIES_NUMBER,
  FILES_NUMBER,
  FILTERING,
  LOC,
  METRICS,
  NO_DATA,
  SELECT_CONCEPTS,
  SELECT_LOCATION,
  SELECT_METHOD,
  SELECT_OPERATION,
  SELECT_TECHNOLOGY,
  STATIC,
  TECHNOLOGIES_OPERATIONS_BREAKDOWN,
  TOP_10_CONCEPT_CO_OCCURRENCE
} from '@/helpers/Text.helper.js'
import TwoDimensionsBreakdownComponent from '@/components/TwoDimensionsBreakdown.component.vue'
import OneDimensionBreakdownComponent from '@/components/OneDimensionBreakdown.component.vue'

export default {
  components: {
    Multiselect,
    OneDimensionBreakdownComponent,
    TwoDimensionsBreakdownComponent,
    ConceptsMatrix,
    ToolTip,
    ZoomControls,
    ColorSlider
  },
  props: {
    treemap: {
      type: Object,
      required: true
    },
    locations: {
      type: Array
      //required: true
    },
    technologies: {
      type: Array
      //required: true
    },
    operations: {
      type: Array
      //required: true
    },
    methods: {
      type: Array
      //required: true
    },
    concepts: {
      type: Array
      //required: true
    },
    conceptsMatrix: {
      type: Object
      //required: true
    },
    directoriesNumber: {
      type: Number
      //required: true
    },
    filesNumber: {
      type: Number
      //required: true
    },
    codeFragmentsNumber: {
      type: Number
      //required: true
    },
    conceptsNumber: {
      type: Number
      //required: true
    },
    operationsTechnologiesBreakdown: {
      type: Object
      //required: true
    },
    conceptsBreakdown: {
      type: Object
      //required: true
    },
    loc: {
      type: Number
      //required: true
    },
    tir: {
      type: Object
      //required: true
    },
    cir: {
      type: Object
      //required: true
    },
    filteredCodeFragments: {
      type: Array
      //required: true
    }
  },
  watch: {
    treemap: {
      handler(newTreemap) {
        this.updateTreemap(newTreemap)
      },
      immediate: true,
      deep: true
    },
    locations: {
      handler(newLocations) {
        this.updateLocations(newLocations)
      },
      immediate: true,
      deep: true
    },
    technologies: {
      handler(newTechnologies) {
        this.updateTechnologies(newTechnologies)
      },
      immediate: true,
      deep: true
    },
    operations: {
      handler(newOperations) {
        this.updateOperations(newOperations)
      },
      immediate: true,
      deep: true
    },
    methods: {
      handler(newMethods) {
        this.updateMethods(newMethods)
      },
      immediate: true,
      deep: true
    },
    concepts: {
      handler(newConcepts) {
        this.updateConcepts(newConcepts)
      },
      immediate: true,
      deep: true
    },
    conceptsMatrix: {
      handler(newMatrix) {
        this.updateConceptsMatrix(newMatrix)
      },
      immediate: true,
      deep: true
    },
    directoriesNumber: {
      handler(newNumber) {
        this.updateDirectoriesNumber(newNumber)
      },
      immediate: true,
      deep: true
    },
    filesNumber: {
      handler(newNumber) {
        this.updateFilesNumber(newNumber)
      },
      immediate: true,
      deep: true
    },
    codeFragmentsNumber: {
      handler(newNumber) {
        this.updateCodeFragmentsNumber(newNumber)
      },
      immediate: true,
      deep: true
    },
    conceptsNumber: {
      handler(newNumber) {
        this.updateConceptsNumber(newNumber)
      },
      immediate: true,
      deep: true
    },
    operationsTechnologiesBreakdown: {
      handler(newBreakdown) {
        this.updateOperationsTechnologiesBreakdown(newBreakdown)
      },
      immediate: true,
      deep: true
    },
    conceptsBreakdown: {
      handler(newBreakdown) {
        this.updateConceptsBreakdown(newBreakdown)
      },
      immediate: true,
      deep: true
    },
    loc: {
      handler(newMetric) {
        this.updateLoC(newMetric)
      },
      immediate: true,
      deep: true
    },
    tir: {
      handler(newMetric) {
        this.updateTIR(newMetric)
      },
      immediate: true,
      deep: true
    },
    cir: {
      handler(newMetric) {
        this.updateCIR(newMetric)
      },
      immediate: true,
      deep: true
    },
    filteredCodeFragments: {
      handler(newFilteredCodeFragments) {
        this.updateFilteredCodeFragments(newFilteredCodeFragments)
        this.onHighlight(newFilteredCodeFragments)
      },
      immediate: true,
      deep: true
    }
  },
  setup() {
    // Helpers
    const dataMapper = new DataMapper()
    return {
      dataMapper
    }
  },
  mounted() {
    nextTick(() => {
      // DOM

      this.treemapDiv = this.$refs.treemap

      // View

      this.preRenderTreemap()
      this.renderTreemap()
    })
  },
  data() {
    return {
      // Model: Treemap.
      treemapObject: null,
      // Model: Locations.
      rawLocationsList: [],
      locationSelected: null,
      // Model: Technologies.
      technologiesList: [],
      technologySelected: null,
      // Model: Operations.
      operationsList: [],
      operationSelected: null,
      // Model: Methods.
      methodsList: [],
      methodSelected: null,
      // Model: Concepts.
      conceptsList: [],
      conceptSelected: null,
      conceptsSelected: [],
      // Model: Concepts matrix.
      conceptsMatrixObject: null,
      // Model: Metrics
      directoriesNumberValue: 0,
      filesNumberValue: 0,
      codeFragmentsNumberValue: 0,
      conceptsNumberValue: 0,
      operationsTechnologiesBreakdownObject: null,
      conceptsBreakdownObject: null,
      locValue: 0,
      tirObject: 0,
      cirObject: 0,
      // Model: Code Fragments.
      filteredCodeFragmentsList: [],

      // View: Settings.
      settingsVisibility: false,
      // View: Metrics.
      metricsVisibility: false,
      // View: Treemap.
      treemapDiv: null,
      treemapSVG: null,
      treemapSVGShapeClicked: null,
      // View: Zoom.
      treemapScale: 1,
      treemapPanX: 0,
      treemapPanY: 0,
      treemapIsPanning: false,
      treemapStartX: 0,
      treemapStartY: 0,
      // View: Tool tip.
      toolTipVisibility: false,
      toolTipX: 0,
      toolTipY: 0,
      toolTipHtml: '',

      // Texts.
      SELECT_LOCATION,
      SELECT_TECHNOLOGY,
      SELECT_OPERATION,
      SELECT_METHOD,
      SELECT_CONCEPTS,
      FILTERING,
      NO_DATA,
      METRICS,
      DIRECTORIES_NUMBER,
      FILES_NUMBER,
      CODE_FRAGMENTS_NUMBER,
      CONCEPTS_NUMBER,
      LOC,
      STATIC,
      TOP_10_CONCEPT_CO_OCCURRENCE,
      TECHNOLOGIES_OPERATIONS_BREAKDOWN
    }
  },
  computed: {
    locationsList() {
      if (this.rawLocationsList && this.rawLocationsList.length > 0) {
        const seen = new Set()
        const result = []
        this.rawLocationsList.forEach((l) => {
          let locationId = l.substring(0, l.indexOf('#'))
          let locationObject = this.dataMapper.extractLocation(l)
          let locationPath = locationObject.getPath()
          if (!seen.has(locationPath)) {
            seen.add(locationPath)
            result.push({
              label: locationPath,
              value: locationId
            })
          }
        })
        return result
      } else {
        return []
      }
    }
  },
  methods: {
    /**
     * Data.
     */
    updateTreemap(newTreemap) {
      if (newTreemap) {
        // Treemap

        this.treemapObject = this.dataMapper.reviveTreemap(newTreemap)

        // View

        this.preRenderTreemap()
        this.renderTreemap()
      }
    },
    updateLocations(newLocations) {
      if (newLocations) {
        this.rawLocationsList = newLocations.filter((l) => l.includes('#')) // Filters only locations concerning code fragments.
      }
    },
    updateTechnologies(newTechnologies) {
      if (newTechnologies) {
        this.technologiesList = newTechnologies
      }
    },
    updateOperations(newOperations) {
      if (newOperations) {
        this.operationsList = newOperations
      }
    },
    updateMethods(newMethods) {
      if (newMethods) {
        this.methodsList = newMethods
      }
    },
    updateConcepts(newConcepts) {
      if (newConcepts) {
        this.conceptsList = newConcepts
      }
    },
    updateConceptsMatrix(newConceptsMatrix) {
      if (newConceptsMatrix) {
        this.conceptsMatrixObject = newConceptsMatrix
      }
    },
    updateDirectoriesNumber(newNumber) {
      if (newNumber) {
        this.directoriesNumberValue = newNumber
      }
    },
    updateFilesNumber(newNumber) {
      if (newNumber) {
        this.filesNumberValue = newNumber
      }
    },
    updateCodeFragmentsNumber(newNumber) {
      if (newNumber) {
        this.codeFragmentsNumberValue = newNumber
      }
    },
    updateConceptsNumber(newNumber) {
      if (newNumber) {
        this.conceptsNumberValue = newNumber
      }
    },
    updateOperationsTechnologiesBreakdown(newBreakdown) {
      if (newBreakdown) {
        this.operationsTechnologiesBreakdownObject = newBreakdown
      }
    },
    updateConceptsBreakdown(newBreakdown) {
      if (newBreakdown) {
        this.conceptsBreakdownObject = newBreakdown
      }
    },
    updateLoC(newMetric) {
      if (newMetric) {
        this.locValue = newMetric
      }
    },
    updateCIR(newMetric) {
      if (newMetric) {
        this.cirObject = Object.fromEntries(
          Object.keys(newMetric)
            .map((key) => {
              let percentage = (newMetric[key] * 100).toFixed(2)
              let count = (newMetric[key] * this.filesNumberValue).toFixed(0)
              if (percentage !== '0.00') {
                return [key, count + ' (' + percentage + '%)']
              } else {
                return null
              }
            })
            .filter((value) => value) // Removes null.
        )
        if (Object.keys(this.cirObject).length < Object.keys(newMetric).length) {
          this.cirObject['...'] = null
        }
      }
    },
    updateTIR(newMetric) {
      if (newMetric) {
        this.tirObject = Object.fromEntries(
          Object.keys(newMetric).map((key) => [
            key,
            (newMetric[key] * this.filesNumberValue).toFixed(0) +
              ' (' +
              (newMetric[key] * 100).toFixed(2) +
              '%)'
          ])
        )
      }
    },
    updateFilteredCodeFragments(newFilteredCodeFragments) {
      if (newFilteredCodeFragments) {
        this.filteredCodeFragmentsList = newFilteredCodeFragments
      }
    },
    /**
     * Rendering.
     */
    preRenderTreemap() {
      if (this.treemapDiv && this.treemapObject) {
        this.treemapScale = MIN_ZOOM
        this.getCalibration(true, false)
      }
    },
    renderTreemap() {
      if (this.treemapDiv && this.treemapObject) {
        // Clean

        while (this.treemapDiv.firstChild) {
          this.treemapDiv.removeChild(this.treemapDiv.firstChild)
        }

        // Draw

        this.toSVG()
      }
    },
    /**
     * SVG.
     */
    toSVG() {
      this.treemapSVG = document.createElementNS(SVG_NS, 'svg')
      const width = this.treemapObject.getWidth()
      const height = this.treemapObject.getHeight()
      this.treemapSVG.setAttribute('xmlns', SVG_NS)
      this.treemapSVG.setAttribute('width', width)
      this.treemapSVG.setAttribute('height', height)
      this.treemapSVG.setAttribute('viewBox', `0 0 ${width} ${height}`)
      this.toSVGShape(this.treemapSVG, this.treemapObject, 0, 0)
      this.treemapSVG.style.width = `${width}px`
      this.treemapSVG.style.height = `${height}px`
      this.treemapSVG.style.position = 'absolute'
      this.treemapSVG.style.transformOrigin = `0px 0px`
      this.treemapSVG.style.transform = `translate(${this.treemapPanX}px, ${this.treemapPanY}px) scale(${this.treemapScale})`
      this.treemapDiv.appendChild(this.treemapSVG)
    },
    toSVGShape(svg, item, parentX, parentY) {
      // Parent

      const x = parentX + item.getX()
      const y = parentY + item.getY()

      // Style
      let shape = null
      switch (item.getType()) {
        case 'treemap':
          shape = this.toSVGShapeTreemap(item, x, y)
          break
        case 'repository':
          shape = this.toSVGShapeRepository(item, x, y)
          break
        case 'directory':
          shape = this.toSVGShapeDirectory(item, x, y)
          break
        case 'file':
          shape = this.toSVGShapeFile(item, x, y)
          break
        case 'codeFragment':
          shape = this.toSVGShapeCodeFragment(item, x, y)
          break
        default:
          break
      }

      // Properties
      shape.setAttribute(
        'id',
        item.getData() ? (item.getData() ? item.getData().location : '') : ''
      )
      shape.setAttribute('type', item.getType())
      shape.setAttribute('childrenNumber', item.getChildrenNumber())
      shape.setAttribute('descendantsNumber', item.getDescendantsNumber())

      // Tool tip
      shape.addEventListener('mouseover', (event) => {
        if (item.getType() !== 'treemap') {
          shape.classList.add('hovered')
        }
        this.onShowToolTip(event, item)
      })
      shape.addEventListener('mousemove', (event) => this.onMoveToolTip(event, item))
      shape.addEventListener('mouseout', () => {
        shape.classList.remove('hovered')
        this.onHideToolTip()
      })
      let self = this
      let clickStartDatetime
      shape.addEventListener('mousedown', function () {
        clickStartDatetime = Date.now()
      })
      shape.addEventListener('mouseup', () => {
        // Distinguishes a short-time click (access the location) to a holding click (moving the canva).
        if (clickStartDatetime && Date.now() - clickStartDatetime <= 200) {
          // Navigates to the destination.
          if (item.getData()) {
            window.open(item.getData().location, '_blank')

            // Keeps in memory the last click.
            if (self.treemapSVGShapeClicked) {
              self.treemapSVGShapeClicked.classList.remove('clicked')
            }
            self.treemapSVGShapeClicked = shape
            self.treemapSVGShapeClicked.classList.add('clicked')
          } else {
            self.treemapSVGShapeClicked.classList.remove('clicked')
            self.treemapSVGShapeClicked = null
          }
        }
      })

      svg.appendChild(shape)

      // Children

      if (item.getChildren() && item.getChildren().length > 0) {
        item.getChildren().forEach((child) => this.toSVGShape(svg, child, x, y))
      }
    },
    toSVGShapeTreemap(item, x, y) {
      const shape = document.createElementNS(SVG_NS, 'rect')
      shape.setAttribute('x', x)
      shape.setAttribute('y', y)
      shape.setAttribute('width', item.getWidth())
      shape.setAttribute('height', item.getHeight())
      shape.setAttribute('fill', item.getColor())
      shape.setAttribute('fill-opacity', item.getOpacity())
      return shape
    },
    toSVGShapeRepository(item, x, y) {
      const shape = document.createElementNS(SVG_NS, 'rect')
      shape.setAttribute('x', x)
      shape.setAttribute('y', y)
      shape.setAttribute('width', item.getWidth())
      shape.setAttribute('height', item.getHeight())
      shape.setAttribute('fill', item.getColor())
      shape.setAttribute('fill-opacity', item.getOpacity())
      return shape
    },
    toSVGShapeDirectory(item, x, y) {
      const shape = document.createElementNS(SVG_NS, 'rect')
      shape.setAttribute('x', x)
      shape.setAttribute('y', y)
      shape.setAttribute('width', item.getWidth())
      shape.setAttribute('height', item.getHeight())
      shape.setAttribute('fill', item.getColor())
      shape.setAttribute('fill-opacity', item.getOpacity())
      return shape
    },
    toSVGShapeFile(item, x, y) {
      const shape = document.createElementNS(SVG_NS, 'rect')
      shape.setAttribute('x', x)
      shape.setAttribute('y', y)
      shape.setAttribute('width', item.getWidth())
      shape.setAttribute('height', item.getHeight())
      shape.setAttribute('fill', item.getColor())
      shape.setAttribute('fill-opacity', item.getOpacity())
      return shape
    },
    toSVGShapeCodeFragment(item, x, y) {
      const group = document.createElementNS(SVG_NS, 'g')
      const shape = document.createElementNS(SVG_NS, 'circle')
      const image = document.createElementNS(SVG_NS, 'g')
      shape.setAttribute('cx', x + item.getWidth() / 2)
      shape.setAttribute('cy', y + item.getHeight() / 2)
      shape.setAttribute('r', item.getWidth() / 2)
      shape.setAttribute('fill', item.getColor())
      shape.setAttribute('fill-opacity', item.getOpacity())
      image.insertAdjacentHTML('beforeend', IMAGES[item.getData().operation.name])
      image.setAttribute(
        'transform',
        `translate(${x + IMAGE_SHIFT}, ${y + IMAGE_SHIFT}) scale(${IMAGE_SCALE})`
      )
      image.setAttribute('fill-opacity', item.getOpacity())
      group.appendChild(shape)
      group.appendChild(image)
      return group
    },
    /**
     * Events.
     */
    onTransform() {
      if (this.treemapSVG) {
        this.treemapSVG.style.transform = `translate(${this.treemapPanX}px, ${this.treemapPanY}px) scale(${this.treemapScale})`
      }
    },
    onWheel(event) {
      event.preventDefault()

      this.onZoom(event)
    },
    onZoom(event) {
      const zoomFactor = event.deltaY ? (event.deltaY < 0 ? 1 : -1) : event
      this.treemapScale += zoomFactor * ZOOM_FACTOR
      this.treemapScale = Math.max(MIN_ZOOM, Math.min(this.treemapScale, MAX_ZOOM)) // Zoom limit.
      this.getCalibration(true, true)
      this.onTransform()
    },
    onResetZoom() {
      this.treemapScale = MIN_ZOOM

      this.getCalibration(true, false)
      this.onTransform()
    },
    onMouseDown(event) {
      this.treemapIsPanning = true
      this.treemapStartX = event.clientX - this.treemapPanX
      this.treemapStartY = event.clientY - this.treemapPanY
    },
    onMouseMove(event) {
      if (!this.treemapIsPanning) return
      this.treemapPanX = event.clientX - this.treemapStartX
      this.treemapPanY = event.clientY - this.treemapStartY
      this.onTransform()
    },
    onMouseUp() {
      this.treemapIsPanning = false
    },
    onMouseLeave() {
      this.treemapIsPanning = false
    },
    onShowToolTip(event, data) {
      this.toolTipVisibility = true

      this.onToolTipPositionChanged(event)
      this.onToolTipHtmlChanged(this.getToolTipHtml(data))
    },
    onMoveToolTip(event, data) {
      this.onToolTipPositionChanged(event)
      this.onToolTipHtmlChanged(this.getToolTipHtml(data))
    },
    onHideToolTip() {
      this.toolTipVisibility = false
    },
    onToolTipPositionChanged(event) {
      this.toolTipX = event.pageX + 10
      this.toolTipY = event.pageY + 10
    },
    onToolTipHtmlChanged(html) {
      this.toolTipHtml = html
    },
    onTechnologyColorSelected(technologyId, color) {
      this.treemapObject = this.dataMapper.colorTreemap(this.treemapObject, (item) => {
        if (item.type === 'codeFragment' && item.getData().technology.id === technologyId) {
          item.color = color
        }
        return item
      })
      this.renderTreemap()
    },
    onOperationColorSelected(operationName, color) {
      this.treemapObject = this.dataMapper.colorTreemap(this.treemapObject, (item) => {
        if (item.getType() === 'codeFragment' && item.getData().operation.name === operationName) {
          item.setColor(color)
        }
        return item
      })
      this.renderTreemap()
    },
    onUnselectConcept(concept) {
      this.conceptsSelected = this.conceptsSelected.filter((c) => c !== concept)
    },
    onFilterCodeFragments() {
      this.$emit(
        'onFilterCodeFragments',
        this.locationSelected,
        this.technologySelected,
        this.operationSelected,
        this.methodSelected,
        this.conceptsSelected
      )
    },
    onHighlight(filteredCodeFragments) {
      if (filteredCodeFragments && filteredCodeFragments.length > 0) {
        const locationsSet = new Set(filteredCodeFragments.map((cf) => cf.location))
        const opacify = (item) => {
          if (item.getType() === 'codeFragment') {
            const hasMatch = locationsSet.has(item.getData().location)
            item.setOpacity(hasMatch ? NO_OPAQUE : OPAQUE)
          }
          return item
        }
        this.treemapObject = this.dataMapper.colorTreemap(this.treemapObject, (item) =>
          opacify(item)
        )
        this.renderTreemap()
      }
    },
    toggleSettings() {
      this.settingsVisibility = !this.settingsVisibility
    },
    toggleMetrics() {
      this.metricsVisibility = !this.metricsVisibility
    },
    /**
     * Utils.
     */
    getToolTipHtml(data) {
      let html = ''
      if (data.getData() !== undefined) {
        if (data.getData().location !== undefined) {
          html += '<span :data-text="text">' + data.getData().location + '</span>'
        }
        if (
          data.getData().technology &&
          data.getData().operation &&
          data.getData().method &&
          data.getData().sample
        ) {
          html += '<span>' + data.getData().technology.id + '</span>'
          html += '<span>' + data.getData().operation.name + '</span>'
          html += '<span>' + data.getData().method.name + '</span>'
          html += '<span>' + data.getData().sample.content + '</span>'
          html +=
            '<span>' +
            data
              .getData()
              .concepts.reduce((acc, item) => {
                acc.push(item.name)
                return acc
              }, [])
              .join(', ') +
            '</span>'
        }
      }
      return html
    },
    getCalibration(isHorizontal, isVertical) {
      if (isHorizontal) {
        let treemapDivMiddleShiftX = this.treemapDiv.offsetWidth / 2
        let treemapSVGMiddleShiftX = (this.treemapObject.getWidth() / 2) * this.treemapScale
        this.treemapPanX = treemapDivMiddleShiftX - treemapSVGMiddleShiftX // Margin left
      } else {
        this.treemapPanX = 10
      }
      if (isVertical) {
        let treemapDivMiddleShiftY = this.treemapDiv.offsetHeight / 2
        let treemapSVGMiddleShiftY = (this.treemapObject.getHeight() / 2) * this.treemapScale
        this.treemapPanY = treemapDivMiddleShiftY - treemapSVGMiddleShiftY // Margin top
      } else {
        this.treemapPanY = 10
      }
    }
  }
}
</script>

<template>
  <!-- Settings -->
  <div class="container">
    <button class="btn btn-light settings-button" type="button" @click="toggleSettings">
      <i :class="settingsVisibility ? 'bi-gear-fill' : 'bi-gear'"></i>
    </button>
    <div :class="['settings', { 'd-none': !settingsVisibility }]">
      <div class="sub-settings">
        <div v-for="technology in technologiesList" :key="technology">
          <span>
            <ColorSlider
              :label="technology"
              @onColor="onTechnologyColorSelected(technology, $event)"
            />
          </span>
        </div>
      </div>
      <hr class="line" />
      <div class="sub-settings">
        <div v-for="operation in operationsList" :key="operation">
          <span>
            <ColorSlider
              :label="operation"
              @onColor="onOperationColorSelected(operation, $event)"
            />
          </span>
        </div>
      </div>
      <hr class="line" />
      <div class="sub-settings multiselects">
        <Multiselect
          v-model="technologySelected"
          :options="technologiesList"
          searchable
          :placeholder="SELECT_TECHNOLOGY"
          class="form-control settings-select"
        ></Multiselect>
        <Multiselect
          v-model="operationSelected"
          :options="operationsList"
          searchable
          :placeholder="SELECT_OPERATION"
          class="form-control settings-select left"
        ></Multiselect>
        <Multiselect
          v-model="locationSelected"
          :options="locationsList"
          label="label"
          track-by="value"
          searchable
          :placeholder="SELECT_LOCATION"
          class="form-control settings-select left"
        ></Multiselect>
        <Multiselect
          v-model="methodSelected"
          :options="methodsList"
          searchable
          :placeholder="SELECT_METHOD"
          class="form-control settings-select left"
        ></Multiselect>
        <Multiselect
          v-model="conceptsSelected"
          :options="conceptsList"
          mode="multiple"
          :searchable="true"
          :hide-selected="false"
          :can-clear="false"
          :can-deselect="true"
          :close-on-select="false"
          :object="false"
          :placeholder="SELECT_CONCEPTS"
          class="form-control settings-select left"
        >
          <template #multiplelabel="{ values }">
            <div class="multiselect-multiple-label">
              <span
                v-for="v in values.slice().reverse()"
                :key="v.value"
                class="selected-span clickable-tag"
                @click.stop="onUnselectConcept(v.value)"
              >
                {{ v.value }} ✕
              </span>
            </div>
          </template>
        </Multiselect>
        <button
          class="btn btn-light form-control left thin-button"
          type="button"
          @click="onFilterCodeFragments"
        >
          <i class="bi bi-funnel"></i>
        </button>
      </div>
    </div>
    <!-- Metrics -->
    <button class="btn btn-light settings-button top" type="button" @click="toggleMetrics">
      <i :class="metricsVisibility ? 'bi-bar-chart-fill' : 'bi-bar-chart'"></i>
    </button>
    <div v-show="metricsVisibility">
      <!-- Filtering -->
      <div class="metrics top">
        <div class="metrics-header">{{ FILTERING }}</div>
        <div class="metrics-content">
          <div class="item" v-if="filteredCodeFragmentsList.length !== 0">
            <span class="item-name">{{ CODE_FRAGMENTS_NUMBER }}: </span>
            <span class="item-count">{{ filteredCodeFragmentsList.length }}</span>
          </div>
          <div v-if="filteredCodeFragmentsList.length === 0">
            <span>{{ NO_DATA }}</span>
          </div>
        </div>
      </div>
      <!-- Figures -->
      <div class="metrics top">
        <div class="metrics-header">{{ METRICS }}</div>
        <div class="metrics-values">
          <span class="metrics-value">
            {{ DIRECTORIES_NUMBER }}:
            {{ new Intl.NumberFormat().format(directoriesNumberValue) }}
          </span>
          <span class="metrics-value">
            {{ FILES_NUMBER }}: {{ new Intl.NumberFormat().format(filesNumberValue) }}
          </span>
          <span class="metrics-value">
            {{ CODE_FRAGMENTS_NUMBER }}:
            {{ new Intl.NumberFormat().format(codeFragmentsNumberValue) }}
          </span>
          <span class="metrics-value">
            {{ CONCEPTS_NUMBER }}: {{ new Intl.NumberFormat().format(conceptsNumberValue) }}
          </span>
          <span class="metrics-value">
            {{ LOC }}: {{ new Intl.NumberFormat().format(locValue) }}
          </span>
        </div>
      </div>
      <!-- Concept similarity coupling -->
      <div class="metrics top">
        <ConceptsMatrix :title="TOP_10_CONCEPT_CO_OCCURRENCE" :data="conceptsMatrixObject" />
      </div>
      <!-- Operations technologies breakdown -->
      <div class="metrics top">
        <TwoDimensionsBreakdownComponent
          v-if="operationsTechnologiesBreakdown"
          :title="STATIC + ' ' + TECHNOLOGIES_OPERATIONS_BREAKDOWN"
          :data="operationsTechnologiesBreakdownObject.static"
        />
      </div>
      <!-- Concept evolutionary coupling -->
      <div class="metrics top">
        <OneDimensionBreakdownComponent title="Concepts" :data="conceptsBreakdownObject" />
      </div>
      <div class="metrics top">
        <OneDimensionBreakdownComponent title="TIR" :data="tirObject" show-percentages="false" />
      </div>
      <div class="metrics top">
        <OneDimensionBreakdownComponent title="CIR" :data="cirObject" show-percentages="false" />
      </div>
    </div>
    <!-- Zoom controls -->
    <ZoomControls @onZoom="onZoom" @onResetZoom="onResetZoom" class="top" />
    <!-- Treemap -->
    <div
      ref="treemap"
      class="treemap top"
      @wheel="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
    ></div>
  </div>
  <!-- Tool tip -->
  <div v-if="toolTipVisibility">
    <ToolTip :html="toolTipHtml" :style="{ left: toolTipX + 'px', top: toolTipY + 'px' }" />
  </div>
</template>
