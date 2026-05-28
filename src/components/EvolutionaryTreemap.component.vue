<script>
// Libraries
import { nextTick } from 'vue'

// Components
import ZoomControls from '@/components/ZoomControls.component.vue'
import ToolTip from '@/components/ToolTip.component.vue'
import OneDimensionBreakdownComponent from '@/components/OneDimensionBreakdown.component.vue'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

// Helpers
import { DataMapper } from '@/helpers/DataMapper.helper'
import {
  CO_CHANGED_OPACITY_FILE,
  DEFAULT_COLOR_FILE,
  DEFAULT_OPACITY_FILE,
  IMAGE_SCALE,
  IMAGE_SHIFT,
  IMAGES,
  MAX_CHANGE_COLOR,
  MAX_ZOOM,
  MIN_CHANGE_COLOR,
  MIN_ZOOM,
  SVG_NS,
  ZOOM_FACTOR
} from '@/helpers/Constants.helper'
import {
  CHANGES,
  COMMITS_NUMBER,
  CONCEPT_FREQUENCY_CO_CHANGED_FILES,
  FILES_NUMBER,
  METRICS,
  NO_DATA,
  SELECT_LOCATION
} from '@/helpers/Text.helper.js'

export default {
  components: {
    Multiselect,
    OneDimensionBreakdownComponent,
    ToolTip,
    ZoomControls
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
    coChangedFiles: {
      type: Array
      //required: true
    },
    coChangedConcepts: {
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
    coChangedFiles: {
      handler(newCoChangedFiles) {
        this.updateCoChangedFiles(newCoChangedFiles)
      },
      immediate: true,
      deep: true
    },
    coChangedConcepts: {
      handler(newCoChangedConcepts) {
        this.updateCoChangedConcepts(newCoChangedConcepts)
      },
      immediate: true,
      deep: true
    },
    locationSelected: {
      handler(newLocationSelected) {
        this.onLocationSelected(newLocationSelected)
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
      // Model: Co-Changed concepts.
      coChangedFilesObject: null,
      // Model: Co-Changed concepts.
      coChangedConceptsObject: null,

      // View: Settings.
      settingsVisibility: false,
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
      // View: Pointer.
      isPointing: false,
      // View: Metrics.
      metricsVisibility: false,
      // Texts.
      CONCEPT_FREQUENCY_CO_CHANGED_FILES,
      NO_DATA,
      METRICS,
      FILES_NUMBER,
      COMMITS_NUMBER,
      CHANGES,
      SELECT_LOCATION
    }
  },
  computed: {
    locationsList() {
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
    updateCoChangedFiles(newCoChangedFiles) {
      if (newCoChangedFiles.files && Object.keys(newCoChangedFiles.files).length > 0) {
        this.coChangedFilesObject = newCoChangedFiles
        this.onCoChangedFiles(this.coChangedFilesObject.files)
      }
    },
    updateCoChangedConcepts(newCoChangedConcepts) {
      if (newCoChangedConcepts) {
        this.coChangedConceptsObject = newCoChangedConcepts
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
      if (
        (this.treemapSVGShapeClicked !== null &&
          shape.getAttribute('id') === this.treemapSVGShapeClicked?.id) ||
        shape.getAttribute('id') === this.locationSelected
      ) {
        shape.classList.add('clicked-selection')
      }

      // Tool tip
      shape.addEventListener('mouseover', (event) => {
        if (item.getType() !== 'treemap') {
          if (!this.isPointing) {
            shape.classList.add('hovered')
          } else {
            if (this.locationsList.map((l) => l.value).includes(item.getData().location)) {
              shape.classList.add('hovered-selection')
            } else {
              shape.classList.add('hovered-selection-refused')
            }
          }
        }
        this.onShowToolTip(event, item)
      })
      shape.addEventListener('mousemove', (event) => this.onMoveToolTip(event, item))
      shape.addEventListener('mouseout', () => {
        shape.classList.remove('hovered')
        shape.classList.remove('hovered-selection')
        shape.classList.remove('hovered-selection-refused')
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
          if (!this.isPointing) {
            // Navigates to the destination.
            if (item.getData()) {
              // Keeps in memory the last click.
              if (self.treemapSVGShapeClicked) {
                self.treemapSVGShapeClicked.classList.remove('clicked')
              }
              self.treemapSVGShapeClicked = shape
              self.treemapSVGShapeClicked.classList.add('clicked')

              window.open(item.getData().location, '_blank')
            } else {
              self.treemapSVGShapeClicked.classList.remove('clicked')
              self.treemapSVGShapeClicked = null
            }
          } else {
            if (item.getData()) {
              // Keeps in memory the last click.
              if (self.treemapSVGShapeClicked) {
                self.treemapSVGShapeClicked.classList.remove('clicked-selection')
              }
              self.treemapSVGShapeClicked = shape
              self.treemapSVGShapeClicked.classList.add('clicked-selection')

              // Looks for co-changed files.
              this.onLocationSelected(item.getData().location)
            } else {
              self.treemapSVGShapeClicked.classList.remove('clicked-selection')
              self.treemapSVGShapeClicked = null
            }
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
    onLocationSelected(location) {
      if (location) {
        this.locationSelected = location
        this.treemapSVGShapeClicked = null
        this.$emit('onVersionalEvolutionaryCoupling', location)
        this.$emit('onConceptualEvolutionaryCoupling', location)

        this.treemapObject = this.dataMapper.colorTreemap(this.treemapObject, (item) => {
          if (item.getType() === 'file') {
            item.setColor(DEFAULT_COLOR_FILE)
            item.setOpacity(DEFAULT_OPACITY_FILE)
          }
          return item
        })
        this.renderTreemap()
      }
    },
    onCoChangedFiles(coChangedFiles) {
      let minChangesOccurrenceNumber = this.getMinChangeOccurrence(coChangedFiles)
      let maxChangesOccurrenceNumber = this.getMaxChangeOccurrence(coChangedFiles)
      this.treemapObject = this.dataMapper.colorTreemap(this.treemapObject, (item) => {
        if (
          item.getType() === 'file' &&
          Object.keys(coChangedFiles).includes(item.getData().location)
        ) {
          item.setColor(
            this.getChangeColor(
              coChangedFiles[item.getData().location],
              minChangesOccurrenceNumber,
              maxChangesOccurrenceNumber
            )
          )
          item.setOpacity(CO_CHANGED_OPACITY_FILE)
        }
        return item
      })
      this.renderTreemap()
    },
    toggleSettings() {
      this.settingsVisibility = !this.settingsVisibility
    },
    togglePointing() {
      this.isPointing = !this.isPointing
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
          this.coChangedFilesObject &&
          this.coChangedFilesObject.files &&
          this.coChangedFilesObject.files[data.getData().location] !== undefined
        ) {
          html +=
            '<span :data-text="text">' +
            this.coChangedFilesObject.files[data.getData().location] +
            CHANGES +
            '</span>'
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
    getChangeColor(frequency, min, max) {
      const hexToRgb = (hex) => {
        const h = hex.replace('#', '')
        const n = parseInt(h, 16)
        return {
          r: (n >> 16) & 255,
          g: (n >> 8) & 255,
          b: n & 255
        }
      }

      const toHex = (r, g, b) =>
        '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

      const minColor = hexToRgb(MIN_CHANGE_COLOR)
      const maxColor = hexToRgb(MAX_CHANGE_COLOR)

      const t = Math.max(0, Math.min(1, (frequency - min) / (max - min)))
      const r = Math.round(minColor.r + (maxColor.r - minColor.r) * t)
      const g = Math.round(minColor.g + (maxColor.g - minColor.g) * t)
      const b = Math.round(minColor.b + (maxColor.b - minColor.b) * t)

      return toHex(r, g, b)
    },
    getMinChangeOccurrence(coChangedItem) {
      return Object.keys(coChangedItem).reduce((acc, file) => {
        if (coChangedItem[file] < acc) {
          acc = coChangedItem[file]
        }
        return acc
      }, Number.MAX_VALUE)
    },
    getMaxChangeOccurrence(coChangedItem) {
      return Object.keys(coChangedItem).reduce((acc, file) => {
        if (coChangedItem[file] > acc) {
          acc = coChangedItem[file]
        }
        return acc
      }, Number.MIN_VALUE)
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
      <div>
        <Multiselect
          v-model="locationSelected"
          :options="locationsList"
          label="label"
          track-by="value"
          searchable
          :placeholder="SELECT_LOCATION"
          class="form-control settings-select"
        />
        <button class="btn btn-light form-control top" type="button" @click="togglePointing">
          <i :class="isPointing ? 'bi-crosshair2' : 'bi-crosshair'"></i>
        </button>
      </div>
    </div>
    <button class="btn btn-light form-control top" type="button" @click="toggleMetrics">
      <i :class="metricsVisibility ? 'bi-bar-chart-fill' : 'bi-bar-chart'"></i>
    </button>
    <!-- Metrics -->
    <div v-show="metricsVisibility" class="metrics top">
      <div class="metrics-header">{{ METRICS }}</div>
      <div class="metrics-content">
        <div
          class="item"
          v-if="coChangedFilesObject !== null && coChangedFilesObject.commits !== null"
        >
          <span class="item-name">{{ COMMITS_NUMBER }}</span>
          <span class="item-count">{{ coChangedFilesObject.commits }}</span>
        </div>
        <div
          class="item"
          v-if="coChangedFilesObject !== null && coChangedFilesObject.files !== null"
        >
          <span class="item-name">{{ FILES_NUMBER }}</span>
          <span class="item-count">{{ Object.keys(coChangedFilesObject.files).length }}</span>
        </div>
        <div v-if="!coChangedFilesObject">
          <span>{{ NO_DATA }}</span>
        </div>
      </div>
    </div>
    <div v-if="metricsVisibility" class="metrics top">
      <OneDimensionBreakdownComponent
        :title="CONCEPT_FREQUENCY_CO_CHANGED_FILES"
        :data="coChangedConcepts"
      />
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
