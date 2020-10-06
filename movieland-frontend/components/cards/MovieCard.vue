<template>
  <v-skeleton-loader v-if="!movie" type="card" loading/>
  <a v-else :class="{'card-link':!noLink, 'card-link-noHover':noLink===true}"
     :href="noLink? null : '/movies/'+movie.movId">
    <article :class="{'movie-card':true,'transparent-card':transparent}">
      <img class="post-image hover-pointer" :src="movie.posterUrl"/>
      <div class="movie-details">
        <h4 class="movie-title">{{ movie.name }}</h4>
        <p class="post-description">{{ movie.description }}</p>
        <p class="post-author">Directed by {{ movie.director }}</p>
      </div>
    </article>
  </a>
</template>

<script>

  export default {
    name: "MovieCard",
    props: {
      movie: {
        movId: Number,
        name: String,
        posterUrl: String,
        director: String,
        description: String,
      },
      noLink: Boolean,
      transparent: Boolean
    },
    methods: {}
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

  body {
    display: flex;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    color: $text;
    background: $bg;
    font-size: 0.9375rem;
    min-height: 100vh;
    margin: 0;
    line-height: 1.6;
    align-items: center;
    justify-content: center;
    text-rendering: optimizeLegibility;
  }

  #container {
    width: 30rem;
    height: 18.625rem;
  }

  .big {
    width: 100% !important;
    border: 1px solid black;
  }

  .movie-card {
    display: flex;
    flex-direction: row;
    background: $white;
    box-shadow: 0 0.1875rem 1.5rem $shadow;
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .transparent-card {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
  }

  .card-link {
    position: relative;
    display: block;
    color: inherit;
    text-decoration: none;

    &:hover .movie-title {
      @include transition(color 0.3s ease);
      color: $red;
    }

    &:hover .post-image {
      @include transition(opacity 0.3s ease);
      opacity: 0.75;
    }
  }

  .card-link-noHover {
    position: relative;
    display: block;
    color: inherit;
    text-decoration: none;

    &:hover * {
      cursor: auto;
    }

    /*   &:hover .movie-title {
         @include transition(color 0.3s ease);
         color: $red;
       }

       &:hover .post-image {
         @include transition(opacity 0.3s ease);
         opacity: 0.75;
       }*/
  }

  .post-image {
    @include transition(opacity 0.3s ease);
    display: block;
    width: 100%;
    object-fit: contain;
  }

  .big-image {
    object-fit: contain;
    margin-top: 10px !important;
  }

  .movie-details {
    padding: 1.5rem;
  }

  .movie-title {
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 0.0625rem;
    padding: 0 0 0.25rem 0;
    border-bottom: 0.125rem solid $border;
    @include transition(color 0.3s ease);
    font-size: 1.125rem;
    line-height: 1.4;
    color: $black;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .post-author {
    font-size: 0.875rem;
    line-height: 1;
    margin: 1.125rem 0 0 0;
    padding: 1.125rem 0 0 0;
    border-top: 0.0625rem solid $border;
  }

  @media (max-width: 40rem) {
    #container {
      width: 18rem;
      height: 27.25rem;
    }

    .movie-card {
      flex-wrap: wrap;
    }
  }

  @supports (display: grid) {
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
      height: 100%;
    }

    .movie-card {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: 1fr;
    }

    @media (max-width: 40rem) {
      .movie-card {
        grid-template-columns: auto;
        grid-template-rows: 12rem 1fr;
      }
    }
  }

</style>
