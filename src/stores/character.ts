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

  const getCharsData: GetCharsDataAction = async params => {
    try {
      isCharsLoading.value = true;
      const response = await characterApi.getCharacters({
        ...params,
        page: currentPage.value,
      });
      // console.log('getCharsData: ', response.data);

      const { info, results } = response.data;
      charactersData.value = [...charactersData.value, ...results];
      paginationInfo.value = info;

      console.log('charactersData: ', charactersData.value);
      console.log('paginationInfo: ', paginationInfo.value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        charsError.value = error.message;
      } else {
        charsError.value = 'An unknown error occurred';
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

  const hasMorePages = computed(() => {
    return paginationInfo.value
      ? currentPage.value < paginationInfo.value.pages
      : false;
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

    // Computed
    hasMorePages,
  };
});
