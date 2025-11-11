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
      <!-- ===== HERO BANNER ADVERTISEMENT ===== -->
      <!-- MONETIZATION: Premium advertising space consistent with category pages -->
      <div v-if="heroBanner" class="hero-banner">
        <img
          :src="heroBanner.image"
          :alt="heroBanner.title"
          class="hero-image"
          @click="openAdLink(heroBanner.link)"
          @error="handleImageError"
        />

        <!-- ===== COMPANY BRANDING/SPONSORSHIP ===== -->
        <!-- Shows clear sponsorship attribution for transparency and brand awareness -->
        <div class="sponsorship-branding">
          <p class="sponsored-by-text">
            Sponsored by <span class="company-name">{{ heroBanner.title }}</span>
          </p>
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
import { useAppConfig } from '@/composables/useAppConfig'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

// ===== SETUP AND DEPENDENCIES =====
const route = useRoute()
const router = useRouter()
const businessStore = useBusinessStore()
const { initializeApp, getCurrentBusinesses } = useAppConfig()

// ===== REACTIVE STATE =====
const showSideMenu = ref(false)                    // Side menu visibility
const countdown = ref(3)                           // Timer countdown (3 seconds for affluent users)
let countdownInterval = null                       // Timer interval reference
const heroBanner = ref(null)                       // Hero banner advertisement
const ad = ref(null)                               // Interstitial advertisement data

// Business Modal State
const selectedBusiness = ref(null)                 // Selected business for modal
const showBusinessModal = ref(false)               // Modal visibility state

// ===== COMPUTED PROPERTIES =====

/**
 * Gets category name from route parameters with fallback
 */
const categoryName = computed(() => route.params.categoryName || 'Category')


// ===== UTILITY FUNCTIONS =====


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
  // Use a brand-appropriate fallback image with forest green theme
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMkY1MjMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmaWxsPSIjRDRBRjM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIj5GZWF0dXJlZCBBZHZlcnRpc2VtZW50PC90ZXh0Pgo8L3N2Zz4K'
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

/**
 * Handles hero banner ad clicks
 * Opens business modal if ad has business_id, otherwise opens external link
 */
const openAdLink = (link) => {
  console.log('🔍 Interstitial ad clicked', {
    category: categoryName.value,
    business_id: heroBanner.value?.business_id,
    link: link,
    heroBanner: heroBanner.value
  })

  // Check if this is a banner ad with a business_id
  if (heroBanner.value?.business_id) {
    const allBusinesses = getCurrentBusinesses.value || []
    const business = allBusinesses.find(b => b.id === heroBanner.value.business_id)
    console.log('📋 Business found for ad:', business)

    if (business) {
      console.log('✅ Opening business modal for:', business.name)
      selectedBusiness.value = business
      showBusinessModal.value = true
      // Pause countdown when modal opens
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      return
    } else {
      console.error('❌ Business not found for ID:', heroBanner.value.business_id)
    }
  }

  // Fallback to opening external link
  if (link && link !== '#') {
    console.log('🔗 Opening external link:', link)
    window.open(link, '_blank')
  } else {
    console.log('❌ No valid link or business_id found')
  }
}

// ===== LIFECYCLE HOOKS =====

/**
 * Component initialization - starts the countdown timer and loads hero banner
 * Timer automatically progresses to category listing after 3 seconds
 */
onMounted(async () => {
  // Initialize the app to load dynamic configuration
  try {
    await initializeApp()
    console.log('✅ App initialized for CategoryInterstitialView')
  } catch (error) {
    console.error('❌ Failed to initialize app for CategoryInterstitialView:', error)
  }

  // Ensure business data is loaded first
  await businessStore.loadData()
  console.log('📊 Business store loaded. Ads available:', !!businessStore.ads)

  // Load interstitial ad data
  ad.value = businessStore.getInterstitialAd(categoryName.value)
  console.log('📢 Interstitial ad data:', ad.value)

  // Initialize hero banner with category-specific ads using actual business images
  heroBanner.value = businessStore.getBannerAd(categoryName.value, 'hero')

  console.log('🔍 Checking heroBanner setup for category:', categoryName.value)
  console.log('🔍 heroBanner from getBannerAd:', heroBanner.value)

  if (!heroBanner.value) {
    // Dynamic category-specific ads using tier-based selection
    let featuredBusiness = null

    const allBusinesses = getCurrentBusinesses.value || []
    console.log('🔍 All businesses loaded:', allBusinesses.length)

    // Get businesses for this specific category
    const categoryBusinesses = allBusinesses.filter(b => b.category === categoryName.value)
    console.log(`🔍 Businesses in ${categoryName.value}:`, categoryBusinesses.length, categoryBusinesses.map(b => ({ name: b.name, tier: b.tier })))

    // Priority: Signature tier first, then Premier tier for interstitial ads
    featuredBusiness = categoryBusinesses.find(b => b.tier === 'signature') ||
                      categoryBusinesses.find(b => b.tier === 'premier') ||
                      categoryBusinesses[0] // fallback to first business in category

    console.log(`🎯 Selected featured business for ${categoryName.value}:`, featuredBusiness?.name, 'Tier:', featuredBusiness?.tier, 'ID:', featuredBusiness?.id)

    if (featuredBusiness) {
      console.log('✅ Featured business found for', categoryName.value, ':', featuredBusiness.name, 'ID:', featuredBusiness.id)
      heroBanner.value = {
        image: featuredBusiness.heroImage || featuredBusiness.logo || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop&crop=center',
        title: featuredBusiness.name,
        business_id: featuredBusiness.id,
        link: '#'
      }
      console.log('🔍 Created heroBanner:', heroBanner.value)
    } else {
      console.warn('❌ No featured business found for category:', categoryName.value)
      heroBanner.value = {
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMkY1MjMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmaWxsPSIjRDRBRjM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIj5GZWF0dXJlZCBCdXNpbmVzczwvdGV4dD4KPC9zdmc+Cg==',
        title: 'Featured Business',
        link: '#'
      }
    }
  }

  // Start countdown timer
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
