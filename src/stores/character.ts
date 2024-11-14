import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { characterApi } from '@/api/character';
import type { Character, Info, CharacterStatus } from '@/types/character.types';
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

  const currentSearchParams = ref<Record<string, any>>({
    name: '',
  });

  const getCharsData: GetCharsDataAction = async params => {
    isCharsLoading.value = true;
    try {
      // const inputParamsString = JSON.stringify(params);
      // const storedParamsString = JSON.stringify(currentSearchParams.value);
      // console.log(params);
      // console.log(inputParamsString.trim());
      // console.log(storedParamsString.trim());
      // if (inputParamsString.trim() === storedParamsString.trim()) {
      //   return;
      // }

      const response = await characterApi.getCharacters({
        ...currentSearchParams.value,
        page: currentPage.value,
      });
      // console.log('getCharsData: ', response.data);

      const { info, results } = response.data;

      if (currentPage.value === 1) {
        charactersData.value = results;
      } else {
        charactersData.value = [...charactersData.value, ...results];
      }
      paginationInfo.value = info;

      // console.log('charactersData: ', charactersData.value);
      // console.log('paginationInfo: ', paginationInfo.value);
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
    await getCharsData(currentSearchParams.value);
  };

  const getCharsByName = async (name: string) => {
    // const inputName = name;
    // const currentName = name;
    if (name.trim() === currentSearchParams.value.name) {
      return;
    }
    if (name !== currentSearchParams.value.name) {
      charactersData.value = [];
      currentPage.value = 1;
      currentSearchParams.value = { name };
    }

    await getCharsData({ name });
  };

  const resetSearch = () => {
    charactersData.value = [];
    currentPage.value = 1;
    paginationInfo.value = null;
    currentSearchParams.value = {};
    charsError.value = null;
  };

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
    resetSearch,
    getCharsByName,

    // Computed
    hasMorePages,
    isAnyCharacters,
  };
});
