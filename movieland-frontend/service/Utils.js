import moment from 'moment';

const Utils = {
  groupByDay(elements) {
    return elements.reduce((r, a) => {
      r[moment(a.date).format("dd DD.MM")] = [...r[moment(a.date).format("dd DD.MM")] || [], a];
      return r;
    }, {});
  },
  getPureToken(token){
    return token.replace("Bearer ","");
  },
  initIndex(array){
    array.forEach((item,idx)=>item.idx=idx)
  },
  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }
}
export default Utils;


