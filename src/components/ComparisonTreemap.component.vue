<script>
// Libraries
import { nextTick } from 'vue'

// Components
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
  FILTERING,
  NO_DATA,
  SELECT_CONCEPTS,
  SELECT_LOCATION,
  SELECT_METHOD,
  SELECT_OPERATION,
  SELECT_TECHNOLOGY
} from '@/helpers/Text.helper.js'

// Models
import { Treemap } from '@/models/Treemap.model.js'
import ColorSlider from '@/components/ColorSlider.component.vue'

export default {
  components: {
    ColorSlider,
    Multiselect,
    ToolTip,
    ZoomControls
  },
  props: {
    treemap1: {
      type: Object,
      required: true
    },
    treemap2: {
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
    filteredCodeFragments: {
      type: Array
      //required: true
    }
  },
  watch: {
    treemap1: {
      handler(newTreemap1) {
        this.updateTreemap1(newTreemap1)
      },
      immediate: true,
      deep: true
    },
    treemap2: {
      handler(newTreemap2) {
        this.updateTreemap2(newTreemap2)
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

      this.treemap1Div = this.$refs.treemap1
      this.treemap2Div = this.$refs.treemap2

      // View

      this.preRenderTreemap()
      this.renderTreemap()
    })
  },
  data() {
    return {
      // Model: Treemap.
      treemap1Object: null,
      treemap2Object: null,
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
      // Model: Code Fragments.
      filteredCodeFragmentsList: [],

      // View: Settings.
      settingsVisibility: false,
      // View: Metrics.
      metricsVisibility: false,
      // View: Treemap.
      treemap1Div: null,
      treemap1SVG: null,
      treemap2Div: null,
      treemap2SVG: null,
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
      // View: Texts
      SELECT_LOCATION,
      SELECT_TECHNOLOGY,
      SELECT_OPERATION,
      SELECT_METHOD,
      SELECT_CONCEPTS,
      FILTERING,
      NO_DATA,
      CODE_FRAGMENTS_NUMBER
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
    updateTreemap1(newTreemap1) {
      if (newTreemap1 && JSON.stringify(newTreemap1) !== JSON.stringify([])) {
        // Treemap

        this.treemap1Object = this.dataMapper.reviveTreemap(newTreemap1)
        this.treemap2Object = new Treemap('treemap', 0, 0, 0, 0, 0, 0, 0, [], '#fff', '0') // Default treemap.

        // View

        this.preRenderTreemap()
        this.renderTreemap()
      }
    },
    updateTreemap2(newTreemap2) {
      if (newTreemap2 && JSON.stringify(newTreemap2) !== JSON.stringify([])) {
        // Treemap

        this.treemap2Object = this.dataMapper.reviveTreemap(newTreemap2)

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
    updateFilteredCodeFragments(newFilteredCodeFragments) {
      if (newFilteredCodeFragments) {
        this.filteredCodeFragmentsList = newFilteredCodeFragments
      }
    },
    /**
     * Rendering.
     */
    preRenderTreemap() {
      if (this.treemap1Div && this.treemap2Div && this.treemap1Object && this.treemap2Object) {
        this.treemapScale = MIN_ZOOM
        this.getCalibration(true, false)
      }
    },
    renderTreemap() {
      if (this.treemap1Div && this.treemap2Div && this.treemap1Object && this.treemap2Object) {
        // Clean

        while (this.treemap1Div.firstChild) {
          this.treemap1Div.removeChild(this.treemap1Div.firstChild)
        }

        while (this.treemap2Div.firstChild) {
          this.treemap2Div.removeChild(this.treemap2Div.firstChild)
        }
        // Draw

        this.toSVG1()
        this.toSVG2()
      }
    },
    /**
     * SVG.
     */
    toSVG1() {
      this.treemap1SVG = document.createElementNS(SVG_NS, 'svg')
      const width = this.treemap1Object.getWidth()
      const height = this.treemap1Object.getHeight()
      this.treemap1SVG.setAttribute('xmlns', SVG_NS)
      this.treemap1SVG.setAttribute('width', width)
      this.treemap1SVG.setAttribute('height', height)
      this.treemap1SVG.setAttribute('viewBox', `0 0 ${width} ${height}`)
      this.toSVGShape(this.treemap1SVG, this.treemap1Object, 0, 0)
      this.treemap1SVG.style.width = `${width}px`
      this.treemap1SVG.style.height = `${height}px`
      this.treemap1SVG.style.position = 'absolute'
      this.treemap1SVG.style.transformOrigin = `0px 0px`
      this.treemap1SVG.style.transform = `translate(${this.treemapPanX}px, ${this.treemapPanY}px) scale(${this.treemapScale})`
      this.treemap1Div.appendChild(this.treemap1SVG)
    },
    toSVG2() {
      this.treemap2SVG = document.createElementNS(SVG_NS, 'svg')
      const width = this.treemap2Object.getWidth()
      const height = this.treemap2Object.getHeight()
      this.treemap2SVG.setAttribute('xmlns', SVG_NS)
      this.treemap2SVG.setAttribute('width', width)
      this.treemap2SVG.setAttribute('height', height)
      this.treemap2SVG.setAttribute('viewBox', `0 0 ${width} ${height}`)
      this.toSVGShape(this.treemap2SVG, this.treemap2Object, 0, 0)
      this.treemap2SVG.style.width = `${width}px`
      this.treemap2SVG.style.height = `${height}px`
      this.treemap2SVG.style.position = 'absolute'
      this.treemap2SVG.style.transformOrigin = `0px 0px`
      this.treemap2SVG.style.transform = `translate(${this.treemapPanX}px, ${this.treemapPanY}px) scale(${this.treemapScale})`
      this.treemap2Div.appendChild(this.treemap2SVG)
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
      if (this.treemap1SVG && this.treemap2SVG) {
        this.treemap1SVG.style.transform = `translate(${this.treemapPanX}px, ${this.treemapPanY}px) scale(${this.treemapScale})`
        this.treemap2SVG.style.transform = `translate(${this.treemapPanX}px, ${this.treemapPanY}px) scale(${this.treemapScale})`
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
      const colorization = (item, color) => {
        if (item.type === 'codeFragment' && item.getData().technology.id === technologyId) {
          item.color = color
        }
        return item
      }
      this.treemap1Object = this.dataMapper.colorTreemap(this.treemap1Object, (item) =>
        colorization(item, color)
      )
      this.treemap2Object = this.dataMapper.colorTreemap(this.treemap2Object, (item) =>
        colorization(item, color)
      )
      this.renderTreemap()
    },
    onOperationColorSelected(operationName, color) {
      const colorization = (item, color) => {
        if (item.getType() === 'codeFragment' && item.getData().operation.name === operationName) {
          item.setColor(color)
        }
        return item
      }
      this.treemap1Object = this.dataMapper.colorTreemap(this.treemap1Object, (item) =>
        colorization(item, color)
      )
      this.treemap2Object = this.dataMapper.colorTreemap(this.treemap2Object, (item) =>
        colorization(item, color)
      )
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
        this.treemap1Object = this.dataMapper.colorTreemap(this.treemap1Object, (item) =>
          opacify(item)
        )
        this.treemap2Object = this.dataMapper.colorTreemap(this.treemap2Object, (item) =>
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
      if (this.treemap1Div && this.treemap2Div && this.treemap1Object && this.treemap2Object) {
        if (isHorizontal) {
          let treemap1DivMiddleShiftX = this.treemap1Div.offsetWidth / 2
          let treemap1SVGMiddleShiftX = (this.treemap1Object.getWidth() / 2) * this.treemapScale
          let treemap2DivMiddleShiftX = this.treemap2Div.offsetWidth / 2
          let treemap2SVGMiddleShiftX = (this.treemap2Object.getWidth() / 2) * this.treemapScale

          if (treemap1SVGMiddleShiftX !== 0 && treemap2SVGMiddleShiftX !== 0) {
            // Treemap 1 and Treemap 2.
            let treemapDivMiddleShiftX = (treemap1DivMiddleShiftX + treemap2DivMiddleShiftX) / 2
            let treemapSVGMiddleShiftX = (treemap1SVGMiddleShiftX + treemap2SVGMiddleShiftX) / 2
            this.treemapPanX = treemapDivMiddleShiftX - treemapSVGMiddleShiftX // Margin left.
          } else if (treemap2SVGMiddleShiftX === 0) {
            // Treemap 1 only.
            this.treemapPanX = treemap1DivMiddleShiftX - treemap1SVGMiddleShiftX // Margin left.
          } else {
            // Treemap 2 only.
            this.treemapPanX = treemap2DivMiddleShiftX - treemap2SVGMiddleShiftX // Margin left.
          }
        } else {
          this.treemapPanX = 10
        }
        if (isVertical) {
          let treemap1DivMiddleShiftY = this.treemap1Div.offsetHeight / 2
          let treemap1SVGMiddleShiftY = (this.treemap1Object.getHeight() / 2) * this.treemapScale
          let treemap2DivMiddleShiftY = this.treemap2Div.offsetHeight / 2
          let treemap2SVGMiddleShiftY = (this.treemap2Object.getHeight() / 2) * this.treemapScale

          if (treemap1SVGMiddleShiftY !== 0 && treemap2SVGMiddleShiftY !== 0) {
            // Treemap 1 and Treemap 2.
            let treemapDivMiddleShiftY = (treemap1DivMiddleShiftY + treemap2DivMiddleShiftY) / 2
            let treemapSVGMiddleShiftY = (treemap1SVGMiddleShiftY + treemap2SVGMiddleShiftY) / 2
            this.treemapPanY = treemapDivMiddleShiftY - treemapSVGMiddleShiftY // Margin top.
          } else if (treemap2SVGMiddleShiftY === 0) {
            // Treemap 1 only.
            this.treemapPanY = treemap1DivMiddleShiftY - treemap1SVGMiddleShiftY // Margin top.
          } else {
            // Treemap 2 only.
            this.treemapPanY = treemap2DivMiddleShiftY - treemap2SVGMiddleShiftY // Margin top.
          }
        } else {
          this.treemapPanY = 10
        }
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
          class="btn btn-light form-control thin-button left"
          type="button"
          @click="onFilterCodeFragments"
        >
          <i class="bi bi-funnel"></i>
        </button>
      </div>
    </div>
    <!-- Metrics -->
    <button class="btn btn-light form-control top" type="button" @click="toggleMetrics">
      <i :class="metricsVisibility ? 'bi-bar-chart-fill' : 'bi-bar-chart'"></i>
    </button>
    <div v-show="metricsVisibility" class="metrics top">
      <!-- Filtering -->
      <div class="metrics-header">{{ FILTERING }}</div>
      <div class="metrics-content">
        <div class="item" v-if="filteredCodeFragmentsList.length !== 0">
          <span class="item-name">{{ CODE_FRAGMENTS_NUMBER }}</span>
          <span class="item-count">{{ filteredCodeFragmentsList.length }}</span>
        </div>
        <div v-if="filteredCodeFragmentsList.length === 0">
          <span>{{ NO_DATA }}</span>
        </div>
      </div>
    </div>
    <!-- Zoom controls -->
    <ZoomControls @onZoom="onZoom" @onResetZoom="onResetZoom" class="top" />
    <!-- Comparison Treemap -->
    <div class="treemap-group">
      <div
        ref="treemap1"
        class="treemap top"
        @wheel="onWheel"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
      ></div>
      <div
        ref="treemap2"
        class="treemap top"
        @wheel="onWheel"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
      ></div>
    </div>
  </div>
  <!-- Tool tip -->
  <div v-if="toolTipVisibility">
    <ToolTip :html="toolTipHtml" :style="{ left: toolTipX + 'px', top: toolTipY + 'px' }" />
  </div>
</template>
