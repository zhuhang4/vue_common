
import Vue from "vue";
import App from "./App.vue";
import VueRouter from 'vue-router';
import routes from './router/router';
// import { routerMode } from './config/env'
// import axios from "axios";
import '@babel/polyfill';
import MyData from './MyData.js';
import VueLazyload from 'vue-lazyload'
new MyData();
// Vue.config.productionTip = false;
// Vue.prototype.$axios = axios;//挂载到Vue原型上
// Vue.prototype.MyData = MyData;//挂载到Vue原型上
// Vue.prototype.YR = YR;//挂载到Vue原型上
// import Video from 'video.js'
// import 'video.js/dist/video-js.css'

// Vue.prototype.$video = Video;
Vue.use(VueRouter);
Vue.use(VueLazyload, {
	lazyComponent: true
});
// Vue.use(Element, { size: 'small', zIndex: 3000 });
// Vue.use(vuescroll);
const router = new VueRouter({
	routes,
	mode: 'hash',
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
			return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
});

new Vue({
	router,
	// store,
	render: h => h(App),
	// mounted() {
	// document.dispatchEvent(new Event("render-event"));
	// },
}).$mount("#app");