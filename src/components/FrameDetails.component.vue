<script>
// Model
import { Frame } from '@/models/Frame.model.js'

// Helpers
import { ARGUMENT, OPERATION_TYPE, TECHNOLOGY, THE_DATE } from '@/helpers/Text.helper.js'

export default {
  props: {
    selectedFrame: {
      type: Frame,
      required: true
    }
  },
  data() {
    return {
      // Texts.
      THE_DATE,
      TECHNOLOGY,
      OPERATION_TYPE,
      ARGUMENT
    }
  },
  methods: {
    formatJSON(value) {
      try {
        const obj = typeof value === 'string' ? JSON.parse(value) : value
        return JSON.stringify(obj, null, 2)
      } catch (e) {
        return value
      }
    },
    isJSONObject(value) {
      return (
        value &&
        (typeof value === 'object' || (typeof value === 'string' && value.trim().startsWith('{')))
      )
    }
  }
}
</script>

<template>
  <div class="details-header">
    <a :href="selectedFrame.location" target="_blank" class="btn btn-light">
      <i class="bi bi bi-code-slash me-1"></i>
    </a>
    <button class="btn btn-sm btn-light" @click="$emit('close')">
      <i class="bi bi-x-lg"></i>
    </button>
  </div>
  <div class="details-content">
    <div class="detail-section">
      <div class="detail-item">
        <span class="detail-label">{{ THE_DATE }}:</span>
        {{ new Date(selectedFrame.getTimestamp()).toLocaleString() }}
      </div>
      <div class="detail-item">
        <span class="detail-label">{{ TECHNOLOGY }}:</span>
        {{ selectedFrame.getTechnology().getId() }}
      </div>
      <div class="detail-item">
        <span class="detail-label">{{ OPERATION_TYPE }}:</span>
        {{ selectedFrame.getOperation().getName() }}
      </div>
    </div>
    <div class="detail-section arguments-section" v-if="selectedFrame.argumentValues">
      <span class="title-text">{{ ARGUMENT }}</span>
      <div class="code">
        <pre v-if="isJSONObject(selectedFrame.argumentValues)">{{
          formatJSON(selectedFrame.argumentValues)
        }}</pre>
        <pre v-else>{{ selectedFrame.argumentValues }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.details-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.detail-section {
  flex: 1 0 300px;
}

.detail-item {
  margin-bottom: 8px;
}

.detail-label {
  margin-right: 5px;
  font-weight: 500;
}

.title-text {
  font-size: 1.5rem;
}

.arguments-section {
  flex: 1 0 100%;
}

.code {
  overflow: auto;
  background-color: #f1f3f5;
  border-radius: 6px;
  border-left: 3px solid #0d6efd;
}

.code pre {
  margin: 0;
  padding: 15px;
  max-height: 250px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  background-color: transparent;
}
</style>
