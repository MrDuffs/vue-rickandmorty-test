import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { characterApi } from '@/api/character';
import type { Info } from '@/types/api.types';
import type { Character } from '@/types/character.types';
import type {
  CharacterStoreState,
  GetCharsDataAction,
} from '@/types/store.types';
import { AxiosError } from 'axios';

export const useCharacterStore = defineStore('character', () => {
  const charactersData = ref<Character[]>([]);
  const isCharsLoading = ref(false);
  const charsError = ref<string | null>(null);
  const paginationInfo = ref<Info | null>(null);
  const currentPage = ref(1);

  const currentSearchParam = ref('');

  const getCharsData = async () => {
    isCharsLoading.value = true;
    charsError.value = null;
    try {
      const response = await characterApi.getCharacters({
        name: currentSearchParam.value.length
          ? currentSearchParam.value
          : undefined,
        page: currentPage.value,
      });

      const { info, results } = response.data;

      if (currentPage.value === 1) {
        charactersData.value = results;
      } else {
        charactersData.value = [...charactersData.value, ...results];
      }
      paginationInfo.value = info;
    } catch (error) {
      handleError(error as AxiosError | Error | string);
      // Сбрасываем данные при ошибке
      if (currentPage.value === 1) {
        charactersData.value = [];
        paginationInfo.value = null;
      }
    } finally {
      isCharsLoading.value = false;
    }
  };

  const loadMoreCharacters = async () => {
    if (!hasMorePages.value || isCharsLoading.value) return;

    currentPage.value += 1;
    await getCharsData();
  };

  const getCharsByName = async (name: string) => {
    const trimName = name.trim();
    if (trimName === currentSearchParam.value) {
      return;
    }
    if (trimName !== currentSearchParam.value) {
      currentPage.value = 1;
      currentSearchParam.value = trimName;
    }

    await getCharsData();
  };

  const getCharsFromLocation = async (charsArr: string[]) => {
    isCharsLoading.value = true;
    paginationInfo.value = null;
    currentSearchParam.value = '';
    charsError.value = null;
    try {
      if (!charsArr.length) {
        charactersData.value = [];
        charsError.value = 'No characters in this location';
        return;
      }

      const response = await characterApi.getCharsFromLocation(charsArr);

      const results = response.data;

      charactersData.value = Array.isArray(results) ? results : [results];
    } catch (error) {
      handleError(error as AxiosError | Error | string);
      // Сбрасываем данные при ошибке
      if (currentPage.value === 1) {
        charactersData.value = [];
        paginationInfo.value = null;
      }
    } finally {
      isCharsLoading.value = false;
    }
  };

  const handleError = (err: AxiosError | Error | string) => {
    if (err instanceof AxiosError) {
      charsError.value = err.response?.data.error;
    } else if (err instanceof Error) {
      charsError.value = err.message;
    } else {
      charsError.value = 'An unknown error occurred';
    }
  };

  const hasMorePages = computed(() => {
    return paginationInfo.value
      ? currentPage.value < paginationInfo.value.pages
      : false;
  });

  const isAnyCharacters = computed(() => {
    return charactersData.value.length;
  });

  const computedMessage = computed(() => {
    if (!charsError.value && !hasMorePages.value) {
      return 'No more characters'
    }
    if (charsError.value === 'There is nothing here') {
      return 'There is no such character(s)';
    }
    if (charsError.value) {
      return charsError.value;
    }
    return false;
  });

  return {
    // State
    charactersData,
    isCharsLoading,
    charsError,
    paginationInfo,
    currentPage,

    // Actions
    getCharsData,
    loadMoreCharacters,
    // resetSearch,
    getCharsByName,
    getCharsFromLocation,

    // Computed
    hasMorePages,
    isAnyCharacters,
    computedMessage,
  };
});
