import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import About from '@/components/About';
import Site from '@/components/Site';
import RankList from '@/components/RankList';
import Visual from '@/components/Visual';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/home',
      redirect: () => '/',
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/:site',
      component: Site,
      children: [
        // 匹配/:site
        {
          path: '',
          name: 'site',
          components: {
            rankList: RankList,
            visual: Visual,
          },
        },
        // 匹配/:site/:page
        {
          path: ':page',
          name: 'page',
          components: {
            rankList: RankList,
            visual: Visual,
          },
        },
      ],
    },

  ],
});
