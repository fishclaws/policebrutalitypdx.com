import Vue from 'vue'
import App from './components/app.vue';
import Router from './router';

const v = new Vue({
  el: "#app",
  template: '<App/>',
  components: {
    App,
  },
  router: Router,
});


