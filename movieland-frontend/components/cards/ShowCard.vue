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
        </v-row>
        <v-row>
            Selected Seats:
        </v-row>
        <v-row v-for="(type,idx) of ticketTypes" :key="type.value" dense no-gutters>
          <v-col cols="3">
            {{type.value | capitalize}}
          </v-col>
          <v-col cols="2">
            <v-text-field type="number" v-model="type.amount" @input="onTicketInput(idx,$event)"  />
          </v-col>
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
        initialSeats,
        ticketTypes: [
          {
            value: 'ADULT',
            price: 7.00,
            icon: 'fas fa-user',
            amount: 0
          },
          {
            value: 'Child',
            price: 5.50,
            icon: 'fas fa-child',
            amount: 0
          },
          {
            value: 'STUDENT',
            price: 6.00,
            icon: 'fas fa-graduate',
            amount: 0
          },
          {
            value: 'DISABLED',
            price: 5.50,
            icon: 'fas fa-wheelchair',
            amount: 0
          },
        ]
      };
    },
    methods: {
      onSeatClick({rowIdx, colIdx}) {
        const newRow = this.seats[rowIdx].slice(0);
        if (newRow[colIdx] === 0) {
          //Seat selected
          newRow[colIdx] = 2;
          this.ticketTypes[0].amount++;
        } else if (newRow[colIdx] === 2) {
          //Seat deselected
          newRow[colIdx] = 0;
          for (let ticketType of this.ticketTypes) {
            if (ticketType.amount > 0) {
              ticketType.amount--;
              break;
            }
          }
        }
        this.$set(this.initialSeats, rowIdx, newRow)
      },
      onTicketInput(idx, input) {
        const ticketType= this.ticketTypes[idx];
        console.log(this.selectionSum() , this.selection.length)
        if(this.selectionSum() > this.selection.length){
          for (let type of this.ticketTypes) {
            if (type.amount > 0 && ticketType.value!== type.value) {
              type.amount--;
              console.log("decrease",type)
              break;
            }
          }
          console.log(this.selectionSum() , this.selection.length)
          while(this.selectionSum() > this.selection.length){
            ticketType.amount--;
          }
          console.log("end",this.selectionSum() , this.selection.length)
          console.log(this.ticketTypes)
        }
       /* if(ticketType.amount < input){
          //oben
          console.log("oben")
          if(this.selectionSum()+1 <= this.selection.length ){
            ticketType.amount=input;
          }else{
            ticketType.amount=ticketType.amount
          }
        }
        else if(ticketType.amount > input){
          console.log("unten")

          //unten
        }*/

      },
      selectionSum(){
        let sum=0;
        this.ticketTypes.forEach(type=>sum+=Number(type.amount))
        return sum;
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
