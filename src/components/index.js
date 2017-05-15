import Vue from 'vue';
// 数值变化渐变组件
import TWEEN from 'tween.js';

Vue.component('animated-integer', {
  template: '<span>{{ tweeningValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tweeningValue: 0,
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.tween(oldValue, newValue);
    },
  },
  mounted() {
    this.tween(0, this.value);
  },
  methods: {
    tween(startValue, endValue) {
      const vm = this;
      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }
      new TWEEN.Tween({ tweeningValue: startValue })
        .to({ tweeningValue: endValue }, 1000)
        .onUpdate(function () {
          vm.tweeningValue = this.tweeningValue.toFixed(0);
        })
        .start();
      animate();
    },
  },
});
