<template>
  <div class="card-list">
    <template v-for="i in 5">
      <Card />
    </template>
  </div>
</template>

<script setup lang="ts">
import { Card } from 'components/_common';
</script>

<style scoped lang="scss">

</style>