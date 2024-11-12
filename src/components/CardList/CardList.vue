<template>
  <div class="card-list" ref="listRef" @scroll="handleScroll">
    <TransitionGroup name="card-list" tag="div" class="card-list__container">
      <Card
        v-for="character in charactersData"
        :key="character.id"
        :character="character"
      />
    </TransitionGroup>
    <LoadingSpinner v-if="isCharsLoading" />
    {{ (!hasMorePages && !isCharsLoading) ? 'Персонажей больше нет' : '' }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { useInfiniteScroll } from '@vueuse/core';
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
const { isCharsLoading, hasMorePages } = storeToRefs(charsStore);

const listRef = ref<HTMLElement | null>(null);

// Бесконечный скролл, используя vue use
// useInfiniteScroll(
//   listRef,
//   async () => {
//     if (!isCharsLoading.value) {
//       await charsStore.loadMoreCharacters();
//     }
//   },
//   {
//     distance: 100,
//     throttle: 500, // добавляем задержку между вызовами
//   }
// );

const handleScroll = async (event: Event) => {
  const element = event.target as HTMLElement;

  const scrollPosition = element.scrollTop + element.clientHeight;
  const scrollHeight = element.scrollHeight;

  if (scrollHeight - scrollPosition <= 100 && !isCharsLoading.value) {
    await charsStore.loadMoreCharacters();
  }
};
</script>

<style scoped lang="scss">
@use './CardList.scss';
</style>
