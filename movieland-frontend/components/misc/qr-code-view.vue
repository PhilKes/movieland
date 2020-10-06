<template>
  <DialogCard class="pa-4">
    <v-container>
      <v-row>
        <v-spacer/>
        <v-col>
          <v-img :src="qrcodeURL" position="center" width="700"/>
        </v-col>
        <v-spacer/>
      </v-row>
    </v-container>
  </DialogCard>

</template>

<script>
  export default {
    name: "QRCodeView",
    props: {
      qrcodeURL: String
    }
  }
</script>

<style scoped>

</style>
