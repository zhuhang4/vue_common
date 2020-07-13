<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MyData from "@/MyData.js";
export default {
  name: "app",
  data() {
    return {
      // loading: true,
      // arr_img: [
      //   { src: require("./assets/images/long_01.jpg") },
      // ],
      // myVideo: null,
      // bt:null,
    };
  },
  components: {
    // LoadPage,
  },
  methods: {
    init() {
      console.log("appMounted");
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
html,
body {
  background: white;
  padding: 0;
  border: 0;
  margin: 0;
  height: 100%;
}
#app {
  height: 100%;
  background-size:100% 100%;
  /* overflow-y: scroll; */
}
</style>
