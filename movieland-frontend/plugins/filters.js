import Vue from 'vue'
import moment from 'moment'
import VueYoutube from 'vue-youtube'
Vue.filter('formatDateTime', value => {
  if (!value) return ''
  return moment(value).format('DD.MM.YYYY HH:mm [h]');
})
Vue.filter('formatDate', value => {
  if (!value) return ''
  return moment(value).format('DD.MM.YYYY');
})
Vue.filter('formatDateName', value => {
  let date = moment(value);
  return moment().isSame(date, 'day') ? 'Today' : value;
})

Vue.filter('formatTime', value => {
  if (!value) return ''
  return moment(value).format('HH:mm [h]');
})
Vue.use(VueYoutube)
