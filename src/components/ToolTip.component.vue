<script>
export default {
  props: {
    html: {
      type: String,
      default: ''
    },
    style: {
      type: Object,
      default: () => ({
        opacity: 0,
        left: '0px',
        top: '0px'
      })
    }
  }
}
</script>

<template>
  <div class="toolTip" :style="style" v-html="html"></div>
</template>

<style>
.toolTip {
  position: fixed;
  z-index: 100;
  border-radius: 5px;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 14px;
  transition: opacity 0.2s;
}

.toolTip span {
  display: block;
  width: 100%;
  padding: 5px;
}
</style>
