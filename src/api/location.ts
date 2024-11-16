import { api } from './index';
import type { ApiClient, ApiResponse, QueryParams } from '@/types/api.types';
import type { Location } from '@/types/location.types';

export const locationApi: Pick<ApiClient, 'getLocations'> = {
  getLocations: (params?: QueryParams) =>
    api.get<ApiResponse<Location>>('/location', { params }),
};
