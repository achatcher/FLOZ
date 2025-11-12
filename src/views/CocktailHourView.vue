<template>
  <div class="cocktail-hour-view">
    <TopBar title="Cocktail Hour" :show-back="true" />

    <!-- ===== HERO ADVERTISEMENT ===== -->
    <!-- MONETIZATION: Premium advertising space for cocktail lounges -->
    <div v-if="heroAd" class="hero-ad-section">
      <div class="hero-ad-card" @click="openBusinessModal(heroAd)">
        <div class="hero-ad-image-container">
          <img
            :src="heroAd.image"
            :alt="heroAd.name"
            class="hero-ad-image"
            @error="handleImageError"
          />
          <div class="tier-badge signature">FEATURED PARTNER</div>
        </div>
        <div class="hero-ad-info">
          <h2 class="hero-ad-name">{{ heroAd.name }}</h2>
          <p class="hero-ad-description">{{ heroAd.description }}</p>
          <div class="hero-ad-features">
            <span class="hero-ad-category">{{ heroAd.subcategory }}</span>
            <span class="hero-ad-price">{{ heroAd.price_range || heroAd.priceRange }}</span>
          </div>
          <div class="hero-ad-cta">
            <span>View Details</span>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div class="cocktail-header">
      <div class="container">
        <h1 class="page-title">Cocktail Hour</h1>
        <p class="page-subtitle">{{ getCurrentDateString() }} • Live Happy Hour Specials</p>
        <div class="time-indicator">
          <span class="current-time">{{ currentTime }}</span>
          <span class="status-badge" :class="getStatusClass()">{{ getStatusText() }}</span>
        </div>
      </div>
    </div>

    <!-- Current Happy Hours -->
    <section class="current-specials" v-if="currentHappyHours.length > 0">
      <div class="container">
        <h2 class="section-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 7L10 12V22H14V12L19 7V5H5V7ZM7.5 9H16.5L14 11.5V20H10V11.5L7.5 9Z"/>
          </svg>
          Happening Now
        </h2>
        <div class="specials-grid">
          <div
            v-for="special in currentHappyHours"
            :key="special.id"
            class="special-card active"
            @click="viewSpecialDetails(special)"
          >
            <div class="card-header">
              <h3 class="venue-name">{{ special.venue }}</h3>
              <div class="time-remaining">{{ getTimeRemaining(special.endTime) }}</div>
            </div>
            <div class="special-details">
              <div class="special-offer">{{ special.offer }}</div>
              <div class="special-time">{{ formatTime12Hour(special.startTime) }} - {{ formatTime12Hour(special.endTime) }}</div>
            </div>
            <div class="card-footer">
              <span class="venue-type">{{ special.category }}</span>
              <span class="price-range">{{ special.priceRange }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Today -->
    <section class="upcoming-today" v-if="upcomingToday.length > 0">
      <div class="container">
        <h2 class="section-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/>
          </svg>
          Starting Soon
        </h2>
        <div class="specials-grid">
          <div
            v-for="special in upcomingToday"
            :key="special.id"
            class="special-card upcoming"
            @click="viewSpecialDetails(special)"
          >
            <div class="card-header">
              <h3 class="venue-name">{{ special.venue }}</h3>
              <div class="starts-in">Starts {{ getStartsIn(special.startTime) }}</div>
            </div>
            <div class="special-details">
              <div class="special-offer">{{ special.offer }}</div>
              <div class="special-time">{{ formatTime12Hour(special.startTime) }} - {{ formatTime12Hour(special.endTime) }}</div>
            </div>
            <div class="card-footer">
              <span class="venue-type">{{ special.category }}</span>
              <span class="price-range">{{ special.priceRange }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Today's Specials -->
    <section class="all-todays-specials">
      <div class="container">
        <h2 class="section-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7Z"/>
          </svg>
          All Today's Happy Hours
        </h2>
        <div class="specials-list">
          <div
            v-for="special in allTodaysSpecials"
            :key="special.id"
            class="special-item"
            :class="{
              active: isCurrentlyActive(special),
              upcoming: isUpcoming(special),
              ended: hasEnded(special)
            }"
            @click="viewSpecialDetails(special)"
          >
            <div class="item-time">
              <div class="time-range">{{ formatTime12Hour(special.startTime) }} - {{ formatTime12Hour(special.endTime) }}</div>
              <div class="status-indicator">{{ getSpecialStatus(special) }}</div>
            </div>
            <div class="item-content">
              <h4 class="venue-name">{{ special.venue }}</h4>
              <p class="special-offer">{{ special.offer }}</p>
              <div class="item-meta">
                <span class="category">{{ special.category }}</span>
                <span class="price">{{ special.priceRange }}</span>
              </div>
            </div>
            <div class="item-action">
              <span class="chevron">›</span>
            </div>
          </div>
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
              <span class="detail-label">Category:</span>
              <span class="detail-value">{{ selectedSpecial?.category || selectedSpecial?.subcategory || 'Cocktail Bar' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Price Range:</span>
              <span class="detail-value">{{ selectedSpecial?.priceRange || selectedSpecial?.price_range || '$$$' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{{ selectedSpecial?.address || selectedSpecial?.location?.address || selectedSpecial?.location?.neighborhood || 'Greenville' }}</span>
            </div>
          </div>


          <!-- Action Buttons -->
          <div class="modal-actions">
            <button class="btn-directions" @click="getDirections(selectedSpecial)">
              Get Directions
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
import { useAppConfig } from '@/composables/useAppConfig'
import analytics from '@/utils/analytics'

// Reactive data
const currentTime = ref('')
const selectedSpecial = ref(null)

// Dynamic app config
const { initializeApp, getCurrentBusinesses, getAppInfo } = useAppConfig()
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

// Get cocktail venues from dynamic business data
const cocktailVenues = computed(() => {
  const businesses = getCurrentBusinesses.value || []
  return businesses.filter(business =>
    business.category === 'Cocktail Hour' ||
    business.subcategory?.toLowerCase().includes('cocktail') ||
    business.subcategory?.toLowerCase().includes('bar') ||
    business.subcategory?.toLowerCase().includes('lounge')
  )
})

// Hero ad - get signature tier cocktail venue
const heroAd = computed(() => {
  const signatureVenues = cocktailVenues.value.filter(v =>
    v.tier === 'signature' || v.listing_tier === 'signature'
  )
  if (signatureVenues.length > 0) {
    return {
      ...signatureVenues[0],
      image: signatureVenues[0].heroImage || signatureVenues[0].logo || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&crop=center'
    }
  }

  const premierVenues = cocktailVenues.value.filter(v =>
    v.tier === 'premier' || v.listing_tier === 'premier'
  )
  if (premierVenues.length > 0) {
    return {
      ...premierVenues[0],
      image: premierVenues[0].heroImage || premierVenues[0].logo || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&crop=center'
    }
  }

  if (cocktailVenues.value.length > 0) {
    return {
      ...cocktailVenues.value[0],
      image: cocktailVenues.value[0].heroImage || cocktailVenues.value[0].logo || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&crop=center'
    }
  }

  return null
})

// Transform business data into happy hour format for compatibility with existing UI
const happyHourSpecials = computed(() => {
  return cocktailVenues.value.map((business) => ({
    id: business.id,
    venue: business.name,
    category: business.subcategory || 'Cocktail Bar',
    offer: business.features?.includes('Happy Hour') ? 'Happy Hour Specials Available' : 'Craft Cocktails & Premium Selection',
    startTime: business.happyHour ? parseHappyHourStartTime(business.happyHour) : "17:00",
    endTime: business.happyHour ? parseHappyHourEndTime(business.happyHour) : "19:00",
    priceRange: business.priceRange || '$$$',
    address: business.location?.address || business.location?.neighborhood || 'Greenville',
    phone: business.contact?.phone || business.phone,
    description: business.description,
    // Keep reference to original business for modal
    originalBusiness: business
  }))
})

// Helper functions to parse happy hour times
const parseHappyHourStartTime = (timeString) => {
  if (!timeString) return "17:00"
  const match = timeString.match(/(\d{1,2})(?::(\d{2}))?\s*(?:AM|PM)?\s*-/)
  if (!match) return "17:00"
  const hour = parseInt(match[1])
  const minute = parseInt(match[2]) || 0
  const isPM = timeString.toUpperCase().includes('PM')
  const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour
  return `${adjustedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

const parseHappyHourEndTime = (timeString) => {
  if (!timeString) return "19:00"
  const match = timeString.match(/-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
  if (!match) return "19:00"
  const hour = parseInt(match[1])
  const minute = parseInt(match[2]) || 0
  const period = match[3].toUpperCase()
  const adjustedHour = period === 'PM' && hour !== 12 ? hour + 12 : hour
  return `${adjustedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// Computed properties
const currentHappyHours = computed(() => {
  const now = getCurrentTimeInMinutes()
  return happyHourSpecials.value.filter(special => {
    const start = timeToMinutes(special.startTime)
    const end = timeToMinutes(special.endTime)
    return now >= start && now <= end
  })
})

const upcomingToday = computed(() => {
  const now = getCurrentTimeInMinutes()
  return happyHourSpecials.value.filter(special => {
    const start = timeToMinutes(special.startTime)
    return start > now && start <= now + 120 // Next 2 hours
  }).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
})

const allTodaysSpecials = computed(() => {
  return [...happyHourSpecials.value].sort((a, b) =>
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  )
})

// Methods
const getCurrentDateString = () => {
  const today = new Date()
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const getCurrentTimeInMinutes = () => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

const formatTime12Hour = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHours}:${displayMinutes} ${ampm}`
}

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

const getStatusClass = () => {
  if (currentHappyHours.value.length > 0) return 'active'
  if (upcomingToday.value.length > 0) return 'upcoming'
  return 'none'
}

const getStatusText = () => {
  if (currentHappyHours.value.length > 0) {
    return `${currentHappyHours.value.length} Active Now`
  }
  if (upcomingToday.value.length > 0) {
    return 'Coming Up Soon'
  }
  return 'Check Back Later'
}

const getTimeRemaining = (endTime) => {
  const now = getCurrentTimeInMinutes()
  const end = timeToMinutes(endTime)
  const remaining = end - now

  if (remaining <= 0) return 'Ending Soon'

  const hours = Math.floor(remaining / 60)
  const minutes = remaining % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m left`
  }
  return `${minutes}m left`
}

const getStartsIn = (startTime) => {
  const now = getCurrentTimeInMinutes()
  const start = timeToMinutes(startTime)
  const until = start - now

  if (until <= 0) return 'now'

  const hours = Math.floor(until / 60)
  const minutes = until % 60

  if (hours > 0) {
    return `in ${hours}h ${minutes}m`
  }
  return `in ${minutes}m`
}

const isCurrentlyActive = (special) => {
  const now = getCurrentTimeInMinutes()
  const start = timeToMinutes(special.startTime)
  const end = timeToMinutes(special.endTime)
  return now >= start && now <= end
}

const isUpcoming = (special) => {
  const now = getCurrentTimeInMinutes()
  const start = timeToMinutes(special.startTime)
  return start > now
}

const hasEnded = (special) => {
  const now = getCurrentTimeInMinutes()
  const end = timeToMinutes(special.endTime)
  return now > end
}

const getSpecialStatus = (special) => {
  if (isCurrentlyActive(special)) return 'Active Now'
  if (isUpcoming(special)) return getStartsIn(special.startTime)
  return 'Ended'
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
      priceRange: special.priceRange,
      price_range: special.priceRange,
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

const getDirections = (special) => {
  try {
    // Track directions request as a high-value lead
    analytics.trackBusinessLead(special, 'directions', {
      placement: 'modal_action',
      page: 'cocktail_hour',
      address: special?.address || special?.location?.address || 'Greenville, SC'
    })

    const address = special?.address || special?.location?.address || special?.location?.neighborhood || 'Greenville, SC'
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.apple.com/?q=${encodedAddress}`, '_blank')
  } catch (error) {
    console.error('Error getting directions:', error)
    analytics.trackError(error, { context: 'get_directions', business_id: special?.id })
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

    // If it has a happyHour field (from original business data), use that
    if (special.happyHour) {
      return special.happyHour
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

  // Look for specific happy hour deals/specials in the business data
  if (special.happyHourSpecials) {
    return special.happyHourSpecials
  }

  if (special.offer && special.offer !== 'Happy Hour Specials Available') {
    return special.offer
  }

  // Generate realistic happy hour specials based on venue type
  const category = special.category || special.subcategory || 'bar'

  if (category.toLowerCase().includes('cocktail')) {
    return '$2 off craft cocktails, $5 house wines, and discounted appetizers'
  } else if (category.toLowerCase().includes('sports')) {
    return '$1 off draft beers, $3 well drinks, and half-price wings'
  } else if (category.toLowerCase().includes('wine')) {
    return 'Half-price wine by the glass and discounted cheese boards'
  } else if (category.toLowerCase().includes('beer')) {
    return '$2 off craft beers and $1 off domestic drafts'
  } else {
    return '$1 off all drinks and discounted appetizers'
  }
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
 * Handles image loading errors with fallback
 */
const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop&crop=center'
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
  allTodaysSpecials.value.forEach((special, index) => {
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
    await initializeApp()
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 60000) // Update every minute

    // Track page view
    analytics.pageView('/cocktail-hour', 'Cocktail Hour')

    // Track business impressions after data loads
    setTimeout(() => {
      trackBusinessImpressions()
    }, 1000)

    console.log('✅ Cocktail Hour view initialized')

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

/* ===== HERO ADVERTISEMENT SECTION ===== */

.hero-ad-section {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.hero-ad-card {
  cursor: pointer;
  transition: var(--transition-all);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero-ad-card:active {
  transform: scale(0.98);
}

.hero-ad-image-container {
  position: relative;
  border: 3px solid #FFD700;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-primary-lg);
  margin-bottom: var(--space-4);
}

.hero-ad-image-container .tier-badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
}

.hero-ad-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.hero-ad-overlay {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
}

.hero-ad-info {
  padding: 0 var(--space-4) var(--space-4);
}

.hero-ad-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  margin: 0 0 var(--space-2);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.hero-ad-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-3);
  line-height: var(--line-height-relaxed);
}

.hero-ad-features {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-3);
}

.hero-ad-category {
  color: var(--color-primary);
}

.hero-ad-price {
  color: var(--color-text-tertiary);
}

.hero-ad-cta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.hero-ad-cta svg {
  width: 16px;
  height: 16px;
}

.tier-badge {
  display: inline-block;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  margin-top: var(--space-2);
}

.tier-badge.signature {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px var(--color-primary-alpha-30);
}

/* Header */
.cocktail-header {
  background: var(--color-bg-luxury);
  padding: var(--space-8) 0 var(--space-6);
  text-align: center;
  border-bottom: 1px solid var(--color-border-primary);
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
  margin-bottom: var(--space-4);
}

.time-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.current-time {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}

.status-badge.active {
  background: var(--color-success);
  color: var(--color-bg-primary);
}

.status-badge.upcoming {
  background: var(--color-warning);
  color: var(--color-bg-primary);
}

.status-badge.none {
  background: var(--color-bg-surface);
  color: var(--color-text-tertiary);
}

/* Section Titles */
.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
}

.title-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

/* Current Specials Grid */
.current-specials {
  padding: var(--space-8) 0;
}

.specials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);
}

.special-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  cursor: pointer;
  transition: var(--transition-all);
  border: 2px solid transparent;
}

.special-card.active {
  border-color: var(--color-success);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
}

.special-card.upcoming {
  border-color: var(--color-warning);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.2);
}

.special-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
}

.venue-name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.time-remaining, .starts-in {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.time-remaining {
  background: var(--color-success);
  color: white;
}

.starts-in {
  background: var(--color-warning);
  color: white;
}

.special-details {
  margin-bottom: var(--space-4);
}

.special-offer {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-2);
}

.special-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.venue-type {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.price-range {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

/* All Specials List */
.upcoming-today, .all-todays-specials {
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

.special-item.upcoming {
  border-left-color: var(--color-warning);
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

.category, .price {
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

/* Responsive */
@media (max-width: 768px) {
  .specials-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .modal-actions {
    flex-direction: column;
  }

  .details-grid {
    gap: var(--space-2);
  }
}
</style>