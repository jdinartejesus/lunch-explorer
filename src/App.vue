<template>
  <div id="app">
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
  name: 'app',
  components: {
    Navigation
  },
  created () {
    this.$store.dispatch('startListeningForRestaurants')
    this.$store.dispatch('startListeningForUsers')
  }
}
</script>

<style>
  @import 'roboto-fontface';
  @import 'basscss-margin';
  @import 'basscss-padding';
  @import 'basscss-grid';
  @import 'basscss-typography';
  @import 'basscss-type-scale';
  @import 'basscss-colors';
  @import 'basscss-forms';
  @import 'basscss-border';
  @import 'basscss-layout';
  @import 'basscss-btn';
  @import 'basscss-btn-primary';
  @import 'basscss-flexbox';
  @import 'basscss-background-colors';

  body {
    background: url('./assets/background.jpg');
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
  }

  :root {
    --button-font-weight: 400;
  }

  .btn-primary {
    width: 100%;
  }
</style>
