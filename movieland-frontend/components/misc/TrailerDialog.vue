<template>
<DialogCard>
  <youtube :video-id="videoId" ref="youtube" :player-vars="{autoplay: 1}" ></youtube>
</DialogCard>
</template>


<script>
  import VueYoutube from 'vue-youtube'
    export default {
      name: "TrailerDialog",
      components:{VueYoutube},
      props:{
          trailerUrl: String
      },
      data(){
          return{
             videoId : this.trailerUrl
          }
      }
    }
</script>

<style scoped>

</style>
