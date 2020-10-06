import moment from 'moment';

const Utils = {
  groupByDay(elements) {
    return elements.reduce((r, a) => {
      r[moment(a.date).format("dd DD.MM")] = [...r[moment(a.date).format("dd DD.MM")] || [], a];
      return r;
    }, {});
  }
}
export default Utils;


