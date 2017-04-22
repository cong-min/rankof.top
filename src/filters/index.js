import Vue from 'vue';

// 格式化数字
function formatNumber(num) {
  const n = num.toString();
  return n[1] ? n : `0${n}`;
}
// 格式化时间
function formatTimer(type) {
  return (timestamp, prefix = '', suffix = '') => {
    if (!timestamp) return null;
    const date = new Date();
    date.setTime(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = [year, month, day].map(formatNumber).join('-');
    if (type === 'date') { return `${prefix}${formattedDate}${suffix}`; }
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const formattedTime = [hour, minute, second].map(formatNumber).join(':');
    if (type === 'time') { return `${prefix}${formattedDate} ${formattedTime}${suffix}`; }
    return null;
  };
}

// yyyy-mm-dd
Vue.filter('formatDate', formatTimer('date'));
// yyyy-mm-dd hh:mm:ss
Vue.filter('formatTime', formatTimer('time'));
