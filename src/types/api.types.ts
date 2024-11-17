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

export interface CharacterApiClient {
  getCharacters: (
    params?: QueryParams
  ) => Promise<AxiosResponse<ApiResponse<Character>>>;
  getCharsFromLocation: (
    charsArr: string[]
  ) => Promise<AxiosResponse<Character[] | Character>>;
}

export interface LocationApiClient {
  getLocations: (
    params?: QueryParams
  ) => Promise<AxiosResponse<ApiResponse<Location>>>;
}
