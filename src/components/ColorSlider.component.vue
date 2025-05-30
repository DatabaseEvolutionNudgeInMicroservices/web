<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hue: -1, // Default position for the default white color.
      color: undefined
    }
  },
  methods: {
    /**
     * Updates the color depending on the slider cursor representing the Hue of the HSL color encoding.
     * If the hue is negative, it resets the color to the default white.
     */
    updateColor() {
      if (this.hue < 0) {
        this.color = 'hsl(0, 0%, 100%)' // Default white color.
      } else {
        this.color = `hsl(${this.hue}, 100%, 75%)`
      }
      this.$emit('updateColor', this.color)
    }
  },
  mounted() {
    this.updateColor()
  }
}
</script>

<template>
  <div class="color">
    <div class="label">{{ label }}</div>
    <div class="color-slider-display">
      <input
        type="range"
        class="color-slider"
        min="-1"
        max="360"
        step="1"
        v-model="hue"
        @input="updateColor"
      />
      <div class="color-display" :style="{ backgroundColor: color }"></div>
    </div>
  </div>
</template>

<style scoped>
.color {
  display: flex;
  flex-direction: column;
}

.label {
  width: 180px;
  text-align: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.color-slider-display {
  display: flex;
  align-items: center;
}

.color-slider {
  width: 180px;
  height: 20px;
  border-radius: 10px;
  background: linear-gradient(
    to right,
    hsl(0, 100%, 75%),
    hsl(60, 100%, 75%),
    hsl(120, 100%, 75%),
    hsl(180, 100%, 75%),
    hsl(240, 100%, 75%),
    hsl(300, 100%, 75%),
    hsl(360, 100%, 75%)
  );
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
}

.color-slider::-webkit-slider-thumb {
  width: 1px;
  height: 20px;
  border-radius: 0%;
  background-color: #fff;
  border: 2px solid #000;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.color-display {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  border-radius: 5px;
}
</style>
