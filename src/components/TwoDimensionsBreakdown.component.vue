<script>
// Helpers
import { getImage } from '@/helpers/Constants.helper'
import { TOTAL } from '@/helpers/Text.helper.js'

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    showPercentages: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // Texts.
      TOTAL
    }
  },
  methods: {
    getImage,
    getPercentage(count, dimension1) {
      const total = this.data[dimension1][TOTAL] || 0
      return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
    },
    getPercentageTotal(count) {
      const allTotals = Object.values(this.data).reduce(
        (sum, dimension1) => sum + (dimension1[TOTAL] || 0),
        0
      )
      return allTotals > 0 ? ((count / allTotals) * 100).toFixed(1) : '0.0'
    }
  }
}
</script>

<template>
  <div class="breakdown">
    <div class="breakdown-header" v-if="title">{{ title }}</div>
    <div class="breakdown-content">
      <div
        v-for="(dimension2, dimension1) in data"
        :key="`dimension1-${dimension1}`"
        class="dimension1-dimension2-section"
      >
        <div class="dimension1-name">{{ dimension1 }}:</div>
        <div class="dimension2-grid">
          <div
            v-for="(count, dimension2) in dimension2"
            :key="`${dimension1}-${dimension2}`"
            class="dimension2-item"
            :class="{ 'total-dimension2-item': dimension2 === TOTAL }"
          >
            <span class="dimension2-icon" v-html="getImage(dimension2, 18)"></span>
            <span class="dimension2-name">{{ dimension2 }}</span>
            <span class="dimension2-count">{{ count }}</span>
            <span class="dimension2-percentage" v-if="dimension2 !== TOTAL && showPercentages">
              ({{ getPercentage(count, dimension1) }}%)
            </span>
            <span class="dimension2-percentage" v-if="dimension2 === TOTAL && showPercentages">
              ({{ getPercentageTotal(count) }}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-header {
  font-weight: bold;
  font-size: 1.1em;
}

.breakdown-content {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.dimension1-dimension2-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dimension1-name {
  margin-bottom: 5px;
  font-weight: bold;
}

.dimension2-grid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.dimension2-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 0.55rem;
  padding: 0.4rem 0.6rem;
  background-color: rgb(247, 248, 249);
}

.dimension2-icon {
  display: flex;
  flex-direction: column;
}

.dimension2-name {
  font-weight: bold;
}

.dimension2-count {
  color: #666;
}

.dimension2-percentage {
  color: #666;
}

.total-dimension2-item {
  outline: thin solid black;
}
</style>
