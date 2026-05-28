<script>
// Libraries
import { nextTick } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker'

// Components
import ToolTip from '@/components/ToolTip.component.vue'
import ZoomControls from '@/components/ZoomControls.component.vue'
import ColorSlider from '@/components/ColorSlider.component.vue'
import TwoDimensionsBreakdownComponent from '@/components/TwoDimensionsBreakdown.component.vue'
import FrameDetails from '@/components/FrameDetails.component.vue'

// Helpers
import { DataMapper } from '@/helpers/DataMapper.helper.js'
import {
  HOUR_IN_MS,
  IMAGES,
  MAX_FRAMES_INIT,
  MIN_ZOOM,
  MINUTE_IN_MS,
  SECOND_IN_MS,
  SVG_NS
} from '@/helpers/Constants.helper.js'
import { DYNAMIC, FRAME, STATIC } from '@/helpers/Text.helper.js'

export default {
  components: {
    FrameDetails,
    TwoDimensionsBreakdownComponent,
    ColorSlider,
    ToolTip,
    ZoomControls,
    VueDatePicker
  },
  props: {
    frames: {
      type: Array,
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
    operationsTechnologiesBreakdown: {
      type: Object
      //required: false
    }
  },
  watch: {
    frames: {
      handler(newFrames) {
        this.updateTimeline(newFrames)
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

      this.timelineDiv = this.$refs.timeline

      // View

      this.preRenderTimeline()
      this.renderTimeline()
    })
  },
  beforeUnmount() {
    // View

    this.postRenderTimeline()
  },
  data() {
    return {
      // Model: Frames.
      framesObject: null,
      datePickerRange: null,
      previousTimeRange: null,
      initialTimeRange: null,

      // View: Settings.
      settingsVisibility: false,
      // View: Timeline.
      timelineDiv: null,
      timelineSVG: null,
      visibleTimeRange: null,
      // View: Operations technologies breakdown.
      operationsTechnologiesBreakdownVisibility: false,
      // View: Frame details.
      selectedFrame: null,
      // View: Zoom.
      alreadyZoomed: false,
      zoomPoint: 0.5,
      zoomToPointFactor: 3,
      // View: Transform.
      isDragging: false,
      dragStartX: 0,
      dragStartRange: null,
      // View: Tool tip.
      toolTipVisibility: false,
      toolTipX: 0,
      toolTipY: 0,
      toolTipHtml: '',
      // View: Texts.
      STATIC,
      DYNAMIC
    }
  },
  methods: {
    /**
     * Data.
     */
    updateTimeline(newFrames) {
      if (newFrames) {
        // Timeline

        this.framesObject = this.dataMapper.reviveFrames(newFrames)

        // View

        this.preRenderTimeline()
        this.renderTimeline()
      }
    },
    /**
     * Rendering.
     */
    preRenderTimeline(numPoints = MAX_FRAMES_INIT) {
      if (this.timelineDiv && this.framesObject) {
        const pointsToShow = Math.min(numPoints, this.framesObject.length) // Determines range to show first n points.
        const visibleMin = this.framesObject[0].getTimestamp()
        const visibleMax = this.framesObject[pointsToShow - 1].getTimestamp()
        const range = visibleMax - visibleMin
        const buffer = range * 0.05 // Adds a small gap to the range for a better visualization.
        this.visibleTimeRange = { min: visibleMin - buffer, max: visibleMax + buffer }
        this.initialTimeRange = { ...this.visibleTimeRange }

        window.addEventListener('resize', this.renderTimeline)
        this.timelineDiv.addEventListener('mousedown', this.onStartDrag)
        window.addEventListener('mousemove', this.onDrag)
        window.addEventListener('mouseup', this.onEndDrag)
        window.addEventListener('mouseleave', this.onEndDrag)
      }
    },
    postRenderTimeline() {
      if (this.timelineDiv && this.framesObject) {
        window.removeEventListener('resize', this.renderTimeline)
        this.timelineDiv.removeEventListener('mousedown', this.onStartDrag)
        window.removeEventListener('mousemove', this.onDrag)
        window.removeEventListener('mouseup', this.onEndDrag)
        window.removeEventListener('mouseleave', this.onEndDrag)
      }
    },
    renderTimeline() {
      if (this.timelineDiv && this.framesObject) {
        // Clean

        while (this.timelineDiv.firstChild) {
          this.timelineDiv.removeChild(this.timelineDiv.firstChild)
        }

        // Draw

        this.toSVGShape()
      }
    },
    /**
     * SVG.
     */
    toSVGShape() {
      this.timelineSVG = document.createElementNS(SVG_NS, 'svg')
      const width = '100%'
      const height = '100%'
      this.timelineSVG.setAttribute('xmlns', SVG_NS)
      this.timelineSVG.setAttribute('width', width)
      this.timelineSVG.setAttribute('height', height)
      this.timelineSVG.setAttribute('viewBox', `0 0 ${width} ${height}`)
      this.toSVGShapeTimeline()
      this.timelineDiv.appendChild(this.timelineSVG)
    },
    toSVGShapeTimeline() {
      const containerWidth = this.timelineDiv.clientWidth
      const arrowSize = 16
      const lineStartX = 10
      const endX = containerWidth - 10
      const lineEndX = endX - arrowSize
      const lineY = 100
      const pointStartX = lineStartX + 10
      const pointsEndX = endX - arrowSize - 10

      this.toSVGShapeTimelineTimeRange()
      this.toSVGShapeTimelineLine(lineStartX, lineY, lineEndX, lineY, 'black', 5)
      this.toSVGShapeTimelineArrow(endX, lineY, arrowSize, 'black')
      this.toSVGShapeTimelineTicks(pointStartX, pointsEndX, lineY, 5, 'dimgray')
      this.toSVGShapeTimelineTimelinePoints(pointStartX, pointsEndX, lineY, 8, 'white')
    },
    toSVGShapeTimelineTimeRange() {
      const startDate = new Date(this.visibleTimeRange.min)
      const endDate = new Date(this.visibleTimeRange.max)

      const formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }

      const startFormatted = startDate.toLocaleString([], formatOptions)
      const endFormatted = endDate.toLocaleString([], formatOptions)

      const labelText = `${startFormatted} - ${endFormatted}`

      const xPos = 10
      const yPos = 20

      const rangeLabelElement = document.createElementNS(SVG_NS, 'text')
      rangeLabelElement.setAttribute('x', xPos)
      rangeLabelElement.setAttribute('y', yPos)
      rangeLabelElement.setAttribute('text-anchor', 'start')
      rangeLabelElement.setAttribute('fill', 'black')
      rangeLabelElement.setAttribute('font-size', 14)
      rangeLabelElement.textContent = labelText

      this.timelineSVG.appendChild(rangeLabelElement)
    },
    toSVGShapeTimelineLine(x1, y1, x2, y2, color = 'black', strokeWidth = 2) {
      const line = document.createElementNS(SVG_NS, 'line')

      line.setAttribute('x1', x1)
      line.setAttribute('y1', y1)
      line.setAttribute('x2', x2)
      line.setAttribute('y2', y2)
      line.setAttribute('stroke', color)
      line.setAttribute('stroke-width', strokeWidth)

      this.timelineSVG.appendChild(line)

      return line
    },
    toSVGShapeTimelinePoint(x, y, radius = 5, color = 'white', toolTipHtml = '', frame) {
      const group = document.createElementNS(SVG_NS, 'g')
      const circle = document.createElementNS(SVG_NS, 'circle')

      const isSelected =
        this.selectedFrame && frame.getTimestamp() === this.selectedFrame.getTimestamp()

      group.setAttribute('transform', `translate(${x}, ${y})`)

      // Visual distinction for selected points.
      if (isSelected) {
        circle.setAttribute('r', radius * 1.5)
        circle.setAttribute('fill', 'white')
        circle.setAttribute('stroke', 'black')
        circle.setAttribute('stroke-width', '2')
      } else {
        circle.setAttribute('r', radius)
        circle.setAttribute('fill', color)
        circle.setAttribute('stroke', 'black')
      }

      group.appendChild(circle)

      const svgIcon = IMAGES[frame.getOperation().getName()]

      if (frame.getOperation() && svgIcon) {
        const image = document.createElementNS(SVG_NS, 'g')
        image.innerHTML = svgIcon

        const svgElement = image.firstChild
        const svgWidth = parseInt(svgElement.getAttribute('width') || 24)
        const svgHeight = parseInt(svgElement.getAttribute('height') || 24)
        const scale = (radius * 1.75) / Math.max(svgWidth, svgHeight)

        image.setAttribute(
          'transform',
          `scale(${scale}) translate(${-svgWidth / 2}, ${-svgHeight / 2})`
        )

        group.appendChild(image)
      }

      group.setAttribute('style', `cursor: pointer; transition: transform 0.15s ease`)

      if (toolTipHtml) {
        const hoverRadius = 1.5
        group.addEventListener('mouseenter', (e) => {
          this.onShowToolTip(e, toolTipHtml)
          group.setAttribute('transform', `translate(${x}, ${y}) scale(${hoverRadius})`)
        })

        group.addEventListener('mouseleave', () => {
          this.onHideToolTip()
          group.setAttribute('transform', `translate(${x}, ${y}) scale(1)`)
        })
      }

      group.addEventListener('click', () => {
        this.selectedFrame = frame
        this.onZoomToPoint(frame)
      })

      this.timelineSVG.appendChild(group)
      return group
    },
    toSVGShapeTimelineTimelinePoints(startX, endX, lineY, radius = 5, defaultColor = 'white') {
      if (!this.framesObject || !this.framesObject.length) return

      const timeRange = this.visibleTimeRange.max - this.visibleTimeRange.min
      const availableWidth = endX - startX

      /*
       * NOTE: Using binary search to find the index of the first and last visible point (call/frame) index on the timeline.
       * The goal is to only process the calls/frames in the visible range (between the index of the closest call/frame to the range min and the closest call/frame to the range max).
       * Since we could have a lot of calls/frames, binary search allows to find these indexes efficiently.
       * The framesPoints array is and should be sorted (by timestamp value, ascending order).
       * https://en.wikipedia.org/wiki/Binary_search
       */

      // Binary search to find first visible point index.
      let low = 0
      let high = this.framesObject.length - 1
      let startIdx = 0

      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2)
        if (this.framesObject[mid].getTimestamp() < this.visibleTimeRange.min) {
          low = mid + 1
        } else {
          high = mid - 1
          startIdx = mid
        }
      }

      // Binary search to find last visible point index.
      low = startIdx
      high = this.framesObject.length - 1
      let endIdx = this.framesObject.length - 1

      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2)
        if (this.framesObject[mid].getTimestamp() > this.visibleTimeRange.max) {
          high = mid - 1
          endIdx = mid - 1
        } else {
          low = mid + 1
        }
      }

      // Only processes and draws points in the visible range.
      for (let i = startIdx; i <= endIdx; i++) {
        const frame = this.framesObject[i]
        const timestamp = frame.getTimestamp()
        const x = startX + ((timestamp - this.visibleTimeRange.min) / timeRange) * availableWidth
        const color = frame.getColor() ? frame.getColor() : defaultColor
        const toolTipHtml = this.getToolTipHtml(frame, i)
        this.toSVGShapeTimelinePoint(x, lineY, radius, color, toolTipHtml, frame)
      }
    },
    toSVGShapeTimelineArrow(x, y, size = 10, color = 'black') {
      const arrow = document.createElementNS(SVG_NS, 'polygon')

      // Triangle arrow shape
      const points = [
        `${x},${y}`,
        `${x - size},${y - size / 2}`,
        `${x - size},${y + size / 2}`
      ].join(' ')

      arrow.setAttribute('points', points)
      arrow.setAttribute('fill', color)

      this.timelineSVG.appendChild(arrow)
      return arrow
    },
    toSVGShapeTimelineTicks(startX, endX, lineY, tickHeight = 5, color = 'black') {
      if (!this.framesObject || !this.framesObject.length) return

      const timeRange = this.visibleTimeRange.max - this.visibleTimeRange.min

      this.toSVGShapeTimelineTicksDay(startX, endX, lineY, tickHeight * 4, color, timeRange)
      this.toSVGShapeTimelineTicksHours(startX, endX, lineY, tickHeight * 3, color, timeRange)

      if (timeRange < 5 * HOUR_IN_MS) {
        // Shows minutes if less than 5 hours visible.
        this.toSVGShapeTimelineTicksMinutes(startX, endX, lineY, tickHeight * 2, color, timeRange)
      }

      if (timeRange < 5 * MINUTE_IN_MS) {
        // Shows seconds if less than 5 minutes visible.
        this.toSVGShapeTimelineTicksSeconds(startX, endX, lineY, tickHeight * 1.2, color, timeRange)
      }

      if (timeRange < 10 * SECOND_IN_MS) {
        // Shows milliseconds if less than 10 seconds visible.
        this.toSVGShapeTimelineTicksMilliseconds(startX, endX, lineY, tickHeight, color, timeRange)
      }
    },
    toSVGShapeTimelineTicksDay(startX, endX, lineY, tickHeight, color, timeRange) {
      const startDay = new Date(this.visibleTimeRange.min)
      const endDay = new Date(this.visibleTimeRange.max)

      startDay.setHours(0, 0, 0, 0)
      endDay.setHours(23, 59, 59, 999)

      const currentDay = new Date(startDay)

      while (currentDay <= endDay) {
        const timestamp = currentDay.getTime()
        const x = this.getTimeToPosition(timestamp, startX, endX, timeRange)

        if (this.isPositionVisible(x, startX, endX)) {
          this.toSVGShapeTimelineLine(x, lineY - tickHeight - 10, x, lineY - 10, color, 2)
          const day = currentDay.toLocaleString('default', { day: 'numeric', month: 'short' })
          // Displays the label above the tick line.
          this.toSVGShapeTimelineText(x, lineY - tickHeight - 15, day, color, 12)
        }

        // Moves to the next day.
        currentDay.setDate(currentDay.getDate() + 1)
      }
    },
    toSVGShapeTimelineTicksHours(startX, endX, lineY, tickHeight, color, timeRange) {
      const startHour = Math.floor(this.visibleTimeRange.min / HOUR_IN_MS) * HOUR_IN_MS
      const endHour = Math.ceil(this.visibleTimeRange.max / HOUR_IN_MS) * HOUR_IN_MS

      for (let timestamp = startHour; timestamp <= endHour; timestamp += HOUR_IN_MS) {
        const x = this.getTimeToPosition(timestamp, startX, endX, timeRange)

        if (this.isPositionVisible(x, startX, endX)) {
          this.toSVGShapeTimelineLine(x, lineY - tickHeight, x, lineY + tickHeight, color, 2)
          const date = new Date(timestamp)
          this.toSVGShapeTimelineText(x, lineY + tickHeight + 20, `${date.getHours()}h`, color, 12)
        }
      }
    },
    toSVGShapeTimelineTicksMinutes(startX, endX, lineY, tickHeight, color, timeRange) {
      // Calculates visible hour range.
      const startHour = Math.floor(this.visibleTimeRange.min / HOUR_IN_MS) * HOUR_IN_MS
      const endHour = Math.ceil(this.visibleTimeRange.max / HOUR_IN_MS) * HOUR_IN_MS

      for (let hourTs = startHour; hourTs <= endHour; hourTs += HOUR_IN_MS) {
        for (let minute = 1; minute < 60; minute++) {
          const timestamp = hourTs + minute * MINUTE_IN_MS

          if (timestamp < this.visibleTimeRange.min || timestamp > this.visibleTimeRange.max)
            continue

          const x = this.getTimeToPosition(timestamp, startX, endX, timeRange)

          if (this.isPositionVisible(x, startX, endX)) {
            this.toSVGShapeTimelineLine(x, lineY - tickHeight, x, lineY + tickHeight, color, 1.5)

            // Only shows labels for every 5 minutes if zoomed out.
            if (timeRange > 900000 ? minute % 5 === 0 : true) {
              this.toSVGShapeTimelineText(x, lineY + tickHeight + 15, `${minute}m`, color, 10)
            }
          }
        }
      }
    },
    toSVGShapeTimelineTicksSeconds(startX, endX, lineY, tickHeight, color, timeRange) {
      // Calculates visible minute range.
      const startMinute = Math.floor(this.visibleTimeRange.min / MINUTE_IN_MS) * MINUTE_IN_MS
      const endMinute = Math.ceil(this.visibleTimeRange.max / MINUTE_IN_MS) * MINUTE_IN_MS

      for (let minuteTs = startMinute; minuteTs <= endMinute; minuteTs += MINUTE_IN_MS) {
        for (let second = 1; second < 60; second++) {
          const timestamp = minuteTs + second * SECOND_IN_MS

          if (timestamp < this.visibleTimeRange.min || timestamp > this.visibleTimeRange.max)
            continue

          const x = this.getTimeToPosition(timestamp, startX, endX, timeRange)

          if (this.isPositionVisible(x, startX, endX)) {
            this.toSVGShapeTimelineLine(x, lineY - tickHeight, x, lineY + tickHeight, color, 1)

            // Only shows labels for every 5 seconds if zoomed out.
            if (timeRange > 60000 ? second % 5 === 0 : true) {
              this.toSVGShapeTimelineText(x, lineY + tickHeight + 10, `${second}s`, color, 8)
            }
          }
        }
      }
    },
    toSVGShapeTimelineTicksMilliseconds(startX, endX, lineY, tickHeight, color, timeRange) {
      let step = 100 // 100 ms ticks by default.

      // Visible ms steps based on zoom level / total ms range on the timeline.
      if (timeRange < 1000) step = 50
      if (timeRange < 500) step = 10
      if (timeRange < 100) step = 1

      const startMs = Math.floor(this.visibleTimeRange.min / step) * step
      const endMs = Math.ceil(this.visibleTimeRange.max / step) * step

      for (let timestamp = startMs; timestamp <= endMs; timestamp += step) {
        if (timestamp % 1000 !== 0) {
          // Skips if other tick already exists (seconds).
          const x = this.getTimeToPosition(timestamp, startX, endX, timeRange)

          if (this.isPositionVisible(x, startX, endX)) {
            this.toSVGShapeTimelineLine(x, lineY - tickHeight, x, lineY + tickHeight, color, 0.5)

            // Only shows labels for some ticks.
            if (
              (step === 100 && timestamp % 200 === 0) ||
              (step === 50 && timestamp % 100 === 0) ||
              (step < 50 && timestamp % (step * 5) === 0)
            ) {
              const ms = new Date(timestamp).getMilliseconds()
              this.toSVGShapeTimelineText(x, lineY + tickHeight + 8, `${ms}ms`, color, 7)
            }
          }
        }
      }
    },
    toSVGShapeTimelineText(x, y, text, color = 'black', fontSize = 10) {
      const textElement = document.createElementNS(SVG_NS, 'text')

      textElement.setAttribute('x', x)
      textElement.setAttribute('y', y)
      textElement.setAttribute('text-anchor', 'middle')
      textElement.setAttribute('fill', color)
      textElement.setAttribute('font-size', fontSize)
      textElement.textContent = text

      this.timelineSVG.appendChild(textElement)
      return textElement
    },
    /**
     * Events.
     */
    onWheel(event) {
      if (this.isDragging) return

      event.preventDefault()

      const rect = this.timelineDiv.getBoundingClientRect()
      this.zoomPoint = (event.clientX - rect.left) / rect.width

      this.onZoom(event)
    },
    onZoom(event) {
      const zoomFactor = event.deltaY ? (event.deltaY > 0 ? 0.8 : 1.2) : event < 0 ? 0.8 : 1.2
      const currentRange = this.visibleTimeRange.max - this.visibleTimeRange.min
      const initialRange = this.initialTimeRange.max - this.initialTimeRange.min

      const firstPointTime = this.framesObject[0].getTimestamp()
      const lastPointTime = this.framesObject[this.framesObject.length - 1].getTimestamp()

      // Calculates new range after zoom.
      let newRange = currentRange / zoomFactor
      const effectiveZoom = initialRange / newRange

      // Checks minimum zoom constraint, but only when zooming out.
      if (effectiveZoom < MIN_ZOOM && zoomFactor < 1) {
        newRange = initialRange / MIN_ZOOM
      }

      const zoomFocusTime = this.visibleTimeRange.min + currentRange * this.zoomPoint
      let newMin = zoomFocusTime - this.zoomPoint * newRange
      let newMax = zoomFocusTime + (1 - this.zoomPoint) * newRange

      // Prevents zooming out past first/last points.
      if (newMin < firstPointTime && zoomFactor < 1) {
        newMin = firstPointTime
      }

      if (newMax > lastPointTime && zoomFactor < 1) {
        newMax = lastPointTime
      }

      if (newMax - newMin < 10) {
        // Reduces from 1000ms to 10ms minimum.
        return
      }

      this.visibleTimeRange = { min: newMin, max: newMax }
      this.renderTimeline()
    },
    onZoomToPoint(frame) {
      if (!this.previousTimeRange) {
        this.previousTimeRange = { ...this.visibleTimeRange }
      }

      const timestamp = frame.timestamp
      let currentRange = this.visibleTimeRange.max - this.visibleTimeRange.min
      let newRange

      if (!this.alreadyZoomed) {
        newRange = currentRange / this.zoomToPointFactor
        this.alreadyZoomed = true
      } else {
        newRange = currentRange // Maintains zoom level if already zoomed in.
      }

      this.visibleTimeRange = {
        // Centers the timeline around the selected point.
        min: timestamp - newRange / 2,
        max: timestamp + newRange / 2
      }
      this.renderTimeline()
    },
    onResetZoom() {
      this.visibleTimeRange = { ...this.initialTimeRange }
      this.renderTimeline()
    },
    onStartDrag(event) {
      // Left mouse click (button 0).
      if (event.button !== 0) return

      this.isDragging = true
      this.dragStartX = event.clientX
      this.dragStartRange = { ...this.visibleTimeRange }

      this.timelineDiv.style.cursor = 'grabbing'
    },
    onDrag(event) {
      if (!this.isDragging) return

      const dx = event.clientX - this.dragStartX
      const containerWidth = this.timelineDiv.clientWidth
      const timeRange = this.dragStartRange.max - this.dragStartRange.min

      // Computes the time shift based on drag distance. NOTE: negative because dragging left should move timeline right.
      const timeShift = (dx / containerWidth) * timeRange * -1

      let newMin = this.dragStartRange.min + timeShift
      let newMax = this.dragStartRange.max + timeShift

      const firstPointTime = this.framesObject[0].getTimestamp()
      const lastPointTime = this.framesObject[this.framesObject.length - 1].getTimestamp()

      // Prevents dragging past boundaries.
      if (newMin < firstPointTime) {
        const adjustment = firstPointTime - newMin
        newMin = firstPointTime
        newMax += adjustment
      }

      if (newMax > lastPointTime) {
        const adjustment = newMax - lastPointTime
        newMax = lastPointTime
        newMin -= adjustment
      }

      this.visibleTimeRange = { min: newMin, max: newMax }
      this.renderTimeline()
    },
    onEndDrag() {
      this.isDragging = false

      if (this.timelineDiv) {
        this.timelineDiv.style.cursor = 'grab'
      }
    },
    onShowToolTip(event, html) {
      this.toolTipVisibility = true
      this.onToolTipHtmlChanged(html)
      this.onToolTipPositionChanged(event)
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
      if (!this.framesObject) return
      this.framesObject.forEach((frame) => {
        this.dataMapper.colorFrame(frame, (item) => {
          if (frame.getTechnology() && frame.getTechnology().getId() === technologyId) {
            frame.setColor(color)
          }
          return item
        })
      })
      this.renderTimeline()
    },
    onDateRange(range) {
      this.visibleTimeRange.min = range[0]
      this.visibleTimeRange.max = range[1]
      this.renderTimeline()
    },
    onCloseDetails() {
      if (this.previousTimeRange) {
        // Restores previous zoom state if available.
        this.visibleTimeRange = { ...this.previousTimeRange }
        this.previousTimeRange = null
        this.alreadyZoomed = false // Resets the zoom state.
      }
      this.selectedFrame = null
      this.renderTimeline()
    },
    toggleSettings() {
      this.settingsVisibility = !this.settingsVisibility
    },
    toggleBreakdown() {
      this.operationsTechnologiesBreakdownVisibility =
        !this.operationsTechnologiesBreakdownVisibility
    },
    /**
     * Utils.
     */
    isPositionVisible(x, startX, endX) {
      return x >= startX && x <= endX
    },
    getTimeToPosition(timestamp, startX, endX, timeRange) {
      const relativePosition = (timestamp - this.visibleTimeRange.min) / timeRange
      return startX + relativePosition * (endX - startX)
    },
    getToolTipHtml(frame, index) {
      const date = new Date(frame.getTimestamp())

      const formattedTime = date.toLocaleTimeString([], {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      })

      const { path, startLine, startColumn, endLine, endColumn } = this.dataMapper.extractLocation(
        frame.getLocation()
      )

      return `<span>${FRAME} ${index + 1}</span>
      <span>${formattedTime}</span>
      <span>${path}#L${startLine}C${startColumn}-L${endLine}C${endColumn}</span>
      <span>${frame.getTechnology().getId()}</span>
      <span>${frame.getOperation().getName()}</span>`
    }
  }
}
</script>

<template>
  <div class="container">
    <!-- Settings -->
    <button class="btn btn-light settings-button" type="button" @click="toggleSettings">
      <i class="bi" :class="settingsVisibility ? 'bi-gear-fill' : 'bi-gear'"></i>
    </button>
    <button class="btn btn-light settings-button top" type="button" @click="toggleBreakdown">
      <i
        class="bi"
        :class="operationsTechnologiesBreakdownVisibility ? 'bi-bar-chart-fill' : 'bi-bar-chart'"
      ></i>
    </button>
    <div :class="['settings', { 'd-none': !settingsVisibility }]">
      <div class="sub-settings date-picker">
        <VueDatePicker
          v-if="framesObject"
          v-model="datePickerRange"
          placeholder="Date range"
          model-type="timestamp"
          :min-date="new Date(framesObject[0].getTimestamp())"
          :max-date="new Date(framesObject[framesObject.length - 1].getTimestamp())"
          :range="{ partialRange: false }"
          @update:model-value="onDateRange"
          prevent-min-max-navigation
          enable-seconds
        ></VueDatePicker>
      </div>
      <hr class="line" />
      <div class="sub-settings">
        <div v-for="technology in technologies" :key="technology">
          <ColorSlider
            :label="technology"
            @onColor="onTechnologyColorSelected(technology, $event)"
          />
        </div>
      </div>
    </div>
    <!-- Details -->
    <div v-if="selectedFrame" class="frame-details top">
      <!-- Frame details -->
      <FrameDetails :selected-frame="selectedFrame" @close="onCloseDetails" />
    </div>
    <!-- Metrics -->
    <div
      v-show="operationsTechnologiesBreakdownVisibility"
      class="operations-technologies-breakdown top"
    >
      <!-- Operations technologies breakdown static -->
      <TwoDimensionsBreakdownComponent
        v-if="operationsTechnologiesBreakdown"
        :title="STATIC"
        :data="operationsTechnologiesBreakdown.static"
      /><br />
      <!-- Operations technologies breakdown dynamic -->
      <TwoDimensionsBreakdownComponent
        v-if="operationsTechnologiesBreakdown"
        v-show="operationsTechnologiesBreakdownVisibility"
        :title="DYNAMIC"
        :data="operationsTechnologiesBreakdown.dynamic"
      />
    </div>
    <!-- Zoom controls -->
    <ZoomControls @onZoom="onZoom" @onResetZoom="onResetZoom" class="top" />
    <!-- Timeline -->
    <div @wheel="onWheel" ref="timeline" class="timeline top"></div>
    <!-- Tool tip -->
    <div v-if="toolTipVisibility">
      <ToolTip :html="toolTipHtml" :style="{ left: toolTipX + 'px', top: toolTipY + 'px' }" />
    </div>
  </div>
</template>

<style scoped>
/* Timeline */

:deep(.timeline) {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  cursor: grab;
  border: 1px solid #d3d4d5;
  border-radius: 0.375rem;
}

:deep(.timeline):active {
  cursor: grabbing;
}

/* Frame details */

.frame-details {
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
