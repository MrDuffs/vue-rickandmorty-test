<template>
  <form class="search" @submit.prevent="handleSubmit">
    <div class="search__input-wrapper">
      <ClSearchMagnifyingGlass class="search__search-icon" />
      <input
        type="text"
        class="search__input"
        :value="modelValue"
        @input="updateValue"
        :placeholder="placeholder"
        ref="inputRef"
      />
      <Transition name="fade">
        <button
          v-if="modelValue"
          type="button"
          class="search__clear-btn"
          @click="clearInput"
          aria-label="Clear search"
        >
          <MdRoundClear class="search__clear-icon" />
        </button>
      </Transition>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';

interface SearchProps {
  modelValue: string;
  placeholder?: string;
}

interface SearchEmits {
  (e: 'update:modelValue', value: string): void;
  (e: 'submit', value: string): void;
}

const props = withDefaults(defineProps<SearchProps>(), {
  placeholder: 'Search...',
});

const emit = defineEmits<SearchEmits>();

const inputRef = ref<HTMLInputElement | null>(null);

const updateValue = useDebounceFn((event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}, 800);

const clearInput = () => {
  emit('update:modelValue', '');
  inputRef.value?.focus();
};

const handleSubmit = () => {
  if (props.modelValue.trim()) {
    emit('submit', props.modelValue);
  }
};
</script>

<style scoped lang="scss">
@use './Search.scss';
</style>
