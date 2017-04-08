<template>
  <div id="restaurant" class="card p1 bg-white border rounded">
    <div class="photo fit rounded" v-bind:style="{ 'background-image': `url(${restaurant.photoURL})`}"></div>
    <h2 class="center regular">{{restaurant.name}}</h2>
    <div v-if="restaurant.address" class="content">
      <star-rating
        v-bind:increment="0.1"
        :rating="restaurant.rating"
        v-bind:star-size="22"
        v-bind:read-only="true">
      </star-rating>
      <p class="h5"><span class="bold">Address:</span> {{restaurant.address}}</p>
    </div>
    <clip-loader :loading="!restaurant.address" :size="'30px'"></clip-loader>
    <div class="clearfix center">
      <p><span class="caps">Votes:</span>{{votes}}</p>
    </div>
    <div class="clearfix mxn1">
      <div class="p1 px1 center col col-6">
        <button
          v-on:click="onHandlerUpVote(restaurantId)"
          :disabled="disableVotesButtonAnonymousUser()"
          class="btn btn-primary white">
          +1
        </button>
      </div>
      <div class="p1 px1 center col col-6">
        <button
          v-on:click="onHnadlerDownVote(restaurantId)"
          :disabled="disableVotesButtonAnonymousUser()"
          class="btn btn-primary white">
          -1
        </button>
      </div>
    </div>
    <div>
      <button
        v-show="isCreatorOfRestaurant()"
        v-on:click="onHandlerDelete(restaurantId)"
        class="btn btn-primary bg-red">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
  import StarRating from 'vue-star-rating'
  import clipLoader from 'vue-spinner/src/clipLoader.vue'

  export default {
    name: 'RestaurantItem',
    props: [
      'user',
      'restaurantId',
      'restaurant',
      'votes',
      'onHandlerDelete',
      'onHandlerUpVote',
      'onHnadlerDownVote'
    ],
    components: {
      StarRating,
      clipLoader
    },
    methods: {
      isCreatorOfRestaurant () {
        return this.user.uid === this.restaurant.uid
      },
      disableVotesButtonAnonymousUser () {
        return this.user.status === 'ANONYMOUS'
      }
    }
  }
</script>
