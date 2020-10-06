<template>
  <v-btn outlined small link nuxt color="primary"
         :to="url">
    {{label}}
    <v-icon color="light" small class="ml-2">fas fa-chevron-right</v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: "NavigateButton",
    props: {
      label: String,
      url: String
    }
  }
</script>

<style scoped>

</style>
