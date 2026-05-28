<script>
// Helpers
import { RouterLink } from 'vue-router'
import { APP_NAME, BACK, ERROR_404 } from '@/helpers/Text.helper'

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      // Texts.
      ERROR_404,
      APP_NAME,
      BACK
    }
  }
}
</script>

<template>
  <div>
    <!-- ERROR -->
    <section class="error">
      <div class="error-content">
        <div class="container">
          <h1 class="display-4 fw-bold">{{ ERROR_404 }}</h1>
          <p>
            <RouterLink class="large-button top" to="/">{{ BACK }}</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Error */

.error {
  position: relative;
  height: 50vh;
  width: 100%;
  overflow: hidden;
}

.error-content {
  display: flex;
  position: absolute;
  align-items: center;
  inset: 0;
}
</style>
