<template>
  <div class="cvs">
    <canvas ref="cvs_2d" style="backgound-color:grey"></canvas>
    <canvas ref="cvs_3d"></canvas>
    <router-link :to="{path:'/home'}" replace>
      
    </router-link>
  </div>
</template>

<script>
import Main from "./src/Main.js";
import MyData from "@/MyData.js";
import * as YR from "./src/YR.js";

export default {
  name: "MyCanvas",
  data() {
    return {
      bool_arrow: false,
      pixi_renderer: null,
      pixiStage: null,
      ratio: 1,
    };
  },
  methods: {
    init() {},
  },

  mounted() {
    new Main(this.$refs["cvs_2d"], this.$refs["cvs_3d"]);
  }
};
</script>

<style lang="scss" scoped>
.cvs {
  position: relative;
  margin: 0;
  padding: 0;
}

.control {
  position: relative;
  bottom: 0px;
  height: 50px;
  z-index: 99995;
}

.left {
  position: absolute;
  bottom: 115px;
  right: 35px;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  display: block;
  /* float: right; */
  z-index: 99995;
}

.right {
  position: absolute;
  bottom: 115px;
  right: 5px;
  width: 30px;
  height: 30px;
  display: block;
  /* float: right; */
  z-index: 99995;
}
.back {
  position: absolute;
  bottom: 115px;
  left: 5px;
  width: 30px;
  height: 30px;
  display: block;
  /* float: right; */
  z-index: 99995;
}
.logo {
  position: absolute;
  right: 5px;
  top: 10px;
  width: 210px;
  z-index: 99995;
}



.logo img {
  height: auto;
  width: 100%;
}
.left img {
  width: 100%;
}

.right img {
  width: 100%;
}
.back img {
  width: 100%;
}
</style>