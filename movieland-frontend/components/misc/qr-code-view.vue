<template>
  <DialogCard >
    <v-container>
      <v-row>
        <v-spacer/>
        <v-col>
          <qrcode-vue :value="qrcode" size="400" level="H" />
        </v-col>
        <v-spacer/>
      </v-row>
      <v-row justify="center">
        Reservation Nr: {{qrcode}}
      </v-row>
    </v-container>
  </DialogCard>

</template>

<script>
  import QrcodeVue from 'qrcode.vue'

  export default {
    name: "QRCodeView",
    components:{QrcodeVue},
    props: {
      qrcode: String
    }
  }
</script>

<style scoped>

</style>
