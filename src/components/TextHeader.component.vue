<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <div>
    <h1 class="message">{{ message }}</h1>
  </div>
</template>

<style scoped></style>
