import { api } from './index';
import type { ApiClient, ApiResponse, QueryParams } from '@/types/api.types';
import type { Character } from '@/types/character.types';

export const characterApi: Pick<ApiClient, 'getCharacters'> = {
  getCharacters: (params?: QueryParams) =>
    api.get<ApiResponse<Character>>('/character', { params }),
};
