import { ref, computed, reactive } from 'vue'

// Global app configuration state
const appConfig = ref(null)
const currentLocation = ref('greenville') // Default location
const isLoading = ref(false)
const error = ref(null)

// Cached data for different locations
const locationCache = reactive({})

/**
 * Composable for managing dynamic app configuration
 * Allows the entire app to be driven by JSON configuration files
 */
export function useAppConfig() {

  /**
   * Load the master app configuration
   */
  const loadAppConfig = async () => {
    if (appConfig.value) return appConfig.value

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/config/app-config.json')
      if (!response.ok) {
        throw new Error(`Failed to load app config: ${response.status}`)
      }

      const config = await response.json()
      appConfig.value = config

      console.log('✅ App configuration loaded:', config.app.name)
      return config
    } catch (err) {
      error.value = `Failed to load app configuration: ${err.message}`
      console.error('❌ App config error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load location-specific data (businesses, events)
   */
  const loadLocationData = async (location = currentLocation.value) => {
    if (locationCache[location]) {
      return locationCache[location]
    }

    isLoading.value = true
    error.value = null

    try {
      // Load businesses and events in parallel
      const [businessesResponse, eventsResponse] = await Promise.all([
        fetch(`/config/locations/${location}/businesses.json`),
        fetch(`/config/locations/${location}/events.json`)
      ])

      if (!businessesResponse.ok || !eventsResponse.ok) {
        throw new Error(`Failed to load location data for ${location}`)
      }

      const [businessesData, eventsData] = await Promise.all([
        businessesResponse.json(),
        eventsResponse.json()
      ])

      // Handle both flat array and tier-based business structures
      let businesses = []
      if (Array.isArray(businessesData.businesses)) {
        // Legacy flat array structure
        businesses = businessesData.businesses
      } else if (businessesData.businesses && typeof businessesData.businesses === 'object') {
        // New tier-based structure - flatten it
        const tiers = ['signature', 'premier', 'curated']
        businesses = tiers.reduce((acc, tier) => {
          if (businessesData.businesses[tier] && Array.isArray(businessesData.businesses[tier])) {
            return acc.concat(businessesData.businesses[tier])
          }
          return acc
        }, [])
        console.log(`✅ Flattened tier-based business structure: ${businesses.length} businesses`)
      }

      const locationData = {
        businesses: businesses,
        events: eventsData.events || [],
        lastUpdated: Math.max(
          new Date(businessesData.lastUpdated || 0).getTime(),
          new Date(eventsData.lastUpdated || 0).getTime()
        )
      }

      // Cache the data
      locationCache[location] = locationData

      console.log(`✅ Location data loaded for ${location}:`, {
        businesses: locationData.businesses.length,
        events: locationData.events.length
      })

      return locationData
    } catch (err) {
      error.value = `Failed to load location data: ${err.message}`
      console.error('❌ Location data error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Switch to a different location
   */
  const setLocation = async (newLocation) => {
    // Check if data is already loaded for this location
    if (newLocation === currentLocation.value && locationCache[newLocation]) {
      console.log(`✅ Location ${newLocation} already loaded`)
      return
    }

    console.log(`🔄 Switching location from ${currentLocation.value} to ${newLocation}`)
    currentLocation.value = newLocation

    // Load data for the new location
    await loadLocationData(newLocation)
  }

  /**
   * Get app information
   */
  const getAppInfo = computed(() => {
    if (!appConfig.value) return null
    return appConfig.value.app
  })

  /**
   * Get navigation categories
   */
  const getCategories = computed(() => {
    if (!appConfig.value) return []
    return appConfig.value.navigation.categories.sort((a, b) => a.order - b.order)
  })

  /**
   * Get featured categories for home page
   */
  const getFeaturedCategories = computed(() => {
    return getCategories.value.filter(cat => cat.featured)
  })

  /**
   * Get category by ID
   */
  const getCategoryById = (categoryId) => {
    return getCategories.value.find(cat => cat.id === categoryId)
  }

  /**
   * Get page configuration
   */
  const getPageConfig = (pageName) => {
    if (!appConfig.value) return null
    return appConfig.value.pages[pageName] || null
  }

  /**
   * Get tier configuration
   */
  const getTierConfig = (tierName) => {
    if (!appConfig.value) return null
    return appConfig.value.tiers[tierName] || null
  }

  /**
   * Get current location businesses
   */
  const getCurrentBusinesses = computed(() => {
    const data = locationCache[currentLocation.value]
    return data ? data.businesses : []
  })

  /**
   * Get current location events
   */
  const getCurrentEvents = computed(() => {
    const data = locationCache[currentLocation.value]
    return data ? data.events : []
  })

  /**
   * Get businesses by category
   */
  const getBusinessesByCategory = (categoryName) => {
    return getCurrentBusinesses.value.filter(business => {
      // Handle category mapping
      const category = getCategoryById(categoryName.toLowerCase().replace(/\s+/g, '-'))
      const mappedCategory = category?.mappedCategory || categoryName
      return business.category === mappedCategory
    })
  }

  /**
   * Get businesses by tier
   */
  const getBusinessesByTier = (tierName) => {
    return getCurrentBusinesses.value.filter(business => business.tier === tierName)
  }

  /**
   * Get businesses organized by tier for easy management
   * Returns an object with signature, premier, and curated arrays
   */
  const getBusinessesByTierOrganized = computed(() => {
    const businesses = getCurrentBusinesses.value
    return {
      signature: businesses.filter(b => b.tier === 'signature'),
      premier: businesses.filter(b => b.tier === 'premier'),
      curated: businesses.filter(b => b.tier === 'curated')
    }
  })

  /**
   * Get tier statistics for business management
   */
  const getTierStatistics = computed(() => {
    const organized = getBusinessesByTierOrganized.value
    return {
      signature: {
        count: organized.signature.length,
        businesses: organized.signature
      },
      premier: {
        count: organized.premier.length,
        businesses: organized.premier
      },
      curated: {
        count: organized.curated.length,
        businesses: organized.curated
      },
      total: getCurrentBusinesses.value.length
    }
  })

  /**
   * Get events by tier
   */
  const getEventsByTier = (tierName) => {
    return getCurrentEvents.value.filter(event => event.tier === tierName)
  }

  /**
   * Check if a feature is enabled
   */
  const isFeatureEnabled = (featureName) => {
    if (!appConfig.value) return false
    return appConfig.value.features[featureName] || false
  }

  /**
   * Get branding configuration
   */
  const getBranding = computed(() => {
    if (!appConfig.value) return null
    return appConfig.value.app.branding
  })

  /**
   * Initialize the app with configuration
   */
  const initializeApp = async (location = 'greenville') => {
    try {
      console.log('🚀 Initializing app with dynamic configuration...')

      // Load app config first
      await loadAppConfig()

      // Set initial location and load its data
      await setLocation(location)

      console.log('✅ App initialization complete')
      return true
    } catch (err) {
      console.error('❌ App initialization failed:', err)
      return false
    }
  }

  return {
    // State
    appConfig: computed(() => appConfig.value),
    currentLocation: computed(() => currentLocation.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Methods
    loadAppConfig,
    loadLocationData,
    setLocation,
    initializeApp,

    // Getters
    getAppInfo,
    getCategories,
    getFeaturedCategories,
    getCategoryById,
    getPageConfig,
    getTierConfig,
    getCurrentBusinesses,
    getCurrentEvents,
    getBusinessesByCategory,
    getBusinessesByTier,
    getBusinessesByTierOrganized,
    getTierStatistics,
    getEventsByTier,
    isFeatureEnabled,
    getBranding
  }
}