import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import List from '@/components/List';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/:site',
      name: 'site',
      component: List,
    },
    {
      path: '/:site/:list',
      name: 'list',
      component: List,
    },
  ],
});
