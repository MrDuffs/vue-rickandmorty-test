<template>
  <Header />
  <main class="main-layout">
    <!-- <CardList :charactersData="charactersData" /> -->
    <CardList />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCharacterStore } from 'stores/character';
import CardList from 'components/CardList';
import Header from './components/Header';

const charsStore = useCharacterStore();

onMounted(async () => {
  await charsStore.getCharsData();
});
</script>
