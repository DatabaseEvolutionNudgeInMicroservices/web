<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    defaultHue: {
      type: Number,
      default: -1
    }
  },
  mounted() {
    this.onColor()
  },
  data() {
    return {
      hue: this.defaultHue, // Default position for the default color.
      color: undefined
    }
  },
  methods: {
    /**
     * Updates the color depending on the slider cursor representing the Hue of the HSL color encoding.
     * If the hue is negative, it resets the color to the default white.
     */
    onColor() {
      if (this.hue < 0) {
        this.color = 'hsl(0, 0%, 100%)' // Default white color.
      } else {
        this.color = `hsl(${this.hue}, 100%, 75%)`
      }
      this.$emit('onColor', this.color)
    }
  }
}
</script>

<template>
  <div class="color-slider">
    <div class="color-slider-label">{{ label }}</div>
    <div class="color-slider-input-display">
      <input
        type="range"
        class="color-slider-input"
        min="-1"
        max="360"
        step="1"
        v-model="hue"
        @input="onColor"
      />
      <div class="color-slider-display" :style="{ backgroundColor: color }"></div>
    </div>
  </div>
</template>

<style>
.color-slider {
  display: flex;
  flex-direction: column;
  margin: 0 10px 0 10px;
}

.color-slider-label {
  text-align: center;
  margin: 0 0 5px 0;
  font-size: 14px;
}

.color-slider-input-display {
  display: flex;
  align-items: center;
}

.color-slider-input {
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

.color-slider-input::-webkit-slider-thumb {
  width: 1px;
  height: 20px;
  border-radius: 0;
  background-color: #fff;
  border: 2px solid #000;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.color-slider-display {
  width: 20px;
  height: 20px;
  margin-left: 5px;
  border-radius: 5px;
}
</style>
