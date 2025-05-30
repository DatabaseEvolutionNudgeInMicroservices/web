<script>
// Components

import TextHeader from '@/components/TextHeader.component.vue'

// Helpers

import { RouterLink } from 'vue-router'
import { GET_STARTED, WELCOME } from '@/helpers/Text.helper'

export default {
  components: {
    RouterLink,
    TextHeader
  },
  data() {
    return {
      GET_STARTED,
      WELCOME
    }
  }
}
</script>

<template>
  <div class="container top text-center">
    <TextHeader :message="WELCOME" />
    <RouterLink class="btn btn-dark" to="/Treemap">{{ GET_STARTED }}</RouterLink>
  </div>
</template>

<style scoped></style>
