<script>
// Helpers
import { PREVIOUS_NEXT_CALLS_COUNT } from '@/helpers/Constants.helper.js'
import {
  CURRENT_POSITION,
  NO_CURRENT_FRAME,
  NO_PREVIOUS_FRAME,
  NO_UPCOMING_FRAME,
  PREVIOUS_FRAME,
  UPCOMING_FRAMES
} from '@/helpers/Text.helper.js'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    frames: {
      type: Array,
      required: true
    },
    currentPosition: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      PREVIOUS_FRAME,
      NO_PREVIOUS_FRAME,
      NO_CURRENT_FRAME,
      NO_UPCOMING_FRAME,
      UPCOMING_FRAMES,
      CURRENT_POSITION
    }
  },
  computed: {
    getPreviousFrames() {
      const startIndex = Math.max(0, this.currentPosition - PREVIOUS_NEXT_CALLS_COUNT)
      const endIndex = Math.max(0, this.currentPosition)
      return this.frames.slice(startIndex, endIndex)
    },
    getCurrentFrame() {
      return this.frames[this.currentPosition]
    },
    getUpcomingFrames() {
      return this.frames.slice(
        this.currentPosition + 1,
        this.currentPosition + PREVIOUS_NEXT_CALLS_COUNT + 1
      )
    }
  },
  methods: {
    getFrameLocation(frame) {
      if (!frame || !frame.location) return { path: '', startLine: 0, endLine: 0 }
      const location = frame.location

      const pathRegex = /\/tree\/[^\/]+\/(.+)/
      const pathMatch = location.match(pathRegex)

      let path = location
      if (pathMatch) {
        path = pathMatch[1].split('#')[0]
      }

      const linesRegex = /#L(\d+)C\d+-L(\d+)C\d+/
      const linesMatch = location.match(linesRegex)

      let startLine = 0
      let endLine = 0
      if (linesMatch) {
        startLine = parseInt(linesMatch[1], 10)
        endLine = parseInt(linesMatch[2], 10)
      }

      return { path, startLine, endLine }
    },
    getFrameTime(frame) {
      if (!frame || !frame.timestamp) return ''
      const date = new Date(frame.timestamp)
      const formatOptions = {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3
      }
      return date.toLocaleTimeString([], formatOptions)
    }
  }
}
</script>

<template>
  <div class="frames">
    <div class="previous-frames">
      <span>{{ PREVIOUS_FRAME }}</span>
      <div v-if="getPreviousFrames.length === 0" class="text-muted">{{ NO_PREVIOUS_FRAME }}</div>
      <div v-for="(frame, index) in getPreviousFrames" :key="'prev-' + index" class="frame-item">
        <span class="frame-index">{{ currentPosition - getPreviousFrames.length + index }}</span>
        <div class="frame-location" v-if="frameLocationObject = getFrameLocation(frame)">
          <span class="location-path">
            {{ frameLocationObject.path }}
          </span>
          <span class="location-lines">
            <i class="bi bi-braces"></i>
            Lines
            {{ frameLocationObject.startLine }}
            <i class="bi bi-arrow-right"></i>
            {{ frameLocationObject.endLine }}
          </span>
        </div>
        <span class="frame-time">{{ getFrameTime(frame) }}</span>
      </div>
    </div>

    <div class="current-frame">
      <span>{{ CURRENT_POSITION }}</span>
      <div v-if="getCurrentFrame" class="frame-item current">
        <span class="frame-index">{{ currentPosition }}</span>
        <div class="frame-location" v-if="frameLocationObject = getFrameLocation(getCurrentFrame)">
          <span class="location-path">
            {{ frameLocationObject.path }}
          </span>
          <span class="location-lines">
            <i class="bi bi-braces"></i>
            Lines
            {{ frameLocationObject.startLine }}
            <i class="bi bi-arrow-right"></i>
            {{ frameLocationObject.endLine }}
          </span>
        </div>
        <span class="frame-time">{{ getFrameTime(getCurrentFrame) }}</span>
      </div>
      <div v-else class="text-muted">{{ NO_CURRENT_FRAME }}</div>
    </div>

    <div class="upcoming-frames">
      <span>{{ UPCOMING_FRAMES }}</span>
      <div v-if="getUpcomingFrames.length === 0" class="text-muted">{{ NO_UPCOMING_FRAME }}</div>
      <div v-for="(frame, index) in getUpcomingFrames" :key="'next-' + index" class="frame-item">
        <span class="frame-index">{{ currentPosition + index + 1 }}</span>
        <div class="frame-location" v-if="frameLocationObject = getFrameLocation(frame)">
          <span class="location-path">
            {{ frameLocationObject.path }}
          </span>
          <span class="location-lines">
            <i class="bi bi-braces"></i>
            Lines
            {{ frameLocationObject.startLine }}
            <i class="bi bi-arrow-right"></i>
            {{ frameLocationObject.endLine }}
          </span>
        </div>
        <span class="frame-time">{{ getFrameTime(frame) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.frames {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.frame-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.frame-item.current {
  background-color: #f8f9fa;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
  border-left: 4px solid #000000;
  border-right: 1px solid #000000;
}

.frame-index {
  min-width: 40px;
}

.frame-location {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: small;
  margin: 0 7.5px;
  word-break: break-word;
}

.frame-time {
  text-align: center;
  color: #6c757d;
  font-size: 0.9em;
}

.location-path,
.location-lines {
  display: block;
  width: 100%;
  text-align: center;
}
</style>
