<template>
  <v-card rounded elevation="2">
    <v-container>
      <v-skeleton-loader type="card" v-if="loading" />
      <template v-else>
        <v-row no-gutters dense>
          <v-col>
            <back-button
              label="All Reservations"
              :url="`/users/me/reservations`"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-card-title>My Reservation</v-card-title>
        </v-row>
        <v-divider class="mb-4" />
        <v-row>
          <v-col>
            <movie-card transparent :movie="resInfo.movie" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card-text>
              Date: {{ resInfo.movieShow.date | formatDateTime }}<br />
              Total Sum: {{ resInfo.reservation.totalSum }} $ Reservation Nr:
              {{ resInfo.reservation.resId }}
            </v-card-text>
            <v-card-actions>
              <v-btn
                block
                v-if="resInfo.reservation.validated === false"
                color="primary"
                @click="showValidateInfo"
              >
                Validate
              </v-btn>
              <v-btn block v-else color="success" outlined class="no-hover"
                >Validated</v-btn
              >
            </v-card-actions>
          </v-col>
          <v-spacer />
          <v-col>
            <!--         <img :src="resInfo.qrcodeURL" class="hover-pointer" @click="openQRCode"/>-->
            <span @click="openQRCode">
              <qrcode-vue
                :value="resInfo.reservation.resId + ''"
                size="150"
                class="hover-pointer"
                level="H"
              />
            </span>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-card>
</template>

<script>
  import MovieCard from "../../../../../components/cards/MovieCard";
  import {DialogConfirm, QrCodeView} from "../../../../../.nuxt/components";
  import BackButton from "../../../../../components/buttons/BackButton";
  import QrcodeVue from 'qrcode.vue'

  export default {
    name: "MyReservation",
    components: {BackButton, MovieCard, QrcodeVue},
    middleware:['loggedIn'],
    data() {
      return {
        resInfo: null,
        loading: true
      }
    },
    async fetch() {
      this.resInfo = await this.$repos.reservations.userReservation(this.$route.params.resId)
      this.loading = false;
    },
    methods: {
      openQRCode() {
        this.$dialog.show(QrCodeView, {qrcode: this.resInfo.reservation.resId+''});
      },
      showValidateInfo() {
        this.$dialog.show(DialogConfirm,{
          text: "To validate your Reservation, please go to the service desk and show your reservation' s QRCode",
          title: "Validation Info",
          cancel:false,
          submitColor:'info'
        });
      }
    },
      head() {
    return {
      title: this.resInfo? `Reservation for ${this.resInfo.movie.name}` : 'Reservation',
    };
  },
  }
</script>

<style scoped lang="scss">
</style>
