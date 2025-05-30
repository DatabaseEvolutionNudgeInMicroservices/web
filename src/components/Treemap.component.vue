<script>
// Components

import ColorSlider from '@/components/ColorSlider.component.vue'

// Helpers

import { nextTick } from 'vue'
import {
  SVG_NS,
  IMAGES,
  IMAGE_SHIFT,
  IMAGE_SCALE,
  OPAQUE,
  NO_OPAQUE,
  ZOOM_FACTOR,
  MIN_ZOOM,
  MAX_ZOOM
} from '@/helpers/Constants.helper'
import { DataMapper } from '@/helpers/DataMapper.helper'

export default {
  components: {
    ColorSlider
  },
  props: {
    treemap: {
      type: Object,
      required: true
    },
    technologies: {
      type: Array
      //required: true
    },
    operations: {
      type: Array
      //required: true
    },
    concepts: {
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
    concepts: {
      handler(newConcepts) {
        this.updateConcepts(newConcepts)
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
  data() {
    return {
      // Model
      treemapObject: null,
      technologiesList: [],
      operationsList: [],
      conceptsList: [],
      // View
      settingsVisibility: false,
      treemapDiv: null,
      treemapSVG: null,
      treemapScale: 1,
      treemapPanX: 0,
      treemapPanY: 0,
      treemapIsPanning: false,
      treemapStartX: 0,
      treemapStartY: 0,
      shapeClicked: null,
      toolTipVisibility: false,
      toolTipX: 0,
      toolTipY: 0,
      toolTipText: ''
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
  methods: {
    /**
     * Updates the given treemap with the given new one.
     * @param newTreemap The given new treemap.
     */
    updateTreemap(newTreemap) {
      if (newTreemap) {
        // Treemap

        this.treemapObject = this.dataMapper.revive(newTreemap)

        // View

        this.preRenderTreemap()
        this.renderTreemap()
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
    updateConcepts(newConcepts) {
      if (newConcepts) {
        this.conceptsList = newConcepts
      }
    },
    preRenderTreemap() {
      if (this.treemapDiv && this.treemapObject) {
        this.treemapScale = MIN_ZOOM
        let recalibrateSVGxyTox0y0 = -(this.treemapObject.getWidth() / 2)
        let shiftToMiddleOfDiv = this.treemapDiv.offsetWidth / 2
        this.treemapPanX = recalibrateSVGxyTox0y0 + shiftToMiddleOfDiv // Margin left
        this.treemapPanY = 10 // Margin top
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
     * Converts to SVG all the given model.
     */
    toSVG() {
      this.treemapSVG = document.createElementNS(SVG_NS, 'svg')
      this.toSVGShape(this.treemapSVG, this.treemapObject, 0, 0)
      this.treemapSVG.style.width = this.treemapObject.getWidth()
      this.treemapSVG.style.height = this.treemapObject.getHeight()
      this.treemapSVG.style.position = 'absolute'
      this.treemapSVG.style.transformOrigin = 'top'
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

      // Tooltip
      shape.addEventListener('mouseover', (event) => {
        if (item.getType() !== 'treemap') {
          shape.classList.add('hovered')
        }
        this.showToolTip(event, item)
      })
      shape.addEventListener('mousemove', (event) => this.moveToolTip(event, item))
      shape.addEventListener('mouseout', () => {
        shape.classList.remove('hovered')
        this.hideToolTip()
      })
      let self = this
      let clickStartDatetime
      shape.addEventListener('mousedown', function () {
        clickStartDatetime = Date.now()
      })
      shape.addEventListener('mouseup', () => {
        // Distinguish a short-time click (access the location) to a holding click (moving the canva).
        if (clickStartDatetime && Date.now() - clickStartDatetime <= 200) {
          // Navigate to the destination
          if (item.getData()) {
            window.open(item.getData().location, '_blank')

            // Keep in memory the last click
            if (self.shapeClicked) {
              self.shapeClicked.classList.remove('clicked')
            }
            self.shapeClicked = shape
            self.shapeClicked.classList.add('clicked')
          } else {
            self.shapeClicked.classList.remove('clicked')
            self.shapeClicked = null
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
      shape.setAttribute('cy', y + item.getWidth() / 2)
      shape.setAttribute('r', item.getWidth() / 2)
      shape.setAttribute('fill', item.getColor())
      shape.setAttribute('fill-opacity', item.getOpacity())
      image.innerHTML = IMAGES[item.getData().operation.name]
      image.setAttribute(
        'transform',
        `translate(${x + IMAGE_SHIFT}, ${y + IMAGE_SHIFT}) scale(${IMAGE_SCALE})`
      )
      image.setAttribute('fill-opacity', item.getOpacity())
      group.appendChild(shape)
      group.appendChild(image)
      return group
    },
    updateTransform() {
      if (this.treemapSVG) {
        this.treemapSVG.style.transform = `translate(${this.treemapPanX}px, ${this.treemapPanY}px) scale(${this.treemapScale})`
      }
    },
    onWheel(event) {
      event.preventDefault()
      this.treemapScale += event.deltaY < 0 ? ZOOM_FACTOR : -ZOOM_FACTOR
      this.treemapScale = Math.max(MIN_ZOOM, Math.min(this.treemapScale, MAX_ZOOM)) // Zoom limit.
      this.updateTransform()
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
      this.updateTransform()
    },
    onMouseUp() {
      this.treemapIsPanning = false
    },
    onMouseLeave() {
      this.treemapIsPanning = false
    },
    showToolTip(event, item) {
      this.toolTipVisibility = true
      this.updateToolTipPosition(event)
      this.updateToolTipText(item)
    },
    moveToolTip(event, item) {
      this.updateToolTipPosition(event)
      this.updateToolTipText(item)
    },
    hideToolTip() {
      this.toolTipVisibility = false
    },
    updateToolTipPosition(event) {
      this.toolTipX = event.pageX + 10
      this.toolTipY = event.pageY + 10
    },
    updateToolTipText(item) {
      let text = ''
      if (item.getData() !== undefined) {
        text += '<span>' + item.getData().location + '</span>'
        if (
          item.getData().technology &&
          item.getData().operation &&
          item.getData().method &&
          item.getData().sample
        ) {
          text += '<span>' + item.getData().technology.id + '</span>'
          text += '<span>' + item.getData().operation.name + '</span>'
          text += '<span>' + item.getData().method.name + '</span>'
          text += '<span>' + item.getData().sample.content + '</span>'
          text +=
            '<span>' +
            item
              .getData()
              .concepts.reduce((acc, item) => {
                acc.push(item.name)
                return acc
              }, [])
              .join(', ') +
            '</span>'
        }
      }
      this.toolTipText = text
    },
    toggleSettings() {
      this.settingsVisibility = !this.settingsVisibility
    },
    onTechnologyColorSelected(technologyId, color) {
      let coloredModel = this.dataMapper.colorTreemap(this.treemapObject, (item) => {
        if (item.type === 'codeFragment' && item.getData().technology.id === technologyId) {
          item.color = color
        }
        return item
      })
      this.treemapObject = coloredModel
      this.renderTreemap()
    },
    onOperationColorSelected(operationName, color) {
      let coloredModel = this.dataMapper.colorTreemap(this.treemapObject, (item) => {
        if (item.getType() === 'codeFragment' && item.getData().operation.name === operationName) {
          item.setColor(color)
        }
        return item
      })
      this.treemapObject = coloredModel
      this.renderTreemap()
    },
    onConceptSelected(conceptName) {
      let opacedModel = this.dataMapper.colorTreemap(this.treemapObject, (item) => {
        if (item.getType() === 'codeFragment') {
          if (
            conceptName.length !== 0 && // If one concept is selected ...
            item.getData().concepts.filter((concept) => concept.name === conceptName).length === 0 // ... and of that item does not contain the selected one.
          ) {
            item.setOpacity(OPAQUE) // Set the opacity.
          } else {
            item.setOpacity(NO_OPAQUE) // Unset the opacity if no concept is selected.
          }
        }
        return item
      })
      this.treemapObject = opacedModel
      this.renderTreemap()
    }
  }
}
</script>

<template>
  <!-- Settings -->
  <div class="container">
    <button class="btn btn-light settings-button" type="button" @click="toggleSettings">
      <i class="bi bi-gear-fill"></i>
    </button>
    <div :class="['settings', { 'd-none': !settingsVisibility }]">
      <div class="sub-settings">
        <div v-for="technology in technologiesList" :key="technology">
          <span>
            <ColorSlider
              :label="technology"
              @updateColor="onTechnologyColorSelected(technology, $event)"
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
              @updateColor="onOperationColorSelected(operation, $event)"
            />
          </span>
        </div>
      </div>
      <hr class="line" />
      <div v-if="conceptsList.length > 0" class="sub-settings">
        <span>Concept: </span><br />
        <select @change="onConceptSelected($event.target.value)" class="form-control">
          <option value=""></option>
          <option v-for="(item, index) in conceptsList" :key="index" :value="item">
            {{ item }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <br />
  <!-- Treemap -->
  <div
    ref="treemap"
    class="treemap"
    @wheel="onWheel"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseLeave"
  ></div>
  <!-- Tooltip -->
  <div
    class="toolTip"
    v-if="toolTipVisibility"
    :style="{ left: toolTipX + 'px', top: toolTipY + 'px' }"
    v-html="toolTipText"
  ></div>
</template>

<style>
/* Settings */

.settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 20px;
}

.settings div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.settings div span {
  margin: 5px;
}

.settings-button {
  width: 100%;
}

/* Treemap */

.treemap {
  position: relative;
  width: 100%;
  height: 1000px;
  overflow: hidden;
  cursor: grab;
  border: 1px solid #d3d4d5;
  border-radius: 0.375rem;
}

.hovered {
  stroke: black;
  stroke-width: 1px;
  cursor: pointer;
}

.clicked {
  outline: 2px solid rgb(0, 0, 0);
  outline-offset: 3px;
  border-radius: 0px;
}

/* Tooltip */

.toolTip {
  position: absolute;
  background: rgb(255, 255, 255);
  color: black;
  padding: 10px;
  border-radius: 0px;
  pointer-events: none;
  font-size: 10pt;
  text-align: left;
  padding: 0;
  margin: 0;
}

.toolTip span {
  display: block;
  padding: 5px;
  border: 1px solid #f8f9fa;
}
</style>
