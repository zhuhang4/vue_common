<template>
  <transition name="fade">
    <div v-if="bool_show" class="LoadPage">
      <div class="loading">{{loadText}}</div>
    </div>
  </transition>
</template>

<script>
import * as YR from "./src/YR";
export default {
  name: "LoadPage",
  data() {
    return {
      bool_show: true,
      loadText: "",
      loadingProgress: 0
    };
  },
  methods: {},
  mounted() {
    // this.init();
    YR.Mediator.getInstance().add("3DProgressUpdate", e => {
      this.loadingProgress = Math.floor(e.data).toString();
      if (this.loadingProgress > 99) {
        this.loadText = "即将进入线上展台...";
      } else {
        this.loadText = "加载中:" + this.loadingProgress;
      }
    });
    YR.Mediator.getInstance().add("LoadPage_Start", () => {
      console.log('start');
      this.bool_show = true;
    });
    YR.Mediator.getInstance().add("LoadPage_Complete", () => {
      this.bool_show = false;
    });
  },
  activated() {},
  deactivated() {
    // this.bool_show = true;
  },
  components: {
    // ProgressBar,
  }
};
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  margin: auto;
  color: white;
  font-size: 18;
  left: 50%;
  top: 300px;
  transform: translate(-50%, -50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>