import type { Character, Info, QueryParams } from "./character.types";

export interface CharacterStoreState {
  charactersData: Character[];
  isCharsLoading: boolean;
  charsError: string | null;
  paginationInfo: Info | null;
}

export type GetCharsDataAction = (params?: QueryParams) => Promise<void>;