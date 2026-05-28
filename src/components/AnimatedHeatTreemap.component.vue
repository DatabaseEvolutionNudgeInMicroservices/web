<script>
// Libraries
import { nextTick } from 'vue'

// Components
import ZoomControls from '@/components/ZoomControls.component.vue'
import FrameSequenceDetails from '@/components/FrameSequenceDetails.component.vue'
import ToolTip from '@/components/ToolTip.component.vue'

// Helpers
import { DataMapper } from '@/helpers/DataMapper.helper'
import {
  ANIMATION_SPEEDS,
  BASE_FF_TIME_MS,
  DEFAULT_FF_THRESHOLD,
  DEFAULT_FPS,
  DEFAULT_LINES_TIME_LIMIT,
  HOUR_IN_MS,
  IMAGE_SCALE,
  IMAGE_SHIFT,
  IMAGES,
  MAX_ZOOM,
  MIN_ZOOM,
  MINUTE_IN_MS,
  SECOND_IN_MS,
  SVG_NS,
  ZOOM_FACTOR
} from '@/helpers/Constants.helper'
import {
  DYNAMIC,
  FRAMES_LINES,
  FRAMES_LINES_TIMEOUT,
  FRAMES_TIME_WINDOW,
  FRAMES_TIME_WINDOW_TIMEOUT,
  NB_FRAMES_TIME_ELAPSED,
  NB_FRAMES_TIME_WINDOW,
  REALISTIC_TIME_SCALE,
  REALISTIC_TIME_SCALE_FAST_FORWARD_TIMEOUT,
  SECONDS_ABBREVIATION,
  STATIC,
  TECHNOLOGIES_OPERATIONS_BREAKDOWN
} from '@/helpers/Text.helper.js'
import TwoDimensionsBreakdownComponent from '@/components/TwoDimensionsBreakdown.component.vue'

export default {
  components: {
    TwoDimensionsBreakdownComponent,
    ToolTip,
    ZoomControls,
    FrameSequenceDetails
  },
  props: {
    treemap: {
      type: Object,
      required: true
    },
    frames: {
      type: Array,
      required: true
    },
    minMaxFrames: {
      type: Object,
      required: true
    },
    operationsTechnologiesBreakdown: {
      type: Object
      //required: false
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
    frames: {
      handler(newFrames) {
        this.updateFrames(newFrames)
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
      // Model: Animation.
      animationFramesObject: [],
      animationFrameObject: null,
      currentFramesCountByFragment: {},
      currentFrameIndex: 0,
      // Model: Lines.
      frameHistoryLines: [],
      frameLinesTimeWindow: DEFAULT_LINES_TIME_LIMIT,
      // Model: Realistic timescale.
      fastForwardThreshold: DEFAULT_FF_THRESHOLD,
      timeoutStartTime: 0,
      currentTimeout: null,
      isInTimeoutPeriod: false,
      fastForwardMessage: '',
      // Model: Time window.
      timeWindow: 3,
      // Model: Time.
      isPaused: true,
      previousTime: 0,
      SECOND_IN_MS,
      // Model: Speed multiplier.
      speedMultiplier: 1,

      // View: Settings.
      settingsVisibility: false,
      // View: Animation controls.
      animationControlsVisibility: false,
      // View: Animation.
      frameLinesVisibility: false,
      fps: DEFAULT_FPS,
      // View: Realistic timescale.
      realisticTimeScaleVisibility: false,
      // View: Time window.
      timeWindowVisibility: false,
      // View: Frame sequence details.
      frameSequenceDetailsVisibility: false,
      // View: Operations technologies breakdown.
      operationsTechnologiesBreakdownVisibility: false,
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
      // View: Texts.
      SECONDS_ABBREVIATION,
      FRAMES_LINES,
      FRAMES_LINES_TIMEOUT,
      FRAMES_TIME_WINDOW_TIMEOUT,
      REALISTIC_TIME_SCALE,
      REALISTIC_TIME_SCALE_FAST_FORWARD_TIMEOUT,
      FRAMES_TIME_WINDOW,
      NB_FRAMES_TIME_ELAPSED,
      NB_FRAMES_TIME_WINDOW,
      TECHNOLOGIES_OPERATIONS_BREAKDOWN,
      STATIC,
      DYNAMIC
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
      }
    },
    updateFrames(newFrames) {
      if (newFrames) {
        // Frames

        this.animationFramesObject = this.dataMapper.reviveFrames(newFrames)

        // View

        this.preRenderTreemap()
        this.renderTreemap()
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
      const baseRadius = item.getWidth() / 2
      group.setAttribute('id', `group-${item.getData().location}`)
      shape.setAttribute('id', `codeFragmentCircle-${item.getData().location}`)
      shape.setAttribute('cx', x + item.getWidth() / 2)
      shape.setAttribute('cy', y + item.getHeight() / 2)
      shape.setAttribute('r', baseRadius)
      shape.setAttribute('fill', item.getColor())
      shape.setAttribute('fill-opacity', item.getOpacity())
      group.appendChild(shape)
      image.insertAdjacentHTML('beforeend', IMAGES[item.getData().operation.name])
      image.setAttribute(
        'transform',
        `translate(${x + IMAGE_SHIFT}, ${y + IMAGE_SHIFT}) scale(${IMAGE_SCALE})`
      )
      image.setAttribute('fill-opacity', item.getOpacity())
      group.appendChild(image)
      return group
    },
    toSVGShapeAllFrames() {
      const currentSecond = this.getCurrentSecond()
      const allFragmentLocations = Object.keys(this.currentFramesCountByFragment)

      allFragmentLocations.forEach((location) => {
        const codeFragmentCircle = document.getElementById(`codeFragmentCircle-${location}`)
        if (!codeFragmentCircle) return

        const group = document.getElementById(`group-${location}`)
        let frameCircle = document.getElementById(`frameCircle-${location}`)

        const isVisibleInWindow =
          !this.timeWindowVisibility ||
          (currentSecond !== null &&
            this.timeSlices[currentSecond] &&
            this.timeSlices[currentSecond].framesByLocation[location])

        if (isVisibleInWindow) {
          if (!frameCircle) {
            frameCircle = document.createElementNS(SVG_NS, 'circle')
            group.appendChild(frameCircle)
          }
          this.toSVGShapeFrame(frameCircle, codeFragmentCircle, location)
        } else if (frameCircle) {
          group.removeChild(frameCircle)
        }
      })
    },
    toSVGShapeFrames() {
      Object.keys(this.currentFramesCountByFragment).forEach((location) => {
        const codeFragmentCircle = document.getElementById(`codeFragmentCircle-${location}`)
        if (!codeFragmentCircle) return

        const group = document.getElementById(`group-${location}`)
        const frameCircle = document.createElementNS(SVG_NS, 'circle')
        this.toSVGShapeFrame(frameCircle, codeFragmentCircle, location)

        const existingFrameCircle = document.getElementById(`frameCircle-${location}`)
        if (existingFrameCircle) {
          group.removeChild(existingFrameCircle)
        }

        group.appendChild(frameCircle)
      })
    },
    toSVGShapeFrame(frameCircle, codeFragmentCircle, location) {
      const framesCount = this.getFramesCountByLocation(location)
      const baseRadius = parseFloat(codeFragmentCircle.getAttribute('r'))
      const color = this.toSVGShapeFrameColor(framesCount)

      frameCircle.setAttribute('id', `frameCircle-${location}`)
      frameCircle.setAttribute('cx', codeFragmentCircle.getAttribute('cx'))
      frameCircle.setAttribute('cy', codeFragmentCircle.getAttribute('cy'))
      frameCircle.setAttribute('r', this.toSVGShapeFrameScaledRadius(baseRadius, framesCount, 4))
      frameCircle.setAttribute('fill', color)
      frameCircle.setAttribute('fill-opacity', 0.5)
      frameCircle.setAttribute('stroke', color)
      frameCircle.setAttribute('stroke-width', 1)
    },
    toSVGShapeFrameColor(framesCount) {
      const blue = 0
      let red, green
      let normalizedValue

      if (this.timeWindowVisibility) {
        const { min, max } = this.getMinMaxFramesCountByTimeWindow()
        normalizedValue = min === max ? 0.5 : (framesCount - min) / (max - min)
      } else {
        normalizedValue =
          (framesCount - this.minMaxFrames.min) / (this.minMaxFrames.max - this.minMaxFrames.min)
      }

      if (normalizedValue < 0.5) {
        red = Math.round(255 * (2 * normalizedValue))
        green = 255
      } else {
        red = 255
        green = Math.round(255 * (2 - 2 * normalizedValue))
      }

      return `rgb(${red}, ${green}, ${blue})`
    },
    toSVGShapeFrameScaledRadius(baseRadius, framesCount, scaleFactor = 3) {
      let min, max

      if (this.timeWindowVisibility) {
        const minMax = this.getMinMaxFramesCountByTimeWindow()
        min = minMax.min
        max = minMax.max
      } else {
        min = this.minMaxFrames.min
        max = this.minMaxFrames.max
      }

      const diff = max - min
      if (diff === 0) return baseRadius

      const scaledRadius = baseRadius + scaleFactor * ((framesCount - min) / diff)
      return Math.min(scaledRadius, 1.5 * baseRadius)
    },
    toSVGShapeLineByPositions(startPosition, endPosition) {
      for (let i = startPosition; i <= endPosition; i++) {
        const previousLocation = this.animationFramesObject[i - 1].getLocation()
        const currentLocation = this.animationFramesObject[i].getLocation()

        if (previousLocation !== currentLocation) {
          const line = this.toSVGShapeLineByCodeFragments(previousLocation, currentLocation)
          if (line) {
            line.dataset.timestamp = this.animationFramesObject[i].getTimestamp()
            this.frameHistoryLines.push(line)
          }
        }
      }
    },
    toSVGShapeLineByCodeFragments(previousCodeFragmentLocation, currentCodeFragmentLocation) {
      const previousCircle = document.getElementById(
        `codeFragmentCircle-${previousCodeFragmentLocation}`
      )
      const currentCircle = document.getElementById(
        `codeFragmentCircle-${currentCodeFragmentLocation}`
      )

      if (!previousCircle || !currentCircle) return null

      if (!document.getElementById('dotMarker')) {
        let defs = this.treemapSVG.querySelector('defs')
        if (!defs) {
          defs = document.createElementNS(SVG_NS, 'defs')
          this.treemapSVG.insertBefore(defs, this.treemapSVG.firstChild)
        }

        const dotMarker = document.createElementNS(SVG_NS, 'marker')
        dotMarker.setAttribute('id', 'dotMarker')
        dotMarker.setAttribute('viewBox', '0 0 6 6')
        dotMarker.setAttribute('refX', '3')
        dotMarker.setAttribute('refY', '3')
        dotMarker.setAttribute('markerWidth', '3')
        dotMarker.setAttribute('markerHeight', '3')

        const dot = document.createElementNS(SVG_NS, 'circle')
        dot.setAttribute('cx', '3')
        dot.setAttribute('cy', '3')
        dot.setAttribute('r', '2')
        dot.setAttribute('fill', '#2e2e2e')

        dotMarker.appendChild(dot)
        defs.appendChild(dotMarker)
      }

      const line = document.createElementNS(SVG_NS, 'line')
      line.setAttribute('x1', previousCircle.getAttribute('cx'))
      line.setAttribute('y1', previousCircle.getAttribute('cy'))
      line.setAttribute('x2', currentCircle.getAttribute('cx'))
      line.setAttribute('y2', currentCircle.getAttribute('cy'))
      line.setAttribute('stroke', '#2e2e2e')
      line.setAttribute('stroke-width', '3')
      line.setAttribute('stroke-opacity', '0.6')
      line.setAttribute('marker-end', 'url(#dotMarker)')

      line.dataset.timestamp = this.animationFramesObject[this.currentFrameIndex].getTimestamp()

      this.treemapSVG.appendChild(line)

      return line
    },
    toSVGShapeLinesByTimeWindow(position) {
      if (!this.frameLinesVisibility || position <= 0) return

      const currentTimestamp = this.animationFramesObject[position].getTimestamp()
      const windowStartTimestamp = currentTimestamp - this.frameLinesTimeWindow * SECOND_IN_MS

      let startPosition = position
      for (let i = position - 1; i >= 0; i--) {
        if (this.animationFramesObject[i].getTimestamp() < windowStartTimestamp) {
          break
        }
        startPosition = i
      }

      this.toSVGShapeLineByPositions(startPosition + 1, position)
    },
    toSVGShapeClearedLines() {
      this.frameHistoryLines.forEach((line) => this.toSVGShapeOutdatedLine(line))
      this.frameHistoryLines = []
    },
    toSVGShapeOutdatedLines() {
      const currentTimestamp = this.animationFramesObject[this.currentFrameIndex].getTimestamp()
      const timeWindowThreshold = this.frameLinesTimeWindow * SECOND_IN_MS

      const linesToRemove = this.frameHistoryLines.filter((line) => {
        const lineTimestamp = parseInt(line.dataset.timestamp)
        return currentTimestamp - lineTimestamp > timeWindowThreshold
      })

      linesToRemove.forEach((line) => {
        this.toSVGShapeOutdatedLine(line)
        const index = this.frameHistoryLines.indexOf(line)
        if (index > -1) {
          this.frameHistoryLines.splice(index, 1)
        }
      })
    },
    toSVGShapeOutdatedLine(line) {
      if (line && line.parentNode) {
        line.parentNode.removeChild(line)
      }
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
    onMouseUp() {
      this.treemapIsPanning = false
    },
    onMouseMove(event) {
      if (!this.treemapIsPanning) return
      this.treemapPanX = event.clientX - this.treemapStartX
      this.treemapPanY = event.clientY - this.treemapStartY

      this.onTransform()
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
    onPlayAnimation() {
      if (this.isPaused) return

      const currentTime = Date.now()

      if (this.previousTime === 0) {
        this.previousTime = currentTime
      }

      if (this.realisticTimeScaleVisibility) {
        this.onPlayAnimationRealisticTime(currentTime)
      } else {
        this.onPlayAnimationStandardTime(currentTime)
      }

      this.animationFrameObject = requestAnimationFrame(() => {
        this.onPlayAnimation()
      })
    },
    onPlayNextAnimation() {
      const currentFrameIndex = this.currentFrameIndex
      const frameLocation = this.animationFramesObject[currentFrameIndex].getLocation()
      const group = document.getElementById(`group-${frameLocation}`)
      const codeFragmentCircle = document.getElementById(`codeFragmentCircle-${frameLocation}`)
      let frameCircle = document.getElementById(`frameCircle-${frameLocation}`)

      if (!frameCircle) {
        frameCircle = document.createElementNS(SVG_NS, 'circle')
        frameCircle.setAttribute('id', `frameCircle-${frameLocation}`)
        group.appendChild(frameCircle)
      }

      if (this.frameLinesVisibility && currentFrameIndex > 0) {
        const previousFrameLocation =
          this.animationFramesObject[currentFrameIndex - 1].getLocation()

        if (previousFrameLocation !== frameLocation) {
          const line = this.toSVGShapeLineByCodeFragments(previousFrameLocation, frameLocation)

          if (line) {
            this.frameHistoryLines.push(line)
            this.toSVGShapeOutdatedLines()
          }
        }
      }

      this.onFramesCountChangedByLocation(frameLocation)
      this.onTimeWindowChangedFrames()
      this.toSVGShapeFrame(frameCircle, codeFragmentCircle, frameLocation)

      this.currentFrameIndex++
    },
    onPauseAnimation() {
      this.isPaused = true
    },
    onStopAnimation() {
      if (this.animationFrameObject) {
        cancelAnimationFrame(this.animationFrameObject)
        this.onResetAnimation()
      }
      this.renderTreemap()
    },
    onResetAnimation() {
      // Model: Animation.
      this.animationFrameObject = null
      this.currentFrameIndex = 0
      this.currentFramesCountByFragment = {}
      this.fps = DEFAULT_FPS
      // Model: Lines.
      this.frameHistoryLines = []
      // Model: Time.
      this.previousTime = 0
      this.isPaused = true
      // Model: Speed multiplier.
      this.speedMultiplier = ANIMATION_SPEEDS[0]
      // Model: Fast forwarding.
      this.timeoutStartTime = 0
      this.currentTimeout = null
      this.isInTimeoutPeriod = false
      this.fastForwardMessage = ''
    },
    onPlayAnimationRealisticTime(currentTime) {
      if (this.isInTimeoutPeriod) {
        // Pause animation until timeout elapsed.
        const timeoutElapsed = currentTime - this.timeoutStartTime
        if (timeoutElapsed >= this.currentTimeout) {
          this.isInTimeoutPeriod = false
          this.fastForwardMessage = ''
        }
      } else if (this.currentFrameIndex < this.animationFramesObject.length - 1) {
        // Play next animation.
        this.onPlayAnimationRealisticNextTime(currentTime)
      } else if (this.currentFrameIndex >= this.animationFramesObject.length) {
        // End animation.
        this.onPauseAnimation()
      } else {
        // Play animation.
        this.onPlayNextAnimation()
        this.previousTime = currentTime
      }
    },
    onPlayAnimationRealisticNextTime(currentTime) {
      const currentFrame = this.animationFramesObject[this.currentFrameIndex]
      const nextFrame = this.animationFramesObject[this.currentFrameIndex + 1]
      const framesTimeDifference = nextFrame.timestamp - currentFrame.timestamp
      const elapsedTimeSinceLastAction = (currentTime - this.previousTime) * this.speedMultiplier

      if (framesTimeDifference > this.fastForwardThreshold) {
        // Fast forwarding.
        this.isInTimeoutPeriod = true
        this.fastForwardMessage = `${this.getFormattedDatetime(framesTimeDifference)}`
        this.currentTimeout = BASE_FF_TIME_MS / this.speedMultiplier
        this.timeoutStartTime = currentTime
        this.onPlayNextAnimation()
        this.previousTime = currentTime
      } else if (elapsedTimeSinceLastAction >= framesTimeDifference) {
        // Next animation.
        this.onPlayNextAnimation()
        this.previousTime = currentTime
      }
    },
    onPlayAnimationStandardTime(currentTime) {
      const elapsedTime = currentTime - this.previousTime
      const interval = SECOND_IN_MS / this.fps

      if (elapsedTime > interval) {
        this.previousTime = currentTime - (elapsedTime % interval)
        for (let i = 0; i < this.speedMultiplier; i++) {
          if (this.currentFrameIndex >= this.animationFramesObject.length) {
            this.onPauseAnimation()
            return
          }
          this.onPlayNextAnimation()
        }
      }
    },
    onFrameLinesTimeWindowChanged(value) {
      this.frameLinesTimeWindow = Math.min(30, parseInt(value))
      this.toSVGShapeOutdatedLines()
    },
    onTimeWindowChanged(value) {
      const newSize = Math.max(1, parseInt(value) || 1)
      if (this.timeWindow !== newSize) {
        this.timeWindow = newSize
        this.onTimeSlicesChanged()
        if (this.timeWindowVisibility) {
          this.onTimeWindowChangedFrames()
        }
      }
    },
    onFastForwardThreshold(value) {
      this.fastForwardThreshold = Math.max(1, parseFloat(value) || 0) * SECOND_IN_MS
    },
    onSpeedMultiple() {
      const speeds = ANIMATION_SPEEDS
      const currentIndex = speeds.indexOf(this.speedMultiplier)
      const nextIndex = (currentIndex + 1) % speeds.length
      this.speedMultiplier = speeds[nextIndex]
    },
    onSeekToPosition(position) {
      position = parseInt(position)

      this.onPauseAnimation()
      this.toSVGShapeClearedLines() // Clears all lines in the existing state.
      this.onFramesCountChangedByPosition(position)
      this.currentFrameIndex = position

      if (this.timeWindowVisibility) {
        if (!this.timeSlices || this.timeSlices.length === 0) {
          this.onTimeSlicesChanged()
        }
        this.onTimeWindowChangedFrames()
      }

      this.renderTreemap()
      this.toSVGShapeLinesByTimeWindow(position)
      this.toSVGShapeFrames()
    },
    onFramesCountChangedByPosition(position) {
      this.currentFramesCountByFragment = {}
      for (let i = 0; i < position; i++) {
        const fragment = this.animationFramesObject[i]
        if (fragment) {
          this.onFramesCountChangedByLocation(fragment.getLocation())
        }
      }
    },
    onFramesCountChangedByLocation(location) {
      if (this.currentFramesCountByFragment[location]) {
        this.currentFramesCountByFragment[location]++
      } else {
        this.currentFramesCountByFragment[location] = 1
      }
    },
    onTimeSlicesChanged() {
      if (!this.animationFramesObject || this.animationFramesObject.length === 0) {
        this.timeSlices = []
        return
      }

      const firstTimestamp = this.animationFramesObject[0].getTimestamp()
      const lastTimestamp =
        this.animationFramesObject[this.animationFramesObject.length - 1].getTimestamp()

      // Number of slices of 1s interval frames
      const totalSeconds = Math.ceil((lastTimestamp - firstTimestamp) / SECOND_IN_MS)

      this.timeSlices = new Array(totalSeconds)
      for (let i = 0; i < totalSeconds; i++) {
        this.timeSlices[i] = { position: i, framesByLocation: {} }
      }

      this.animationFramesObject.forEach((frame) => {
        const frameTime = Math.floor((frame.getTimestamp() - firstTimestamp) / SECOND_IN_MS)

        if (frameTime >= 0 && frameTime < totalSeconds) {
          const location = frame.location
          const windowStart = Math.max(0, frameTime - this.timeWindow + 1)
          const windowEnd = Math.min(totalSeconds - 1, frameTime)

          for (let sliceIndex = windowStart; sliceIndex <= windowEnd; sliceIndex++) {
            const framesByLocation = this.timeSlices[sliceIndex].framesByLocation
            framesByLocation[location] = (framesByLocation[location] || 0) + 1
          }
        }
      })
    },
    onTimeWindowChangedFrames() {
      if (!this.timeWindowVisibility || !this.timeSlices || this.timeSlices.length === 0) return

      const currentSecond = this.getCurrentSecond()

      if (currentSecond >= 0 && currentSecond < this.timeSlices.length) {
        this.toSVGShapeAllFrames()
      }
    },
    toggleSettings() {
      this.settingsVisibility = !this.settingsVisibility
    },
    toggleAnimationControls() {
      this.animationControlsVisibility = !this.animationControlsVisibility
    },
    toggleFrameLines() {
      this.frameLinesVisibility = !this.frameLinesVisibility
      if (!this.frameLinesVisibility) {
        this.frameHistoryLines.forEach((line) => this.toSVGShapeOutdatedLine(line))
        this.frameHistoryLines = []
      }
    },
    toggleTimeWindow() {
      this.timeWindowVisibility = !this.timeWindowVisibility
      if (this.timeWindowVisibility) {
        this.onTimeSlicesChanged()
        this.onTimeWindowChangedFrames()
      }
    },
    toggleRealisticTimeScale() {
      this.realisticTimeScaleVisibility = !this.realisticTimeScaleVisibility
    },
    toggleAnimation() {
      if (this.isPaused) {
        this.isPaused = false
        this.animationFrameObject = requestAnimationFrame(() => {
          this.onPlayAnimation(this.fps)
        })
      } else {
        this.onPauseAnimation()
      }
    },
    toggleFrameSequenceDetails() {
      this.frameSequenceDetailsVisibility = !this.frameSequenceDetailsVisibility
    },
    toggleBreakdown() {
      this.operationsTechnologiesBreakdownVisibility =
        !this.operationsTechnologiesBreakdownVisibility
    },
    /**
     * Utils.
     */
    getToolTipHtml(data) {
      let html = ''
      if (data.getData() !== undefined) {
        if (data.getData().location !== undefined) {
          html += '<span>' + data.getData().location + '</span>'

          const totalFramesCount = this.currentFramesCountByFragment[data.getData().location]
          if (totalFramesCount !== undefined) {
            html += '<span>' + totalFramesCount + ' ' + NB_FRAMES_TIME_ELAPSED + '</span>'
          }

          if (this.timeWindowVisibility) {
            const windowFramesCount = this.getFramesCountByLocation(data.getData().location)
            html +=
              '<span>' +
              windowFramesCount +
              ' ' +
              NB_FRAMES_TIME_WINDOW +
              this.timeWindow +
              SECONDS_ABBREVIATION +
              '</span>'
          }
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
    getCurrentSecond() {
      const currentFrame = this.animationFramesObject[this.currentFrameIndex]
      const firstTimestamp = this.animationFramesObject[0].getTimestamp()

      return Math.floor((currentFrame.getTimestamp() - firstTimestamp) / SECOND_IN_MS)
    },
    getFramesCountByLocation(location) {
      const currentSecond = this.getCurrentSecond()

      if (this.timeWindowVisibility && currentSecond !== null) {
        return this.timeSlices[currentSecond]?.framesByLocation[location] || 0
      }
      return this.currentFramesCountByFragment[location] || 0
    },
    getMinMaxFramesCountByTimeWindow() {
      const currentSecond = this.getCurrentSecond()
      if (
        !this.timeWindowVisibility ||
        currentSecond === null ||
        !this.timeSlices ||
        currentSecond >= this.timeSlices.length
      ) {
        return { min: 0, max: 1 }
      }

      const framesCounts = Object.values(this.timeSlices[currentSecond].framesByLocation)
      if (framesCounts.length === 0) {
        return { min: 0, max: 1 }
      }

      let min = Number.MAX_VALUE
      let max = Number.MIN_VALUE

      for (const count of framesCounts) {
        if (count < min) min = count
        if (count > max) max = count
      }

      return { min, max }
    },
    getFormattedDatetime(timeMilliseconds) {
      const hours = Math.floor(timeMilliseconds / HOUR_IN_MS)
      const minutes = Math.floor((timeMilliseconds % HOUR_IN_MS) / MINUTE_IN_MS)
      const seconds = Math.floor((timeMilliseconds % MINUTE_IN_MS) / SECOND_IN_MS)

      let timeString = ''
      if (hours > 0) timeString += `${hours}h `
      if (minutes > 0 || hours > 0) timeString += `${minutes}m `
      timeString += `${seconds}s`

      return timeString
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
  <div class="container">
    <!-- Settings -->
    <button class="btn btn-light settings-button" type="button" @click="toggleSettings">
      <i :class="settingsVisibility ? 'bi-gear-fill' : 'bi-gear'"></i>
    </button>
    <div :class="['settings', { 'd-none': !settingsVisibility }]">
      <div class="sub-settings">
        <div class="row align-items-center w-100">
          <div class="col-6">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="toggleFrameLines"
                @change="toggleFrameLines()"
              />
              <label class="form-check-label" for="toggleFrameLines">{{ FRAMES_LINES }}</label>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <i class="input-group-text bi bi-clock-history"></i>
              <span class="input-group-text">{{ FRAMES_LINES_TIMEOUT }}</span>
              <input
                type="number"
                class="form-control"
                id="frameLinesTimeWindow"
                @input="onFrameLinesTimeWindowChanged($event.target.value)"
                min="1"
                max="30"
                step="1"
                :value="frameLinesTimeWindow"
                :disabled="!frameLinesVisibility"
              />
              <span class="input-group-text">{{ SECONDS_ABBREVIATION }}</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="line" />
      <div class="sub-settings">
        <div class="row align-items-center w-100">
          <div class="col-6">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="toggleRealisticTimeScale"
                @change="toggleRealisticTimeScale()"
              />
              <label class="form-check-label" for="toggleRealisticTimeScale">
                {{ REALISTIC_TIME_SCALE }}
              </label>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <i class="input-group-text bi bi-fast-forward"></i>
              <span class="input-group-text">{{ REALISTIC_TIME_SCALE_FAST_FORWARD_TIMEOUT }}</span>
              <input
                type="number"
                class="form-control"
                id="fastForwardThreshold"
                @input="onFastForwardThreshold($event.target.value)"
                min="1"
                step="1"
                :value="fastForwardThreshold / SECOND_IN_MS"
                :disabled="!realisticTimeScaleVisibility"
              />
              <span class="input-group-text">{{ SECONDS_ABBREVIATION }}</span>
            </div>
          </div>
        </div>
      </div>
      <hr class="line" />
      <div class="sub-settings">
        <div class="row align-items-center w-100">
          <div class="col-6">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="toggleTimeWindow"
                @input="toggleTimeWindow"
              />
              <label class="form-check-label" for="toggleTimeWindow">{{
                FRAMES_TIME_WINDOW
              }}</label>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <i class="input-group-text bi bi-clock-history"></i>
              <span class="input-group-text">{{ FRAMES_TIME_WINDOW_TIMEOUT }}</span>
              <input
                type="number"
                class="form-control"
                id="windowSizeSeconds"
                @change="onTimeWindowChanged($event.target.value)"
                min="5"
                step="1"
                :value="timeWindow"
                :disabled="!timeWindowVisibility"
              />
              <span class="input-group-text">{{ SECONDS_ABBREVIATION }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Animation Controls -->
    <button
      class="btn btn-light settings-button top"
      type="button"
      @click="toggleAnimationControls()"
    >
      <i
        :class="animationControlsVisibility ? ' bi-collection-play-fill' : 'bi-collection-play'"
      ></i>
    </button>
    <div :class="['top', { 'd-none': !animationControlsVisibility }]">
      <div class="d-flex justify-content-center">
        <div class="btn-group w-50" role="group" aria-label="Animation controls">
          <button class="btn btn-light" @click="toggleAnimation()">
            <i class="bi" :class="isPaused ? 'bi-play' : 'bi-pause'"></i>
          </button>
          <button
            class="btn btn-light"
            :disabled="!this.animationFrameObject"
            @click="onStopAnimation()"
          >
            <i class="bi bi-stop"></i>
          </button>
          <button class="btn btn-light" @click="onSpeedMultiple()">
            <i class="bi bi-speedometer"></i> {{ speedMultiplier }}×
          </button>
        </div>
      </div>
      <div class="container mt-2">
        <div class="progress-bar-container">
          <input
            type="range"
            class="progress-bar-slider"
            min="0"
            :max="animationFramesObject.length - 1"
            :value="currentFrameIndex"
            @input="onSeekToPosition($event.target.value)"
            :disabled="animationFramesObject.length === 0"
          />
          <div class="progress-bar-info">
            <div
              v-if="realisticTimeScaleVisibility"
              :class="[
                'progress-bar-timeout-message',
                `${fastForwardMessage ? 'visible' : 'invisible'}`
              ]"
            >
              <i class="bi bi-fast-forward"></i>
              {{ fastForwardMessage }}
            </div>
            <div>{{ currentFrameIndex }} / {{ animationFramesObject.length }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Details -->
    <button
      class="btn btn-light settings-button top"
      type="button"
      @click="toggleFrameSequenceDetails"
    >
      <i :class="frameSequenceDetailsVisibility ? 'bi-info-circle-fill' : 'bi-info-circle'"></i>
    </button>
    <div v-show="frameSequenceDetailsVisibility" class="call-sequence-details top">
      <!-- Frame sequence details -->
      <FrameSequenceDetails
        v-if="frames"
        :disabled="!isPaused"
        :currentPosition="currentFrameIndex"
        :frames="frames"
      />
    </div>
    <button class="btn btn-light settings-button top" type="button" @click="toggleBreakdown">
      <i
        class="bi"
        :class="operationsTechnologiesBreakdownVisibility ? 'bi-bar-chart-fill' : 'bi-bar-chart'"
      ></i>
    </button>
    <!-- Metrics-->
    <div
      v-show="operationsTechnologiesBreakdownVisibility"
      class="operations-technologies-breakdown top"
    >
      <!-- Operations technologies breakdown static -->
      <TwoDimensionsBreakdownComponent
        v-if="operationsTechnologiesBreakdown"
        :title="STATIC + ' ' + TECHNOLOGIES_OPERATIONS_BREAKDOWN"
        :data="operationsTechnologiesBreakdown.static"
      /><br />
      <!-- Operations technologies breakdown dynamic -->
      <TwoDimensionsBreakdownComponent
        v-if="operationsTechnologiesBreakdown"
        v-show="operationsTechnologiesBreakdownVisibility"
        :title="DYNAMIC + ' ' + TECHNOLOGIES_OPERATIONS_BREAKDOWN"
        :data="operationsTechnologiesBreakdown.dynamic"
      />
    </div>
    <!-- Zoom controls -->
    <ZoomControls @onZoom="onZoom" @onResetZoom="onResetZoom" class="top" />
    <!-- Animated Heat Treemap -->
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

<style scoped>
/* Settings */

.settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Animated tree map */

.progress-bar-container {
  width: 100%;
  padding: 0 5px;
}

.progress-bar-slider {
  width: 100%;
  height: 10px;
  -webkit-appearance: none;
  background: #e9ecef;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
}

.progress-bar-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  background: #6c757d;
  border-radius: 50%;
}

.progress-bar-slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background: #6c757d;
  border-radius: 50%;
  border: none;
}

.progress-bar-info {
  margin-top: 5px;
  text-align: center;
  font-size: 0.8rem;
  color: #6c757d;
}

.progress-bar-timeout-message {
  margin-bottom: 5px;
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Call sequence details */

.call-sequence-details {
  padding: 25px;
  border: 1px solid #d3d4d5;
  border-radius: 0.375rem;
}

/* Operations technologies breakdown */

.operations-technologies-breakdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #d3d4d5;
  border-radius: 0.375rem;
}
</style>
