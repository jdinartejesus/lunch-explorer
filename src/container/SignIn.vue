<template>
  <div id="signin" class="m3">
    <div id="signin-box" class="p3 bg-white border border-box silver rounded max-width-2 mx-auto">
      <h1 class="m1 center">Login</h1>
      <form class="max-width-2 mx-auto" v-on:submit.prevent="onHandlerSignIn">
        <input type="email" class="input" v-model="email" placeholder="Email" />
        <input type="password" class="input" v-model="password" placeholder="Password" />
        <input type="submit" class="btn btn-primary" value="Login" />
      </form>
      <hr class="mt3 mb3 border silver">
      <clip-loader :loading="userStatus === 'ATTEMPTING_LOGIN'" :size="'25px'"></clip-loader>
      <div  v-if="userStatus === 'ANONYMOUS'" id="signin-social" class="center">
        <button v-on:click="onHandlerSignIn" class='btn btn-primary bg-red regular'>Google +</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import clipLoader from 'vue-spinner/src/clipLoader.vue'

export default {
  name: 'SignIn',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['userStatus']),
    ...mapState(['user'])
  },
  components: {
    clipLoader
  },
  watch: {
    user (nextUserState) {
      if (nextUserState.status === 'AUTHENTICATED') {
        return this.$router.push({ path: '/' })
      }
    }
  },
  methods: {
    onHandlerSignIn (event) {
      console.log({email: this.email, password: this.password})
      this.$store.dispatch('signIn', {email: this.email, password: this.password})
    }
  }
}
</script>
