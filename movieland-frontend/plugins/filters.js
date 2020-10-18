import Vue from 'vue'
import moment from 'moment'
import VueYoutube from 'vue-youtube'
import AsyncComputed from 'vue-async-computed'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import Utils from "../service/Utils";

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

Vue.filter('formatDollar', value => {
  if (!value) return ''
  return Number(value).toFixed(2)+' $';
})

Vue.filter('capitalize', value => {
  if (!value) return ''
  return Utils.capitalize(value)
})
Vue.use(VueYoutube)
Vue.use(AsyncComputed);

Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
