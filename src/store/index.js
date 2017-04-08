import Vuex from 'vuex'
import Vue from 'vue'
import moment from 'moment'

import { clone, extend, pick, omit, get, size, reduce } from 'lodash'
import { auth, googleAuthProvider, database } from '@/utils/firebase'

Vue.use(Vuex)

const usersRef = database.ref('users')
const restaurantsRef = database.ref('restaurants')

const store = new Vuex.Store({
  state: {
    filter: {
      date: moment().format('YYYY-MM-DD')
    },
    user: {
      status: 'ANONYMOUS'
    },
    newRestaurant: '',
    restaurants: {}
  },
  mutations: {
    // AUTH MUTATIONS
    SIGN_IN (state) {
      state.user = { status: 'ATTEMPTING_LOGIN' }
    },
    SIGNED_IN (state, user) {
      state.user = extend(clone(state.user), {
        status: 'AUTHENTICATED',
        ...user
      })
    },
    SIGN_OUT (state) {
      state.user = { status: 'ATTEMPTING_LOGIN' }
    },
    SIGNED_OUT (state) {
      state.user = { status: 'ANONYMOUS' }
    },

    // RESTAURANTS MUTATIONS
    INPUT_NEW_RESTAURANT (state, newRestaurant) {
      state.newRestaurant = newRestaurant
    },
    ADD_RESTAURANT (state, {key, content}) {
      state.restaurants = extend(clone(state.restaurants), {
        [key]: {
          ...content
        }
      })
    },
    UPDATE_RESTAURANT (state, {key, content}) {
      state.restaurants = extend(clone(state.restaurants), {
        [key]: {
          ...content
        }
      })
    },
    REMOVE_RESTAURANT (state, key) {
      state.restaurants = omit(clone(state.restaurants), key)
    },
    UPDATE_FILTER (state, data) {
      state.filter = extend(clone(state.filter), data)
    }
  },
  actions: {
    // AUTH ACTIONS
    signIn ({commit}, data = '') {
      commit('SIGN_IN')
      if (!data.email && !data.password) {
        return auth.signInWithPopup(googleAuthProvider)
      }

      auth.signInWithEmailAndPassword(data.email, data.password)
    },
    signOut ({commit}) {
      commit('SIGN_OUT')
      auth.signOut()
    },

    // FILTER ACTIONS
    updateDateFilter ({commit}, newDate) {
      commit('UPDATE_FILTER', { date: moment(newDate).format('YYYY-MM-DD') })
    },

    // RESTAURANTS ACTIONS
    changeRestaurant ({commit}, newRestaurant) {
      commit('INPUT_NEW_RESTAURANT', newRestaurant)
    },
    createRestaurant ({commit}, data) {
      const newRestaurant = {
        name: data.newRestaurant,
        uid: data.user.uid,
        date: moment().format('YYYY-MM-DD')
      }
      restaurantsRef.push(newRestaurant)
    },
    destroyRestaurant ({commit}, key) {
      restaurantsRef.child(key).remove()
    },

    // VOTE ACTIONS
    upVote ({commit}, { restaurantId, user }) {
      const today = moment().format('YYYY-MM-DD')
      restaurantsRef.child(restaurantId)
              .child('votes')
              .child(today)
              .child(user.uid)
              .set(user.email)
    },
    downVote ({commit}, {restaurantId, user}) {
      const today = moment().format('YYYY-MM-DD')
      restaurantsRef.child(restaurantId)
              .child('votes')
              .child(today)
              .child(user.uid)
              .remove()
    },

    // UPDATES FIREBASE
    startListeningForUsers ({commit}) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const currentUser = pick(user, ['uid', 'displayName', 'email', 'photoURL'])
          usersRef.child(user.uid).set(currentUser)
          commit('SIGNED_IN', currentUser)
        } else {
          commit('SIGNED_OUT')
        }
      })
    },
    startListeningForRestaurants ({commit}) {
      restaurantsRef.on('child_added', (snapshot) => {
        const restaurant = { key: snapshot.key, content: snapshot.val() }
        commit('INPUT_NEW_RESTAURANT', '')
        commit('ADD_RESTAURANT', restaurant)
      })
      restaurantsRef.on('child_changed', (snapshot) => {
        const restaurant = { key: snapshot.key, content: snapshot.val() }
        commit('UPDATE_RESTAURANT', restaurant)
      })
      restaurantsRef.on('child_removed', (snapshot) => {
        commit('REMOVE_RESTAURANT', snapshot.key)
      })
    }
  },
  getters: {
    userStatus: (state) => {
      return state.user.status
    },
    restaurantVotesByDate: (state) => (restaurantId, date) => {
      const restaurant = get(state.restaurants, `${restaurantId}.votes.${date}`, {})
      return size(restaurant)
    },
    restaurantWinnerByDate: (state) => (date) => {
      const winner = reduce(state.restaurants, (winner, contender) => {
        if (!contender.votes) return winner

        return (size(contender.votes[date]) > size(winner.votes[date])) ? contender : winner
      }, {votes: 0})

      return winner.name || undefined
    }
  }
})

export default store
