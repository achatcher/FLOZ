/**
 * The Greenville Social - Vue Router Configuration
 *
 * Defines the client-side routing structure for the mountain community lifestyle directory.
 * Uses Vue Router 4 with HTML5 history mode for clean URLs and SEO benefits.
 *
 * Application Flow:
 * Home → Category Selection → Interstitial Ad → Business Listing → Business Detail
 *
 * Key Features:
 * - Dynamic route parameters for category and business navigation
 * - Interstitial advertising between category selection and business listing
 * - Mobile-optimized navigation with swipe gesture support
 * - SEO-friendly URLs for better search engine indexing
 *
 * Route Hierarchy:
 * 1. Landing & Discovery: Home, Search, Explore (Map)
 * 2. Business Discovery: Category → Interstitial → Listing → Detail
 * 3. Events & Experiences: Events calendar and featured experiences
 * 4. Utility Pages: Share, Contact, Spotlights
 * 5. Special Features: Cocktail Hour (time-sensitive promotions)
 */

// ===== VUE ROUTER IMPORTS =====
import { createRouter, createWebHistory } from 'vue-router'

// ===== PAGE COMPONENTS =====
// Import all view components (pages) for the application
// These are lazy-loaded components for better performance

// Core navigation pages
import HomeView from '@/views/HomeView.vue'                    // Landing page with category grid
import SearchView from '@/views/SearchView.vue'                // Business search functionality
import MapView from '@/views/MapView.vue'                      // Interactive map with markers

// Business discovery flow
import CategoryInterstitialView from '@/views/CategoryInterstitialView.vue'  // Advertisement screen
import CategoryListingView from '@/views/CategoryListingView.vue'            // Business category listings
import SubcategoryListingView from '@/views/SubcategoryListingView.vue'     // Subcategory listings
import BusinessDetailView from '@/views/BusinessDetailView.vue'             // Individual business pages

// Event system
import EventsView from '@/views/EventsView.vue'                // Events calendar and featured events

// Utility and special pages
import ContactView from '@/views/ContactView.vue'              // Contact information and support
import ShareView from '@/views/ShareView.vue'                  // App sharing with QR codes
import SpotlightsView from '@/views/SpotlightsView.vue'        // Community announcements and updates
import CocktailHourView from '@/views/CocktailHourView.vue'    // Time-sensitive happy hour deals
import ConfigTestView from '@/views/ConfigTestView.vue'        // Configuration system testing
import TierVisualizationView from '@/views/TierVisualizationView.vue'  // Business tier comparison

/**
 * Route Definitions
 *
 * Each route object defines:
 * - path: URL pattern with dynamic parameters
 * - name: Route name for programmatic navigation
 * - component: Vue component to render
 * - meta: Additional route metadata (SEO, auth, etc.)
 */
const routes = [
  /**
   * HOME ROUTE - Landing Page
   * Path: /
   * Purpose: Main entry point with category navigation grid
   * Features: Hero section, category cards, featured businesses
   */
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'The Greenville Social - Mountain Community Lifestyle',
      description: 'Your guide to Greenville\'s finest dining, outdoor adventures, and premium services',
      requiresAuth: false
    }
  },

  /**
   * INTERSTITIAL ADVERTISEMENT ROUTE
   * Path: /category/:categoryName/interstitial
   * Purpose: Display full-screen advertisement before business listing
   * Monetization: Premium advertising space with high visibility
   * Parameters: categoryName - The business category being accessed
   */
  {
    path: '/category/:categoryName/interstitial',
    name: 'CategoryInterstitial',
    component: CategoryInterstitialView,
    meta: {
      title: 'Loading - The Greenville Social',
      description: 'Featured partner advertisement',
      requiresAuth: false
    }
  },

  /**
   * BUSINESS CATEGORY LISTING ROUTE
   * Path: /category/:categoryName
   * Purpose: Display businesses within a specific category
   * Features: Three-tier system (Signature, Premier, Curated)
   * Parameters: categoryName - Business category (e.g., "Fine Dining")
   */
  {
    path: '/category/:categoryName',
    name: 'CategoryListing',
    component: CategoryListingView,
    meta: {
      title: 'Category - The Greenville Social',
      description: 'Curated businesses in luxury categories',
      requiresAuth: false
    }
  },

  /**
   * SUBCATEGORY LISTING ROUTE
   * Path: /category/:categoryName/:subcategoryName
   * Purpose: Further refined business listings within subcategories
   * Parameters:
   *   - categoryName: Main category
   *   - subcategoryName: Specific subcategory
   */
  {
    path: '/category/:categoryName/:subcategoryName',
    name: 'SubcategoryListing',
    component: SubcategoryListingView,
    meta: {
      title: 'Subcategory - The Greenville Social',
      description: 'Specialized luxury business listings',
      requiresAuth: false
    }
  },

  /**
   * BUSINESS DETAIL ROUTE
   * Path: /business/:businessId
   * Purpose: Individual business information page
   * Features: Contact info, hours, directions, reviews, gallery
   * Parameters: businessId - Unique business identifier
   */
  {
    path: '/business/:businessId',
    name: 'BusinessDetail',
    component: BusinessDetailView,
    meta: {
      title: 'Business Details - The Greenville Social',
      description: 'Comprehensive business information and contact details',
      requiresAuth: false
    }
  },

  /**
   * CONTACT INFORMATION ROUTE
   * Path: /contact
   * Purpose: App support, feedback, and contact information
   * Features: Support forms, developer contact, app information
   */
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
    meta: {
      title: 'Contact Us - The Greenville Social',
      description: 'Get in touch with The Greenville Social team',
      requiresAuth: false
    }
  },

  /**
   * SEARCH FUNCTIONALITY ROUTE
   * Path: /search
   * Purpose: Advanced business search with filtering
   * Features: Real-time search, category filters, location-based results
   */
  {
    path: '/search',
    name: 'Search',
    component: SearchView,
    meta: {
      title: 'Search - The Greenville Social',
      description: 'Find luxury businesses and services',
      requiresAuth: false
    }
  },

  /**
   * APP SHARING ROUTE
   * Path: /share
   * Purpose: Share the app via QR codes and social media
   * Features: QR code generation, social sharing, app promotion
   */
  {
    path: '/share',
    name: 'Share',
    component: ShareView,
    meta: {
      title: 'Share App - The Greenville Social',
      description: 'Share The Greenville Social with friends and family',
      requiresAuth: false
    }
  },

  /**
   * INTERACTIVE MAP ROUTE
   * Path: /explore
   * Purpose: Full-screen interactive map with business markers
   * Features: Leaflet map, custom gold markers, location search
   * Note: Uses '/explore' for better UX than '/map'
   */
  {
    path: '/explore',
    name: 'Explore',
    component: MapView,
    meta: {
      title: 'Explore Map - The Greenville Social',
      description: 'Discover businesses on interactive map',
      requiresAuth: false
    }
  },

  /**
   * EVENTS CALENDAR ROUTE
   * Path: /events
   * Purpose: Event discovery and calendar management
   * Features: Interactive calendar, featured events, event details
   */
  {
    path: '/events',
    name: 'Events',
    component: EventsView,
    meta: {
      title: 'Events Calendar - The Greenville Social',
      description: 'Discover exclusive events and experiences',
      requiresAuth: false
    }
  },

  /**
   * ANNOUNCEMENTS ROUTE
   * Path: /spotlights
   * Purpose: Community announcements and updates
   * Features: Dynamic announcements, community stats, app updates
   */
  {
    path: '/spotlights',
    name: 'Spotlights',
    component: SpotlightsView,
    meta: {
      title: 'Announcements - The Greenville Social',
      description: 'Stay updated with community news and announcements',
      requiresAuth: false
    }
  },

  /**
   * COCKTAIL HOUR ROUTE
   * Path: /cocktail-hour
   * Purpose: Time-sensitive happy hour deals and promotions
   * Features: Live deals, time-sensitive offers, location-based promotions
   * Note: Special route for real-time promotional content
   */
  {
    path: '/cocktail-hour',
    name: 'CocktailHour',
    component: CocktailHourView,
    meta: {
      title: 'Cocktail Hour - The Greenville Social',
      description: 'Live happy hour deals and special promotions',
      requiresAuth: false
    }
  },

  /**
   * CONFIGURATION TEST ROUTE
   * Path: /config-test
   * Purpose: Testing dynamic configuration system functionality
   * Features: Location switching, store testing, configuration validation
   * Note: Development/testing route for configuration system
   */
  {
    path: '/config-test',
    name: 'ConfigTest',
    component: ConfigTestView,
    meta: {
      title: 'Configuration Test - The Greenville Social',
      description: 'Dynamic configuration system testing interface',
      requiresAuth: false
    }
  },

  /**
   * TIER VISUALIZATION ROUTE
   * Path: /tiers
   * Purpose: Business advertising tier comparison and visualization
   * Features: Interactive tier cards, pricing comparison, feature tables
   * Note: Helps businesses understand tier options and pricing
   */
  {
    path: '/tiers',
    name: 'TierVisualization',
    component: TierVisualizationView,
    meta: {
      title: 'Business Advertising Tiers - The Greenville Social',
      description: 'Choose the perfect advertising tier for your business visibility',
      requiresAuth: false
    }
  }
]

/**
 * Router Configuration
 *
 * Creates the Vue Router instance with:
 * - HTML5 History Mode: Clean URLs without hash (#)
 * - Route definitions for all application pages
 * - Mobile gesture integration for swipe navigation
 */
const router = createRouter({
  // Use HTML5 history mode for clean URLs (requires server configuration)
  // Benefits: SEO-friendly URLs, better user experience, native browser navigation
  history: createWebHistory(),

  // All route definitions
  routes,

  // Scroll behavior configuration
  scrollBehavior(to, from, savedPosition) {
    // If user used browser back/forward buttons, restore scroll position
    if (savedPosition) {
      return savedPosition
    }
    // For new navigation, scroll to top of page
    return { top: 0 }
  }
})

/**
 * Navigation Guards
 *
 * These run before each route change and can:
 * - Check authentication status
 * - Update page titles and meta tags
 * - Track analytics
 * - Handle loading states
 */

// Global before guard - runs before every route change
router.beforeEach((to, from, next) => {
  // Update page title from route meta or generate dynamic title
  if (to.meta.title) {
    document.title = to.meta.title
  } else if (to.params.categoryName) {
    document.title = `${to.params.categoryName} - The Greenville Social`
  } else {
    document.title = 'The Greenville Social - Luxury Lifestyle Directory'
  }

  // Update meta description for SEO
  if (to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }

  // Continue with navigation
  next()
})

// Global after guard - runs after every route change
router.afterEach((to, from) => {
  // Track page views for analytics (implement with your analytics service)
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_TRACKING_ID', {
      page_title: document.title,
      page_location: window.location.href
    })
  }
})

export default router
