<script>
// Helpers
import { NO_DATA, TOTAL } from '@/helpers/Text.helper.js'

export default {
  props: {
    data: {
      type: Object,
      required: true
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
      NO_DATA,
      TOTAL
    }
  },
  computed: {
    items() {
      return Object.keys(this.data || {})
    },
    total() {
      return this.data['TOTAL'] || 0
    }
  },
  methods: {
    getPercentageConcept(item) {
      return this.total > 0 ? ((this.data[item] / this.total) * 100).toFixed(1) : '0.0'
    }
  }
}
</script>

<template>
  <div class="breakdown">
    <div class="breakdown-header" v-if="title">{{ title }}</div>
    <div class="breakdown-content">
      <div v-for="item in items" :key="item">
        <div class="item" v-if="item !== TOTAL">
          <span class="item-name" :title="item">{{ item }}</span>
          <span class="item-count">{{ data[item] }}</span>
          <span class="item-percentage" v-if="showPercentages === true">
            ({{ getPercentageConcept(item) }}%)
          </span>
        </div>
        <div class="item item-percentage-total" v-if="item === TOTAL">
          <span class="item-name" :title="item">{{ item }}</span>
          <span class="item-count">{{ data[item] }}</span>
          <span class="item-percentage" v-if="showPercentages === true">
            ({{ getPercentageConcept(item) }}%)
          </span>
        </div>
      </div>
      <div v-if="!data">
        <span>{{ NO_DATA }}</span>
      </div>
    </div>
  </div>
</template>

<style>
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 0.55rem;
  padding: 0.4rem 0.6rem;
  background-color: rgb(247, 248, 249);
}

.item-name {
  font-weight: bold;
}

.item-count {
  color: #666;
}

.item-percentage {
  color: #666;
}

.item-percentage-total {
  outline: thin solid black;
}
</style>
