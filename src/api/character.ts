import { api } from './index';
import type {
  CharacterApiClient,
  ApiResponse,
  QueryParams,
} from '@/types/api.types';
import type { Character } from '@/types/character.types';

export const characterApi: CharacterApiClient = {
  getCharacters: (params?: QueryParams) =>
    api.get<ApiResponse<Character>>('/character', { params }),
  getCharsFromLocation: (charsArr: string[]) =>
    api.get<Character[] | Character>(`/character/${charsArr}`),
};
