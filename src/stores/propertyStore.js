/*
 * Property Store - Real Estate Listings Management for FLOZ App
 *
 * Handles live property listings, MLS integration, and real estate data.
 * Integrates with multiple real estate APIs to show current properties for sale/rent.
 *
 * Key Features:
 * - Live MLS data integration
 * - Property search and filtering
 * - Integration with existing real estate businesses
 * - Property favorites and saved searches
 *
 * API Integration Guide:
 * 1. RentSpree API: Set VITE_RENTSPREE_API_KEY in .env
 * 2. RapidAPI: Set VITE_RAPIDAPI_KEY in .env
 * 3. Custom MLS: Set VITE_MLS_API_KEY in .env
 */

import { defineStore } from 'pinia'
import analytics from '@/utils/analytics'

export const usePropertyStore = defineStore('properties', {
  // ===== STATE DEFINITION =====
  state: () => ({
    properties: [],         // All property listings
    favorites: [],         // User's favorite properties
    searchFilters: {       // Current search filters
      priceMin: null,
      priceMax: null,
      bedrooms: null,
      bathrooms: null,
      propertyType: 'all',  // 'all', 'house', 'condo', 'land', 'commercial'
      waterfront: false,
      newConstruction: false
    },
    loading: false,
    lastUpdated: null,
    initialized: false,
    currentPage: 1,
    totalPages: 1,
    totalResults: 0
  }),

  // ===== COMPUTED GETTERS =====
  getters: {
    /**
     * Gets filtered properties based on current search criteria
     */
    getFilteredProperties: (state) => {
      return state.properties.filter(property => {
        // Price filter
        if (state.searchFilters.priceMin && property.price < state.searchFilters.priceMin) return false
        if (state.searchFilters.priceMax && property.price > state.searchFilters.priceMax) return false

        // Bedroom filter
        if (state.searchFilters.bedrooms && property.bedrooms < state.searchFilters.bedrooms) return false

        // Bathroom filter
        if (state.searchFilters.bathrooms && property.bathrooms < state.searchFilters.bathrooms) return false

        // Property type filter
        if (state.searchFilters.propertyType !== 'all' && property.type !== state.searchFilters.propertyType) return false

        // Waterfront filter
        if (state.searchFilters.waterfront && !property.waterfront) return false

        // New construction filter
        if (state.searchFilters.newConstruction && !property.newConstruction) return false

        return true
      })
    },

    /**
     * Gets properties by type (for sale, for rent, sold)
     */
    getPropertiesByStatus: (state) => (status) => {
      return state.properties.filter(property => property.status === status)
    },

    /**
     * Gets waterfront properties
     */
    getWaterfrontProperties: (state) => {
      return state.properties.filter(property => property.waterfront)
    },

    /**
     * Gets luxury properties (over $500K)
     */
    getLuxuryProperties: (state) => {
      return state.properties.filter(property => property.price >= 500000)
    },

    /**
     * Gets properties by price range
     */
    getPropertiesByPriceRange: (state) => (min, max) => {
      return state.properties.filter(property =>
        property.price >= min && property.price <= max
      )
    },

    /**
     * Gets featured properties (premium listings)
     */
    getFeaturedProperties: (state) => {
      return state.properties
        .filter(property => property.featured)
        .sort((a, b) => b.price - a.price)
        .slice(0, 6)
    }
  },

  // ===== ACTIONS =====
  actions: {
    /**
     * Loads all property data from APIs
     */
    async loadPropertyData() {
      if (this.initialized && this.properties.length > 0) {
        return
      }

      this.loading = true
      try {
        // Load from multiple sources in parallel
        const [mlsProperties, rentalProperties] = await Promise.all([
          this.fetchMLSProperties(),
          this.fetchRentalProperties()
        ])

        // Combine and deduplicate properties
        this.properties = [...mlsProperties, ...rentalProperties]
        this.removeDuplicateProperties()

        this.lastUpdated = new Date()
        this.initialized = true
        this.totalResults = this.properties.length
        this.totalPages = Math.ceil(this.totalResults / 20) // 20 per page

        console.log('✅ Property data loaded successfully', {
          properties: this.properties.length,
          forSale: this.getPropertiesByStatus('for-sale').length,
          forRent: this.getPropertiesByStatus('for-rent').length
        })
      } catch (error) {
        console.error('❌ Error loading property data:', error)
        if (window.$toast) {
          window.$toast.error('Failed to load property listings. Please try again.')
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetches MLS properties from real estate APIs
     */
    async fetchMLSProperties() {
      try {
        // Try RentSpree API first (if configured)
        const rentspreeKey = import.meta.env.VITE_RENTSPREE_API_KEY
        if (rentspreeKey) {
          return await this.fetchFromRentSpree(rentspreeKey)
        }

        // Try RapidAPI as fallback
        const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY
        if (rapidApiKey) {
          return await this.fetchFromRapidAPI(rapidApiKey)
        }

        // Use mock data if no API keys configured
        console.log('📝 Using mock property data (no API keys configured)')
        return this.getMockMLSProperties()

      } catch (error) {
        console.warn('MLS API fetch failed, using mock data:', error.message)
        return this.getMockMLSProperties()
      }
    },

    /**
     * Fetches properties from RentSpree API
     */
    async fetchFromRentSpree(apiKey) {
      const response = await fetch('https://api.rentspree.com/v1/properties/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: 'Lake of the Ozarks, MO',
          radius: 25, // miles
          status: ['active', 'pending'],
          propertyTypes: ['house', 'condo', 'townhouse', 'land'],
          limit: 50
        })
      })

      if (!response.ok) {
        throw new Error(`RentSpree API error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformRentSpreeData(data.properties || [])
    },

    /**
     * Fetches properties from RapidAPI
     */
    async fetchFromRapidAPI(apiKey) {
      const response = await fetch('https://realty-mole-property-api.p.rapidapi.com/properties', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
        },
        params: {
          city: 'Lake Ozark',
          state: 'MO',
          limit: 50
        }
      })

      if (!response.ok) {
        throw new Error(`RapidAPI error: ${response.status}`)
      }

      const data = await response.json()
      return this.transformRapidAPIData(data)
    },

    /**
     * Mock MLS properties for development/demo
     */
    getMockMLSProperties() {
      return [
        {
          id: 'mls_001',
          mlsNumber: 'LO12345678',
          address: '123 Waterfront Drive, Lake Ozark, MO 65049',
          price: 1250000,
          bedrooms: 4,
          bathrooms: 3.5,
          sqft: 3200,
          type: 'house',
          status: 'for-sale',
          waterfront: true,
          newConstruction: false,
          yearBuilt: 2018,
          lotSize: 0.75,
          description: 'Stunning lakefront home with panoramic views, private dock, and luxury finishes throughout.',
          images: [
            '/images/properties/waterfront-home-1.jpg',
            '/images/properties/waterfront-home-2.jpg',
            '/images/properties/waterfront-home-3.jpg'
          ],
          features: [
            'Private Dock',
            'Lake Views',
            'Gourmet Kitchen',
            'Master Suite with Balcony',
            'Walk-out Lower Level',
            'Covered Deck'
          ],
          listingAgent: {
            name: 'Sarah Johnson',
            company: 'Lake of the Ozarks Sotheby\'s International Realty',
            phone: '573-348-5555',
            email: 'sarah@lakeozarkssir.com'
          },
          coordinates: { lat: 38.0867, lng: -92.6345 },
          daysOnMarket: 45,
          featured: true,
          virtualTour: 'https://example.com/virtual-tour-1'
        },
        {
          id: 'mls_002',
          mlsNumber: 'LO87654321',
          address: '456 Cove Circle, Osage Beach, MO 65065',
          price: 875000,
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 2400,
          type: 'condo',
          status: 'for-sale',
          waterfront: true,
          newConstruction: true,
          yearBuilt: 2024,
          description: 'Brand new luxury condo with modern amenities and direct lake access.',
          images: [
            '/images/properties/luxury-condo-1.jpg',
            '/images/properties/luxury-condo-2.jpg'
          ],
          features: [
            'New Construction',
            'Shared Dock',
            'Pool & Fitness Center',
            'Granite Counters',
            'Stainless Appliances'
          ],
          listingAgent: {
            name: 'Mike Thompson',
            company: 'Premier Properties Lake Ozark',
            phone: '573-348-1234',
            email: 'mike@premierpropertieslake.com'
          },
          coordinates: { lat: 38.0901, lng: -92.6378 },
          daysOnMarket: 12,
          featured: true
        },
        {
          id: 'mls_003',
          mlsNumber: 'LO11223344',
          address: '789 Sunset Lane, Lake Ozark, MO 65049',
          price: 425000,
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1800,
          type: 'house',
          status: 'for-sale',
          waterfront: false,
          newConstruction: false,
          yearBuilt: 1995,
          lotSize: 0.5,
          description: 'Charming lake home with easy lake access and beautiful wooded lot.',
          images: [
            '/images/properties/lake-home-1.jpg'
          ],
          features: [
            'Wooded Lot',
            'Lake Access',
            'Updated Kitchen',
            'Deck'
          ],
          listingAgent: {
            name: 'Jennifer Davis',
            company: 'Lake Ozark Realty - Luxury Division',
            phone: '573-365-2200',
            email: 'jennifer@lakeozarkrealty.com'
          },
          coordinates: { lat: 38.0823, lng: -92.6412 },
          daysOnMarket: 78,
          featured: false
        },
        {
          id: 'mls_004',
          mlsNumber: 'LO99887766',
          address: 'Lot 15 Eagle Point Drive, Camdenton, MO 65020',
          price: 125000,
          bedrooms: 0,
          bathrooms: 0,
          sqft: 0,
          type: 'land',
          status: 'for-sale',
          waterfront: true,
          newConstruction: false,
          lotSize: 1.2,
          description: 'Prime waterfront lot with 150 feet of shoreline. Perfect for your dream home.',
          images: [
            '/images/properties/waterfront-lot-1.jpg'
          ],
          features: [
            '150ft Shoreline',
            'Deep Water',
            'Buildable',
            'Utilities Available'
          ],
          listingAgent: {
            name: 'Robert Wilson',
            company: 'Waterfront Estates Group',
            phone: '573-348-7300',
            email: 'robert@waterfrontestates.com'
          },
          coordinates: { lat: 38.0756, lng: -92.6489 },
          daysOnMarket: 120,
          featured: false
        }
      ]
    },

    /**
     * Fetches rental properties
     */
    async fetchRentalProperties() {
      // This would integrate with vacation rental APIs or property management systems
      return [
        {
          id: 'rental_001',
          address: '321 Resort Villa Lane, Osage Beach, MO 65065',
          price: 4500, // monthly rent
          bedrooms: 5,
          bathrooms: 4,
          sqft: 3500,
          type: 'house',
          status: 'for-rent',
          waterfront: true,
          description: 'Luxury vacation rental with private dock and resort amenities.',
          images: ['/images/properties/vacation-rental-1.jpg'],
          features: ['Private Dock', 'Pool', 'Hot Tub', 'Fully Furnished'],
          listingAgent: {
            name: 'Luxury Lake Rentals',
            company: 'Luxury Lake Rentals',
            phone: '573-348-8888',
            email: 'concierge@luxurylakezark.com'
          },
          coordinates: { lat: 38.0901, lng: -92.6378 },
          rentalType: 'vacation', // 'vacation', 'long-term'
          minStay: 7, // days
          featured: true
        }
      ]
    },

    /**
     * Transforms RentSpree API data to our format
     */
    transformRentSpreeData(properties) {
      return properties.map(prop => ({
        id: `rs_${prop.id}`,
        mlsNumber: prop.mlsNumber,
        address: prop.address.full,
        price: prop.listPrice,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        sqft: prop.livingArea,
        type: prop.propertyType.toLowerCase(),
        status: 'for-sale',
        waterfront: prop.features?.includes('waterfront') || false,
        yearBuilt: prop.yearBuilt,
        description: prop.remarks,
        images: prop.photos?.map(photo => photo.url) || [],
        coordinates: {
          lat: prop.location.latitude,
          lng: prop.location.longitude
        },
        daysOnMarket: prop.daysOnMarket,
        listingAgent: {
          name: prop.listingAgent?.name || 'Contact MLS',
          company: prop.listingOffice?.name || '',
          phone: prop.listingAgent?.phone || ''
        }
      }))
    },

    /**
     * Updates search filters and triggers new search
     */
    updateSearchFilters(newFilters) {
      this.searchFilters = { ...this.searchFilters, ...newFilters }
      analytics.track('property_search', { filters: this.searchFilters })
    },

    /**
     * Adds property to favorites
     */
    addToFavorites(propertyId) {
      if (!this.favorites.includes(propertyId)) {
        this.favorites.push(propertyId)
        analytics.track('property_favorite_add', { propertyId })
      }
    },

    /**
     * Removes property from favorites
     */
    removeFromFavorites(propertyId) {
      const index = this.favorites.indexOf(propertyId)
      if (index > -1) {
        this.favorites.splice(index, 1)
        analytics.track('property_favorite_remove', { propertyId })
      }
    },

    /**
     * Checks if property is favorited
     */
    isPropertyFavorite(propertyId) {
      return this.favorites.includes(propertyId)
    },

    /**
     * Removes duplicate properties based on MLS number or address
     */
    removeDuplicateProperties() {
      const seen = new Set()
      this.properties = this.properties.filter(property => {
        const key = property.mlsNumber || property.address.toLowerCase()
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })
    },

    /**
     * Refreshes property data
     */
    async refreshProperties() {
      this.initialized = false
      await this.loadPropertyData()
    }
  }
})