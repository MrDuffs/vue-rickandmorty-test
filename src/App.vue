<template>
  <header class="header">
    <Search
      v-model="searchQuery"
      placeholder="Find character by name"
    />
    <DropdownSearch />
  </header>
  <main class="main-layout">
    <CardList :charactersData="charactersData" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCharacterStore } from 'stores/character';
import { Search, DropdownSearch } from 'components/_common';
import CardList from 'components/CardList';

const charsStore = useCharacterStore();
const { charactersData } = storeToRefs(charsStore);

const searchQuery = ref('');

onMounted(async () => {
  await charsStore.getCharsData();
});

watch(searchQuery, async newSearchQuery => {
  await charsStore.getCharsByName(newSearchQuery);
});
</script>

<style lang="scss">
.header {
  // padding: 20px 20px 0 20px;
  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
