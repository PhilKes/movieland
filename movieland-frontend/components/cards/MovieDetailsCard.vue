<template>
  <v-skeleton-loader loading v-if="!movie" type="card"/>
  <v-card v-else>
    <v-container class="pa-0 ma-0">
      <v-row dense style="height:60vh!important;" justify="center" align-content="center" align="center">
        <v-col cols="3" xl="2">
          <div class="img-container pa-0 ma-0">
            <v-img :src="movie.posterUrl" style=" height:60vh!important;" class="movie-poster ma-0 pa-0"/>
          </div>
        </v-col>
        <v-spacer/>
        <v-col cols="9" xl="10">
          <v-container class="pa-0 ma-0">
            <v-row dense>
              <v-col cols="12">
                <h4 class="movie-title">{{ movie.name }}</h4>
                <v-card-subtitle class="movie-description">{{ movie.description }}</v-card-subtitle>
              </v-col>
            </v-row>
            <v-row dense justify="center" align="center">
              <v-col cols="11">
                <shows-view :shows="shows" :mov-id="movie.movId"/>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <p>Directed by {{ movie.director }}</p>
              </v-col>
            </v-row>

          </v-container>
        </v-col>
        <v-spacer/>
      </v-row>
    </v-container>
  </v-card>

</template>

<script>
  import ShowsView from "../misc/shows-view";

  export default {
    name: "MovieDetailsCard",
    components: {ShowsView},
    props: {
      movie: {
        movId: Number,
        name: String,
        posterUrl: String,
        director: String,
        description: String
      },
      shows: Array
    },
    data: () => ({})
  }
</script>

<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');

  $bg: #eedfcc;
  $text: #777;
  $black: #121212;
  $white: #fff;
  $red: #e04f62;
  $border: #ebebeb;
  $shadow: rgba(0, 0, 0, 0.2);

  @mixin transition($args...) {
    transition: $args;
  }

  * {
    box-sizing: border-box;

    &::before, &::after {
      box-sizing: border-box;
    }
  }


  #container {
    width: 30rem;
    height: 18.625rem;
  }


  .movie-card {
    display: flex;
    flex-direction: row;
    background: $white;
    box-shadow: 0 0.1875rem 1.5rem $shadow;
    border-radius: 0.375rem;
  }

  .card-link {
    position: relative;
    display: block;
    color: inherit;
    text-decoration: none;

  }

  /*  .post-image {
      @include transition(opacity 0.3s ease);
      height: 100% !important;
      object-fit: cover;
    }*/


  .movie-details {
    padding: 1.5rem;
  }

  .movie-title {
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 0.0625rem;
    border-bottom: 0.125rem solid $border;
    @include transition(color 0.3s ease);
    font-size: 1.125rem;
    line-height: 1.4;
    color: $black;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    margin-top: 16px;

  }

  .post-author {
    font-size: 0.875rem;
    line-height: 1;
    margin: 1.125rem 0 0 0;
    padding: 1.125rem 0 0 0;
    border-top: 0.0625rem solid $border;
  }

  /*
    @media (max-width: 40rem) {
      #container {
        width: 18rem;
        height: 27.25rem;
      }

      .movie-card {
        flex-wrap: wrap;
      }
    }
  */

  /*  @supports (display: grid) {
      body {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 0.625rem;
        grid-template-areas: ". main main ." ". main main .";
      }

      #container {
        grid-area: main;
        align-self: center;
        justify-self: center;
      }

      .post-image {
        //height: 100%;
      }

      .movie-card {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 1fr;
      }

  !*    @media (max-width: 40rem) {
        .movie-card {
          grid-template-columns: auto;
          grid-template-rows: 12rem 1fr;
        }
      }*!
    }*/

  .img-container {
    height: 100% !important;
    width: 100% !important;
    text-align: center; /* optional */

  }

  .img-container .v-img {
    vertical-align: top;
    border-top-left-radius: 20%;
  }

  .movie-description {
    font-size: 0.7em;
    padding: 0 !important;
    margin: 0 !important;
    margin-left: 10px;
  }

  .movie-poster {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    @include transition(opacity 0.3s ease);
    opacity: 0.9;
  }

</style>
