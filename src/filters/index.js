import Vue from 'vue';

Vue.filter('formatTime', (timestamp, prefix = '', suffix = '') => {
  if (!timestamp) return null;
  const date = new Date();
  date.setTime(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  function formatNumber(num) {  // 格式化数字
    const n = num.toString();
    return n[1] ? n : `0${n}`;
  }
  const formattedDate = [year, month, day].map(formatNumber).join('-');
  const formattedTime = [hour, minute, second].map(formatNumber).join(':');
  return `${prefix}${formattedDate} ${formattedTime}${suffix}`;
});
