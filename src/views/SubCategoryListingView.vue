<template>
  <!--
    SubcategoryListingView Component

    Displays businesses within a specific subcategory using a three-tier system:
    1. Signature Establishments - Premium full-width cards with hero images
    2. Featured Listings - Grid cards with logos and basic info
    3. Additional Choices - Compact list items for more options

    Props via Route Params:
    - categoryName: Main category (e.g., "Dining Out")
    - subcategoryName: Sub-category (e.g., "Waterfront Dining")

    Features:
    - Premium filter system for business features
    - Three-tier monetization display system
    - Business modal integration for details
    - Responsive design with mobile-first approach

    Usage:
    Accessed via router from CategoryListingView when user clicks subcategory
  -->
  <div class="subcategory-listing-view">
    <TopBar :title="subcategoryName" :show-back="true" />

    <div class="listing-content">
      <!-- ===== PREMIUM FILTER SYSTEM ===== -->
      <!-- Filter buttons for business features (waterfront, valet, etc.) -->
      <div v-if="filters.length" class="filter-bar">
        <button
          v-for="filter in filters"
          :key="filter.key"
          :class="['filter-btn', { active: activeFilters.includes(filter.key) }]"
          @click="toggleFilter(filter.key)"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- ===== TIER 1: SIGNATURE ESTABLISHMENTS ===== -->
      <!-- Premium businesses - full-width cards with hero images and detailed info -->
      <!-- These are the highest-paying advertisers with maximum visibility -->
      <section v-if="signatureBusinesses.length" class="signature-section">
        <h2 class="section-title">
          <span class="icon">⭐</span>
          Signature Establishments
        </h2>
        <div class="signature-grid">
          <div
            v-for="business in signatureBusinesses"
            :key="business.id"
            class="signature-card"
            @click="openBusinessModal(business)"
          >
            <!-- Hero image with optional badge overlay -->
            <div class="signature-image-wrapper">
              <img
                :src="business.heroImage || business.logo"
                :alt="business.name"
                class="signature-image"
                @error="handleImageError"
              />
              <!-- Premium badge display (e.g., "Award Winner", "Michelin Rated") -->
              <div v-if="business.badges && business.badges.length" class="badge-overlay">
                <span class="top-badge">{{ business.badges[0] }}</span>
              </div>
            </div>

            <!-- Business information section -->
            <div class="signature-info">
              <div class="signature-header">
                <h3 class="business-name">{{ business.name }}</h3>
              </div>
              <p class="business-description">{{ business.description }}</p>

              <!-- Feature tags (amenities and services) -->
              <div v-if="business.features" class="features-list">
                <span v-if="business.features.valet" class="feature-tag">Valet</span>
                <span v-if="business.features.private_dining" class="feature-tag">Private Dining</span>
                <span v-if="business.features.waterfront" class="feature-tag">Waterfront</span>
                <span v-if="business.features.reservations" class="feature-tag">Reservations</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- ===== TIER 2: FEATURED LISTINGS ===== -->
      <!-- Mid-tier businesses - 2-3 column grid with logos and condensed info -->
      <!-- Good visibility and branding without premium hero treatment -->
      <section v-if="premierBusinesses.length" class="premier-section">
        <h2 class="section-title">Featured Listings</h2>
        <div class="premier-grid">
          <div
            v-for="business in premierBusinesses"
            :key="business.id"
            class="premier-card"
            @click="openBusinessModal(business)"
          >
            <!-- Business logo/image -->
            <img
              :src="business.logo"
              :alt="business.name"
              class="premier-logo"
              @error="handleImageError"
            />

            <!-- Condensed business information -->
            <div class="premier-info">
              <h3 class="business-name">{{ business.name }}</h3>
              <p class="business-description-short">{{ truncate(business.description, 60) }}</p>

              <!-- Optional badge -->
              <div class="premier-meta">
                <span v-if="business.badges && business.badges.length" class="badge-inline">
                  {{ business.badges[0] }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- ===== TIER 3: ADDITIONAL CHOICES ===== -->
      <!-- Entry-level businesses - compact list format for basic visibility -->
      <!-- Cost-effective listing option with minimal space but still discoverable -->
      <section v-if="curatedBusinesses.length" class="curated-section">
        <h2 class="section-title">Additional Choices</h2>
        <div class="curated-list">
          <div
            v-for="business in curatedBusinesses"
            :key="business.id"
            class="curated-item"
            @click="openBusinessModal(business)"
          >
            <!-- Small business logo -->
            <img
              :src="business.logo"
              :alt="business.name"
              class="curated-logo"
              @error="handleImageError"
            />

            <!-- Basic business information -->
            <div class="curated-info">
              <h4 class="business-name">{{ business.name }}</h4>
              <p class="business-description-short">{{ truncate(business.description, 80) }}</p>
            </div>

            <!-- Navigation indicator -->
            <div class="curated-meta">
              <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== EMPTY STATE ===== -->
      <!-- Shown when no businesses match current filters or subcategory has no listings -->
      <div v-if="!signatureBusinesses.length && !premierBusinesses.length && !curatedBusinesses.length" class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">No Establishments Found</h3>
        <p class="empty-text">We're curating the finest {{ subcategoryName }} experiences for you.</p>
        <button @click="goBack" class="back-button">Browse Other Categories</button>
      </div>
    </div>

    <BottomNav />

    <!-- ===== BUSINESS DETAILS MODAL ===== -->
    <!-- Full-screen modal for detailed business information -->
    <!-- Replaces navigation to separate page for better UX -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
/*
 * SubcategoryListingView Component Script
 *
 * Handles the display and filtering of businesses within a specific subcategory.
 * Implements a three-tier monetization system with premium filter capabilities.
 *
 * Key Features:
 * - Dynamic filtering by business features (waterfront, valet, etc.)
 * - Three-tier display system for different ad tiers
 * - Business modal integration for detailed views
 * - Responsive design with mobile-first approach
 *
 * Data Flow:
 * Route Params → Store Query → Filter Logic → Tier Separation → Display
 */

// ===== IMPORTS =====
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

// ===== SETUP AND DEPENDENCIES =====
const router = useRouter()
const route = useRoute()
const businessStore = useBusinessStore()

// ===== REACTIVE STATE =====
const categoryName = computed(() => route.params.categoryName)        // Main category (e.g., "Dining Out")
const subcategoryName = computed(() => route.params.subcategoryName)  // Sub-category (e.g., "Waterfront Dining")
const businesses = computed(() => {                                   // All businesses for this subcategory
  return businessStore.getBusinessesBySubcategory(categoryName.value, subcategoryName.value)
})
const activeFilters = ref([])                             // Currently applied feature filters
const selectedBusiness = ref(null)                        // Business selected for modal view
const showBusinessModal = ref(false)                      // Modal visibility state

// ===== FILTER CONFIGURATION =====
// Available filters for business features - easily customizable
const filters = [
  { key: 'waterfront', label: 'Waterfront' },
  { key: 'reservations', label: 'Reservations' },
  { key: 'valet', label: 'Valet' },
  { key: 'private_dining', label: 'Private Dining' }
]

// ===== COMPUTED PROPERTIES =====

/**
 * Filters businesses based on active feature filters
 * Uses AND logic - business must have ALL selected features
 */
const filteredBusinesses = computed(() => {
  if (!businesses.value || activeFilters.value.length === 0) {
    return businesses.value || [] // No filters = show all businesses, handle undefined case
  }

  return businesses.value.filter(business => {
    return activeFilters.value.every(filter => {
      return business.features && business.features[filter] === true
    })
  })
})

/**
 * Three-tier system for monetization and display hierarchy
 * Separates businesses by their listing tier for appropriate presentation
 */

// Tier 1: Premium businesses with hero images and maximum visibility
const signatureBusinesses = computed(() =>
  filteredBusinesses.value.filter(b => b.listing_tier === 'signature')
)

// Tier 2: Featured businesses in grid format with good visibility
const premierBusinesses = computed(() =>
  filteredBusinesses.value.filter(b => b.listing_tier === 'premier')
)

// Tier 3: Basic listings in compact list format
const curatedBusinesses = computed(() =>
  filteredBusinesses.value.filter(b => b.listing_tier === 'curated')
)

// ===== LIFECYCLE HOOKS =====

// No longer needed - businesses are fetched reactively via computed properties

// ===== EVENT HANDLERS =====

/**
 * Opens business details in full-screen modal
 * Replaces navigation to separate page for better UX
 */
const openBusinessModal = (business) => {
  selectedBusiness.value = business
  showBusinessModal.value = true
}

/**
 * Closes business modal and resets selection
 */
const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}

/**
 * Toggles filter on/off - removes if active, adds if inactive
 * Supports multiple simultaneous filters with AND logic
 */
const toggleFilter = (filterKey) => {
  const index = activeFilters.value.indexOf(filterKey)
  if (index > -1) {
    activeFilters.value.splice(index, 1) // Remove filter
  } else {
    activeFilters.value.push(filterKey)   // Add filter
  }
}

/**
 * Navigation helper - returns to home page
 */
const goBack = () => {
  router.push({ name: 'Home' })
}

// ===== UTILITY FUNCTIONS =====

/**
 * Text truncation for consistent display lengths
 * CUSTOMIZATION: Adjust length parameters for different tiers as needed
 */
const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Image error fallback handler
 * CUSTOMIZATION: Replace placeholder URL with your branded fallback image
 */
const handleImageError = (e) => {
  // Use a simple data URL to avoid external request failures
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjMDBEOUZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
}
</script>

<!-- All styles moved to src/assets/styles/pages/subcategory-listing.css -->
