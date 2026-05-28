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
  },
  emits: ['close'],
  methods: {
    onClose() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div v-if="message" :class="`alert alert-${type} position-relative`" role="alert">
    {{ message }}

    <button
      type="button"
      class="btn-close position-absolute top-0 end-0 m-2"
      aria-label="Close"
      @click="onClose"
    ></button>
  </div>
</template>
