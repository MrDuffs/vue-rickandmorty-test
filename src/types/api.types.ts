import type { AxiosResponse } from 'axios';
import type { ApiResponse, QueryParams } from './character.types';

export interface ApiClient {
  getCharacters: (params?: QueryParams) => Promise<AxiosResponse<ApiResponse>>;
}