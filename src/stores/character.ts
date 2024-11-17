import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { characterApi } from '@/api/character';
import type { Info } from '@/types/api.types';
import type { Character } from '@/types/character.types';
import type {
  CharacterStoreState,
  GetCharsDataAction,
} from '@/types/store.types';

export const useCharacterStore = defineStore('character', () => {
  const charactersData = ref<Character[]>([]);
  const isCharsLoading = ref(false);
  const charsError = ref<string | null>(null);
  const paginationInfo = ref<Info | null>(null);
  const currentPage = ref(1);

  const currentSearchParam = ref('');

  const getCharsData: GetCharsDataAction = async params => {
    isCharsLoading.value = true;
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
      if (error instanceof Error) {
        charsError.value = error.message;
      } else {
        charsError.value = 'An unknown error occurred';
      }
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
    if (name.trim() === currentSearchParam.value) {
      return;
    }
    if (name !== currentSearchParam.value) {
      charactersData.value = [];
      currentPage.value = 1;
      currentSearchParam.value = name;
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
        return;
      }

      const response = await characterApi.getCharsFromLocation(charsArr);

      const results = response.data;

      charactersData.value = Array.isArray(results) ? results : [results];
    } catch (error) {
      if (error instanceof Error) {
        charsError.value = error.message;
      } else {
        charsError.value = 'An unknown error occurred';
      }
      // Сбрасываем данные при ошибке
      if (currentPage.value === 1) {
        charactersData.value = [];
        paginationInfo.value = null;
      }
    } finally {
      isCharsLoading.value = false;
    }
  };

  // const resetSearch = () => {
  //   charactersData.value = [];
  //   currentPage.value = 1;
  //   paginationInfo.value = null;
  //   currentSearchParams.value = {};
  //   charsError.value = null;
  // };

  const hasMorePages = computed(() => {
    return paginationInfo.value
      ? currentPage.value < paginationInfo.value.pages
      : false;
  });

  const isAnyCharacters = computed(() => {
    return charactersData.value.length;
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
  };
});
