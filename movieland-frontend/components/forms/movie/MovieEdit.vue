<template>
  <v-card class="dialog-card">
    <v-card-title>Delete Movie</v-card-title>
    <v-card-text>Are you sure you want to delete {{Array.isArray(title)? 'these Movies': 'this Movie'}}?</v-card-text>
    <v-card-text v-if="Array.isArray(title)">
      <template v-for="name in title">
        {{name}}<br/>
      </template>
    </v-card-text>
    <v-card-text v-else>
      {{title}}
    </v-card-text>
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
      movie: String
    }
  }
</script>

<style scoped>

</style>
