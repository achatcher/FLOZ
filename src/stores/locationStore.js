// stores/locationStore.js
import { defineStore } from 'pinia'
import { getCurrentLocation, calculateDistance } from '@/utils/helpers'
import { GREENVILLE_CENTER } from '@/utils/constants'

export const useLocationStore = defineStore('location', {
  state: () => ({
    userLocation: null,
    permissionGranted: false,
    loading: false,
    error: null
  }),

  getters: {
    hasLocation: (state) => state.userLocation !== null,
    
    // Calculate distance from user to a business
    distanceTo: (state) => (businessLat, businessLng) => {
      if (!state.userLocation) return null
      return calculateDistance(
        state.userLocation.lat,
        state.userLocation.lng,
        businessLat,
        businessLng
      )
    }
  },

  actions: {
    async requestLocation() {
      this.loading = true
      this.error = null
      
      try {
        const location = await getCurrentLocation()
        this.userLocation = location
        this.permissionGranted = true
        return location
      } catch (error) {
        this.error = error.message
        this.permissionGranted = false
        // Fallback to Greenville center
        this.userLocation = GREENVILLE_CENTER
        throw error
      } finally {
        this.loading = false
      }
    },

    setLocation(lat, lng) {
      this.userLocation = { lat, lng }
    },

    clearLocation() {
      this.userLocation = null
      this.permissionGranted = false
      this.error = null
    }
  }
})
