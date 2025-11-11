<template>
  <div class="cocktail-hour-view">
    <TopBar title="Cocktail Hour" :show-back="true" />

    <!-- ===== HERO ADVERTISEMENT ===== -->
    <!-- MONETIZATION: Premium advertising space for cocktail lounges -->
    <div v-if="heroAd" class="hero-ad-section">
      <div class="hero-ad-card" @click="openBusinessModal(heroAd)">
        <img
          :src="heroAd.image"
          :alt="heroAd.name"
          class="hero-ad-image"
          @error="handleImageError"
        />
        <div class="hero-ad-overlay">
          <div class="hero-ad-content">
            <div class="tier-badge signature">FEATURED PARTNER</div>
            <h2 class="hero-ad-title">{{ heroAd.name }}</h2>
            <p class="hero-ad-subtitle">{{ heroAd.description }}</p>
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
              <div class="special-time">{{ special.startTime }} - {{ special.endTime }}</div>
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
              <div class="special-time">{{ special.startTime }} - {{ special.endTime }}</div>
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
              <div class="time-range">{{ special.startTime }} - {{ special.endTime }}</div>
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
    <div v-if="selectedSpecial" class="special-modal" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn">&times;</button>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedSpecial.venue }}</h2>
          <div class="modal-status">{{ getSpecialStatus(selectedSpecial) }}</div>
        </div>
        <div class="modal-body">
          <div class="offer-highlight">{{ selectedSpecial.offer }}</div>
          <div class="time-info">
            <span class="time-label">Time:</span>
            <span class="time-value">{{ selectedSpecial.startTime }} - {{ selectedSpecial.endTime }}</span>
          </div>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Category:</span>
              <span class="detail-value">{{ selectedSpecial.category }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Price Range:</span>
              <span class="detail-value">{{ selectedSpecial.priceRange }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{{ selectedSpecial.address }}</span>
            </div>
          </div>
          <div class="special-description" v-if="selectedSpecial.description">
            {{ selectedSpecial.description }}
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-directions" @click="getDirections(selectedSpecial)">
            Get Directions
          </button>
          <button class="btn-call" @click="callVenue(selectedSpecial)">
            Call {{ selectedSpecial.phone }}
          </button>
        </div>
      </div>
    </div>

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
import { useBusinessStore } from '@/stores/businessStore'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

// Reactive data
const currentTime = ref('')
const selectedSpecial = ref(null)

// Business Store and Hero Ad
const businessStore = useBusinessStore()
const heroAd = ref(null)
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

// Mock happy hour data - in real app this would come from an API
const happyHourSpecials = ref([
  {
    id: 1,
    venue: "The Brass Monkey",
    category: "Cocktail Lounge",
    offer: "50% off craft cocktails & $5 wine flights",
    startTime: "16:00",
    endTime: "19:00",
    priceRange: "$$",
    address: "123 Main Street",
    phone: "(555) 123-4567",
    description: "Upscale cocktail lounge featuring craft spirits and an extensive wine selection."
  },
  {
    id: 2,
    venue: "Rooftop 360",
    category: "Rooftop Bar",
    offer: "$7 signature cocktails & $4 local beers",
    startTime: "17:00",
    endTime: "20:00",
    priceRange: "$$$",
    address: "456 Sky Tower",
    phone: "(555) 234-5678",
    description: "Spectacular city views with premium cocktails and small plates."
  },
  {
    id: 3,
    venue: "The Wine Cellar",
    category: "Wine Bar",
    offer: "Buy one glass, get second 50% off",
    startTime: "15:00",
    endTime: "18:00",
    priceRange: "$$",
    address: "789 Grape Street",
    phone: "(555) 345-6789",
    description: "Intimate wine bar with curated selections from around the world."
  },
  {
    id: 4,
    venue: "Martini & Co",
    category: "Cocktail Bar",
    offer: "$8 classic martinis & $6 appetizers",
    startTime: "18:00",
    endTime: "21:00",
    priceRange: "$$$",
    address: "321 Olive Avenue",
    phone: "(555) 456-7890",
    description: "Classic cocktail bar specializing in premium martinis and small bites."
  },
  {
    id: 5,
    venue: "Sunset Terrace",
    category: "Restaurant & Bar",
    offer: "$5 house cocktails & half-price appetizers",
    startTime: "16:30",
    endTime: "19:30",
    priceRange: "$$",
    address: "654 Sunset Boulevard",
    phone: "(555) 567-8901",
    description: "Elegant dining with stunning sunset views and creative cocktails."
  }
])

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
  return 'Check Back Tomorrow'
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
  selectedSpecial.value = special
}

const closeModal = () => {
  selectedSpecial.value = null
}

const getDirections = (special) => {
  const address = encodeURIComponent(special.address)
  window.open(`https://maps.apple.com/?q=${address}`, '_blank')
}

const callVenue = (special) => {
  window.location.href = `tel:${special.phone}`
}

// Lifecycle
// ===== HERO AD FUNCTIONS =====

/**
 * Opens the business modal for the clicked hero ad
 */
const openBusinessModal = (business) => {
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

onMounted(() => {
  updateCurrentTime()
  const interval = setInterval(updateCurrentTime, 60000) // Update every minute

  // Initialize hero ad - get The Brass Monkey business
  const brassBusiness = businessStore.getBusinessById(8) // The Brass Monkey ID
  if (brassBusiness) {
    heroAd.value = {
      ...brassBusiness,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&crop=center'
    }
  }

  onUnmounted(() => {
    clearInterval(interval)
  })
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
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-primary-lg);
  transition: var(--transition-all);
  border: 3px solid #FFD700;
  background: var(--color-bg-secondary);
}

.hero-ad-card:active {
  transform: scale(0.98);
}

.hero-ad-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.hero-ad-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: var(--space-5) var(--space-4) var(--space-4);
}

.hero-ad-content {
  color: white;
}

.hero-ad-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  margin: var(--space-2) 0 var(--space-1);
  line-height: var(--line-height-tight);
}

.hero-ad-subtitle {
  font-size: var(--font-size-sm);
  opacity: 0.9;
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
  opacity: 0.8;
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
  space-y: var(--space-3);
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

/* Modal */
.special-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
}

.modal-content {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  max-width: 500px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-2xl);
  cursor: pointer;
}

.modal-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.modal-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.modal-status {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.offer-highlight {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-6);
}

.time-info {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
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
  margin-bottom: var(--space-6);
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
  margin-bottom: var(--space-6);
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
}
</style>