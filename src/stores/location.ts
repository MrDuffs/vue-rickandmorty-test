import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { locationApi } from '@/api/location';

export const useLocationStore = defineStore('location', () => {
  const locationData = ref([]);
  const isLocationLoading = ref(false);
  const locationError = ref<string | null>(null);
  const paginationInfo = ref<{} | null>(null);
  const currentPage = ref(1);
  
  const getAllLocations = async () => {
    isLocationLoading.value = true;
    try {
      const response = await locationApi.getLocations();

      const { info, results } = response.data;
      locationData.value = results;
      paginationInfo.value = info;
      console.log(paginationInfo.value);
      console.log(locationData.value);
      
    } catch (error) {
      if (error instanceof Error) {
        locationError.value = error.message;
      } else {
        locationError.value = 'An unknown error occurred';
      }
    } finally {
      isLocationLoading.value = false;
    }
  };


  return {
    // State
    locationData,
    isLocationLoading,

    // Actions
    getAllLocations,
  };
});
