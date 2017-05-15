import Vue from 'vue';

import formatTimer from './formatTimer';

// yyyy-mm-dd
Vue.filter('formatDate', formatTimer('date'));
// yyyy-mm-dd hh:mm:ss
Vue.filter('formatTime', formatTimer('time'));
