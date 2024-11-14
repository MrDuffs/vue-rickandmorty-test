import { api } from './index';
import type { ApiClient } from '@/types/api.types';

export const locationApi: Pick<ApiClient, 'getLocations'> = {
  getLocations: () => api.get('/location'),
};