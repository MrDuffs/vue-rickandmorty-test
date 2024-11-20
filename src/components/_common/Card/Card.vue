<template>
  <article v-if="character" class="card" ref="cardRef">
    <div class="card__img">
      <img :src="character.image" :alt="character.name" />
    </div>
    <div class="card__info">
      <h2 class="card__name">{{ character.name }}</h2>
      <div class="card__gender">gender: {{ character.gender }}</div>
      <div class="card__status">status: {{ character.status }}</div>
      <div class="card__location">location: {{ character.location.name }}</div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Character } from '@/types/character.types';

interface CardListProps {
  character: Character;
}

withDefaults(defineProps<CardListProps>(), {});
</script>

<style scoped lang="scss">
@use './Card.scss';
</style>
