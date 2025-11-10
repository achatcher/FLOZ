<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>

      <!-- Close Button -->
      <button class="modal-close" @click="closeModal" aria-label="Close modal">
        ✕
      </button>

      <div v-if="property" class="modal-content">

        <!-- Image Gallery -->
        <div class="property-gallery">
          <div class="main-image">
            <img
              :src="currentImage"
              :alt="property.address"
              class="gallery-main-photo"
              @error="handleImageError"
            />

            <!-- Gallery Navigation -->
            <div v-if="property.images?.length > 1" class="gallery-nav">
              <button
                v-for="(image, index) in property.images"
                :key="index"
                class="gallery-thumb"
                :class="{ active: currentImageIndex === index }"
                @click="currentImageIndex = index"
              >
                <img :src="image" :alt="`View ${index + 1}`" />
              </button>
            </div>

            <!-- Status Badge -->
            <div class="property-status" :class="property.status">
              {{ statusText }}
            </div>

            <!-- Virtual Tour Button -->
            <button
              v-if="property.virtualTour"
              class="virtual-tour-btn"
              @click="openVirtualTour"
            >
              🏠 Virtual Tour
            </button>
          </div>
        </div>

        <!-- Property Information -->
        <div class="property-info">

          <!-- Price & Basic Info -->
          <div class="property-header">
            <div class="property-price">
              <span class="price-amount">${{ formattedPrice }}</span>
              <span v-if="property.status === 'for-rent'" class="price-period">/month</span>
            </div>
            <button
              class="favorite-btn"
              :class="{ active: isFavorite }"
              @click="toggleFavorite"
            >
              {{ isFavorite ? '❤️ Saved' : '🤍 Save' }}
            </button>
          </div>

          <h1 class="property-address">{{ property.address }}</h1>

          <!-- Property Stats -->
          <div class="property-stats">
            <div v-if="property.bedrooms > 0" class="stat-item">
              <div class="stat-value">{{ property.bedrooms }}</div>
              <div class="stat-label">Bedroom{{ property.bedrooms > 1 ? 's' : '' }}</div>
            </div>
            <div v-if="property.bathrooms > 0" class="stat-item">
              <div class="stat-value">{{ property.bathrooms }}</div>
              <div class="stat-label">Bathroom{{ property.bathrooms > 1 ? 's' : '' }}</div>
            </div>
            <div v-if="property.sqft > 0" class="stat-item">
              <div class="stat-value">{{ formattedSqft }}</div>
              <div class="stat-label">Sq Ft</div>
            </div>
            <div v-if="property.lotSize" class="stat-item">
              <div class="stat-value">{{ property.lotSize }}</div>
              <div class="stat-label">Acres</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="property-actions">
            <button
              v-if="property.listingAgent?.phone"
              @click="callAgent"
              class="action-btn primary"
            >
              📞 Call Agent
            </button>
            <button
              v-if="property.listingAgent?.email"
              @click="emailAgent"
              class="action-btn"
            >
              📧 Email Agent
            </button>
            <button
              @click="getDirections"
              class="action-btn"
            >
              🗺️ Directions
            </button>
            <button
              @click="shareProperty"
              class="action-btn"
            >
              📤 Share
            </button>
          </div>

          <!-- Description -->
          <div v-if="property.description" class="property-description">
            <h3>Description</h3>
            <p>{{ property.description }}</p>
          </div>

          <!-- Features -->
          <div v-if="property.features?.length" class="property-features-section">
            <h3>Features & Amenities</h3>
            <div class="features-grid">
              <div
                v-for="feature in property.features"
                :key="feature"
                class="feature-item"
              >
                ✓ {{ feature }}
              </div>
            </div>
          </div>

          <!-- Property Details -->
          <div class="property-details-section">
            <h3>Property Details</h3>
            <div class="details-grid">
              <div v-if="property.yearBuilt" class="detail-row">
                <span class="detail-label">Year Built:</span>
                <span class="detail-value">{{ property.yearBuilt }}</span>
              </div>
              <div v-if="property.type" class="detail-row">
                <span class="detail-label">Property Type:</span>
                <span class="detail-value">{{ capitalizeFirst(property.type) }}</span>
              </div>
              <div v-if="property.waterfront !== undefined" class="detail-row">
                <span class="detail-label">Waterfront:</span>
                <span class="detail-value">{{ property.waterfront ? 'Yes' : 'No' }}</span>
              </div>
              <div v-if="property.mlsNumber" class="detail-row">
                <span class="detail-label">MLS #:</span>
                <span class="detail-value">{{ property.mlsNumber }}</span>
              </div>
              <div v-if="property.daysOnMarket" class="detail-row">
                <span class="detail-label">Days on Market:</span>
                <span class="detail-value">{{ property.daysOnMarket }} days</span>
              </div>
            </div>
          </div>

          <!-- Listing Agent -->
          <div v-if="property.listingAgent" class="agent-section">
            <h3>Listing Agent</h3>
            <div class="agent-card">
              <div class="agent-info">
                <div class="agent-name">{{ property.listingAgent.name }}</div>
                <div class="agent-company">{{ property.listingAgent.company }}</div>
                <div v-if="property.listingAgent.phone" class="agent-contact">
                  📞 {{ property.listingAgent.phone }}
                </div>
                <div v-if="property.listingAgent.email" class="agent-contact">
                  📧 {{ property.listingAgent.email }}
                </div>
              </div>
              <div class="agent-actions">
                <button
                  v-if="property.listingAgent.phone"
                  @click="callAgent"
                  class="agent-btn"
                >
                  Call
                </button>
                <button
                  v-if="property.listingAgent.email"
                  @click="emailAgent"
                  class="agent-btn"
                >
                  Email
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Error State -->
      <div v-else class="modal-error">
        <h2 class="modal-error-title">Property Information Unavailable</h2>
        <p>We're sorry, but the property details couldn't be loaded.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePropertyStore } from '@/stores/propertyStore'
import analytics from '@/utils/analytics'

// Props
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

// Emits
const emit = defineEmits(['close'])

// Store
const propertyStore = usePropertyStore()

// Reactive data
const currentImageIndex = ref(0)

// Computed
const currentImage = computed(() => {
  if (!props.property?.images?.length) {
    return '/images/properties/default-property.jpg'
  }
  return props.property.images[currentImageIndex.value]
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US').format(props.property?.price || 0)
})

const formattedSqft = computed(() => {
  return new Intl.NumberFormat('en-US').format(props.property?.sqft || 0)
})

const statusText = computed(() => {
  switch (props.property?.status) {
    case 'for-sale': return 'For Sale'
    case 'for-rent': return 'For Rent'
    case 'sold': return 'Sold'
    case 'pending': return 'Pending'
    default: return 'Available'
  }
})

const isFavorite = computed(() => {
  return propertyStore.isPropertyFavorite(props.property?.id)
})

// Watch for property changes to reset image index
watch(() => props.property, () => {
  currentImageIndex.value = 0
})

// Methods
const closeModal = () => {
  emit('close')
}

const toggleFavorite = () => {
  if (!props.property) return

  if (isFavorite.value) {
    propertyStore.removeFromFavorites(props.property.id)
  } else {
    propertyStore.addToFavorites(props.property.id)
  }
}

const callAgent = () => {
  if (props.property?.listingAgent?.phone) {
    analytics.track('property_contact', { method: 'phone', propertyId: props.property.id })
    window.location.href = `tel:${props.property.listingAgent.phone}`
  }
}

const emailAgent = () => {
  if (props.property?.listingAgent?.email) {
    const subject = `Inquiry about ${props.property.address}`
    const body = `Hi, I'm interested in learning more about the property at ${props.property.address}. MLS #: ${props.property.mlsNumber || 'N/A'}`

    analytics.track('property_contact', { method: 'email', propertyId: props.property.id })
    window.location.href = `mailto:${props.property.listingAgent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
}

const getDirections = () => {
  if (props.property?.address) {
    const address = encodeURIComponent(props.property.address)
    analytics.track('property_directions', { propertyId: props.property.id })
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank')
  }
}

const shareProperty = async () => {
  if (!props.property) return

  const shareData = {
    title: `${props.property.address} - $${formattedPrice.value}`,
    text: `Check out this property: ${props.property.description?.slice(0, 100)}...`,
    url: window.location.href
  }

  analytics.track('property_share', { propertyId: props.property.id })

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        if (window.$toast) {
          window.$toast.success('Property link copied to clipboard!')
        }
      }
    }
  } else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(window.location.href)
    if (window.$toast) {
      window.$toast.success('Property link copied to clipboard!')
    }
  }
}

const openVirtualTour = () => {
  if (props.property?.virtualTour) {
    analytics.track('property_virtual_tour', { propertyId: props.property.id })
    window.open(props.property.virtualTour, '_blank')
  }
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjMDBEOUZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiPjxQcm9wZXJ0eSBJbWFnZTwvdGV4dD4KPHN2Zz4K'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 0;
}

.modal-container {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  width: 100%;
  max-width: 900px;
  min-height: 100vh;
  position: relative;
  margin: 0;
  border-left: 1px solid rgba(6, 182, 212, 0.1);
  border-right: 1px solid rgba(6, 182, 212, 0.1);
}

.modal-content {
  min-height: 100vh;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.property-gallery {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.gallery-main-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-nav {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.gallery-thumb {
  width: 60px;
  height: 45px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.gallery-thumb.active {
  border-color: #06b6d4;
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-status {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(6, 182, 212, 0.9);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.virtual-tour-btn {
  position: absolute;
  top: 16px;
  right: 70px;
  background: rgba(251, 191, 36, 0.9);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.virtual-tour-btn:hover {
  background: rgba(251, 191, 36, 1);
  transform: translateY(-2px);
}

.property-info {
  padding: 30px;
}

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.property-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-amount {
  color: #06b6d4;
  font-size: 32px;
  font-weight: 800;
}

.price-period {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

.favorite-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.favorite-btn.active {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.property-address {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px 0;
  line-height: 1.3;
}

.property-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-value {
  color: #06b6d4;
  font-size: 24px;
  font-weight: 800;
  display: block;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.property-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-color: #06b6d4;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #0891b2, #0e7490);
}

.property-description,
.property-features-section,
.property-details-section,
.agent-section {
  margin-bottom: 32px;
}

.property-description h3,
.property-features-section h3,
.property-details-section h3,
.agent-section h3 {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.property-description p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.feature-item {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.details-grid {
  display: grid;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.detail-value {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.agent-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.agent-name {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.agent-company {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 8px;
}

.agent-contact {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 2px 0;
}

.agent-actions {
  display: flex;
  gap: 8px;
}

.agent-btn {
  background: rgba(6, 182, 212, 0.2);
  border: 1px solid rgba(6, 182, 212, 0.4);
  color: #06b6d4;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.agent-btn:hover {
  background: rgba(6, 182, 212, 0.3);
}

.modal-error {
  padding: 60px 30px;
  text-align: center;
  color: white;
}

.modal-error-title {
  color: #06b6d4;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .property-info {
    padding: 20px;
  }

  .property-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .property-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
  }

  .property-actions {
    grid-template-columns: 1fr;
  }

  .agent-card {
    flex-direction: column;
    gap: 16px;
  }

  .agent-actions {
    align-self: stretch;
  }

  .agent-btn {
    flex: 1;
    text-align: center;
  }
}
</style>