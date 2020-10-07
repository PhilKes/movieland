import Vue from 'vue';

export default (ctx, inject) => {
  const bus = new Vue;

  inject('events', bus)
  ctx.events = bus;
};
