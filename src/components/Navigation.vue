<template>
  <div id="navigation" class="clearfix bg-silver fixed p1 flex items-center">
    <div class="col col-4 left-align">
      <router-link class="nav-links" to="/">Lunch Explorer</router-link>
    </div>
    <div class="col col-8 right-align">
      <div class="inline-block">
        <div class="mr2">
          <div v-if="userStatus === 'AUTHENTICATED' && user" id="authentication" class="flex items-center" >
            <img v-show="user.photoURL" class="circle m1" width="36" height="36" v-bind:src="user.photoURL" v-bind:alt="user.displayName" />
            <p class="inline-block m1 white">{{user.email}}</p>
            <a v-on:click.prevent="onHandlerSignOut" class="nav-links">Logout</a>
          </div>
          <router-link v-else class="nav-links" to="/login">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Navigation',
  computed: {
    ...mapState(['user']),
    ...mapGetters(['userStatus'])
  },
  methods: {
    onHandlerSignOut (event) {
      this.$store.dispatch('signOut')
    }
  }
}
</script>

<style>
  #navigation {
    min-height: 60px;
  }
  #navigation .nav-links {
    color: white;
    text-decoration: none;
    padding: 8px;
  }
</style>
