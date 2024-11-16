import type { AxiosResponse } from 'axios';
import type { Character } from './character.types';
import type { Location } from './location.types';

export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface QueryParams {
  page?: number;
  name?: string;
}

export interface ApiResponse<T> {
  info: Info;
  results: T[];
}

export interface ApiClient {
  getCharacters: (
    params?: QueryParams
  ) => Promise<AxiosResponse<ApiResponse<Character>>>;
  getLocations: (
    params?: QueryParams
  ) => Promise<AxiosResponse<ApiResponse<Location>>>;
}
