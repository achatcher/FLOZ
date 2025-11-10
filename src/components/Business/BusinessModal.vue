<template>
  <!--
    BusinessModal Component

    A full-screen modal that displays detailed business information with action buttons.
    This is the primary way users interact with individual business listings.

    Props:
    - business: Object containing business data (name, description, contact, etc.)
    - isVisible: Boolean to control modal visibility

    Emits:
    - close: When user closes the modal

    Usage:
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showModal"
      @close="closeModal"
    />
  -->
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>

      <!-- Close Button - Positioned absolutely in top right -->
      <button class="modal-close" @click="closeModal" aria-label="Close modal">
        ✕
      </button>

      <!-- Main Business Content -->
      <div v-if="business" class="modal-content">

        <!-- Hero Image Section -->
        <!-- CUSTOMIZATION: Replace placeholder URLs in handleImageError function -->
        <div class="modal-header">
          <img
            :src="business.heroImage || business.logo"
            :alt="business.name"
            class="modal-header-image"
            @error="handleImageError"
          />
        </div>

        <!-- Business Information Section -->
        <div class="modal-body">

          <!-- Business Name & Price Range -->
          <h1 class="modal-title">{{ business.name }}</h1>
          <p class="modal-description">{{ business.description }}</p>

          <!-- Price Range Badge -->
          <!-- Shows $$, $$$, etc. - customize styling in CSS -->
          <div v-if="business.price_range" class="modal-price">
            Price Range: {{ business.price_range }}
          </div>

          <!-- Action Buttons Grid -->
          <!-- FEATURE: Add more action buttons here (booking, menu, etc.) -->
          <div class="modal-actions">
            <!-- Website Button - opens in new tab -->
            <button
              v-if="business.contact?.website"
              @click="openWebsite"
              class="modal-action-btn"
              title="Visit website"
            >
              🌐 Website
            </button>

            <!-- Phone Button - triggers device dialer -->
            <button
              v-if="business.contact?.phone"
              @click="callBusiness"
              class="modal-action-btn"
              title="Call business"
            >
              📞 Call
            </button>

            <!-- Directions Button - opens Google Maps -->
            <button
              v-if="business.location?.address"
              @click="openMaps"
              class="modal-action-btn"
              title="Get directions"
            >
              🗺️ Directions
            </button>
          </div>

          <!-- Hours & Special Information -->
          <div class="modal-hours-section">
            <!-- Happy Hour -->
            <div v-if="business.happyHour" class="special-info happy-hour">
              <div class="special-icon">🍹</div>
              <div class="special-content">
                <h4 class="special-title">Happy Hour</h4>
                <p class="special-time">{{ business.happyHour }}</p>
              </div>
            </div>

            <!-- Live Music -->
            <div v-if="business.liveMusic" class="special-info live-music">
              <div class="special-icon">🎵</div>
              <div class="special-content">
                <h4 class="special-title">Live Music</h4>
                <p class="special-time">{{ business.liveMusic.schedule }}</p>
                <p class="special-detail">{{ business.liveMusic.time }}</p>
              </div>
            </div>

            <!-- Hours -->
            <div v-if="business.hours" class="hours-info">
              <h4 class="hours-title">Hours</h4>
              <div class="hours-grid">
                <div v-for="(hours, day) in business.hours" :key="day" class="hours-row">
                  <span class="day-name">{{ capitalizeFirst(day) }}:</span>
                  <span class="day-hours">{{ hours }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div v-if="business.contact" class="modal-contact">
            <h3 class="modal-contact-title">Contact & Location</h3>
            <p v-if="business.contact.phone" class="modal-contact-item">📞 {{ business.contact.phone }}</p>
            <p v-if="business.contact.email" class="modal-contact-item">📧 {{ business.contact.email }}</p>
            <p v-if="business.location?.address" class="modal-contact-item">📍 {{ business.location.address }}</p>
          </div>
        </div>
      </div>

      <!-- Debug/Error State - Shows when business data is missing -->
      <!-- TODO: Replace with user-friendly error message in production -->
      <div v-else class="modal-error">
        <h2 class="modal-error-title">Business Information Unavailable</h2>
        <p>We're sorry, but the business details couldn't be loaded.</p>
        <p>Debug info - isVisible: {{ isVisible }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
 * BusinessModal Component Script
 *
 * Handles the business modal logic including:
 * - Props validation and type definitions
 * - Action button functions (website, phone, directions)
 * - Image error handling with fallback placeholders
 * - Modal close events
 */

// ===== COMPONENT PROPS =====
const props = defineProps({
  // Business object containing all business information
  // Expected structure: { name, description, contact: { phone, email, website }, location: { address }, heroImage, logo }
  business: {
    type: Object,
    default: null
  },
  // Controls modal visibility - passed from parent component
  isVisible: {
    type: Boolean,
    default: false
  }
})

// ===== COMPONENT EVENTS =====
const emit = defineEmits(['close'])

// ===== MODAL CONTROL FUNCTIONS =====

/**
 * Closes the modal by emitting close event to parent
 * Parent component should set isVisible to false
 */
const closeModal = () => {
  emit('close')
}

// ===== ACTION BUTTON FUNCTIONS =====

/**
 * Opens business website in new tab
 * Only shows if business.contact.website exists
 */
const openWebsite = () => {
  if (props.business?.contact?.website) {
    window.open(props.business.contact.website, '_blank')
  }
}

/**
 * Triggers device phone dialer with business phone number
 * Works on mobile devices and desktop apps that support tel: protocol
 */
const callBusiness = () => {
  if (props.business?.contact?.phone) {
    window.location.href = `tel:${props.business.contact.phone}`
  }
}

/**
 * Opens Google Maps with business address
 * Address is URL-encoded for safety
 */
const openMaps = () => {
  if (props.business?.location?.address) {
    const address = encodeURIComponent(props.business.location.address)
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank')

    // CUSTOMIZATION: Replace with your preferred mapping service
    // Examples:
    // Apple Maps: `https://maps.apple.com/?q=${address}`
    // Waze: `https://waze.com/ul?q=${address}`
  }
}

// ===== IMAGE ERROR HANDLING =====

/**
 * Handles image loading errors by setting a placeholder
 * CUSTOMIZATION: Replace this URL with your own placeholder image
 * Recommended size: 800x400px or larger for good quality
 */
const handleImageError = (e) => {
  // Use a simple data URL to avoid external request failures
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmaWxsPSIjMDBEOUZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiPkJ1c2luZXNzIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
}

/**
 * Capitalizes the first letter of a string
 */
const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<!-- All styles moved to src/assets/styles/components/modals.css -->