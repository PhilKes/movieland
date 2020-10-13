<template>
  <v-skeleton-loader v-if="loading" type="card"></v-skeleton-loader>
  <v-card v-else>
    <v-list-item three-line dense>
      <v-list-item-avatar tile :size="img==null? 100: null" :color="img==null? color: 'transparent'">
        <v-img v-if="img" :src="img" width="100" height="auto" />
        <v-icon v-else-if="icon" color="white" x-large>{{icon}}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="mb-4 text-center" style="font-size: 0.8em">
          {{title}}
        </v-list-item-title>
        <v-list-item-title class="mb-2 text-center stat-card-main">
         {{value}}
          <slot></slot>
        </v-list-item-title>
        <v-list-item-subtitle class="text-center" style="font-size: 0.6em">
          <v-divider/>
          {{subtitle}}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <!--  <v-card-actions>
        <v-btn
          outlined
          rounded
          text
        >
          Button
        </v-btn>
      </v-card-actions>-->
  </v-card>
</template>

<script>
  export default {
    name: "StatCard",
    props: {
      title:String,
      value:String | Number,
      subtitle:String,
      color:String,
      icon:String,
      img:String,
      loading:Boolean
    }
  }
</script>

<style scoped lang="scss">
  .stat-card-main{
    font-size: 1.4em;
    font-weight: bold;
    text-wrap: normal;
  }
</style>
