/*
 * Business Store - Central Data Management for FLOZ App
 *
 * Handles all business-related data including businesses, categories, and advertisements.
 * Uses Pinia for reactive state management with computed getters for efficient data access.
 *
 * Key Features:
 * - Three-tier business listing system (Signature, Premier, Curated)
 * - Category and subcategory management
 * - Advertisement integration system
 * - Sorting and filtering capabilities
 *
 * Usage Examples:
 *
 * // In a Vue component:
 * import { useBusinessStore } from '@/stores/businessStore'
 *
 * const businessStore = useBusinessStore()
 *
 * // Get all businesses in a category
 * const diningBusinesses = businessStore.getBusinessesByCategory('Dining Out')
 *
 * // Get businesses in a specific subcategory
 * const waterfrontDining = businessStore.getBusinessesBySubcategory('Dining Out', 'Waterfront Dining')
 *
 * // Get subcategories for a category
 * const subcategories = businessStore.getSubcategoriesForCategory('Dining Out')
 *
 * // Get advertisement for interstitial
 * const ad = businessStore.getInterstitialAd('Dining Out')
 */

// stores/businessStore.js
import { defineStore } from 'pinia'

export const useBusinessStore = defineStore('business', {
  // ===== STATE DEFINITION =====
  state: () => ({
    businesses: [],      // All business listings with tier information
    categories: [],      // Category structure with subcategories
    ads: [],            // Advertisement data for interstitials and banners
    loading: false,     // Loading state for async operations
    lastUpdated: null,  // Timestamp of last data update
    initialized: false  // Flag to track if data has been loaded
  }),

  // ===== COMPUTED GETTERS =====
  getters: {
    /**
     * Gets all businesses for a specific category, sorted by listing tier
     *
     * @param {string} categoryName - Name of the category (e.g., "Dining Out")
     * @returns {Array} Sorted array of businesses (Signature → Premier → Curated)
     *
     * Usage: businessStore.getBusinessesByCategory('Dining Out')
     */
    getBusinessesByCategory: (state) => (categoryName) => {
      console.log('🔍 Searching for category:', categoryName)
      console.log('📊 Total businesses in store:', state.businesses.length)
      console.log('📋 Available categories:', [...new Set(state.businesses.map(b => b.category))])

      const matchedBusinesses = state.businesses
        .filter(b => {
          const match = b.category.toLowerCase() === categoryName.toLowerCase()
          if (!match) {
            console.log(`❌ No match: "${b.category}" vs "${categoryName}"`)
          } else {
            console.log(`✅ Match found: ${b.name} (${b.category})`)
          }
          return match
        })
        .sort((a, b) => {
          const tierOrder = { signature: 0, premier: 1, curated: 2 }
          return tierOrder[a.listing_tier] - tierOrder[b.listing_tier]
        })

      console.log('🎯 Matched businesses:', matchedBusinesses.length)
      return matchedBusinesses
    },

    /**
     * Gets businesses for a specific subcategory, sorted by listing tier
     *
     * @param {string} categoryName - Main category name
     * @param {string} subcategoryName - Subcategory name (e.g., "Waterfront Dining")
     * @returns {Array} Filtered and sorted businesses for the subcategory
     *
     * Usage: businessStore.getBusinessesBySubcategory('Dining Out', 'Waterfront Dining')
     */
    getBusinessesBySubcategory: (state) => (categoryName, subcategoryName) => {
      return state.businesses
        .filter(b =>
          b.category.toLowerCase() === categoryName.toLowerCase() &&
          b.subcategory.toLowerCase() === subcategoryName.toLowerCase()
        )
        .sort((a, b) => {
          const tierOrder = { signature: 0, premier: 1, curated: 2 }
          return tierOrder[a.listing_tier] - tierOrder[b.listing_tier]
        })
    },

    /**
     * Gets all subcategories for a given category with image paths
     *
     * @param {string} categoryName - Category to get subcategories for
     * @returns {Array} Array of subcategory objects with name and image
     *
     * Usage: businessStore.getSubcategoriesForCategory('Dining Out')
     * Returns: [{ name: "Fine Dining", image: "/images/subcategories/fine-dining.jpg" }]
     */
    getSubcategoriesForCategory: (state) => (categoryName) => {
      const category = state.categories.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
      )

      if (category && category.subcategories) {
        return category.subcategories.map(subcat => ({
          name: typeof subcat === 'string' ? subcat : subcat.name,
          // Auto-generate image path from subcategory name if not provided
          image: typeof subcat === 'string'
            ? `/images/subcategories/${subcat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}.jpg`
            : subcat.image
        }))
      }

      return []
    },

    /**
     * Finds a specific business by its unique ID
     *
     * @param {number|string} id - Business ID to lookup
     * @returns {Object|undefined} Business object or undefined if not found
     *
     * Usage: businessStore.getBusinessById(300)
     * Used by: Ad click handlers to show business modal
     */
    getBusinessById: (state) => (id) => {
      return state.businesses.find(b => b.id === parseInt(id))
    },

    /**
     * Gets interstitial advertisement for a specific category
     *
     * @param {string} categoryName - Category to get ad for
     * @returns {Object|undefined} Advertisement object or undefined
     *
     * Usage: businessStore.getInterstitialAd('Dining Out')
     * Used by: CategoryInterstitialView to display ads between navigation
     */
    getInterstitialAd: (state) => (categoryName) => {
      return state.ads.find(
        ad => ad.type === 'interstitial' &&
              ad.category.toLowerCase() === categoryName.toLowerCase()
      )
    },

    /**
     * Gets banner advertisement for a category and position
     *
     * @param {string} categoryName - Category to get banner for
     * @param {string} position - Banner position ('top_sticky', 'hero', etc.)
     * @returns {Object|undefined} Banner advertisement object
     *
     * Usage: businessStore.getBannerAd('Dining Out', 'hero')
     * Used by: CategoryListingView for hero banners
     */
    getBannerAd: (state) => (categoryName, position = 'top_sticky') => {
      return state.ads.find(
        ad => ad.type === 'banner' &&
              ad.category.toLowerCase() === categoryName.toLowerCase() &&
              ad.position === position
      )
    },

    /**
     * Gets premium businesses (Premier + Signature tiers) for a category
     *
     * @param {string} categoryName - Category to filter by
     * @returns {Array} Premium tier businesses only
     *
     * Usage: businessStore.getFeaturedBusinesses('Dining Out')
     * Used for: Special promotional sections or premium listings
     */
    getFeaturedBusinesses: (state) => (categoryName) => {
      return state.businesses.filter(
        b => b.category.toLowerCase() === categoryName.toLowerCase() &&
             (b.listing_tier === 'premier' || b.listing_tier === 'signature')
      )
    },

    /**
     * Searches businesses by name, category, subcategory, or description
     *
     * @param {string} query - Search term to match against
     * @returns {Array} Matching businesses
     *
     * Usage: businessStore.searchBusinesses('waterfront')
     * Used for: Search functionality and filtering
     */
    searchBusinesses: (state) => (query) => {
      const lowerQuery = query.toLowerCase()
      return state.businesses.filter(b =>
        b.name.toLowerCase().includes(lowerQuery) ||
        b.category.toLowerCase().includes(lowerQuery) ||
        b.subcategory?.toLowerCase().includes(lowerQuery) ||
        b.description?.toLowerCase().includes(lowerQuery)
      )
    }
  },

  // ===== ACTIONS (METHODS) =====
  actions: {
    /**
     * Loads all data for the application (async action)
     * Should be called once during app initialization
     *
     * Usage:
     * // In main.js or app initialization
     * const businessStore = useBusinessStore()
     * await businessStore.loadData()
     */
    async loadData() {
      // Prevent duplicate loading if already initialized
      if (this.initialized && this.businesses.length > 0) {
        return
      }

      this.loading = true
      try {
        // Load all data sources in parallel for better performance
        const [businesses, categories, ads] = await Promise.all([
          this.fetchBusinesses(),
          this.fetchCategories(),
          this.fetchAds()
        ])

        this.businesses = businesses
        this.categories = categories
        this.ads = ads
        this.lastUpdated = new Date()
        this.initialized = true

        console.log('✅ Business data loaded successfully', {
          businesses: this.businesses.length,
          categories: this.categories.length,
          ads: this.ads.length
        })
      } catch (error) {
        console.error('❌ Error loading data:', error)
        // Add user-friendly error handling
        if (window.$toast) {
          window.$toast.error('Failed to load business data. Please refresh the page.')
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetches business data from businesses.json data file
     * In production, this would connect to your backend API
     *
     * CUSTOMIZATION: Replace with real API endpoint
     * Example: return await fetch('/api/businesses').then(r => r.json())
     */
    async fetchBusinesses() {
      try {
        // Load businesses from the businesses.json file
        const businessData = await import('@/data/businesses.json')
        return businessData.businesses || []
      } catch (error) {
        console.error('Error loading businesses:', error)
        // Fallback to empty array if loading fails
        return []
      }
    },

    /**
     * Legacy hardcoded business data - kept for reference
     * This data has been moved to businesses.json
     */
    async fetchBusinessesLegacy() {
      // Simulate API delay for realistic development experience
      await new Promise(resolve => setTimeout(resolve, 500))

      return [
        // ==================== FINE DINING - 12 businesses ====================
        {
          id: 1,
          name: "The Grand Reserve",
          category: "Fine Dining",
          subcategory: "Contemporary American",
          logo: "/images/businesses/grand-reserve-logo.jpg",
          heroImage: "/images/businesses/grand-reserve-hero.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6345,
            address: "1234 Lake Road, Osage Beach, MO 65065"
          },
          contact: {
            phone: "573-348-9988",
            website: "https://grandreserve.com",
            email: "concierge@grandreserve.com"
          },
          listing_tier: "signature",
          badges: ["Chef's Table", "Forbes Five Star", "Wine Spectator"],
          price_range: "$$$$",
          description: "Elevated dining experience featuring locally-sourced ingredients and an award-winning wine cellar overlooking the lake.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: true,
            sommelier: true,
            dress_code: "Smart Casual"
          },
          awards: ["Forbes Five Star 2024", "Wine Spectator Grand Award"],
          hours: {
            monday: "Closed",
            tuesday: "5:00 PM - 10:00 PM",
            wednesday: "5:00 PM - 10:00 PM",
            thursday: "5:00 PM - 10:00 PM",
            friday: "5:00 PM - 11:00 PM",
            saturday: "5:00 PM - 11:00 PM",
            sunday: "5:00 PM - 9:00 PM"
          }
        },
        {
          id: 2,
          name: "The Prime House",
          category: "Fine Dining",
          subcategory: "Steakhouse",
          logo: "/images/businesses/prime-house-logo.jpg",
          heroImage: "/images/businesses/prime-house-hero.jpg",
          location: {
            lat: 38.0923,
            lng: -92.6298,
            address: "5500 Lake Shore Dr, Osage Beach, MO 65065"
          },
          contact: {
            phone: "573-348-7777",
            website: "https://primehouse.com",
            email: "reservations@primehouse.com"
          },
          listing_tier: "signature",
          badges: ["AAA Four Diamond", "Wine Spectator", "Dry-Aged"],
          price_range: "$$$$",
          description: "Premium dry-aged steaks and an extensive wine collection in an elegant lakeside setting with impeccable service.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: true,
            sommelier: true,
            dress_code: "Business Casual"
          },
          awards: ["AAA Four Diamond 2024", "Wine Spectator Best of Award 2023"]
        },
        {
          id: 3,
          name: "Coastal Prime",
          category: "Fine Dining",
          subcategory: "Seafood",
          logo: "/images/businesses/coastal-prime-logo.jpg",
          heroImage: "/images/businesses/coastal-prime-hero.jpg",
          location: {
            lat: 38.0891,
            lng: -92.6312
          },
          contact: {
            phone: "573-348-8800",
            website: "https://coastalprime.com"
          },
          listing_tier: "signature",
          badges: ["Fresh Flown Daily", "Waterfront"],
          price_range: "$$$$",
          description: "Fresh seafood flown in daily, paired with breathtaking lake views and an extensive raw bar selection.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: true
          }
        },
        {
          id: 4,
          name: "Bella Vista Ristorante",
          category: "Fine Dining",
          subcategory: "Italian",
          logo: "/images/businesses/bella-vista-logo.jpg",
          location: {
            lat: 38.0845,
            lng: -92.6389
          },
          contact: {
            phone: "573-348-5555",
            website: "https://bellavista.com"
          },
          listing_tier: "premier",
          badges: ["Authentic Italian", "Waterfront"],
          price_range: "$$$",
          description: "Authentic Northern Italian cuisine with handmade pasta and imported ingredients in a romantic waterfront setting.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: false
          }
        },
        {
          id: 5,
          name: "Lakeside Bistro",
          category: "Fine Dining",
          subcategory: "Farm-to-Table",
          logo: "/images/businesses/lakeside-bistro-logo.jpg",
          location: {
            lat: 38.0876,
            lng: -92.6334
          },
          contact: {
            phone: "573-348-6600",
            website: "https://lakesidebistro.com"
          },
          listing_tier: "premier",
          badges: ["Farm-to-Table", "Sustainable"],
          price_range: "$$$",
          description: "Seasonal menu featuring locally-sourced ingredients from area farms.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: false,
            valet: false
          }
        },
        {
          id: 6,
          name: "The Yacht Club",
          category: "Fine Dining",
          subcategory: "Contemporary American",
          logo: "/images/businesses/yacht-club-logo.jpg",
          location: {
            lat: 38.0912,
            lng: -92.6267
          },
          contact: {
            phone: "573-348-7700",
            website: "https://yachtclub.com"
          },
          listing_tier: "premier",
          badges: ["Members & Guests", "Waterfront"],
          price_range: "$$$$",
          description: "Exclusive yacht club dining with New American cuisine and panoramic lake views.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: true
          }
        },
        {
          id: 7,
          name: "Sunset Terrace",
          category: "Fine Dining",
          subcategory: "Contemporary American",
          logo: "/images/businesses/sunset-terrace-logo.jpg",
          location: {
            lat: 38.0834,
            lng: -92.6401
          },
          contact: {
            phone: "573-348-8888"
          },
          listing_tier: "curated",
          price_range: "$$$",
          description: "Upscale dining with stunning sunset views and creative contemporary cuisine.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: false,
            valet: false
          }
        },
        {
          id: 8,
          name: "The Captain's Table",
          category: "Fine Dining",
          subcategory: "Seafood",
          logo: "/images/businesses/captains-table-logo.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6378
          },
          contact: {
            phone: "573-348-9900"
          },
          listing_tier: "curated",
          price_range: "$$$",
          description: "Fresh seafood with a nautical ambiance and lake views.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: false,
            valet: false
          }
        },
        {
          id: 9,
          name: "Prime 54",
          category: "Fine Dining",
          subcategory: "Steakhouse",
          logo: "/images/businesses/prime-54-logo.jpg",
          location: {
            lat: 38.0856,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-5454",
            website: "https://prime54.com"
          },
          listing_tier: "premier",
          price_range: "$$$$",
          description: "Modern steakhouse featuring prime cuts and craft cocktails.",
          features: {
            reservations: true,
            outdoor_seating: false,
            waterfront: false,
            full_bar: true,
            private_dining: true,
            valet: true
          }
        },
        {
          id: 10,
          name: "Tuscan Sun",
          category: "Fine Dining",
          subcategory: "Italian",
          logo: "/images/businesses/tuscan-sun-logo.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6289
          },
          contact: {
            phone: "573-348-7800"
          },
          listing_tier: "curated",
          price_range: "$$$",
          description: "Traditional Tuscan recipes with a modern twist.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: false,
            full_bar: true,
            private_dining: false,
            valet: false
          }
        },
        {
          id: 11,
          name: "The Lake House",
          category: "Fine Dining",
          subcategory: "Farm-to-Table",
          logo: "/images/businesses/lake-house-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6356
          },
          contact: {
            phone: "573-348-6700"
          },
          listing_tier: "curated",
          price_range: "$$$",
          description: "Rustic elegance with seasonal farm-fresh ingredients.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: false,
            valet: false
          }
        },
        {
          id: 12,
          name: "Azure",
          category: "Fine Dining",
          subcategory: "Contemporary American",
          logo: "/images/businesses/azure-logo.jpg",
          location: {
            lat: 38.0923,
            lng: -92.6412
          },
          contact: {
            phone: "573-348-9200"
          },
          listing_tier: "premier",
          price_range: "$$$$",
          description: "Innovative contemporary cuisine with artistic presentation.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: false
          }
        },

        // ==================== GOLF & COUNTRY CLUBS - 8 businesses ====================
        {
          id: 20,
          name: "The Lodge of Four Seasons Golf Club",
          category: "Golf & Country Clubs",
          subcategory: "Championship Golf",
          logo: "/images/businesses/lodge-golf-logo.jpg",
          heroImage: "/images/businesses/lodge-golf-hero.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6445
          },
          contact: {
            phone: "573-365-3000",
            website: "https://4seasonsresort.com/golf",
            email: "golf@4seasonsresort.com"
          },
          listing_tier: "signature",
          badges: ["Robert Trent Jones", "Championship", "Resort Golf"],
          price_range: "$$$$",
          description: "Two championship 18-hole golf courses designed by Robert Trent Jones Sr., featuring stunning lake views and world-class facilities.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: true,
            practice_facility: true,
            golf_instruction: true,
            cart_included: true,
            club_rental: true
          },
          amenities: ["Driving Range", "Putting Green", "Golf Academy", "Locker Rooms", "Club Fitting"]
        },
        {
          id: 21,
          name: "Old Kinderhook Golf Club",
          category: "Golf & Country Clubs",
          subcategory: "Championship Golf",
          logo: "/images/businesses/old-kinderhook-logo.jpg",
          heroImage: "/images/businesses/old-kinderhook-hero.jpg",
          location: {
            lat: 38.1023,
            lng: -92.6512
          },
          contact: {
            phone: "573-346-4444",
            website: "https://oldkinderhook.com",
            email: "teetimes@oldkinderhook.com"
          },
          listing_tier: "signature",
          badges: ["Arnold Palmer Design", "Semi-Private", "Championship"],
          price_range: "$$$$",
          description: "Arnold Palmer-designed championship course featuring dramatic elevation changes and breathtaking lake views.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: true,
            practice_facility: true,
            golf_instruction: true,
            cart_included: true,
            club_rental: true
          },
          amenities: ["Driving Range", "Chipping Green", "Putting Green", "Golf Academy", "Club Fitting", "Spa"]
        },
        {
          id: 22,
          name: "Sycamore Creek Golf Club",
          category: "Golf & Country Clubs",
          subcategory: "Championship Golf",
          logo: "/images/businesses/sycamore-creek-logo.jpg",
          location: {
            lat: 38.0789,
            lng: -92.6234
          },
          contact: {
            phone: "573-348-9593",
            website: "https://sycamorecreek.com"
          },
          listing_tier: "premier",
          badges: ["Links Style", "Public Welcome"],
          price_range: "$$$",
          description: "Links-style championship course with challenging water features and scenic beauty.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: true,
            practice_facility: true,
            golf_instruction: true,
            cart_included: true,
            club_rental: true
          },
          amenities: ["Driving Range", "Practice Bunkers", "Putting Green", "Golf Lessons"]
        },
        {
          id: 23,
          name: "Lake Valley Golf & Country Club",
          category: "Golf & Country Clubs",
          subcategory: "Private Clubs",
          logo: "/images/businesses/lake-valley-logo.jpg",
          location: {
            lat: 38.0934,
            lng: -92.6489
          },
          contact: {
            phone: "573-365-8888",
            website: "https://lakevalleycc.com"
          },
          listing_tier: "signature",
          badges: ["Members Only", "Private", "Social Club"],
          price_range: "$$$$",
          description: "Exclusive private country club offering championship golf, tennis, fine dining, and social events for members.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: true,
            practice_facility: true,
            golf_instruction: true,
            cart_included: true,
            tennis_courts: true,
            pool: true,
            fitness_center: true
          },
          amenities: ["18-Hole Course", "Tennis Courts", "Pool", "Fitness Center", "Spa", "Fine Dining", "Event Spaces"]
        },
        {
          id: 24,
          name: "The Club at Porto Cima",
          category: "Golf & Country Clubs",
          subcategory: "Private Clubs",
          logo: "/images/businesses/porto-cima-logo.jpg",
          heroImage: "/images/businesses/porto-cima-hero.jpg",
          location: {
            lat: 38.1156,
            lng: -92.6878
          },
          contact: {
            phone: "573-302-1000",
            website: "https://portocima.com"
          },
          listing_tier: "signature",
          badges: ["Jack Nicklaus Design", "Ultra-Private", "Lakefront"],
          price_range: "$$$$",
          description: "Ultra-exclusive Jack Nicklaus Signature course within a gated lakefront community. Members and guests only.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: true,
            practice_facility: true,
            golf_instruction: true,
            cart_included: true,
            marina: true,
            concierge: true
          },
          amenities: ["Championship Golf", "Marina", "Spa", "Fine Dining", "Tennis", "Fitness", "Beach Club"]
        },
        {
          id: 25,
          name: "Tan-Tar-A Golf Club",
          category: "Golf & Country Clubs",
          subcategory: "Resort Golf",
          logo: "/images/businesses/tan-tar-a-logo.jpg",
          location: {
            lat: 38.0623,
            lng: -92.6789
          },
          contact: {
            phone: "573-348-3131",
            website: "https://tan-tar-a.com/golf"
          },
          listing_tier: "premier",
          badges: ["Resort Golf", "Public Welcome", "Scenic"],
          price_range: "$$$",
          description: "Three scenic 9-hole courses offering resort-style golf for all skill levels with stunning lake vistas.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: true,
            practice_facility: true,
            golf_instruction: true,
            cart_included: true,
            club_rental: true
          },
          amenities: ["27 Holes", "Driving Range", "Pro Shop", "Golf Lessons", "Club Rentals"]
        },
        {
          id: 26,
          name: "Osage National Golf Club",
          category: "Golf & Country Clubs",
          subcategory: "Championship Golf",
          logo: "/images/businesses/osage-national-logo.jpg",
          location: {
            lat: 38.1045,
            lng: -92.5934
          },
          contact: {
            phone: "573-365-1950",
            website: "https://osagenational.com"
          },
          listing_tier: "premier",
          badges: ["Arnold Palmer", "Mountain Course"],
          price_range: "$$$",
          description: "Arnold Palmer design featuring dramatic elevation changes through Ozark hills and valleys.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: true,
            practice_facility: true,
            golf_instruction: true,
            cart_included: true,
            club_rental: true
          }
        },
        {
          id: 27,
          name: "Whispering Pines Golf Club",
          category: "Golf & Country Clubs",
          subcategory: "Resort Golf",
          logo: "/images/businesses/whispering-pines-logo.jpg",
          location: {
            lat: 38.0712,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-7800"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Affordable lakeside golf with well-maintained fairways and friendly atmosphere.",
          features: {
            reservations: true,
            pro_shop: true,
            restaurant: false,
            practice_facility: true,
            golf_instruction: true,
            cart_included: false,
            club_rental: true
          }
        },

        // ==================== LUXURY REAL ESTATE - 10 businesses ====================
        {
          id: 40,
          name: "Lake of the Ozarks Sotheby's International Realty",
          category: "Luxury Real Estate",
          subcategory: "Luxury Sales",
          logo: "/images/businesses/sothebys-logo.jpg",
          heroImage: "/images/businesses/sothebys-hero.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6323
          },
          contact: {
            phone: "573-348-5555",
            website: "https://lakeozarks.sothebysrealty.com",
            email: "info@lakeozarkssir.com"
          },
          listing_tier: "signature",
          badges: ["Sotheby's", "Luxury Specialist", "Global Network"],
          price_range: "$$$$",
          description: "Premier luxury real estate services representing the finest waterfront estates and luxury properties at Lake of the Ozarks.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            investment_properties: true,
            relocation_services: true,
            international_marketing: true,
            concierge_services: true
          },
          specialties: ["Waterfront Estates", "Luxury Condos", "Investment Properties", "New Construction", "Private Islands"]
        },
        {
          id: 41,
          name: "Lake Ozark Realty - Luxury Division",
          category: "Luxury Real Estate",
          subcategory: "Luxury Sales",
          logo: "/images/businesses/lake-ozark-realty-logo.jpg",
          location: {
            lat: 38.0923,
            lng: -92.6356
          },
          contact: {
            phone: "573-365-2200",
            website: "https://lakeozarkrealty.com"
          },
          listing_tier: "premier",
          badges: ["Local Experts", "Luxury Homes"],
          price_range: "$$$",
          description: "Local expertise in luxury lakefront properties with personalized service and market knowledge.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            investment_properties: true,
            relocation_services: true,
            local_expertise: true
          },
          specialties: ["Waterfront Homes", "Condominiums", "Land Sales", "New Developments"]
        },
        {
          id: 42,
          name: "Premier Properties Lake Ozark",
          category: "Luxury Real Estate",
          subcategory: "Luxury Sales",
          logo: "/images/businesses/premier-properties-logo.jpg",
          location: {
            lat: 38.0856,
            lng: -92.6401
          },
          contact: {
            phone: "573-348-1234",
            website: "https://premierpropertieslake.com"
          },
          listing_tier: "premier",
          badges: ["Waterfront Experts", "25+ Years"],
          price_range: "$$$",
          description: "Over 25 years of experience specializing in premier waterfront properties and luxury estates.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            investment_properties: true,
            new_construction: true
          }
        },
        {
          id: 43,
          name: "Luxury Lake Rentals",
          category: "Luxury Real Estate",
          subcategory: "Vacation Rentals",
          logo: "/images/businesses/luxury-lake-rentals-logo.jpg",
          heroImage: "/images/businesses/luxury-lake-rentals-hero.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6378
          },
          contact: {
            phone: "573-348-8888",
            website: "https://luxurylakezark.com",
            email: "concierge@luxurylakezark.com"
          },
          listing_tier: "signature",
          badges: ["Luxury Rentals", "Concierge Service", "Waterfront"],
          price_range: "$$$$",
          description: "Exclusive collection of luxury vacation homes with full concierge services including boat rentals, private chefs, and activities.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            concierge_services: true,
            boat_slip_included: true,
            housekeeping: true,
            chef_services: true
          },
          amenities: ["Waterfront Homes", "Private Docks", "Luxury Amenities", "Concierge", "Boat Slips", "Event Planning"]
        },
        {
          id: 44,
          name: "Lake Vacation Homes",
          category: "Luxury Real Estate",
          subcategory: "Vacation Rentals",
          logo: "/images/businesses/lake-vacation-homes-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6412
          },
          contact: {
            phone: "573-348-7000",
            website: "https://lakevacationhomes.com"
          },
          listing_tier: "premier",
          badges: ["Premium Rentals", "Waterfront"],
          price_range: "$$$",
          description: "Premium vacation rental homes with waterfront locations and upscale amenities.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            concierge_services: false,
            boat_slip_included: true,
            housekeeping: true
          }
        },
        {
          id: 45,
          name: "Elite Estates Management",
          category: "Luxury Real Estate",
          subcategory: "Property Management",
          logo: "/images/businesses/elite-estates-logo.jpg",
          location: {
            lat: 38.0934,
            lng: -92.6345
          },
          contact: {
            phone: "573-348-6000",
            website: "https://eliteestatesmanagement.com"
          },
          listing_tier: "signature",
          badges: ["Full Service", "Luxury Management"],
          price_range: "$$$$",
          description: "Comprehensive luxury property management including maintenance, rentals, and concierge services for estate owners.",
          features: {
            property_management: true,
            rental_management: true,
            maintenance: true,
            landscaping: true,
            security: true,
            concierge_services: true
          },
          services: ["24/7 Management", "Rental Income", "Maintenance", "Landscaping", "Security", "Concierge"]
        },
        {
          id: 46,
          name: "Prestige Property Management",
          category: "Luxury Real Estate",
          subcategory: "Property Management",
          logo: "/images/businesses/prestige-property-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6289
          },
          contact: {
            phone: "573-348-5000",
            website: "https://prestigepropertylake.com"
          },
          listing_tier: "premier",
          badges: ["Full Service", "Trusted"],
          price_range: "$$$",
          description: "Professional property management for luxury lakefront homes and vacation rentals.",
          features: {
            property_management: true,
            rental_management: true,
            maintenance: true,
            landscaping: true,
            security: false
          }
        },
        {
          id: 47,
          name: "The Property Collective",
          category: "Luxury Real Estate",
          subcategory: "Luxury Sales",
          logo: "/images/businesses/property-collective-logo.jpg",
          location: {
            lat: 38.0912,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-9100",
            website: "https://propertycollective.com"
          },
          listing_tier: "premier",
          badges: ["Boutique Agency", "Luxury Homes"],
          price_range: "$$$",
          description: "Boutique real estate agency specializing in unique luxury properties and personalized service.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            investment_properties: true,
            relocation_services: true
          }
        },
        {
          id: 48,
          name: "Lakefront Living Realty",
          category: "Luxury Real Estate",
          subcategory: "Luxury Sales",
          logo: "/images/businesses/lakefront-living-logo.jpg",
          location: {
            lat: 38.0845,
            lng: -92.6367
          },
          contact: {
            phone: "573-348-8200"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Helping buyers find their dream lakefront property with local market expertise.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            investment_properties: false,
            relocation_services: true
          }
        },
        {
          id: 49,
          name: "Waterfront Estates Group",
          category: "Luxury Real Estate",
          subcategory: "Luxury Sales",
          logo: "/images/businesses/waterfront-estates-logo.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6445
          },
          contact: {
            phone: "573-348-7300"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Specialists in waterfront properties from condos to estates.",
          features: {
            luxury_homes: true,
            waterfront_specialist: true,
            investment_properties: true,
            relocation_services: false
          }
        },

        // ==================== LIVE ENTERTAINMENT - 10 businesses ====================
        {
          id: 60,
          name: "Sunset Cruise & Live Music",
          category: "Live Entertainment",
          subcategory: "Cruises & Shows",
          logo: "/images/businesses/sunset-cruise-logo.jpg",
          heroImage: "/images/businesses/sunset-cruise-hero.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6312
          },
          contact: {
            phone: "573-348-2200",
            website: "https://sunsetcruiselake.com",
            email: "reservations@sunsetcruise.com"
          },
          listing_tier: "signature",
          badges: ["Dinner Cruise", "Live Music", "Premium Experience"],
          price_range: "$$$$",
          description: "Luxury dinner cruises featuring live entertainment, gourmet dining, and breathtaking sunset views of the lake.",
          features: {
            reservations: true,
            dinner_included: true,
            full_bar: true,
            live_music: true,
            private_events: true,
            climate_controlled: true
          },
          amenities: ["Multi-Level Yacht", "Live Band", "Gourmet Dinner", "Full Bar", "Dance Floor", "Climate Controlled"]
        },
        {
          id: 61,
          name: "The Yacht Club Live",
          category: "Live Entertainment",
          subcategory: "Nightlife & Bars",
          logo: "/images/businesses/yacht-club-live-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6334
          },
          contact: {
            phone: "573-348-5500",
            website: "https://yachtclublive.com"
          },
          listing_tier: "signature",
          badges: ["Live Music", "Waterfront", "VIP Tables"],
          price_range: "$$$",
          description: "Upscale waterfront venue featuring national touring acts, craft cocktails, and VIP bottle service.",
          features: {
            reservations: true,
            full_bar: true,
            live_music: true,
            private_events: true,
            vip_seating: true,
            bottle_service: true,
            outdoor_seating: true,
            waterfront: true
          }
        },
        {
          id: 62,
          name: "Margaritaville Lake Resort - Entertainment",
          category: "Live Entertainment",
          subcategory: "Nightlife & Bars",
          logo: "/images/businesses/margaritaville-logo.jpg",
          heroImage: "/images/businesses/margaritaville-hero.jpg",
          location: {
            lat: 38.0623,
            lng: -92.6734
          },
          contact: {
            phone: "573-348-1500",
            website: "https://margaritavilleresorts.com/lake-ozarks"
          },
          listing_tier: "signature",
          badges: ["Resort Entertainment", "Multiple Venues", "Live Music"],
          price_range: "$$$",
          description: "World-class resort entertainment featuring multiple venues with live music, comedy shows, and special events.",
          features: {
            reservations: true,
            full_bar: true,
            live_music: true,
            multiple_venues: true,
            comedy_shows: true,
            outdoor_seating: true,
            waterfront: true
          }
        },
        {
          id: 63,
          name: "The Blue Heron",
          category: "Live Entertainment",
          subcategory: "Nightlife & Bars",
          logo: "/images/businesses/blue-heron-logo.jpg",
          location: {
            lat: 38.0845,
            lng: -92.6389
          },
          contact: {
            phone: "573-348-4400",
            website: "https://blueheronlake.com"
          },
          listing_tier: "premier",
          badges: ["Live Music", "Waterfront", "Craft Cocktails"],
          price_range: "$$",
          description: "Sophisticated waterfront lounge with live acoustic music and creative cocktails.",
          features: {
            reservations: false,
            full_bar: true,
            live_music: true,
            outdoor_seating: true,
            waterfront: true
          }
        },
        {
          id: 64,
          name: "Lake Ozark Amphitheater",
          category: "Live Entertainment",
          subcategory: "Concerts & Events",
          logo: "/images/businesses/amphitheater-logo.jpg",
          location: {
            lat: 38.0756,
            lng: -92.6445
          },
          contact: {
            phone: "573-348-9700",
            website: "https://lakeozarkamphitheater.com"
          },
          listing_tier: "signature",
          badges: ["Outdoor Venue", "Major Acts", "Summer Series"],
          price_range: "$$$",
          description: "Premier outdoor amphitheater hosting major touring acts and summer concert series with lakefront setting.",
          features: {
            reservations: true,
            covered_seating: true,
            lawn_seating: true,
            full_bar: true,
            concessions: true,
            vip_boxes: true
          }
        },
        {
          id: 65,
          name: "Jazz on the Lake",
          category: "Live Entertainment",
          subcategory: "Concerts & Events",
          logo: "/images/businesses/jazz-lake-logo.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6301
          },
          contact: {
            phone: "573-348-5800",
            website: "https://jazzonthelake.com"
          },
          listing_tier: "premier",
          badges: ["Jazz Venue", "Intimate Setting"],
          price_range: "$$$",
          description: "Intimate jazz club featuring renowned musicians in an elegant lakeside setting.",
          features: {
            reservations: true,
            full_bar: true,
            live_music: true,
            dinner_available: true,
            private_events: false
          }
        },
        {
          id: 66,
          name: "Comedy Cove",
          category: "Live Entertainment",
          subcategory: "Comedy Clubs",
          logo: "/images/businesses/comedy-cove-logo.jpg",
          location: {
            lat: 38.0823,
            lng: -92.6378
          },
          contact: {
            phone: "573-348-6600",
            website: "https://comedycove.com"
          },
          listing_tier: "premier",
          badges: ["Stand-Up Comedy", "National Acts"],
          price_range: "$$",
          description: "Upscale comedy club featuring national headliners and rising stars every weekend.",
          features: {
            reservations: true,
            full_bar: true,
            dinner_available: true,
            private_events: true,
            vip_seating: true
          }
        },
        {
          id: 67,
          name: "The Marina Bar & Grill - Live Music",
          category: "Live Entertainment",
          subcategory: "Nightlife & Bars",
          logo: "/images/businesses/marina-bar-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-7200"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Casual waterfront bar with nightly live music and boat-up access.",
          features: {
            reservations: false,
            full_bar: true,
            live_music: true,
            outdoor_seating: true,
            waterfront: true,
            boat_access: true
          }
        },
        {
          id: 68,
          name: "Sunset Lounge",
          category: "Live Entertainment",
          subcategory: "Nightlife & Bars",
          logo: "/images/businesses/sunset-lounge-logo.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6356
          },
          contact: {
            phone: "573-348-8300"
          },
          listing_tier: "curated",
          price_range: "$",
          description: "Relaxed atmosphere with acoustic music and stunning sunset views.",
          features: {
            reservations: false,
            full_bar: true,
            live_music: true,
            outdoor_seating: true,
            waterfront: true
          }
        },
        {
          id: 69,
          name: "Lake Stage Theater",
          category: "Live Entertainment",
          subcategory: "Theater & Arts",
          logo: "/images/businesses/lake-stage-logo.jpg",
          location: {
            lat: 38.0834,
            lng: -92.6412
          },
          contact: {
            phone: "573-348-9500",
            website: "https://lakestagetheater.com"
          },
          listing_tier: "premier",
          badges: ["Live Theater", "Musicals"],
          price_range: "$$",
          description: "Professional theater company presenting Broadway musicals and classic plays.",
          features: {
            reservations: true,
            season_tickets: true,
            private_events: false,
            concessions: true
          }
        },

        // ==================== LUXURY SERVICES - 10 businesses ====================
        {
          id: 80,
          name: "Lake Concierge Services",
          category: "Luxury Services",
          subcategory: "Concierge",
          logo: "/images/businesses/lake-concierge-logo.jpg",
          heroImage: "/images/businesses/lake-concierge-hero.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6334
          },
          contact: {
            phone: "573-348-1111",
            website: "https://lakeconcierge.com",
            email: "concierge@lakeconcierge.com"
          },
          listing_tier: "signature",
          badges: ["24/7 Service", "VIP Access", "Full Service"],
          price_range: "$$$$",
          description: "Premier concierge services offering 24/7 assistance with reservations, activities, transportation, and exclusive experiences.",
          features: {
            available_24_7: true,
            reservations: true,
            transportation: true,
            event_planning: true,
            personal_shopping: true,
            vip_access: true
          },
          services: ["Restaurant Reservations", "Activity Planning", "Private Chef", "Transportation", "Event Tickets", "VIP Services"]
        },
        {
          id: 81,
          name: "Luxury Yacht Charters",
          category: "Luxury Services",
          subcategory: "Boat Rentals",
          logo: "/images/businesses/luxury-yacht-logo.jpg",
          heroImage: "/images/businesses/luxury-yacht-hero.jpg",
          location: {
            lat: 38.0912,
            lng: -92.6389
          },
          contact: {
            phone: "573-348-2222",
            website: "https://luxuryyachtcharters.com"
          },
          listing_tier: "signature",
          badges: ["Luxury Yachts", "Captain Included", "Premium Fleet"],
          price_range: "$$$$",
          description: "Exclusive fleet of luxury yachts with professional captains for private charters, events, and entertainment.",
          features: {
            reservations: true,
            captain_included: true,
            catering_available: true,
            full_bar: true,
            overnight_available: true,
            event_hosting: true
          },
          fleet: ["60ft Luxury Yacht", "50ft Sport Yacht", "45ft Express Cruiser", "Custom Charters"]
        },
        {
          id: 82,
          name: "Premier Boat Rentals",
          category: "Luxury Services",
          subcategory: "Boat Rentals",
          logo: "/images/businesses/premier-boats-logo.jpg",
          location: {
            lat: 38.0856,
            lng: -92.6412
          },
          contact: {
            phone: "573-348-3333",
            website: "https://premierboatrentals.com"
          },
          listing_tier: "premier",
          badges: ["New Fleet", "Pontoons & Ski Boats"],
          price_range: "$$$",
          description: "Premium boat rental fleet including pontoons, ski boats, and wake boats. All vessels under 2 years old.",
          features: {
            reservations: true,
            delivery_available: true,
            captain_available: true,
            water_toys_included: true,
            fuel_included: false
          }
        },
        {
          id: 83,
          name: "Lake Ozark Spa & Wellness",
          category: "Luxury Services",
          subcategory: "Spa & Wellness",
          logo: "/images/businesses/lake-spa-logo.jpg",
          heroImage: "/images/businesses/lake-spa-hero.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6356
          },
          contact: {
            phone: "573-348-4444",
            website: "https://lakeozarkspa.com"
          },
          listing_tier: "signature",
          badges: ["Full-Service Spa", "Luxury Treatments"],
          price_range: "$$$$",
          description: "Award-winning spa offering luxury treatments, massage therapy, facials, and wellness services with lake views.",
          features: {
            reservations: true,
            couples_suites: true,
            hot_tub: true,
            sauna: true,
            steam_room: true,
            relaxation_lounge: true
          },
          services: ["Massage", "Facials", "Body Treatments", "Manicure/Pedicure", "Salon Services", "Couples Packages"]
        },
        {
          id: 84,
          name: "Serenity Spa",
          category: "Luxury Services",
          subcategory: "Spa & Wellness",
          logo: "/images/businesses/serenity-spa-logo.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-5555",
            website: "https://serenityspalake.com"
          },
          listing_tier: "premier",
          badges: ["Day Spa", "Wellness Center"],
          price_range: "$$$",
          description: "Tranquil day spa specializing in therapeutic massage and holistic wellness treatments.",
          features: {
            reservations: true,
            couples_suites: true,
            hot_tub: false,
            sauna: true,
            relaxation_lounge: true
          }
        },
        {
          id: 85,
          name: "Elite Transportation Services",
          category: "Luxury Services",
          subcategory: "Transportation",
          logo: "/images/businesses/elite-transport-logo.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6301
          },
          contact: {
            phone: "573-348-6666",
            website: "https://elitetransportlake.com"
          },
          listing_tier: "signature",
          badges: ["Executive Service", "Luxury Fleet"],
          price_range: "$$$$",
          description: "Premium transportation services including luxury sedans, SUVs, and limousines for airport transfers and special occasions.",
          features: {
            reservations: true,
            airport_service: true,
            chauffeur: true,
            luxury_vehicles: true,
            by_the_hour: true,
            corporate_accounts: true
          },
          fleet: ["Mercedes S-Class", "Cadillac Escalade", "Lincoln Navigator", "Stretch Limousines"]
        },
        {
          id: 86,
          name: "Lake Private Chefs",
          category: "Luxury Services",
          subcategory: "Private Dining",
          logo: "/images/businesses/private-chefs-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6378
          },
          contact: {
            phone: "573-348-7777",
            website: "https://lakeprivatechefs.com"
          },
          listing_tier: "signature",
          badges: ["Private Chef", "In-Home Dining"],
          price_range: "$$$$",
          description: "Professional private chef services bringing fine dining to your vacation home or yacht with customized menus.",
          features: {
            reservations: true,
            custom_menus: true,
            full_service: true,
            wine_pairing: true,
            dietary_accommodations: true,
            event_catering: true
          }
        },
        {
          id: 87,
          name: "Lake Helicopter Tours",
          category: "Luxury Services",
          subcategory: "Tours & Activities",
          logo: "/images/businesses/helicopter-tours-logo.jpg",
          heroImage: "/images/businesses/helicopter-tours-hero.jpg",
          location: {
            lat: 38.0756,
            lng: -92.6489
          },
          contact: {
            phone: "573-348-8888",
            website: "https://lakehelicoptertours.com"
          },
          listing_tier: "signature",
          badges: ["Aerial Tours", "Private Charters"],
          price_range: "$$$$",
          description: "Breathtaking helicopter tours offering unparalleled views of Lake of the Ozarks and surrounding areas.",
          features: {
            reservations: true,
            private_charters: true,
            custom_routes: true,
            proposal_packages: true,
            photography: true
          },
          tours: ["Scenic Lake Tour", "Sunset Tour", "Private Charter", "Photography Tour", "Proposal Package"]
        },
        {
          id: 88,
          name: "Marina Del Sol",
          category: "Luxury Services",
          subcategory: "Marinas",
          logo: "/images/businesses/marina-del-sol-logo.jpg",
          location: {
            lat: 38.0923,
            lng: -92.6445
          },
          contact: {
            phone: "573-348-9999",
            website: "https://marinadelsol.com"
          },
          listing_tier: "premier",
          badges: ["Full-Service Marina", "Concierge"],
          price_range: "$$$",
          description: "Premier full-service marina with boat slips, fuel, service, and concierge amenities.",
          features: {
            boat_slips: true,
            fuel_dock: true,
            boat_service: true,
            ship_store: true,
            restaurant: true,
            concierge: true,
            security: true
          }
        },
        {
          id: 89,
          name: "Lake Event Planning Co.",
          category: "Luxury Services",
          subcategory: "Event Planning",
          logo: "/images/businesses/event-planning-logo.jpg",
          location: {
            lat: 38.0845,
            lng: -92.6367
          },
          contact: {
            phone: "573-348-1010",
            website: "https://lakeeventplanning.com"
          },
          listing_tier: "premier",
          badges: ["Full-Service", "Luxury Events"],
          price_range: "$$$$",
          description: "Luxury event planning for weddings, corporate retreats, and special celebrations at the lake.",
          features: {
            wedding_planning: true,
            corporate_events: true,
            venue_sourcing: true,
            vendor_management: true,
            day_of_coordination: true,
            design_services: true
          }
        },

        // ==================== WELLNESS & FITNESS - 8 businesses ====================
        {
          id: 100,
          name: "Lakeside Fitness Club",
          category: "Wellness & Fitness",
          subcategory: "Fitness Centers",
          logo: "/images/businesses/lakeside-fitness-logo.jpg",
          heroImage: "/images/businesses/lakeside-fitness-hero.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6312
          },
          contact: {
            phone: "573-348-2000",
            website: "https://lakesidefitness.com"
          },
          listing_tier: "signature",
          badges: ["Full Gym", "Personal Training", "Classes"],
          price_range: "$$$",
          description: "State-of-the-art fitness facility with lake views, personal training, group classes, and wellness programs.",
          features: {
            cardio_equipment: true,
            weight_training: true,
            group_classes: true,
            personal_training: true,
            locker_rooms: true,
            sauna: true,
            pool: true
          },
          amenities: ["Cardio Theater", "Free Weights", "Yoga Studio", "Spin Classes", "Pool", "Sauna", "Smoothie Bar"]
        },
        {
          id: 101,
          name: "The Training Studio",
          category: "Wellness & Fitness",
          subcategory: "Personal Training",
          logo: "/images/businesses/training-studio-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6345
          },
          contact: {
            phone: "573-348-2100",
            website: "https://trainingstudiolake.com"
          },
          listing_tier: "premier",
          badges: ["Private Training", "Nutrition Coaching"],
          price_range: "$$$",
          description: "Exclusive personal training studio offering one-on-one sessions and customized fitness programs.",
          features: {
            personal_training: true,
            nutrition_coaching: true,
            private_sessions: true,
            small_group: true,
            online_coaching: true
          }
        },
        {
          id: 102,
          name: "Lake Yoga & Wellness",
          category: "Wellness & Fitness",
          subcategory: "Yoga & Pilates",
          logo: "/images/businesses/lake-yoga-logo.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6378
          },
          contact: {
            phone: "573-348-2200",
            website: "https://lakeyogawellness.com"
          },
          listing_tier: "premier",
          badges: ["Yoga", "Meditation", "Wellness"],
          price_range: "$$",
          description: "Tranquil yoga studio offering various styles of yoga, meditation, and wellness workshops.",
          features: {
            yoga_classes: true,
            pilates: true,
            meditation: true,
            workshops: true,
            private_sessions: true,
            outdoor_classes: true
          }
        },
        {
          id: 103,
          name: "CrossFit Lake Ozarks",
          category: "Wellness & Fitness",
          subcategory: "Fitness Centers",
          logo: "/images/businesses/crossfit-lake-logo.jpg",
          location: {
            lat: 38.0856,
            lng: -92.6401
          },
          contact: {
            phone: "573-348-2300",
            website: "https://crossfitlakeozarks.com"
          },
          listing_tier: "premier",
          badges: ["CrossFit", "Group Training"],
          price_range: "$$",
          description: "High-intensity CrossFit gym with experienced coaches and supportive community atmosphere.",
          features: {
            group_classes: true,
            personal_training: true,
            open_gym: true,
            nutrition_coaching: true,
            competitions: true
          }
        },
        {
          id: 104,
          name: "Mindful Movement Studio",
          category: "Wellness & Fitness",
          subcategory: "Yoga & Pilates",
          logo: "/images/businesses/mindful-movement-logo.jpg",
          location: {
            lat: 38.0823,
            lng: -92.6367
          },
          contact: {
            phone: "573-348-2400",
            website: "https://mindfulmovement.com"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Boutique studio specializing in Pilates reformer classes and mindful movement practices.",
          features: {
            pilates: true,
            reformer: true,
            mat_classes: true,
            private_sessions: true,
            small_group: true
          }
        },
        {
          id: 105,
          name: "Lake Nutrition Center",
          category: "Wellness & Fitness",
          subcategory: "Nutrition & Wellness",
          logo: "/images/businesses/nutrition-center-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-2500",
            website: "https://lakenutrition.com"
          },
          listing_tier: "premier",
          badges: ["Registered Dietitian", "Meal Planning"],
          price_range: "$$$",
          description: "Professional nutrition counseling and meal planning services with registered dietitians.",
          features: {
            nutrition_counseling: true,
            meal_planning: true,
            weight_management: true,
            sports_nutrition: true,
            cooking_classes: true
          }
        },
        {
          id: 106,
          name: "Outdoor Fitness Adventures",
          category: "Wellness & Fitness",
          subcategory: "Outdoor Fitness",
          logo: "/images/businesses/outdoor-fitness-logo.jpg",
          location: {
            lat: 38.0789,
            lng: -92.6456
          },
          contact: {
            phone: "573-348-2600",
            website: "https://outdoorfitnessadventures.com"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Outdoor fitness classes and adventure workouts utilizing the natural beauty of the lake.",
          features: {
            outdoor_classes: true,
            boot_camps: true,
            hiking_groups: true,
            paddle_board_yoga: true,
            seasonal_programs: true
          }
        },
        {
          id: 107,
          name: "The Pilates Loft",
          category: "Wellness & Fitness",
          subcategory: "Yoga & Pilates",
          logo: "/images/businesses/pilates-loft-logo.jpg",
          location: {
            lat: 38.0912,
            lng: -92.6334
          },
          contact: {
            phone: "573-348-2700"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Classical Pilates studio with certified instructors and reformer equipment.",
          features: {
            pilates: true,
            reformer: true,
            mat_classes: true,
            private_sessions: true,
            duet_sessions: true
          }
        },

        // ==================== SHOPPING & RETAIL - 8 businesses ====================
        {
          id: 120,
          name: "Lake Boutique Collection",
          category: "Shopping & Retail",
          subcategory: "Fashion & Boutiques",
          logo: "/images/businesses/boutique-collection-logo.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6345
          },
          contact: {
            phone: "573-348-3000",
            website: "https://lakeboutiquecollection.com"
          },
          listing_tier: "signature",
          badges: ["Designer Fashion", "Luxury Brands"],
          price_range: "$$$$",
          description: "Upscale boutique featuring designer fashion, accessories, and resort wear from premium brands.",
          features: {
            designer_brands: true,
            personal_shopping: true,
            alterations: true,
            gift_wrapping: true,
            online_shopping: true
          },
          brands: ["Tory Burch", "Rag & Bone", "Vince", "Theory", "Johnny Was"]
        },
        {
          id: 121,
          name: "The Coastal Shop",
          category: "Shopping & Retail",
          subcategory: "Fashion & Boutiques",
          logo: "/images/businesses/coastal-shop-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6367
          },
          contact: {
            phone: "573-348-3100",
            website: "https://coastalshoplake.com"
          },
          listing_tier: "premier",
          badges: ["Resort Wear", "Beach Fashion"],
          price_range: "$$$",
          description: "Stylish resort wear and accessories perfect for lake life and vacation style.",
          features: {
            resort_wear: true,
            swimwear: true,
            accessories: true,
            gifts: true,
            personal_shopping: false
          }
        },
        {
          id: 122,
          name: "Lake Home Interiors",
          category: "Shopping & Retail",
          subcategory: "Home & Decor",
          logo: "/images/businesses/home-interiors-logo.jpg",
          heroImage: "/images/businesses/home-interiors-hero.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6389
          },
          contact: {
            phone: "573-348-3200",
            website: "https://lakehomeinteriors.com"
          },
          listing_tier: "signature",
          badges: ["Interior Design", "Luxury Furnishings"],
          price_range: "$$$$",
          description: "Luxury home furnishings and interior design services specializing in lakefront properties and vacation homes.",
          features: {
            interior_design: true,
            custom_furniture: true,
            delivery: true,
            installation: true,
            consultation: true
          },
          services: ["Interior Design", "Furniture", "Window Treatments", "Lighting", "Accessories", "Full Home Furnishing"]
        },
        {
          id: 123,
          name: "Artisan Gallery",
          category: "Shopping & Retail",
          subcategory: "Art & Gifts",
          logo: "/images/businesses/artisan-gallery-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6412
          },
          contact: {
            phone: "573-348-3300",
            website: "https://artisangallerylake.com"
          },
          listing_tier: "premier",
          badges: ["Local Artists", "Fine Art"],
          price_range: "$$$",
          description: "Fine art gallery featuring works by local and regional artists, including paintings, sculptures, and photography.",
          features: {
            fine_art: true,
            local_artists: true,
            custom_framing: true,
            art_consultation: true,
            shipping: true
          }
        },
        {
          id: 124,
          name: "The Wine Cellar",
          category: "Shopping & Retail",
          subcategory: "Wine & Spirits",
          logo: "/images/businesses/wine-cellar-logo.jpg",
          location: {
            lat: 38.0856,
            lng: -92.6378
          },
          contact: {
            phone: "573-348-3400",
            website: "https://winecellarlake.com"
          },
          listing_tier: "signature",
          badges: ["Premium Selection", "Wine Expert"],
          price_range: "$$$",
          description: "Curated selection of fine wines, craft spirits, and premium cigars with knowledgeable staff and tasting events.",
          features: {
            wine_selection: true,
            spirits: true,
            cigars: true,
            tastings: true,
            delivery: true,
            gift_baskets: true
          }
        },
        {
          id: 125,
          name: "Lake Luxury Jewelers",
          category: "Shopping & Retail",
          subcategory: "Jewelry",
          logo: "/images/businesses/luxury-jewelers-logo.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-3500",
            website: "https://lakeluxuryjewelers.com"
          },
          listing_tier: "signature",
          badges: ["Fine Jewelry", "Custom Design"],
          price_range: "$$$$",
          description: "Premier jeweler offering fine jewelry, luxury watches, and custom design services.",
          features: {
            fine_jewelry: true,
            luxury_watches: true,
            custom_design: true,
            repairs: true,
            appraisals: true
          },
          brands: ["Rolex", "Cartier", "David Yurman", "John Hardy"]
        },
        {
          id: 126,
          name: "Provisions Market",
          category: "Shopping & Retail",
          subcategory: "Gourmet Food",
          logo: "/images/businesses/provisions-market-logo.jpg",
          location: {
            lat: 38.0912,
            lng: -92.6356
          },
          contact: {
            phone: "573-348-3600",
            website: "https://provisionsmarket.com"
          },
          listing_tier: "premier",
          badges: ["Gourmet Foods", "Prepared Meals"],
          price_range: "$$$",
          description: "Upscale market featuring gourmet foods, prepared meals, artisan cheeses, and specialty items.",
          features: {
            gourmet_foods: true,
            prepared_meals: true,
            catering: true,
            gift_baskets: true,
            delivery: true
          }
        },
        {
          id: 127,
          name: "The Book Nook",
          category: "Shopping & Retail",
          subcategory: "Books & Gifts",
          logo: "/images/businesses/book-nook-logo.jpg",
          location: {
            lat: 38.0834,
            lng: -92.6401
          },
          contact: {
            phone: "573-348-3700"
          },
          listing_tier: "curated",
          price_range: "$$",
          description: "Charming bookstore with curated selection, local authors, and unique gifts.",
          features: {
            new_books: true,
            local_authors: true,
            gifts: true,
            coffee_bar: true,
            events: true
          }
        },

        // ==================== CHARITY & COMMUNITY - 8 businesses ====================
        {
          id: 140,
          name: "Lake of the Ozarks Community Foundation",
          category: "Charity & Community",
          subcategory: "Foundations",
          logo: "/images/businesses/community-foundation-logo.jpg",
          heroImage: "/images/businesses/community-foundation-hero.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6312
          },
          contact: {
            phone: "573-348-4000",
            website: "https://lakecommunityfoundation.org",
            email: "info@lakecommunityfoundation.org"
          },
          listing_tier: "signature",
          badges: ["Community Impact", "Charitable Giving"],
          description: "Leading philanthropic organization supporting education, health, and community development initiatives throughout the Lake region.",
          features: {
            donor_advised_funds: true,
            scholarships: true,
            grants: true,
            planned_giving: true,
            community_programs: true
          },
          programs: ["Scholarship Fund", "Emergency Relief", "Youth Programs", "Environmental Conservation"]
        },
        {
          id: 141,
          name: "Children's Harbor",
          category: "Charity & Community",
          subcategory: "Youth Services",
          logo: "/images/businesses/childrens-harbor-logo.jpg",
          location: {
            lat: 38.0756,
            lng: -92.6445
          },
          contact: {
            phone: "573-348-4100",
            website: "https://childrensharbor.org"
          },
          listing_tier: "signature",
          badges: ["Children's Charity", "Camp Programs"],
          description: "Non-profit providing camp experiences and support for children with serious illnesses and their families.",
          features: {
            camp_programs: true,
            family_support: true,
            volunteer_opportunities: true,
            donations_accepted: true
          }
        },
        {
          id: 142,
          name: "Lake Area Humane Society",
          category: "Charity & Community",
          subcategory: "Animal Welfare",
          logo: "/images/businesses/humane-society-logo.jpg",
          location: {
            lat: 38.0823,
            lng: -92.6378
          },
          contact: {
            phone: "573-348-4200",
            website: "https://lakehumane.org"
          },
          listing_tier: "premier",
          badges: ["Animal Rescue", "Adoption"],
          description: "Dedicated to rescuing, rehabilitating, and rehoming animals in the Lake community.",
          features: {
            animal_rescue: true,
            adoption_services: true,
            spay_neuter: true,
            volunteer_opportunities: true,
            donations_accepted: true
          }
        },
        {
          id: 143,
          name: "Lake Regional Health Foundation",
          category: "Charity & Community",
          subcategory: "Healthcare",
          logo: "/images/businesses/health-foundation-logo.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6389
          },
          contact: {
            phone: "573-348-4300",
            website: "https://lakehealthfoundation.org"
          },
          listing_tier: "signature",
          badges: ["Healthcare Support", "Medical Charity"],
          description: "Supporting healthcare initiatives and providing assistance to those in need of medical care at the Lake.",
          features: {
            patient_assistance: true,
            equipment_funding: true,
            research_support: true,
            donations_accepted: true
          }
        },
        {
          id: 144,
          name: "Lake Arts Council",
          category: "Charity & Community",
          subcategory: "Arts & Culture",
          logo: "/images/businesses/arts-council-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6356
          },
          contact: {
            phone: "573-348-4400",
            website: "https://lakeartscouncil.org"
          },
          listing_tier: "premier",
          badges: ["Arts Support", "Cultural Programs"],
          description: "Promoting and supporting arts and cultural programs throughout the Lake community.",
          features: {
            grants_available: true,
            events: true,
            education_programs: true,
            gallery_space: true,
            volunteer_opportunities: true
          }
        },
        {
          id: 145,
          name: "Lake Area Food Bank",
          category: "Charity & Community",
          subcategory: "Food Security",
          logo: "/images/businesses/food-bank-logo.jpg",
          location: {
            lat: 38.0845,
            lng: -92.6412
          },
          contact: {
            phone: "573-348-4500",
            website: "https://lakefoodbank.org"
          },
          listing_tier: "premier",
          badges: ["Hunger Relief", "Community Support"],
          description: "Fighting hunger and food insecurity in the Lake community through food distribution and programs.",
          features: {
            food_distribution: true,
            volunteer_opportunities: true,
            donations_accepted: true,
            partner_agencies: true
          }
        },
        {
          id: 146,
          name: "Habitat for Humanity - Lake Area",
          category: "Charity & Community",
          subcategory: "Housing",
          logo: "/images/businesses/habitat-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6423
          },
          contact: {
            phone: "573-348-4600",
            website: "https://lakehabitat.org"
          },
          listing_tier: "premier",
          badges: ["Affordable Housing", "Community Build"],
          description: "Building affordable housing and promoting homeownership for families in need.",
          features: {
            home_building: true,
            volunteer_opportunities: true,
            donations_accepted: true,
            restore_shop: true
          }
        },
        {
          id: 147,
          name: "Lake Education Foundation",
          category: "Charity & Community",
          subcategory: "Education",
          logo: "/images/businesses/education-foundation-logo.jpg",
          location: {
            lat: 38.0912,
            lng: -92.6367
          },
          contact: {
            phone: "573-348-4700",
            website: "https://lakeeducation.org"
          },
          listing_tier: "curated",
          description: "Supporting educational excellence through scholarships, grants, and programs for local schools.",
          features: {
            scholarships: true,
            teacher_grants: true,
            student_programs: true,
            donations_accepted: true
          }
        },

        // ==================== RESTAURANTS & BARS - 8 businesses ====================
        {
          id: 300,
          name: "Shady Gators",
          category: "Restaurants & Bars",
          subcategory: "Waterfront Dining",
          logo: "/images/businesses/shady-gators-logo.jpg",
          heroImage: "/images/businesses/shady-gators-hero.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6334,
            address: "1456 Bagnell Dam Blvd, Lake Ozark, MO 65049"
          },
          contact: {
            phone: "573-365-2424",
            website: "https://shadygators.com",
            email: "info@shadygators.com"
          },
          listing_tier: "signature",
          badges: ["Waterfront", "Boat-Up Dining", "Live Music"],
          price_range: "$$",
          description: "Legendary waterfront restaurant with boat-up dining, live music, and the famous Gator Gumbo.",
          features: {
            reservations: false,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: false,
            valet: false,
            boat_access: true,
            live_music: true
          },
          hours: {
            monday: "11:00 AM - 10:00 PM",
            tuesday: "11:00 AM - 10:00 PM",
            wednesday: "11:00 AM - 10:00 PM",
            thursday: "11:00 AM - 10:00 PM",
            friday: "11:00 AM - 11:00 PM",
            saturday: "11:00 AM - 11:00 PM",
            sunday: "11:00 AM - 10:00 PM"
          },
          happyHour: "3:00 PM - 6:00 PM Daily",
          liveMusic: {
            schedule: "Friday & Saturday nights",
            time: "8:00 PM - 11:00 PM"
          }
        },
        {
          id: 301,
          name: "Margaritaville at the Lake of the Ozarks",
          category: "Restaurants & Bars",
          subcategory: "Casual Dining",
          logo: "/images/businesses/margaritaville-logo.jpg",
          location: {
            lat: 38.0623,
            lng: -92.6734,
            address: "494 Tan Tar A Dr, Osage Beach, MO 65065"
          },
          contact: {
            phone: "573-348-1500",
            website: "https://margaritavilleresorts.com"
          },
          listing_tier: "signature",
          badges: ["Resort Dining", "Jimmy Buffett", "Tropical"],
          price_range: "$$$",
          description: "Tropical paradise with signature margaritas, Caribbean-inspired cuisine, and lake views.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: true
          },
          hours: {
            monday: "11:00 AM - 11:00 PM",
            tuesday: "11:00 AM - 11:00 PM",
            wednesday: "11:00 AM - 11:00 PM",
            thursday: "11:00 AM - 11:00 PM",
            friday: "11:00 AM - 12:00 AM",
            saturday: "11:00 AM - 12:00 AM",
            sunday: "11:00 AM - 11:00 PM"
          },
          happyHour: "2:00 PM - 5:00 PM Daily",
          liveMusic: {
            schedule: "Thursday - Sunday",
            time: "7:00 PM - 10:00 PM"
          }
        },
        {
          id: 302,
          name: "JB Hooks",
          category: "Restaurants & Bars",
          subcategory: "Fine Dining",
          logo: "/images/businesses/jb-hooks-logo.jpg",
          location: {
            lat: 38.0845,
            lng: -92.6389,
            address: "1357 Bagnell Dam Blvd, Lake Ozark, MO 65049"
          },
          contact: {
            phone: "573-365-3255",
            website: "https://jbhooks.com"
          },
          listing_tier: "premier",
          badges: ["Steakhouse", "Waterfront", "Fine Dining"],
          price_range: "$$$",
          description: "Upscale steakhouse specializing in prime cuts and fresh seafood with stunning lake views.",
          features: {
            reservations: true,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            private_dining: true,
            valet: false
          },
          hours: {
            monday: "5:00 PM - 10:00 PM",
            tuesday: "5:00 PM - 10:00 PM",
            wednesday: "5:00 PM - 10:00 PM",
            thursday: "5:00 PM - 10:00 PM",
            friday: "5:00 PM - 11:00 PM",
            saturday: "4:00 PM - 11:00 PM",
            sunday: "4:00 PM - 9:00 PM"
          },
          happyHour: "4:00 PM - 6:00 PM Mon-Fri"
        },
        {
          id: 303,
          name: "Backwater Jacks Bar & Grill",
          category: "Restaurants & Bars",
          subcategory: "Sports Bars",
          logo: "/images/businesses/backwater-jacks-logo.jpg",
          location: {
            lat: 38.0756,
            lng: -92.6445,
            address: "1148 Bagnell Dam Blvd, Lake Ozark, MO 65049"
          },
          contact: {
            phone: "573-365-2282"
          },
          listing_tier: "premier",
          badges: ["Sports Bar", "Waterfront", "Live Music"],
          price_range: "$$",
          description: "Lively waterfront sports bar with great burgers, cold beer, and live entertainment.",
          features: {
            reservations: false,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            boat_access: true,
            live_music: true,
            sports_viewing: true
          },
          hours: {
            monday: "11:00 AM - 1:00 AM",
            tuesday: "11:00 AM - 1:00 AM",
            wednesday: "11:00 AM - 1:00 AM",
            thursday: "11:00 AM - 1:00 AM",
            friday: "11:00 AM - 2:00 AM",
            saturday: "11:00 AM - 2:00 AM",
            sunday: "11:00 AM - 1:00 AM"
          },
          happyHour: "2:00 PM - 6:00 PM Daily",
          liveMusic: {
            schedule: "Wednesday - Saturday",
            time: "9:00 PM - 1:00 AM"
          }
        },
        {
          id: 304,
          name: "Fish & Co.",
          category: "Dining Out",
          subcategory: "Seafood",
          logo: "/images/businesses/fish-co-logo.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6312,
            address: "1209 Bagnell Dam Blvd, Lake Ozark, MO 65049"
          },
          contact: {
            phone: "573-365-6700"
          },
          listing_tier: "curated",
          badges: ["Fresh Seafood", "Casual Dining"],
          price_range: "$$",
          description: "Fresh seafood and fish market with casual dining atmosphere and daily catches.",
          features: {
            reservations: false,
            outdoor_seating: true,
            waterfront: false,
            full_bar: true,
            takeout: true
          }
        },
        {
          id: 305,
          name: "Coconuts Caribbean Beach Bar & Grill",
          category: "Dining Out",
          subcategory: "Beach Bar",
          logo: "/images/businesses/coconuts-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6356,
            address: "1000 Coconut Dr, Lake Ozark, MO 65049"
          },
          contact: {
            phone: "573-365-2626"
          },
          listing_tier: "premier",
          badges: ["Beach Bar", "Waterfront", "Tropical"],
          price_range: "$$",
          description: "Caribbean-themed beach bar with tropical drinks, island cuisine, and sandy beach area.",
          features: {
            reservations: false,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            beach_area: true,
            boat_access: true,
            volleyball: true
          }
        },
        {
          id: 306,
          name: "Horny Toad Bar & Grill",
          category: "Dining Out",
          subcategory: "Sports Bar",
          logo: "/images/businesses/horny-toad-logo.jpg",
          location: {
            lat: 38.0923,
            lng: -92.6298,
            address: "1774 Bagnell Dam Blvd, Lake Ozark, MO 65049"
          },
          contact: {
            phone: "573-365-3317"
          },
          listing_tier: "curated",
          badges: ["Sports Bar", "Dive Bar", "Local Favorite"],
          price_range: "$",
          description: "Classic dive bar atmosphere with cold beer, bar food, and friendly locals.",
          features: {
            reservations: false,
            outdoor_seating: true,
            waterfront: false,
            full_bar: true,
            pool_tables: true,
            darts: true,
            sports_viewing: true
          }
        },
        {
          id: 307,
          name: "Captain Ron's Bar & Grill",
          category: "Dining Out",
          subcategory: "Waterfront Dining",
          logo: "/images/businesses/captain-rons-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6423,
            address: "1252 Bagnell Dam Blvd, Lake Ozark, MO 65049"
          },
          contact: {
            phone: "573-365-2200"
          },
          listing_tier: "curated",
          badges: ["Waterfront", "Boat Access", "Casual"],
          price_range: "$$",
          description: "Laid-back waterfront spot with boat-up dining, cold drinks, and lake atmosphere.",
          features: {
            reservations: false,
            outdoor_seating: true,
            waterfront: true,
            full_bar: true,
            boat_access: true,
            dock_dining: true
          }
        },

        // ==================== EVENTS & FESTIVALS - 6 businesses ====================
        {
          id: 160,
          name: "Lake of the Ozarks Shootout",
          category: "Events & Festivals",
          subcategory: "Annual Events",
          logo: "/images/businesses/shootout-logo.jpg",
          heroImage: "/images/businesses/shootout-hero.jpg",
          location: {
            lat: 38.0889,
            lng: -92.6334
          },
          contact: {
            phone: "573-348-5000",
            website: "https://shootout.com",
            email: "info@shootout.com"
          },
          listing_tier: "signature",
          badges: ["Premier Event", "High-Performance Boats", "Charity"],
          description: "World-renowned unsanctioned boat race featuring the fastest boats on water. Annual August event raising millions for local charities.",
          features: {
            annual_event: true,
            vip_packages: true,
            hospitality_tents: true,
            charity_beneficiary: true,
            vendor_village: true
          },
          details: {
            month: "August",
            duration: "3 days",
            attendance: "100,000+"
          }
        },
        {
          id: 161,
          name: "Ozarks Amphitheater Concert Series",
          category: "Events & Festivals",
          subcategory: "Concert Series",
          logo: "/images/businesses/amphitheater-series-logo.jpg",
          location: {
            lat: 38.0756,
            lng: -92.6445
          },
          contact: {
            phone: "573-348-5100",
            website: "https://ozarksamphitheater.com"
          },
          listing_tier: "signature",
          badges: ["Major Acts", "Summer Series"],
          description: "Premier outdoor concert venue hosting national touring acts throughout the summer season.",
          features: {
            season_tickets: true,
            vip_boxes: true,
            lawn_seating: true,
            concessions: true,
            parking: true
          }
        },
        {
          id: 162,
          name: "Lake Area Chamber Events",
          category: "Events & Festivals",
          subcategory: "Business Events",
          logo: "/images/businesses/chamber-events-logo.jpg",
          location: {
            lat: 38.0901,
            lng: -92.6312
          },
          contact: {
            phone: "573-348-5200",
            website: "https://lakeareachamber.com"
          },
          listing_tier: "premier",
          badges: ["Networking", "Business Community"],
          description: "Year-round business networking events, galas, and community celebrations.",
          features: {
            networking_events: true,
            annual_gala: true,
            business_expos: true,
            member_benefits: true
          }
        },
        {
          id: 163,
          name: "Lake Wine Festival",
          category: "Events & Festivals",
          subcategory: "Food & Wine",
          logo: "/images/businesses/wine-festival-logo.jpg",
          location: {
            lat: 38.0878,
            lng: -92.6389
          },
          contact: {
            phone: "573-348-5300",
            website: "https://lakewinefestival.com"
          },
          listing_tier: "premier",
          badges: ["Wine Tasting", "Food Vendors"],
          description: "Annual wine festival featuring regional wineries, food vendors, and live entertainment.",
          features: {
            wine_tasting: true,
            food_vendors: true,
            live_music: true,
            vip_area: true
          },
          details: {
            month: "September",
            duration: "2 days"
          }
        },
        {
          id: 164,
          name: "Bagnell Dam Strip Run",
          category: "Events & Festivals",
          subcategory: "Annual Events",
          logo: "/images/businesses/strip-run-logo.jpg",
          location: {
            lat: 38.0867,
            lng: -92.6356
          },
          contact: {
            phone: "573-348-5400",
            website: "https://striprun.com"
          },
          listing_tier: "curated",
          badges: ["Charity Run", "Community Event"],
          description: "Annual 5K/10K run benefiting local charities with scenic lake route and family-friendly atmosphere.",
          features: {
            annual_event: true,
            multiple_distances: true,
            family_friendly: true,
            charity_beneficiary: true,
            post_race_party: true
          },
          details: {
            month: "May",
            distances: "5K, 10K, Kids Fun Run"
          }
        },
        {
          id: 165,
          name: "Fourth of July Fireworks Celebration",
          category: "Events & Festivals",
          subcategory: "Holiday Events",
          logo: "/images/businesses/fireworks-logo.jpg",
          location: {
            lat: 38.0823,
            lng: -92.6412
          },
          contact: {
            phone: "573-348-5500",
            website: "https://lakefireworks.com"
          },
          listing_tier: "premier",
          badges: ["Fireworks", "Family Event"],
          description: "Spectacular Fourth of July fireworks display over the lake with multiple viewing locations and festivities.",
          features: {
            fireworks_display: true,
            multiple_locations: true,
            boat_viewing: true,
            live_entertainment: true,
            food_vendors: true
          }
        }
      ]
    },

    /**
     * Loads categories from businesses.json data file
     * Returns categories with subcategories that match The Hills Guide business data
     */
    async fetchCategories() {
      try {
        // Load categories from the businesses.json file
        const businessData = await import('@/data/businesses.json')
        return businessData.categories || []
      } catch (error) {
        console.error('Error loading categories:', error)
        return []
      }
    },

    /**
     * Fetches advertisement data for interstitials and banners
     * Controls monetization content throughout the app
     *
     * CUSTOMIZATION: Replace with real API endpoint
     * Example: return await fetch('/api/advertisements').then(r => r.json())
     *
     * Ad Types:
     * - interstitial: Full-screen ads between navigation (CategoryInterstitialView)
     * - banner: Header/hero banners on category pages (CategoryListingView)
     */
    async fetchAds() {
      return [
        {
          id: 0,
          business_id: 300,
          business_name: "Shady Gators",
          type: "interstitial",
          category: "Dining Out",
          image: "/images/ads/shady-gators-interstitial.jpg",
          link: "https://shadygators.com",
          title: "Shady Gators",
          description: "Legendary waterfront dining with boat-up access",
          business: "Shady Gators",
          cta_text: "Explore Dining Out",
          priority: 1
        },
        {
          id: 1,
          business_id: 1,
          business_name: "The Grand Reserve",
          type: "interstitial",
          category: "Fine Dining",
          image: "/images/ads/grand-reserve-interstitial.jpg",
          link: "https://grandreserve.com/reservations",
          title: "The Grand Reserve",
          description: "Experience elevated lakeside dining",
          business: "The Grand Reserve",
          cta_text: "Explore Fine Dining",
          priority: 1
        },
        {
          id: 2,
          business_id: 2,
          type: "banner",
          category: "Fine Dining",
          image: "/images/ads/prime-house-banner.jpg",
          link: "https://primehouse.com",
          position: "top_sticky",
          show_pointer: true
        },
        {
          id: 3,
          business_id: 1,
          type: "banner",
          category: "Fine Dining",
          image: "/images/ads/grand-reserve-inline.jpg",
          link: "https://grandreserve.com/menu",
          position: "inline"
        },
        {
          id: 4,
          business_id: 1,
          type: "banner",
          category: "Fine Dining",
          image: "/images/ads/grand-reserve-hero.jpg",
          link: "https://grandreserve.com",
          position: "hero",
          show_pointer: false
        },
        {
          id: 5,
          business_id: 20,
          business_name: "The Lodge Golf Club",
          type: "interstitial",
          category: "Golf & Country Clubs",
          image: "/images/ads/lodge-golf-interstitial.jpg",
          link: "https://4seasonsresort.com/golf",
          title: "The Lodge Golf Club",
          description: "Championship golf at its finest",
          business: "The Lodge of Four Seasons",
          cta_text: "Explore Golf",
          priority: 1
        },
        {
          id: 6,
          business_id: 81,
          business_name: "Luxury Yacht Charters",
          type: "interstitial",
          category: "Luxury Services",
          image: "/images/ads/yacht-charters-interstitial.jpg",
          link: "https://luxuryyachtcharters.com",
          title: "Luxury Yacht Charters",
          description: "Exclusive yacht experiences",
          business: "Luxury Yacht Charters",
          cta_text: "Explore Luxury Services",
          priority: 1
        },
        {
          id: 7,
          business_id: 60,
          business_name: "Sunset Cruise & Live Music",
          type: "interstitial",
          category: "Live Entertainment",
          image: "/images/ads/sunset-cruise-interstitial.jpg",
          link: "https://sunsetcruiselake.com",
          title: "Sunset Cruise & Live Music",
          description: "Luxury dinner cruises with live entertainment",
          business: "Sunset Cruise & Live Music",
          cta_text: "Explore Live Entertainment",
          priority: 1
        },
        {
          id: 8,
          business_id: 40,
          business_name: "Lake of the Ozarks Sotheby's International Realty",
          type: "interstitial",
          category: "Luxury Real Estate",
          image: "/images/ads/sothebys-interstitial.jpg",
          link: "https://lakeozarks.sothebysrealty.com",
          title: "Sotheby's International Realty",
          description: "Premier luxury real estate at the Lake",
          business: "Sotheby's International Realty",
          cta_text: "Explore Luxury Real Estate",
          priority: 1
        },
        {
          id: 9,
          business_id: 300,
          type: "banner",
          category: "Dining Out",
          image: "/images/ads/shady-gators-banner.jpg",
          link: "https://shadygators.com",
          position: "top_sticky",
          show_pointer: true
        },
        {
          id: 10,
          business_id: 301,
          type: "banner",
          category: "Dining Out",
          image: "/images/ads/margaritaville-banner.jpg",
          link: "https://margaritavilleresorts.com",
          position: "inline"
        },
        {
          id: 11,
          business_id: 31,
          business_name: "Little Explorers Academy",
          type: "interstitial",
          category: "Children",
          image: "/images/ads/little-explorers-interstitial.jpg",
          link: "https://littleexplorers.com",
          title: "Little Explorers Academy",
          description: "Premier educational center with interactive STEM programs for young minds",
          business: "Little Explorers Academy",
          cta_text: "Explore Children Activities",
          priority: 1
        }
      ]
    },

    addBusiness(business) {
      this.businesses.push({
        ...business,
        id: Math.max(...this.businesses.map(b => b.id), 0) + 1
      })
    },

    updateBusiness(id, updates) {
      const index = this.businesses.findIndex(b => b.id === id)
      if (index !== -1) {
        this.businesses[index] = { ...this.businesses[index], ...updates }
      }
    }
  }
})

