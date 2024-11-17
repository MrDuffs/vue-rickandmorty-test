<template>
  <div class="dropdown-search" ref="dropdown">
    <div
      @click="toggleInput"
      class="dropdown-search__btn"
      :class="{ 'dropdown-search__btn_expanded': isExpanded }"
    >
      <input
        v-if="isExpanded"
        v-model="searchQuery"
        @blur="handleBlur"
        @keydown.escape="collapseInput"
        type="text"
        ref="searchInput"
        placeholder="Search location"
      />
      <span>{{ selectedOption || 'Choose location' }}</span>
    </div>

    <ul v-if="isExpanded" class="dropdown-search__list" @scroll="handleScroll">
      <!-- TODO: Реализовать норм-ый спиннер -->
      <LoadingSpinner v-if="isLocationLoading" />
      <li
        v-for="location in locationData"
        :key="location.id"
        class="dropdown-search__list-item"
        :class="{
          'dropdown-search__list-item_active': selectedOption === location.name,
        }"
        @click="selectOption(location)"
      >
        location: {{ location.name }} <br />
        dimension: {{ location.dimension }} <br />
        type: {{ location.type }} <br />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useLocationStore } from '@/stores/location';
import { storeToRefs } from 'pinia';

import { LoadingSpinner } from 'components/_common';
import type { Location } from '@/types/location.types';
import { getCharsIds } from '@/utils';

interface DropdownSearchEmits {
  (e: 'get-chars-from-location', value: string[]): void;
}

const emit = defineEmits<DropdownSearchEmits>();

const location = useLocationStore();
const { locationData, isLocationLoading } = storeToRefs(location);

// Управляет состоянием кнопки/поля ввода
const isExpanded = ref(false);
// Строка поиска
const searchQuery = ref('');
// Выбранное значение
const selectedOption = ref<string | null>(null);
// Ссылка на элемент input для автофокусировки
const searchInput = ref<HTMLInputElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);

const toggleInput = async () => {
  if (!isExpanded.value && !locationData.value.length) {
    isExpanded.value = true;
    await location.getLocations();
  } else if (!isExpanded.value && locationData.value.length) {
    isExpanded.value = true;
  }
};

const collapseInput = () => {
  isExpanded.value = false;
};

const selectOption = async (option: Location) => {
  selectedOption.value = option.name;
  const charIds = getCharsIds(option.residents);

  emit('get-chars-from-location', charIds);
  collapseInput();
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    collapseInput();
  }
};

const handleBlur = () => {
  // Используем setTimeout, чтобы дать время на выбор элемента списка перед закрытием
  setTimeout(() => {
    if (!dropdown.value?.contains(document.activeElement)) {
      collapseInput();
    }
  }, 100);
};

const handleScroll = async (event: Event) => {
  const element = event.target as HTMLElement;

  const scrollPosition = element.scrollTop + element.clientHeight;
  const scrollHeight = element.scrollHeight;

  if (scrollHeight - scrollPosition <= 50 && !isLocationLoading.value) {
    await location.loadMoreLocations();
  }
};

// Добавляем и удаляем обработчики кликов вне компонента
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

watch(isExpanded, isExpandedValue => {
  setTimeout(() => {
    if (isExpandedValue) {
      searchInput.value?.focus();
    }
  }, 100);
});

const debouncedSearchFn = useDebounceFn(async (query: string) => {
  await location.getLocationByName(query);
}, 800);

watch(searchQuery, async newSearchQuery => {
  await debouncedSearchFn(newSearchQuery);
});
</script>

<style scoped lang="scss">
@use './DropdownSearch.scss';
</style>
