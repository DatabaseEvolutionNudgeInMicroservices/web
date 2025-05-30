<script>
// Components

import TextHeader from '@/components/TextHeader.component.vue'

// Helpers

import { RouterLink } from 'vue-router'
import { ERROR_404, BACK } from '@/helpers/Text.helper'

export default {
  components: {
    RouterLink,
    TextHeader
  },
  data() {
    return {
      ERROR_404,
      BACK
    }
  }
}
</script>

<template>
  <div class="container top text-center">
    <TextHeader :message="ERROR_404" />
    <RouterLink class="btn btn-dark" to="/">{{ BACK }}</RouterLink>
  </div>
</template>

<style scoped></style>
