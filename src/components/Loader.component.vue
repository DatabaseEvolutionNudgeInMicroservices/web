<script>
// Helpers

import { LOADING } from '@/helpers/Text.helper'

export default {
  props: {
    visibility: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      LOADING
    }
  }
}
</script>

<template>
  <div v-if="visibility" class="spinner-border" role="status">
    <span class="visually-hidden">{{ LOADING }}</span>
  </div>
</template>

<style scoped></style>
