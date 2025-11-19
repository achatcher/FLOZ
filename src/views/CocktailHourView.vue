<template>
  <div class="cocktail-hour-view">
    <TopBar :title="pageConfig.displayName || 'Cocktail Hour'" :show-back="true" />

    <!-- ===== HERO ADVERTISEMENT ===== -->
    <!-- MONETIZATION: Premium advertising space for cocktail lounges -->
    <HeroAdCard
      v-if="heroAd"
      :business="heroAd"
      layout="split"
      cta-text="View Details"
      badge-text="SIGNATURE"
      @click="openBusinessModal"
      @image-error="handleImageError"
    />

    <!-- Header -->
    <div class="cocktail-header">
      <div class="container">
        <h1 class="page-title">{{ pageConfig.displayName || 'Cocktail Hour' }}</h1>
        <p class="page-subtitle">{{ getCurrentDateString() }} • Happy Hour Specials</p>
      </div>
    </div>

    <!-- Day Selector & Happy Hour Specials -->
    <section class="daily-specials">
      <div class="container">
        <!-- Day Selector -->
        <div class="day-selector">
          <div class="section-header">
            <h2 class="section-title">Happy Hour Specials</h2>
            <button class="btn btn-filter" @click="toggleCategoryFilter" :class="{ active: showCategoryFilter }">
              <svg class="filter-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"/>
              </svg>
              <span class="filter-text">Filter</span>
            </button>
          </div>

          <div class="day-tabs">
            <button
              v-for="day in daysOfWeek"
              :key="day.value"
              class="day-tab"
              :class="{ active: selectedDay === day.value }"
              @click="selectDay(day.value)"
            >
              <span class="day-short">{{ day.short }}</span>
              <span class="day-full">{{ day.full }}</span>
            </button>
          </div>

          <!-- Category Filter -->
          <transition name="slide-down">
            <div v-if="showCategoryFilter" class="category-filter">
              <div class="filter-header">
                <h3>Filter by Special Type</h3>
                <button
                  v-if="selectedCategory"
                  class="btn btn-ghost btn-sm"
                  @click="clearCategoryFilter"
                >
                  Clear Filter
                </button>
              </div>
              <div class="category-chips">
                <button
                  v-for="category in availableCategories"
                  :key="category"
                  class="category-chip"
                  :class="{ active: selectedCategory === category }"
                  @click="selectCategory(category)"
                >
                  {{ category }}
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Selected Day's Specials -->
        <div class="day-specials-list">
          <div
            v-for="special in selectedDaySpecials"
            :key="special.id"
            class="business-list-item"
            @click="viewSpecialDetails(special)"
          >
            <div class="business-image-section">
              <img
                :src="special.logo || special.image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop&crop=center'"
                :alt="special.venue"
                class="business-logo"
              />
              <div class="time-badge">
                {{ formatTimeShort(special.startTime) }} - {{ formatTimeShort(special.endTime) }}
              </div>
            </div>
            <div class="business-info">
              <div class="business-header">
                <h3 class="business-name">{{ special.venue }}</h3>
                <span v-if="special.tier && special.tier !== BUSINESS_TIERS.CURATED" class="tier-badge" :class="special.tier">
                  {{ getTierLabel(special.tier) }}
                </span>
              </div>
              <p class="business-category">{{ special.category }}</p>
              <div class="special-offer-display">
                <span class="perk-text">{{ getHappyHourSpecials(special) }}</span>
              </div>
            </div>
            <span class="chevron">›</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="selectedDaySpecials.length === 0" class="no-specials">
          <h3>No Specials {{ getCurrentDayName() }}</h3>
          <p>Try selecting a different day to see available happy hour specials.</p>
        </div>
      </div>
    </section>


    <!-- Detail Modal -->
    <BaseModal
      v-if="selectedSpecial"
      :is-visible="!!selectedSpecial"
      :title="selectedSpecial?.venue || selectedSpecial?.name"
      :subtitle="selectedSpecial?.category || selectedSpecial?.subcategory"
      :description="selectedSpecial?.description"
      :hero-image="selectedSpecial?.heroImage || selectedSpecial?.logo"
      @close="closeModal"
    >
      <template #content>
        <div class="business-details">
          <!-- Happy Hour Specials Section -->
          <div class="specials-section">
            <h3 class="specials-title">Happy Hour Specials</h3>
            <div class="offer-highlight">{{ getHappyHourSpecials(selectedSpecial) }}</div>
          </div>

          <!-- Happy Hour Time Info -->
          <div class="time-info">
            <span class="time-label">Time:</span>
            <span class="time-value">{{ getFormattedTimeRange(selectedSpecial) }}</span>
          </div>

          <!-- Business Information Grid -->
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{{ selectedSpecial?.address || selectedSpecial?.location?.address || selectedSpecial?.location?.neighborhood || 'Greenville' }}</span>
            </div>
          </div>


          <!-- Action Buttons -->
          <div class="modal-actions">
            <button class="btn-directions" @click="openWebsite(selectedSpecial)">
              Website
            </button>
            <button v-if="selectedSpecial?.phone || selectedSpecial?.contact?.phone" class="btn-call" @click="callVenue(selectedSpecial)">
              Call {{ selectedSpecial?.phone || selectedSpecial?.contact?.phone }}
            </button>
          </div>
        </div>
      </template>
    </BaseModal>

    <!-- Bottom Navigation -->
    <BottomNav />

    <!-- Business Modal -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      :show-happy-hour="true"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'
import BaseModal from '@/components/UI/BaseModal.vue'
import HeroAdCard from '@/components/Business/HeroAdCard.vue'
import { useAppConfig } from '@/composables/useAppConfig'
import analytics from '@/utils/analytics'
import { BUSINESS_TIERS, TIER_LABELS } from '@/utils/constants'
import {
  getTierLabel,
  getHeroBusiness,
  timeToMinutes,
  getCurrentTimeInMinutes,
  formatTime12Hour,
  formatTimeShort,
  convertTo24Hour,
  isCurrentlyActive,
  isUpcoming,
  hasEnded,
  getSpecialStatus,
  getTimeRemaining,
  parseHappyHourSchedule,
  getSpecialTypeFromDeals,
  getCurrentDateString
} from '@/utils/businessUtils'

// Reactive data
const currentTime = ref('')
const selectedSpecial = ref(null)
const selectedCategory = ref('')
const selectedDay = ref(new Date().getDay()) // 0 = Sunday, 1 = Monday, etc.
const showCategoryFilter = ref(false)

// Days of the week data
const daysOfWeek = [
  { value: 0, short: 'Sun', full: 'Sunday' },
  { value: 1, short: 'Mon', full: 'Monday' },
  { value: 2, short: 'Tue', full: 'Tuesday' },
  { value: 3, short: 'Wed', full: 'Wednesday' },
  { value: 4, short: 'Thu', full: 'Thursday' },
  { value: 5, short: 'Fri', full: 'Friday' },
  { value: 6, short: 'Sat', full: 'Saturday' }
]

// Dynamic app config
const { initializeApp, getCurrentBusinesses, getAppInfo, forceRefreshLocation } = useAppConfig()
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

// Get page configuration from centralized config
const pageConfig = computed(() => {
  const appInfo = getAppInfo.value
  if (!appInfo?.navigation?.categories) return { displayName: 'Cocktail Hour' }

  const cocktailCategory = appInfo.navigation.categories.find(cat => cat.id === 'cocktail-hour')
  return cocktailCategory || { displayName: 'Cocktail Hour' }
})

// Get all businesses with happy hours from dynamic business data
const cocktailVenues = computed(() => {
  const businessData = getCurrentBusinesses.value || {}

  // Handle both old tier-based structure and new flat array structure
  let allBusinesses = []
  if (businessData.businesses && Array.isArray(businessData.businesses)) {
    // New flat array structure
    allBusinesses = businessData.businesses
  } else if (businessData.businesses) {
    // Old tier-based structure - flatten all tiers
    const { signature = [], premier = [], curated = [] } = businessData.businesses
    allBusinesses = [...signature, ...premier, ...curated]
  }

  return allBusinesses.filter(business => {
    const category = (business.category || '').toLowerCase()
    const subcategory = (business.subcategory || '').toLowerCase()

    return category === 'cocktail hour' ||
           category.includes('dining') ||
           subcategory.includes('cocktail') ||
           subcategory.includes('bar') ||
           subcategory.includes('lounge') ||
           subcategory.includes('rooftop') ||
           subcategory.includes('gastropub')
  })
})

// Hero ad - get signature tier cocktail venue
const heroAd = computed(() => {
  return getHeroBusiness(
    cocktailVenues.value,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&crop=center'
  )
})

// Transform business data into day-specific happy hour format
const happyHourSpecials = computed(() => {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const selectedDayName = dayNames[selectedDay.value]

  let specials = cocktailVenues.value
    .filter(business => {
      // Must have happy hour available
      if (!business.happyHour?.available) return false

      // Must have day-specific data for the selected day
      const dayData = business.happyHour?.days?.[selectedDayName]
      return dayData && dayData.available
    })
    .map((business) => {
      const dayData = business.happyHour.days[selectedDayName]

      return {
        id: business.id,
        venue: business.name,
        category: business.subcategory || 'Bar',
        offer: dayData.deals || business.happyHour?.deals || 'Happy Hour Specials Available',
        startTime: dayData.startTime || '5:00 PM',
        endTime: dayData.endTime || '7:00 PM',
        address: business.location?.address || business.location?.neighborhood || 'Greenville',
        phone: business.contact?.phone || business.phone,
        description: business.description,
        tier: business.tier,
        logo: business.logo,
        image: business.image,
        // Keep reference to original business for modal
        originalBusiness: business,
        // Add type for filtering based on actual deals
        type: getSpecialTypeFromDeals(dayData.deals || business.happyHour?.deals || '')
      }
    })

  // Apply category filter if selected
  if (selectedCategory.value) {
    specials = specials.filter(special => special.type === selectedCategory.value)
  }

  return specials
})

// Get available categories - always show all three
const availableCategories = computed(() => {
  return ['Beer', 'Cocktails', 'Food']
})



// Computed properties for day-based specials
const selectedDaySpecials = computed(() => {
  return happyHourSpecials.value.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
})


// Methods
const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// Day selector methods
const selectDay = (dayValue) => {
  selectedDay.value = dayValue
}

const getCurrentDayName = () => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return dayNames[selectedDay.value]
}


const viewSpecialDetails = (special) => {
  // Track business modal view as a lead
  const business = special.originalBusiness || special
  analytics.trackBusinessLead(business, 'modal_view', {
    placement: 'happy_hour_listing',
    page: 'cocktail_hour',
    special_status: getSpecialStatus(special)
  })

  // Use original business data if available, otherwise transform special data
  if (special.originalBusiness) {
    selectedSpecial.value = special.originalBusiness
  } else {
    // Fallback transformation for compatibility
    selectedSpecial.value = {
      id: special.id,
      name: special.venue,
      description: special.description || special.offer,
      subcategory: special.category,
      location: {
        address: special.address,
        neighborhood: special.address
      },
      contact: {
        phone: special.phone
      },
      happyHour: `${formatTime12Hour(special.startTime)} - ${formatTime12Hour(special.endTime)}`,
      features: ['Happy Hour']
    }
  }
}

const closeModal = () => {
  selectedSpecial.value = null
}

const openWebsite = (special) => {
  try {
    // Track website visit as a high-value lead
    analytics.trackBusinessLead(special, 'website', {
      placement: 'modal_action',
      page: 'cocktail_hour'
    })

    // Check if the special has original business data with a website
    const business = special?.originalBusiness || special
    const website = business?.website || business?.contact?.website

    if (website) {
      window.open(website, '_blank')
    } else {
      // Fallback to Google search for the business
      const businessName = special?.venue || special?.name || 'business'
      const searchQuery = encodeURIComponent(`${businessName} Greenville SC`)
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank')
    }
  } catch (error) {
    console.error('Error opening website:', error)
    analytics.trackError(error, { context: 'open_website', business_id: special?.id })
  }
}

const callVenue = (special) => {
  try {
    // Track phone call as the highest-value lead
    analytics.trackBusinessLead(special, 'call', {
      placement: 'modal_action',
      page: 'cocktail_hour',
      phone: special?.phone || special?.contact?.phone
    })

    const phone = special?.phone || special?.contact?.phone
    if (phone) {
      window.location.href = `tel:${phone}`
    }
  } catch (error) {
    console.error('Error calling venue:', error)
    analytics.trackError(error, { context: 'call_venue', business_id: special?.id })
  }
}

const getFormattedTimeRange = (special) => {
  try {
    if (!special) return 'Time not available'

    // If it has a happyHour field (from original business data), use the schedule
    if (special.happyHour?.schedule) {
      return special.happyHour.schedule
    }

    // Otherwise try to format from startTime/endTime
    if (special.startTime && special.endTime) {
      const start = formatTime12Hour(special.startTime)
      const end = formatTime12Hour(special.endTime)
      return `${start} - ${end}`
    }

    // Fallback
    return '5:00 PM - 7:00 PM'
  } catch (error) {
    console.error('Error formatting time range:', error)
    return 'Time not available'
  }
}

const getHappyHourSpecials = (special) => {
  if (!special) return 'Happy hour specials available'

  // The offer field contains the deals text from the transformation
  if (special.offer && special.offer !== 'Happy Hour Specials Available') {
    return special.offer
  }

  // Check for deals in the original business data
  if (special.originalBusiness?.happyHour?.deals) {
    return special.originalBusiness.happyHour.deals
  }

  // Check for direct happyHour deals (for modal when passed original business)
  if (special.happyHour?.deals) {
    return special.happyHour.deals
  }

  // Fallback
  return 'Happy hour specials available'
}

// ===== HERO AD FUNCTIONS =====

/**
 * Opens the business modal for the clicked hero ad
 */
const openBusinessModal = (business) => {
  // Track hero ad click as a high-value lead
  analytics.trackBusinessLead(business, 'hero_click', {
    placement: 'hero_ad',
    page: 'cocktail_hour'
  })

  selectedBusiness.value = business
  showBusinessModal.value = true
}

/**
 * Closes the business modal
 */
const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}

/**
 * Handles image loading errors from HeroAdCard component
 */
const handleImageError = (errorData) => {
  console.warn('Hero ad image failed to load:', errorData)
}

// Category filter functions
const toggleCategoryFilter = () => {
  showCategoryFilter.value = !showCategoryFilter.value
}

const selectCategory = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
}

const clearCategoryFilter = () => {
  selectedCategory.value = ''
}

// Track business impressions when they appear
const trackBusinessImpressions = () => {
  // Track hero ad impression
  if (heroAd.value) {
    analytics.trackBusinessImpression(heroAd.value, 'hero', {
      page: 'cocktail_hour'
    })
  }

  // Track happy hour listing impressions
  selectedDaySpecials.value.forEach((special, index) => {
    const business = special.originalBusiness || special
    analytics.trackBusinessImpression(business, 'happy_hour_listing', {
      page: 'cocktail_hour',
      position: index + 1,
      special_status: getSpecialStatus(special)
    })
  })
}

onMounted(async () => {
  try {
    await forceRefreshLocation()
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 60000) // Update every minute

    // Track page view
    analytics.pageView('/cocktail-hour', 'Cocktail Hour')

    // Track business impressions after data loads
    setTimeout(() => {
      trackBusinessImpressions()
    }, 1000)

    onUnmounted(() => {
      clearInterval(interval)
    })
  } catch (error) {
    console.error('❌ Failed to initialize Cocktail Hour view:', error)
    analytics.trackError(error, { context: 'cocktail_hour_init' })
  }
})
</script>

<style scoped>
.cocktail-hour-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-bottom: var(--bottom-nav-height);
}


/* Header */
.cocktail-header {
  background: var(--color-bg-luxury);
  padding: var(--space-8) 0 var(--space-6);
  text-align: center;
  border-bottom: 1px solid var(--color-border-primary);
}

.btn-filter {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-medium);
  backdrop-filter: var(--backdrop-blur-base);
  font-size: var(--font-size-sm);
}

.btn-filter:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-filter.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg-primary);
}

.filter-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.filter-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Category Filter Section */
.category-filter-section {
  margin-top: var(--space-4);
  text-align: left;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  backdrop-filter: var(--backdrop-blur-base);
}

.category-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.category-filter-header h3 {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  letter-spacing: var(--letter-spacing-wide);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--color-primary-alpha-30);
  color: var(--color-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
}

.btn-ghost:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.category-chip {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-secondary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  white-space: nowrap;
  font-family: var(--font-family-primary);
}

.category-chip:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.category-chip.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-md);
}

.category-chip:active {
  transform: translateY(0) scale(0.98);
}

.page-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  margin: 0;
}

/* Section Titles */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

/* For section titles not in header containers */
.section-title:not(.section-header .section-title) {
  margin-bottom: var(--space-6);
}

.title-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

/* ===== DAILY SPECIALS SECTION ===== */

.daily-specials {
  padding: var(--space-8) 0;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

/* Filter Button */
.btn-filter {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-medium);
  backdrop-filter: var(--backdrop-blur-base);
  font-size: var(--font-size-sm);
}

.btn-filter:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-filter.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg-primary);
}

.filter-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.filter-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Day Selector */
.day-selector {
  margin-bottom: var(--space-8);
}

.day-tabs {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Category Filter */
.category-filter {
  margin-top: var(--space-4);
  text-align: left;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  backdrop-filter: var(--backdrop-blur-base);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.filter-header h3 {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  letter-spacing: var(--letter-spacing-wide);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--color-primary-alpha-30);
  color: var(--color-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
}

.btn-ghost:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
}

.day-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-all);
  min-width: 80px;
  flex-shrink: 0;
}

.day-tab:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-alpha-30);
  transform: translateY(-2px);
}

.day-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.day-short {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.day-full {
  font-size: var(--font-size-xs);
  opacity: 0.8;
  font-weight: var(--font-weight-medium);
}

/* Day Specials List */
.day-specials-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Empty State */
.no-specials {
  text-align: center;
  padding: var(--space-12) var(--space-4);
  color: var(--color-text-tertiary);
}

.no-specials h3 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-2);
}

.no-specials p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  max-width: 400px;
  margin: 0 auto;
}

/* All Specials List */
.all-todays-specials {
  padding: var(--space-8) 0;
}

.specials-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.special-item {
  display: flex;
  align-items: center;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  cursor: pointer;
  transition: var(--transition-all);
  border-left: 4px solid transparent;
  margin-bottom: var(--space-3);
}

.special-item.active {
  border-left-color: var(--color-success);
  background: var(--color-bg-tertiary);
}


.special-item.ended {
  opacity: 0.6;
  border-left-color: var(--color-text-tertiary);
}

.special-item:hover {
  background: var(--color-bg-tertiary);
  transform: translateX(4px);
}

.item-time {
  min-width: 120px;
  text-align: center;
}

.time-range {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.status-indicator {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
}

.item-content {
  flex: 1;
  padding: 0 var(--space-4);
}

.item-content .venue-name {
  font-size: var(--font-size-base);
  margin-bottom: var(--space-1);
}

.item-content .special-offer {
  margin-bottom: var(--space-2);
}

.item-meta {
  display: flex;
  gap: var(--space-4);
}

.category {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.item-action {
  color: var(--color-primary);
  font-size: var(--font-size-xl);
}


/* Modal Content Styling */
.business-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.specials-section {
  text-align: center;
}

.specials-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
  font-family: var(--font-family-heading);
}

.offer-highlight {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: var(--font-weight-medium);
}

.time-info {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}

.time-label {
  color: var(--color-text-tertiary);
}

.time-value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.details-grid {
  display: grid;
  gap: var(--space-3);
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.detail-label {
  color: var(--color-text-tertiary);
}

.detail-value {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.special-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
}

.btn-directions, .btn-call {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: none;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
}

.btn-directions {
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.btn-call {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}

.btn-directions:hover, .btn-call:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Container */
.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* ===== RESPONSIVE DESIGN ===== */

/* Tablet and Up: 640px+ */
@media (min-width: 640px) {
  .day-tabs {
    justify-content: center;
    overflow-x: visible;
  }

  .day-tab {
    min-width: 100px;
    padding: var(--space-4) var(--space-5);
  }

  .special-venue {
    font-size: var(--font-size-2xl);
  }

  .special-offer {
    font-size: var(--font-size-lg);
  }
}

/* Large Desktop: 1024px+ */
@media (min-width: 1024px) {
  .day-tabs {
    gap: var(--space-3);
  }

  .day-tab {
    min-width: 120px;
    padding: var(--space-5) var(--space-6);
  }

  .special-item {
    padding: var(--space-6);
  }
}

/* Mobile Responsive */
@media (max-width: 639px) {
  .section-title {
    font-size: var(--font-size-xl);
  }

  .day-tabs {
    gap: var(--space-1);
    padding: 0 var(--space-2);
  }

  .day-tab {
    min-width: 70px;
    padding: var(--space-2) var(--space-3);
  }

  .day-short {
    font-size: var(--font-size-base);
  }

  .day-full {
    font-size: var(--font-size-2xs);
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .filter-header h3 {
    font-size: var(--font-size-base);
  }

  .filter-text {
    display: none;
  }

  .category-filter {
    margin-top: var(--space-4);
    padding: var(--space-4);
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .category-chips {
    gap: var(--space-2);
  }

  .category-chip {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
  }

  .modal-actions {
    flex-direction: column;
  }

  .details-grid {
    gap: var(--space-2);
  }
}

/* Business List Item Styles (matching search page) */
.business-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--color-bg-secondary);
  cursor: pointer;
  transition: var(--transition-all);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
  border: 1px solid var(--color-border-secondary);
}

.business-list-item:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-alpha-20);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.business-image-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.business-logo {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  border: 2px solid var(--color-border-primary);
}

.time-badge {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-align: center;
  white-space: nowrap;
  border: 1px solid var(--color-primary-alpha-20);
  min-width: 60px;
}

.business-info {
  flex: 1;
  min-width: 0;
}

.business-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.business-name {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-perks, .special-offer-display {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-primary-alpha-20);
  border-radius: var(--radius-sm);
  max-width: fit-content;
  margin-bottom: var(--space-1);
}

.perk-icon {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.perk-text {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.chevron {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-light);
  flex-shrink: 0;
}

</style>