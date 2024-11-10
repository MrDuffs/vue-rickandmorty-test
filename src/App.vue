<template>
  <main>
    <h1>Hello world!</h1>
    <CardList />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCharacterStore } from 'stores/character';
import CardList from 'components/CardList';

const characterStore = useCharacterStore();

onMounted(async () => {
  await characterStore.getCharsData();
});
</script>

<style lang="scss">
@import './index.scss';
</style>
