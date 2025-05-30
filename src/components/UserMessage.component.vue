<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: (value) => {
        const validTypes = ['success', 'danger', 'warning', 'info']
        return validTypes.includes(value)
      }
    }
  }
}
</script>

<template>
  <div v-if="message" :class="`alert alert-${type}`" role="alert">
    {{ message }}
  </div>
</template>

<style scoped></style>
