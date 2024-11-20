<template>
  <header class="header">
    <Search v-model="searchQuery" placeholder="Enter character name" />
    <Transition name="fade">
      <button
        v-if="selectedLocation"
        type="button"
        class="header__clear-btn"
        @click="removeLocation"
        aria-label="Clear search"
      >
        <MdRoundClear class="header__clear-icon" />
      </button>
    </Transition>
    <DropdownSearch @get-chars-from-location="handleSearchCharsByLocation" />
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCharacterStore } from 'stores/character';
import { useLocationStore } from '@/stores/location';
import { Search, DropdownSearch } from 'components/_common';

const charsStore = useCharacterStore();
const locationStore = useLocationStore();
const { selectedLocation } = storeToRefs(locationStore);

const searchQuery = ref('');

const removeLocation = async () => {
  if (selectedLocation.value) {
    selectedLocation.value = '';
    await charsStore.getCharsData();
  }
};

const handleSearchCharsByLocation = async (charsArr: string[]) => {
  if (selectedLocation.value && searchQuery.value) searchQuery.value = '';
  await charsStore.getCharsFromLocation(charsArr);
};

watch(searchQuery, async newSearchQuery => {
  if (newSearchQuery && selectedLocation.value) selectedLocation.value = '';
  await charsStore.getCharsByName(newSearchQuery);
});
</script>

<style scoped lang="scss">
@use './Header.scss';
</style>
