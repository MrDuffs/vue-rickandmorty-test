import { api } from './index';
import type { LocationApiClient, ApiResponse, QueryParams } from '@/types/api.types';
import type { Location } from '@/types/location.types';

export const locationApi: LocationApiClient = {
  getLocations: (params?: QueryParams) =>
    api.get<ApiResponse<Location>>('/location', { params }),
};
