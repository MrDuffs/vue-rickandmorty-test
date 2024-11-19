import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { locationApi } from '@/api/location';
import type { Info } from '@/types/api.types';
import type { Location } from '@/types/location.types';
import { AxiosError } from 'axios';

export const useLocationStore = defineStore('location', () => {
  const locationData = ref<Location[]>([]);
  const isLocationLoading = ref(false);
  const locationError = ref<string | null>(null);
  const paginationInfo = ref<Info | null>(null);

  const currentPage = ref(1);
  const currentSearchParam = ref('');

  const getLocations = async () => {
    isLocationLoading.value = true;
    locationError.value = null;
    try {
      const response = await locationApi.getLocations({
        name: currentSearchParam.value.length
          ? currentSearchParam.value
          : undefined,
        page: currentPage.value,
      });

      const { info, results } = response.data;

      if (currentPage.value === 1) {
        locationData.value = results;
      } else {
        locationData.value = [...locationData.value, ...results];
      }
      paginationInfo.value = info;
    } catch (error) {
      handleError(error as AxiosError | Error | string);
    } finally {
      isLocationLoading.value = false;
    }
  };

  const loadMoreLocations = async () => {
    if (!hasMorePages.value || isLocationLoading.value) return;

    currentPage.value += 1;
    await getLocations();
  };

  const getLocationByName = async (name: string) => {
    const trimName = name.trim();
    if (trimName === currentSearchParam.value) {
      return;
    }
    if (trimName !== currentSearchParam.value) {
      locationData.value = [];
      currentPage.value = 1;
      currentSearchParam.value = trimName;
    }

    await getLocations();
  };

  const handleError = (err: AxiosError | Error | string) => {
    if (err instanceof AxiosError) {
      locationError.value = err.response?.data.error;
    } else if (err instanceof Error) {
      locationError.value = err.message;
    } else {
      locationError.value = 'An unknown error occurred';
    }
  };

  const hasMorePages = computed(() => {
    return paginationInfo.value
      ? currentPage.value < paginationInfo.value.pages
      : false;
  });

  const computedMessage = computed(() => {
    return locationError.value === 'There is nothing here'
      ? 'There is no such location'
      : false;
  });

  return {
    // State
    locationData,
    isLocationLoading,

    // Actions
    getLocations,
    loadMoreLocations,
    getLocationByName,

    // Computed
    computedMessage,
  };
});
