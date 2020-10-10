<template>
  <v-card class="dialog-card">
    <v-card-title>{{title}}</v-card-title>
    <v-card-text>Are you sure you want to delete this Movie?</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" outlined @click="$emit('submit',false)">Cancel</v-btn>
      <v-btn color="error" @click="$emit('submit',true)">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "MovieDelete",
    props: {
      title: String
    }
  }
</script>

<style scoped>

</style>
