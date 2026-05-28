<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    concepts() {
      return this.data?.concepts || []
    },
    matrix() {
      return this.data?.matrix || null
    }
  }
}
</script>

<template>
  <div class="matrix">
    <div class="matrix-header" v-if="title">{{ title }}</div>

    <div class="matrix-content">
      <!-- Header row -->
      <div class="matrix-row header">
        <span class="matrix-cell empty"></span>
        <span
          v-for="(concept, conceptIndex) in concepts"
          :key="'col-' + conceptIndex"
          :title="concept"
          class="matrix-cell concept-name"
        >
          {{ concept }}
        </span>
      </div>
      <!-- Data rows -->
      <div v-for="(row, rowIndex) in matrix" :key="'row-' + rowIndex" class="matrix-row">
        <!-- Row label -->
        <span class="matrix-cell concept-name" :title="concepts[rowIndex]">
          {{ concepts[rowIndex] }}
        </span>

        <!-- Cells -->
        <div
          v-for="(value, colIndex) in row"
          :key="'cell-' + rowIndex + '-' + colIndex"
          class="matrix-cell"
        >
          <span v-if="value !== null" :title="value">{{ value }}</span>
          <span v-else>–</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.matrix {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.matrix-header {
  font-weight: bold;
  font-size: 1.1em;
}

.matrix-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.matrix-row {
  display: flex;
  width: 100%;
  gap: 0.25rem;
}

.matrix-cell {
  width: 10%;
  padding: 0.4rem 0.6rem;
  gap: 0.4rem;
  text-align: center;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 0.55rem;
  background-color: rgb(247, 248, 249);
}

.matrix-cell.empty {
  background: transparent;
}

.concept-name {
  text-align: left;
  font-weight: bold;
}
</style>
