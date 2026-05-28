<script>
// Libraries
import { nextTick } from 'vue'

// Components
import ZoomControls from '@/components/ZoomControls.component.vue'
import ToolTip from '@/components/ToolTip.component.vue'

// Helpers
import { DataMapper } from '@/helpers/DataMapper.helper'
import {
  ADDED_COLOR,
  DEFAULT_COLOR_CODE_FRAGMENT,
  DEFAULT_COLOR_FILE,
  DEFAULT_COLOR_TREEMAP,
  DELETED_COLOR,
  IMAGE_SCALE,
  IMAGE_SHIFT,
  IMAGES,
  MAX_ZOOM,
  MIN_ZOOM,
  MODIFIED_COLOR,
  SVG_NS,
  ZOOM_FACTOR
} from '@/helpers/Constants.helper'

// Models
import { Treemap } from '@/models/Treemap.model.js'

export default {
  components: {
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
    differences: {
      type: Object,
      required: true
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
    differences: {
      handler(differences) {
        this.updateDifferences(differences)
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
      differencesObject: null,

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
      toolTipHtml: ''
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
        this.differencesObject = []

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
    updateDifferences(newDifferences) {
      if (newDifferences && JSON.stringify(newDifferences) !== JSON.stringify([])) {
        this.differencesObject = newDifferences
        this.onDifferencesTreemap1(this.differencesObject)
        this.onDifferencesTreemap2(this.differencesObject)
        this.preRenderTreemap()
        this.renderTreemap()
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
      shape.setAttribute('stroke-width', '1')
      shape.setAttribute('stroke', 'rgba(255,255,255,1)')
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
      shape.setAttribute('stroke-width', '1')
      shape.setAttribute('stroke', 'rgba(255,255,255,1)')
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
      shape.setAttribute('stroke-width', '1')
      shape.setAttribute('stroke', 'rgba(255,255,255,1)')
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
      shape.setAttribute('stroke-width', '1')
      shape.setAttribute('stroke', 'rgba(255,255,255,1)')
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
      shape.setAttribute('stroke-width', '1')
      shape.setAttribute('stroke', 'rgba(255,255,255,1)')
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
    onDifferencesTreemap1(differences) {
      this.treemap1Object = this.dataMapper.colorTreemap(this.treemap1Object, (item) => {
        const type = item.getType()
        const location = item.getData().location

        const isRemoved = differences.removed.includes(location)
        const isModified = differences.modified.includes(location)

        if (isRemoved && !isModified) {
          item.setColor(DELETED_COLOR)
          return item
        }

        if (isModified && !isRemoved) {
          item.setColor(MODIFIED_COLOR)
          return item
        }

        if (type === 'file') {
          item.setColor(DEFAULT_COLOR_FILE)
        } else if (type === 'directory' || type === 'repository') {
          item.setColor(DEFAULT_COLOR_TREEMAP)
        } else if (type === 'codeFragment') {
          item.setColor(DEFAULT_COLOR_CODE_FRAGMENT)
        }

        return item
      })
    },
    onDifferencesTreemap2(differences) {
      this.treemap2Object = this.dataMapper.colorTreemap(this.treemap2Object, (item) => {
        const type = item.getType()
        const location = item.getData().location

        const isAdded = differences.added.includes(location)
        const isModified = differences.modified.includes(location)

        if (isAdded && !isModified) {
          item.setColor(ADDED_COLOR)
          return item
        }

        if (isModified && !isAdded) {
          item.setColor(MODIFIED_COLOR)
          return item
        }

        if (type === 'file') {
          item.setColor(DEFAULT_COLOR_FILE)
        } else if (type === 'directory' || type === 'repository') {
          item.setColor(DEFAULT_COLOR_TREEMAP)
        } else if (type === 'codeFragment') {
          item.setColor(DEFAULT_COLOR_CODE_FRAGMENT)
        }

        return item
      })
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
  <div class="container">
    <!-- Zoom controls -->
    <ZoomControls @onZoom="onZoom" @onResetZoom="onResetZoom" class="top" />
    <!-- Difference Treemap -->
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
