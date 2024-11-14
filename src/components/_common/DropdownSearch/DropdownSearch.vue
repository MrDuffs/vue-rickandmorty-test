<template>
  <div class="dropdown-search" ref="dropdown">
    <div
      @click="toggleInput"
      class="dropdown-search__btn"
      :class="{ 'dropdown-search__btn_expanded': isExpanded }"
    >
      <span v-if="!isExpanded">{{ selectedOption || 'Choose location' }}</span>
      <input
        v-else
        v-model="searchQuery"
        @blur="handleBlur"
        @keydown.escape="collapseInput"
        type="text"
        ref="searchInput"
        placeholder="Search location"
      />
    </div>

    <ul
      v-if="isExpanded && filteredOptions.length"
      class="dropdown-search__list"
    >
      <li
        v-for="location in filteredOptions"
        :key="location.id"
        class="dropdown-search__list-item"
        :class="{
          'dropdown-search__list-item_active': selectedOption === location.name,
        }"
        @click="selectOption(location.name as string)"
      >
        location: {{ location.name }} <br />
        dimension: {{ location.dimension }} <br />
        type: {{ location.type }} <br />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useLocationStore } from '@/stores/location';

// Пример списка значений
const options = ['Apple', 'Banana', 'Orange', 'Grapes', 'Mango', 'Pineapple'];

const location = useLocationStore();

const isExpanded = ref(false); // Управляет состоянием кнопки/поля ввода
const searchQuery = ref(''); // Строка поиска
const selectedOption = ref<string | null>(null); // Выбранное значение
// Ссылка на элемент input для автофокусировки
const searchInput = ref<HTMLInputElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);

// Логика фильтрации на основе ввода
const filteredOptions = computed(() => {
  if (!searchQuery.value) return location.locationData;

  const query = searchQuery.value.toLowerCase();
  return location.locationData.filter(location =>
    location.name.toLowerCase().includes(query)
  );
});

const toggleInput = async () => {
  if (!isExpanded.value && !location.locationData.length) {
    isExpanded.value = true;
    await location.getAllLocations();
  } else if (!isExpanded.value && location.locationData.length) {
    isExpanded.value = true;
  }
};

const collapseInput = () => {
  isExpanded.value = false;
};

// Выбор опции из списка
const selectOption = (option: string) => {
  selectedOption.value = option;
  collapseInput();
};

// Обработка клика вне компонента
const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    collapseInput();
  }
};

// Обработчик для поля ввода при потере фокуса
const handleBlur = (event: FocusEvent) => {
  // Используем setTimeout, чтобы дать время на выбор элемента списка перед закрытием
  setTimeout(() => {
    if (!dropdown.value?.contains(document.activeElement)) {
      collapseInput();
    }
  }, 100);
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
</script>

<style scoped lang="scss">
@use './DropdownSearch.scss';
</style>
