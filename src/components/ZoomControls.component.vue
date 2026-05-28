<script>
export default {
  emits: ['onZoom', 'onResetZoom'],
  methods: {
    onZoomIn() {
      this.$emit('onZoom', 1)
    },
    onZoomOut() {
      this.$emit('onZoom', -1)
    },
    onResetZoom() {
      this.$emit('onResetZoom')
    }
  }
}
</script>

<template>
  <div class="zoom-controls">
    <button type="button" class="btn btn-light" @click="onZoomIn">
      <i class="bi bi-plus"></i>
    </button>
    <button type="button" class="btn btn-light" @click="onZoomOut">
      <i class="bi bi-dash"></i>
    </button>
    <button type="button" class="btn btn-light" @click="onResetZoom">
      <i class="bi bi-arrow-clockwise"></i>
    </button>
  </div>
</template>

<style>
.zoom-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
</style>
