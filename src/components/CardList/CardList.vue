<template>
  <div class="card-list" ref="listRef" @scroll="handleScroll">
    <LoadingSpinner v-if="isCharsLoading" />
    <TransitionGroup
      tag="div"
      name="card-list"
      class="card-list__container"
      appear
      v-if="!isCharsLoading && charactersData.length > 0"
    >
      <Card
        v-for="(character, index) in charactersData"
        :key="character.id"
        :character="character"
        :data-index="index"
      />
    </TransitionGroup>

    <Transition
      name="fade"
      mode="out-in"
    >
      <div v-if="computedMessage && !isCharsLoading" class="card-list__message">
        {{ computedMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { useInfiniteScroll } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { Card, LoadingSpinner } from 'components/_common';
import { useCharacterStore } from '@/stores/character';
import type { Character } from '@/types/character.types';

const charsStore = useCharacterStore();
const { charactersData, isCharsLoading, hasMorePages, computedMessage } =
  storeToRefs(charsStore);

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
