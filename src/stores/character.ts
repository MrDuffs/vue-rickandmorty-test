import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { characterApi } from '@/api/character';
// import type {
//   Character,
//   CharacterStatus,
//   QueryParams,
//   ApiResponse,
// } from '@/types/character.types';
import type {
  CharacterStoreState,
  GetCharsDataAction,
} from '@/types/store.types';

export const useCharacterStore = defineStore('character', () => {
  const state = ref<CharacterStoreState>({
    charactersData: [],
    isCharsLoading: false,
    charsError: null,
    paginationInfo: null,
  });

  const getCharsData: GetCharsDataAction = async (params) => {
    try {
      state.value.isCharsLoading = true;
      const response = await characterApi.getCharacters(params);
      console.log('getCharsData: ', response.data);

      const { info, results } = response.data;
      state.value.charactersData = results;
      state.value.paginationInfo = info;

      console.log('charactersData: ', state.value.charactersData);
      console.log('paginationInfo: ', state.value.paginationInfo);
      

    } catch (error: unknown) {
      if (error instanceof Error) {
        state.value.charsError = error.message;
      } else {
        state.value.charsError = 'An unknown error occurred';
      }
    } finally {
      state.value.isCharsLoading = false;
    }
  };

  return {
    // State
    charactersData: state.value.charactersData,
    isCharsLoading: state.value.isCharsLoading,
    charsError: state.value.charsError,
    paginationInfo: state.value.paginationInfo,

    // Actions
    getCharsData,
  };
});
