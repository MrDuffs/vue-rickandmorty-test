<template>
  <div class="card-list" ref="listRef">
    <template v-for="character in charactersData" :key="character.id">
      <Card :character="character" />
    </template>
    <LoadingSpinner v-if="isCharsLoading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { Card, LoadingSpinner } from 'components/_common';
import { useCharacterStore } from '@/stores/character';
import type { Character } from '@/types/character.types';

interface CardListProps {
  charactersData: Character[];
}

const props = withDefaults(defineProps<CardListProps>(), {
  charactersData: () => [],
});

const charsStore = useCharacterStore();
const { isCharsLoading } = storeToRefs(charsStore);

const listRef = ref<HTMLElement | null>(null);
// let observer: IntersectionObserver | null = null;

useInfiniteScroll(listRef, charsStore.loadMoreCharacters, {
  distance: 100, // Расстояние до конца списка, при котором срабатывает загрузка
  direction: 'bottom',
});

// useInfiniteScroll(
//   listRef,
//   async () => {
//     await charsStore.loadMoreCharacters();
//   },
//   {
//     distance: 100, // Задаем расстояние до конца списка, когда подгружать новые данные
//   }
// );
</script>

<style scoped lang="scss">
@use './CardList.scss';
</style>
