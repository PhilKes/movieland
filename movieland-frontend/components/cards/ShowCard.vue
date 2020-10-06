<template>
  <v-skeleton-loader type="card, card-image" v-if="!show" width="1000"
  ></v-skeleton-loader>
  <v-card v-else elevation="2" rounded width="9000">
    <v-card-title> Reservation for {{show.date | formatDateTime}}</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          Please select seats for your reservation
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <seats-view :disabled="booking" :seats="seats" @seatClick="onSeatClick"/>
          </v-col>
          <v-row>
            <v-col cols="12">
              <v-card-subtitle>Selected Seats: {{selection.length}}</v-card-subtitle>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn color="success" class="btn-uppercase" @click="$emit('submit',selection)"
             :disabled="booking || selection.length<1">
        <v-progress-circular indeterminate v-if="booking" :size="20"></v-progress-circular>
        Book
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import SeatsView from "../misc/seats-view";

  export default {
    name: "ShowCard",
    components: {SeatsView},
    props: {
      show: Object,
      booking: Boolean,
      takenSeats: Array
    },
    data() {
      let initialSeats = [];
      for (let row = 0; row < 10; row++) {
        let rowSeats = [];
        for (let col = 0; col < 16; col++) {
          rowSeats.push(0);
        }
        initialSeats.push(rowSeats);
      }
      return {
        initialSeats
      };
    },
    methods: {
      onSeatClick({rowIdx, colIdx}) {
        const newRow = this.seats[rowIdx].slice(0);
        if (newRow[colIdx] === 0)
          newRow[colIdx] = 2
        else if (newRow[colIdx] === 2)
          newRow[colIdx] = 0;
        this.$set(this.initialSeats, rowIdx, newRow)
      }
    },
    computed: {
      selection: {
        get() {
          let selection = [];
          this.seats.forEach((row, rowIdx) => {
            row.forEach((seat, colIdx) => {
              if (seat === 2) {
                selection.push({rowIdx, colIdx})
              }
            })
          })
          return selection;
        }
      },
      seats: {
        get() {
          let seats = this.initialSeats.slice();
          this.takenSeats.forEach(takenSeat => {
            seats[Math.floor(takenSeat.number / 16)][takenSeat.number % 16] = 1;
          })
          return seats;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
