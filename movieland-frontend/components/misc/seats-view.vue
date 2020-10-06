<template>
  <v-container class="pa-0 ma-0" style="width: fit-content">
    <v-row dense v-for="(row,rowIdx) of seats" :key="'seatRow'+rowIdx" justify="start">
      <v-col v-for="(col,colIdx) of row" :key="'seat'+(rowIdx*row.length+colIdx)">

        <div :class="{'seat':true,'selected':col===2, 'taken':col===1,'disabled':disabled}"
             @click="$emit('seatClick',{rowIdx,colIdx})">
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: "SeatsView",
    props: {
      seats: Array,
      disabled: Boolean
    }
  }
</script>

<style scoped lang="scss">
  @mixin transition($args...) {
    transition: $args;
  }

  $free: grey;
  $selected: green;
  $taken: red;


  .seat {
    width: 1.1rem;
    height: 1.3rem;
    border-top-left-radius: 25%;
    border-top-right-radius: 25%;
    background-color: $free;

    &:hover {
      cursor: pointer;
    }

    &:hover {
      @include transition(color 0.5s ease);
      background-color: lighten($selected, 60);
    }
  }

  .selected {
    background-color: $selected;
  }

  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  .taken {
    background-color: $taken;

    &:hover {
      cursor: auto;
      background-color: $taken;
    }

  }
</style>
