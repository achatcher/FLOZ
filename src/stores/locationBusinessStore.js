/**
 * Location-Aware Business Store - Scalable Business Data Management
 *
 * This enhanced business store integrates with the location configuration system
 * to provide flexible business categorization and data management that can be
 * easily adapted for different geographic markets and business types.
 *
 * Key Features:
 * - Dynamic business tier system based on location configuration
 * - Location-specific category management
 * - Flexible advertisement integration
 * - Multi-market data structure support
 * - Scalable filtering and sorting capabilities
 *
 * Usage Examples:
 * ```javascript
 * // In a Vue component:
 * import { useLocationBusinessStore } from '@/stores/locationBusinessStore'
 *
 * const businessStore = useLocationBusinessStore()
 *
 * // Get businesses for current location's categories
 * const restaurants = businessStore.getBusinessesByCategory('fine-dining')
 *
 * // Get location-specific subcategories
 * const subcategories = businessStore.getLocationSubcategories('fine-dining')
 *
 * // Get businesses by tier (using location config)
 * const signatureBusinesses = businessStore.getBusinessesByTier('signature')
 * ```
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getLocationConfig } from '@/config/locations'

export const useLocationBusinessStore = defineStore('locationBusiness', () => {
  // ===== REACTIVE STATE =====
  const businesses = ref([])       // All business listings for current location
  const categories = ref([])       // Location-specific category structure
  const ads = ref([])             // Advertisement data
  const loading = ref(false)      // Loading state for async operations
  const lastUpdated = ref(null)   // Timestamp of last data update
  const initialized = ref(false)  // Flag to track if data has been loaded
  const currentLocation = ref(getLocationConfig())

  // ===== LOCATION-AWARE GETTERS =====

  /**
   * Get Current Location's Business Categories
   * Returns categories configured for the current location
   */
  const locationCategories = computed(() => {
    return currentLocation.value.businessCategories.primary || []
  })

  /**
   * Get Current Location's Business Tiers
   * Returns tier configuration for the current location
   */
  const locationTiers = computed(() => {
    return currentLocation.value.businessCategories.tiers || {}
  })

  /**
   * Get Businesses by Location Category
   * Returns businesses filtered by location-specific category ID
   */
  const getBusinessesByCategory = computed(() => {
    return (categoryId) => {
      const categoryBusinesses = businesses.value.filter(
        business => business.category_id === categoryId
      )

      // Sort by tier priority using location configuration
      const tierPriority = {
        signature: 3,
        premier: 2,
        curated: 1
      }

      return categoryBusinesses.sort((a, b) => {
        const aTierPriority = tierPriority[a.listing_tier] || 0
        const bTierPriority = tierPriority[b.listing_tier] || 0

        if (aTierPriority !== bTierPriority) {
          return bTierPriority - aTierPriority // Higher tier first
        }

        // Secondary sort by name for same tier
        return a.name.localeCompare(b.name)
      })
    }
  })

  /**
   * Get Businesses by Subcategory
   * Handles location-specific subcategory filtering
   */
  const getBusinessesBySubcategory = computed(() => {
    return (categoryId, subcategoryName) => {
      return businesses.value.filter(business =>
        business.category_id === categoryId &&
        business.subcategory === subcategoryName
      ).sort((a, b) => {
        // Apply same tier-based sorting
        const tierPriority = { signature: 3, premier: 2, curated: 1 }
        const aTierPriority = tierPriority[a.listing_tier] || 0
        const bTierPriority = tierPriority[b.listing_tier] || 0
        return bTierPriority - aTierPriority
      })
    }
  })

  /**
   * Get Businesses by Tier
   * Returns all businesses of a specific tier across categories
   */
  const getBusinessesByTier = computed(() => {
    return (tier) => {
      return businesses.value.filter(business => business.listing_tier === tier)
    }
  })

  /**
   * Get Location-Specific Subcategories
   * Returns subcategories for a category from location configuration
   */
  const getLocationSubcategories = computed(() => {
    return (categoryId) => {
      const category = locationCategories.value.find(cat => cat.id === categoryId)
      return category?.subcategories || []
    }
  })

  /**
   * Get Category Display Information
   * Returns complete category info from location configuration
   */
  const getCategoryInfo = computed(() => {
    return (categoryId) => {
      return locationCategories.value.find(cat => cat.id === categoryId)
    }
  })

  /**
   * Get Featured Businesses
   * Returns businesses marked as featured across all categories
   */
  const featuredBusinesses = computed(() => {
    return businesses.value.filter(business => business.featured === true)
  })

  /**
   * Get Signature Businesses
   * Returns all signature tier businesses for hero displays
   */
  const signatureBusinesses = computed(() => {
    return getBusinessesByTier.value('signature')
  })

  /**
   * Search Businesses
   * Flexible search across name, category, description, and location data
   */
  const searchBusinesses = computed(() => {
    return (query) => {
      if (!query || query.length < 2) return []

      const searchTerm = query.toLowerCase().trim()

      return businesses.value.filter(business => {
        // Search in business name
        if (business.name?.toLowerCase().includes(searchTerm)) return true

        // Search in business description
        if (business.description?.toLowerCase().includes(searchTerm)) return true

        // Search in category name (using location config)
        const categoryInfo = getCategoryInfo.value(business.category_id)
        if (categoryInfo?.name?.toLowerCase().includes(searchTerm)) return true

        // Search in subcategory
        if (business.subcategory?.toLowerCase().includes(searchTerm)) return true

        // Search in address/location
        if (business.address?.toLowerCase().includes(searchTerm)) return true

        return false
      })
    }
  })

  // ===== ADVERTISEMENT MANAGEMENT =====

  /**
   * Get Interstitial Advertisement
   * Returns location-specific interstitial ad for category
   */
  const getInterstitialAd = computed(() => {
    return (categoryId) => {
      // Find ads specific to this category and location
      const categoryAds = ads.value.filter(ad =>
        ad.type === 'interstitial' &&
        ad.category_id === categoryId &&
        ad.location_id === currentLocation.value.id
      )

      // Return random ad if multiple available
      if (categoryAds.length > 0) {
        return categoryAds[Math.floor(Math.random() * categoryAds.length)]
      }

      // Fallback to generic interstitial for location
      const genericAds = ads.value.filter(ad =>
        ad.type === 'interstitial' &&
        !ad.category_id &&
        ad.location_id === currentLocation.value.id
      )

      return genericAds.length > 0 ? genericAds[0] : null
    }
  })

  /**
   * Get Banner Advertisements
   * Returns banner ads for specific placements
   */
  const getBannerAds = computed(() => {
    return (placement = 'home') => {
      return ads.value.filter(ad =>
        ad.type === 'banner' &&
        ad.placement === placement &&
        ad.location_id === currentLocation.value.id
      )
    }
  })

  // ===== ACTIONS =====

  /**
   * Load Location-Specific Business Data
   * Loads businesses and categories for the current location
   */
  const loadData = async () => {
    if (initialized.value) return

    loading.value = true

    try {
      // In a real application, this would fetch from an API
      // For now, we'll use the existing JSON structure but enhance it
      const businessesResponse = await import('@/assets/data/businesses.json')
      const adsResponse = await import('@/assets/data/ads.json').catch(() => ({ default: [] }))

      // Process businesses to match location categories
      const locationBusinesses = processBusinessesForLocation(
        businessesResponse.default,
        currentLocation.value
      )

      businesses.value = locationBusinesses
      ads.value = adsResponse.default || []
      lastUpdated.value = new Date()
      initialized.value = true

      console.log(`✅ Loaded ${businesses.value.length} businesses for ${currentLocation.value.name}`)

    } catch (error) {
      console.error('Failed to load business data:', error)
      businesses.value = []
      ads.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Refresh Location Configuration
   * Updates store when location configuration changes
   */
  const refreshLocation = () => {
    currentLocation.value = getLocationConfig()
    // Optionally reload data for new location
    if (initialized.value) {
      initialized.value = false
      loadData()
    }
  }

  /**
   * Add New Business
   * Adds a business to the current location's directory
   */
  const addBusiness = (businessData) => {
    const newBusiness = {
      ...businessData,
      id: businesses.value.length + 1,
      location_id: currentLocation.value.id,
      created_at: new Date().toISOString()
    }

    businesses.value.push(newBusiness)
    return newBusiness
  }

  /**
   * Update Business
   * Updates existing business data
   */
  const updateBusiness = (businessId, updates) => {
    const index = businesses.value.findIndex(b => b.id === businessId)
    if (index !== -1) {
      businesses.value[index] = {
        ...businesses.value[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return businesses.value[index]
    }
    return null
  }

  /**
   * Delete Business
   * Removes business from directory
   */
  const deleteBusiness = (businessId) => {
    const index = businesses.value.findIndex(b => b.id === businessId)
    if (index !== -1) {
      const deletedBusiness = businesses.value.splice(index, 1)[0]
      return deletedBusiness
    }
    return null
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Process Businesses for Current Location
   * Maps existing business data to location-specific categories
   */
  function processBusinessesForLocation(rawBusinesses, locationConfig) {
    return rawBusinesses.map(business => {
      // Map legacy category names to new location-specific category IDs
      const categoryMapping = createCategoryMapping(locationConfig)
      const mappedCategoryId = categoryMapping[business.category] || business.category

      return {
        ...business,
        category_id: mappedCategoryId,
        location_id: locationConfig.id,
        // Ensure all businesses have required fields
        listing_tier: business.listing_tier || 'curated',
        featured: business.featured || false
      }
    })
  }

  /**
   * Create Category Mapping
   * Maps legacy category names to location-specific IDs
   */
  function createCategoryMapping(locationConfig) {
    const mapping = {}

    // Common mappings for different location types
    const commonMappings = {
      'Dining Out': 'fine-dining',
      'Fine Dining': 'fine-dining',
      'Restaurants': 'fine-dining',
      'Private Clubs': 'private-clubs',
      'Golf Clubs': 'private-clubs',
      'Wellness & Spa': 'wellness-spa',
      'Health & Beauty': 'wellness-spa',
      'Luxury Shopping': 'luxury-retail',
      'Shopping': 'luxury-retail',
      'Professional Services': 'professional-services',
      'Business Services': 'professional-services'
    }

    return commonMappings
  }

  // ===== RETURN STORE API =====
  return {
    // State
    businesses: readonly(businesses),
    categories: readonly(categories),
    ads: readonly(ads),
    loading: readonly(loading),
    lastUpdated: readonly(lastUpdated),
    initialized: readonly(initialized),
    currentLocation: readonly(currentLocation),

    // Location-aware getters
    locationCategories,
    locationTiers,
    getBusinessesByCategory,
    getBusinessesBySubcategory,
    getBusinessesByTier,
    getLocationSubcategories,
    getCategoryInfo,
    featuredBusinesses,
    signatureBusinesses,
    searchBusinesses,

    // Advertisement getters
    getInterstitialAd,
    getBannerAds,

    // Actions
    loadData,
    refreshLocation,
    addBusiness,
    updateBusiness,
    deleteBusiness
  }
})

// Import readonly for store API
import { readonly } from 'vue'