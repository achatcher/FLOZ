<template>
  <BaseModal
    :is-visible="isVisible"
    :title="property?.address"
    :subtitle="`${property?.price} • ${property?.bedrooms}BR/${property?.bathrooms}BA`"
    :description="property?.description"
    :hero-image="currentImage"
    :actions="modalActions"
    @close="closeModal"
  >
    <!-- Property Details Content -->
    <template #content>
      <div v-if="property" class="property-details">

        <!-- Property Gallery Navigation -->
        <div v-if="property.images?.length > 1" class="property-gallery">
          <h4 class="gallery-title">
            <svg class="gallery-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"/>
            </svg>
            Photo Gallery ({{ property.images.length }} photos)
          </h4>
          <div class="gallery-thumbnails">
            <button
              v-for="(image, index) in property.images"
              :key="index"
              class="gallery-thumb"
              :class="{ active: currentImageIndex === index }"
              @click="setCurrentImage(index)"
            >
              <img :src="image" :alt="`View ${index + 1}`" />
            </button>
          </div>
        </div>

        <!-- Property Status -->
        <div class="property-status-section">
          <div class="status-badge" :class="property.status">
            <svg class="status-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            {{ statusText }}
          </div>
          <div v-if="property.daysOnMarket" class="days-on-market">
            {{ property.daysOnMarket }} days on market
          </div>
        </div>

        <!-- Property Details Grid -->
        <div class="property-info-grid">
          <div class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
            </svg>
            <div class="info-content">
              <span class="info-label">Size</span>
              <span class="info-value">{{ property.squareFootage }} sq ft</span>
            </div>
          </div>

          <div v-if="property.lotSize" class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
            </svg>
            <div class="info-content">
              <span class="info-label">Lot Size</span>
              <span class="info-value">{{ property.lotSize }}</span>
            </div>
          </div>

          <div v-if="property.yearBuilt" class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7Z"/>
            </svg>
            <div class="info-content">
              <span class="info-label">Year Built</span>
              <span class="info-value">{{ property.yearBuilt }}</span>
            </div>
          </div>

          <div v-if="property.propertyType" class="info-item">
            <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z"/>
            </svg>
            <div class="info-content">
              <span class="info-label">Property Type</span>
              <span class="info-value">{{ property.propertyType }}</span>
            </div>
          </div>
        </div>

        <!-- Property Features -->
        <div v-if="property.features?.length" class="property-features">
          <h4 class="features-title">
            <svg class="features-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Key Features
          </h4>
          <div class="features-grid">
            <div v-for="feature in property.features" :key="feature" class="feature-item">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
              </svg>
              {{ feature }}
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Agent Contact in Additional Slot -->
    <template #additional>
      <div v-if="property?.agent" class="agent-contact">
        <h3 class="agent-title">
          <svg class="agent-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8S13.66 11 12 11 9 9.66 9 8 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9S17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"/>
          </svg>
          Listing Agent
        </h3>
        <div class="agent-info">
          <div class="agent-details">
            <p class="agent-name">{{ property.agent.name }}</p>
            <p v-if="property.agent.company" class="agent-company">{{ property.agent.company }}</p>
          </div>
          <div class="agent-contact-methods">
            <p v-if="property.agent.phone" class="agent-contact-item">
              <svg class="agent-contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
              </svg>
              {{ property.agent.phone }}
            </p>
            <p v-if="property.agent.email" class="agent-contact-item">
              <svg class="agent-contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
              </svg>
              {{ property.agent.email }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from '@/components/UI/BaseModal.vue'
import { ICONS } from '@/utils/icons'

const props = defineProps({
  property: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const currentImageIndex = ref(0)

const closeModal = () => {
  emit('close')
}

// Current image computed property
const currentImage = computed(() => {
  if (!props.property?.images?.length) return props.property?.image
  return props.property.images[currentImageIndex.value]
})

// Property status text
const statusText = computed(() => {
  const status = props.property?.status
  if (!status) return ''

  const statusMap = {
    'for-sale': 'For Sale',
    'under-contract': 'Under Contract',
    'sold': 'Sold',
    'for-rent': 'For Rent',
    'rented': 'Rented',
    'coming-soon': 'Coming Soon'
  }

  return statusMap[status] || status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
})

// Modal Actions with white SVG icons
const modalActions = computed(() => {
  if (!props.property) return []

  const actions = []

  // Virtual Tour action
  if (props.property.virtualTour) {
    actions.push({
      label: 'Virtual Tour',
      icon: ICONS.THEATER,
      handler: openVirtualTour,
      variant: 'primary',
      tooltip: 'Take virtual tour'
    })
  }

  // Contact Agent action
  if (props.property.agent?.phone) {
    actions.push({
      label: 'Call Agent',
      icon: ICONS.PHONE,
      handler: callAgent,
      variant: 'secondary',
      tooltip: 'Call listing agent'
    })
  }

  // Directions action
  if (props.property.address) {
    actions.push({
      label: 'Directions',
      icon: ICONS.DIRECTIONS,
      handler: getDirections,
      variant: 'secondary',
      tooltip: 'Get directions'
    })
  }

  // Share action
  actions.push({
    label: 'Share',
    icon: ICONS.SHARE,
    handler: shareProperty,
    variant: 'ghost',
    tooltip: 'Share property'
  })

  return actions
})

// Action Functions
const setCurrentImage = (index) => {
  currentImageIndex.value = index
}

const openVirtualTour = () => {
  if (props.property?.virtualTour) {
    window.open(props.property.virtualTour, '_blank')
  }
}

const callAgent = () => {
  if (props.property?.agent?.phone) {
    window.location.href = `tel:${props.property.agent.phone}`
  }
}

const getDirections = () => {
  if (props.property?.address) {
    const encodedAddress = encodeURIComponent(props.property.address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  }
}

const shareProperty = async () => {
  const shareData = {
    title: props.property?.address,
    text: `Check out this property: ${props.property?.address} - ${props.property?.price}`,
    url: window.location.href
  }

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') {
        fallbackShare()
      }
    }
  } else {
    fallbackShare()
  }
}

const fallbackShare = () => {
  const text = `Check out this property: ${props.property?.address} - ${props.property?.price}`

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    alert('Property details copied to clipboard!')
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Property details copied to clipboard!')
  }
}
</script>

<style scoped>
/* Property-specific styling for BaseModal content */
.property-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Property Gallery Section */
.property-gallery {
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.gallery-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
}

.gallery-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.gallery-thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: var(--space-2);
}

.gallery-thumb {
  position: relative;
  width: 60px;
  height: 40px;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-all);
  background: none;
  padding: 0;
}

.gallery-thumb.active {
  border-color: var(--color-primary);
}

.gallery-thumb:hover {
  border-color: var(--color-primary-light);
  transform: scale(1.05);
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Property Status Section */
.property-status-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.status-badge.for-sale {
  background: var(--color-success-alpha-10);
  color: var(--color-success);
  border: 1px solid var(--color-success-alpha-30);
}

.status-badge.under-contract {
  background: var(--color-warning-alpha-10);
  color: var(--color-warning);
  border: 1px solid var(--color-warning-alpha-30);
}

.status-badge.sold {
  background: var(--color-error-alpha-10);
  color: var(--color-error);
  border: 1px solid var(--color-error-alpha-30);
}

.status-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.days-on-market {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Property Info Grid */
.property-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.info-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.info-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.info-value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

/* Property Features */
.property-features {
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.features-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
}

.features-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.feature-icon {
  width: 16px;
  height: 16px;
  color: var(--color-success);
  flex-shrink: 0;
}

/* Agent Contact Section */
.agent-contact {
  padding: var(--space-5);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
  margin-top: var(--space-2);
}

.agent-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.agent-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.agent-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.agent-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.agent-company {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.agent-contact-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.agent-contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin: 0;
}

.agent-contact-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .property-info-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .property-status-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .gallery-thumbnails {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  }

  .gallery-thumb {
    width: 50px;
    height: 33px;
  }

  .property-gallery,
  .property-features,
  .agent-contact {
    padding: var(--space-3);
  }
}
</style>