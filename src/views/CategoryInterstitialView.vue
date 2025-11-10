<template>
  <!--
    CategoryInterstitialView Component

    A brief advertisement screen shown when users navigate from home to category.
    Displays promotional content while building anticipation for the category listings.

    Key Features:
    - Full-screen advertisement display with business integration
    - Automatic countdown timer (3 seconds) for smooth UX flow
    - Interactive ad that opens business modal when clicked
    - Fallback content when no ad is available
    - Pause/resume countdown when modal is opened/closed

    Navigation Flow:
    HomeView → CategoryInterstitialView → CategoryListingView

    Monetization:
    - Premium advertising space with high visibility
    - Integration with business modal for lead generation
    - Timed display ensures users see ads before continuing

    Props via Route Params:
    - categoryName: Category to show interstitial for (e.g., "Dining Out")

    Usage:
    Auto-navigated from HomeView when user clicks category card
  -->
  <div class="interstitial-view">
    <TopBar :title="categoryName" @toggle-menu="toggleSideMenu" :show-back="true" />

    <div class="interstitial-content">
      <!-- ===== MAIN ADVERTISEMENT DISPLAY ===== -->
      <!-- Interactive ad with business integration - click opens business modal -->
      <div v-if="ad" class="ad-container" @click="openBusinessModal">
        <img
          :src="ad.image"
          :alt="ad.title"
          class="ad-image"
          @error="handleImageError"
        />
        <!-- Overlay with ad content and call-to-action -->
        <div class="ad-overlay">
          <h2 class="ad-title">{{ ad.title }}</h2>
          <p v-if="ad.description" class="ad-description">{{ ad.description }}</p>
          <div class="ad-cta">
            <span class="tap-indicator">👆 Tap to learn more</span>
          </div>
        </div>
      </div>

      <!-- ===== FALLBACK CONTENT ===== -->
      <!-- Shown when no advertisement is available for this category -->
      <div v-else class="ad-container fallback">
        <div class="fallback-content">
          <div class="category-icon">{{ getCategoryIcon(categoryName) }}</div>
          <h2 class="fallback-title">{{ categoryName }}</h2>
          <p class="fallback-text">Discover premier establishments</p>
        </div>
      </div>

      <!-- ===== ACTION CONTROLS ===== -->
      <!-- User controls for navigation and countdown display -->
      <div class="action-container">
        <!-- Primary action button - continues to category listing -->
        <button @click="continueToCategory" class="continue-button">
          {{ ad?.cta_text || `Explore ${categoryName}` }}
          <span class="arrow">→</span>
        </button>

        <!-- Skip option for users who want to continue immediately -->
        <button @click="continueToCategory" class="skip-button">
          Skip
        </button>

        <!-- Countdown timer display (auto-continues after 3 seconds) -->
        <p class="timer-text">Continuing in {{ countdown }} seconds...</p>
      </div>

      <!-- ===== ADVERTISEMENT ATTRIBUTION ===== -->
      <!-- Shows featured partner information for transparency -->
      <div v-if="ad && ad.business" class="ad-info">
        <p class="sponsored-text">Featured Partner: {{ ad.business }}</p>
      </div>
    </div>

    <BottomNav />

    <!-- ===== SIDE NAVIGATION MENU ===== -->
    <transition name="slide">
      <SideMenu v-if="showSideMenu" @close="toggleSideMenu" />
    </transition>

    <!-- ===== BUSINESS DETAILS MODAL ===== -->
    <!-- Opens when user clicks advertisement for more information -->
    <!-- Integrates ads with detailed business information for lead generation -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
/*
 * CategoryInterstitialView Component Script
 *
 * Handles the advertisement interstitial screen between category selection and listing.
 * Key responsibilities:
 * - Display advertisements with countdown timer
 * - Integrate ads with business modal for lead generation
 * - Provide smooth UX transition between navigation states
 * - Handle timer pause/resume when modal opens/closes
 *
 * Business Logic:
 * - 3-second countdown for optimal user experience
 * - Automatic progression to category listing
 * - Ad click integration with business details
 * - Fallback content when no ads available
 */

// ===== IMPORTS =====
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

// ===== SETUP AND DEPENDENCIES =====
const route = useRoute()
const router = useRouter()
const businessStore = useBusinessStore()

// ===== REACTIVE STATE =====
const showSideMenu = ref(false)                    // Side menu visibility
const countdown = ref(3)                           // Timer countdown (3 seconds for affluent users)
let countdownInterval = null                       // Timer interval reference

// Business Modal State
const selectedBusiness = ref(null)                 // Selected business for modal
const showBusinessModal = ref(false)               // Modal visibility state

// ===== COMPUTED PROPERTIES =====

/**
 * Gets category name from route parameters with fallback
 */
const categoryName = computed(() => route.params.categoryName || 'Category')

/**
 * Fetches interstitial advertisement for current category
 * Returns null if no ad is configured for this category
 */
const ad = computed(() => {
  return businessStore.getInterstitialAd(categoryName.value)
})

// ===== UTILITY FUNCTIONS =====

/**
 * Maps category names to display icons for fallback content
 * CUSTOMIZATION: Add new categories and their representative emojis here
 */
const getCategoryIcon = (category) => {
  const iconMap = {
    'Dining Out': '🍽️',
    'Fine Dining': '🍽️',
    'Golf & Country Clubs': '⛳',
    'Luxury Real Estate': '🏠',
    'Live Entertainment': '🎸',
    'Luxury Services': '⚓',
    'Wellness & Fitness': '🏋️',
    'Shopping & Retail': '🛍️',
    'Charity & Community': '❤️',
    'Events & Festivals': '🎉',
    'Lake Services': '⚓',
    'Lake Fun': '🎉',
    'Local Media': '📰',
    'West Side': '🏔️',
    'LOZ Deals': '💰',
    'Podcast Network': '🎙️'
  }
  return iconMap[category] || '📍' // Default icon for unmapped categories
}

// ===== EVENT HANDLERS =====

/**
 * Toggles side menu visibility
 */
const toggleSideMenu = () => {
  showSideMenu.value = !showSideMenu.value
}

/**
 * Navigates to category listing page and cleans up timer
 * Called by countdown timer, continue button, or skip button
 */
const continueToCategory = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  router.push({
    name: 'CategoryListing',
    params: { categoryName: categoryName.value }
  })
}

/**
 * Handles ad image loading errors with fallback placeholder
 * CUSTOMIZATION: Replace placeholder URL with branded fallback image
 */
const handleImageError = (e) => {
  // Use a simple data URL to avoid external request failures
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmaWxsPSIjMDBEOUZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiPkFkdmVydGlzZW1lbnQ8L3RleHQ+Cjwvc3ZnPgo='
}

/**
 * Opens business modal when ad is clicked
 * Integrates advertisement with detailed business information for lead generation
 * Pauses countdown timer while modal is open
 */
const openBusinessModal = () => {
  if (ad.value?.business_id) {
    const business = businessStore.getBusinessById(ad.value.business_id)
    if (business) {
      selectedBusiness.value = business
      showBusinessModal.value = true
      // Pause the countdown when modal opens for better UX
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }
}

/**
 * Closes business modal and resumes countdown timer
 * Continues countdown where it left off if time remaining
 */
const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
  // Resume countdown when modal closes (if time remaining)
  if (!countdownInterval && countdown.value > 0) {
    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        continueToCategory()
      }
    }, 1000)
  }
}

// ===== LIFECYCLE HOOKS =====

/**
 * Component initialization - starts the countdown timer
 * Timer automatically progresses to category listing after 3 seconds
 */
onMounted(() => {
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      continueToCategory() // Auto-continue when countdown reaches 0
    }
  }, 1000) // Update every second
})

/**
 * Component cleanup - ensures timer is cleared to prevent memory leaks
 * Important for proper cleanup when component is destroyed
 */
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<!-- All styles moved to src/assets/styles/pages/category-interstitial.css -->
