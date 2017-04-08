<template>
  <div class="card p1 bg-white border rounded">
    <h2 class="center regular">Add New</h2>
    <form v-on:submit.prevent="onSubmitNewRestaurant" class="fit">
      <input @change="onChangeNewRestaurant" type="text" :value="value" class="input" placeholder="Name" />
      <button class="btn btn-primary">Add</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'AddRestaurant',
    props: [
      'onChangeNewRestaurant',
      'onSubmitNewRestaurant',
      'value'
    ]
  }
</script>

<style scoped>
  .input {
    width: 262px;
  }
  .btn-primary {
    width: 100%;
  }
</style>
