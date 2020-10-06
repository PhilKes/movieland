export default $axios => resource => ({
  all() {
    return $axios.$get(`/${resource}`)
  },

  id(id) {
    return $axios.$get(`/${resource}/${id}`)
  },


})
