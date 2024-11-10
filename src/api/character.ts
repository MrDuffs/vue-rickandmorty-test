import { api } from './index';
import type { ApiClient } from '@/types/api.types';
import type { ApiResponse, QueryParams } from '@/types/character.types';

export const characterApi: ApiClient = {
  getCharacters: (params?: QueryParams) =>
    api.get<ApiResponse>('/character', { params }),
};
