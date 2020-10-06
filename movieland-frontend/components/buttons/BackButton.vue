<template>
  <v-btn outlined small link nuxt color="secondary"
         :to="url">
    <v-icon color="light" small class="mr-2">fas fa-chevron-left</v-icon>
    {{label}}
  </v-btn>
</template>

<script>
  export default {
    name: "BackButton",
    props: {
      label: String,
      url: String
    }
  }
</script>

<style scoped>

</style>
