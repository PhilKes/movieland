<template>
  <v-card class="dialog-card">
    <v-card-title>{{title}}</v-card-title>
    <v-card-text v-html="text"></v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="cancel!==false" color="secondary" outlined @click="$emit('submit',false)">Cancel</v-btn>
      <v-btn :color="submitColor? submitColor : 'error'" @click="$emit('submit',true)" elevation="0">{{submitText? submitText: 'Ok'}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "DialogConfirm",
    props: {
      title: String,
      text: String,
      submitText:String,
      submitColor:String,
      cancel:Boolean
    }
  }
</script>

<style scoped>

</style>
