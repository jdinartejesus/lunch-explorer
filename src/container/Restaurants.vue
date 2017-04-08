<template>
  <div id="restaurants">
    <div class="p2 bg-white center border silver">
      <h3 class="m0 gray">Winner: {{getWinnerRestaurantBySelectedDate()}} </h3>
      <datepicker
        class="flex justify-center"
        input-class="input-date blue border-none underline p1 h4 center"
        :value="filter.date"
        v-on:selected="onHandlerSelectedDate"
        :format="'dd MMMM yyyy'" />
    </div>
    <ul class="list-reset flex flex-wrap">
      <li v-for="(restaurant, key) in restaurants" class="inline m1">
        <restaurant-item
          :user="user"
          :key="key"
          :restaurantId="key"
          :restaurant="restaurant"
          :votes="getRestaurantVotesByDate(key, filter.date)"
          :onHandlerDelete="onHandlerDelete"
          :onHandlerUpVote="onHandlerUpVote"
          :onHnadlerDownVote="onHnadlerDownVote"
        />
      </li>
      <li v-show="userStatus === 'AUTHENTICATED'" class="inline m1">
        <add-Restaurant
          :value="newRestaurant"
          :onChangeNewRestaurant="onChangeNewRestaurant"
          :onSubmitNewRestaurant="onSubmitNewRestaurant"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

  import Datepicker from 'vuejs-datepicker'
  import RestaurantItem from '@/components/RestaurantItem'
  import AddRestaurant from '@/components/AddRestaurant'

  export default {
    name: 'Restaurants',
    computed: {
      ...mapState(['newRestaurant', 'filter', 'user', 'restaurants']),
      ...mapGetters(['restaurantVotesByDate', 'restaurantWinnerByDate', 'userStatus'])
    },
    components: {
      RestaurantItem,
      AddRestaurant,
      Datepicker
    },
    methods: {
      getRestaurantVotesByDate (restaurantId, date) {
        return this.restaurantVotesByDate(restaurantId, date)
      },
      getWinnerRestaurantBySelectedDate () {
        return this.restaurantWinnerByDate(this.filter.date)
      },
      onHandlerSelectedDate (newDate) {
        this.$store.dispatch('updateDateFilter', newDate)
      },
      onChangeNewRestaurant (event) {
        this.$store.dispatch('changeRestaurant', event.target.value)
      },
      onSubmitNewRestaurant () {
        const { newRestaurant, user } = this
        this.$store.dispatch('createRestaurant', { newRestaurant, user })
      },
      onHandlerDelete (restaurantId) {
        this.$store.dispatch('destroyRestaurant', restaurantId)
      },
      onHandlerUpVote (restaurantId) {
        const { user } = this
        this.$store.dispatch('upVote', { restaurantId, user })
      },
      onHnadlerDownVote (restaurantId) {
        const { user } = this
        this.$store.dispatch('downVote', { restaurantId, user })
      }
    }
  }
</script>

<style>
  .card {
    width: 280px;
    border-color: silver;
    color: #272727;
  }
  .card .photo {
    width: 280px;
    height: 220px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
