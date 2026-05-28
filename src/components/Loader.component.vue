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
      // Texts.
      LOADING
    }
  }
}
</script>

<template>
  <div v-if="visibility" class="spinner-border top" role="status">
    <span class="visually-hidden">{{ LOADING }}</span>
  </div>
</template>
