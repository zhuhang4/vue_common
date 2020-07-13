<template>
  <div class="home">
    <div>Home</div>
    <my-canvas></my-canvas>
  </div>
</template>
<script>
import MyCanvas from "../cvs/MyCanvas.vue";

export default {
  data() {
    return {};
  },
  mounted() {},
  components: {
      MyCanvas
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
@import "../style/mixin";
</style>