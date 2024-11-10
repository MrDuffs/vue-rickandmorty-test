<template>
  <main class="main-layout">
    <h1>Hello world!</h1>
    <CardList :charactersData="charactersData" />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useCharacterStore } from 'stores/character';
import CardList from 'components/CardList';

const charsStore = useCharacterStore();

const { charactersData } = storeToRefs(charsStore);

onMounted(async () => {
  await charsStore.getCharsData();  
});
</script>

<style lang="scss">
@use './index.scss';
</style>
