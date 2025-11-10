<template>
  <div class="property-card" @click="$emit('view-details', property)">
    <!-- Property Image -->
    <div class="property-image">
      <img
        :src="property.images?.[0] || '/images/properties/default-property.jpg'"
        :alt="property.address"
        class="property-photo"
        @error="handleImageError"
      />

      <!-- Status Badge -->
      <div class="property-status" :class="property.status">
        {{ statusText }}
      </div>

      <!-- Featured Badge -->
      <div v-if="property.featured" class="property-featured">
        ⭐ Featured
      </div>

      <!-- Favorite Button -->
      <button
        class="property-favorite"
        :class="{ active: isFavorite }"
        @click.stop="toggleFavorite"
        :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        {{ isFavorite ? '❤️' : '🤍' }}
      </button>
    </div>

    <!-- Property Details -->
    <div class="property-content">
      <!-- Price -->
      <div class="property-price">
        <span class="price-amount">${{ formattedPrice }}</span>
        <span v-if="property.status === 'for-rent'" class="price-period">/month</span>
      </div>

      <!-- Address -->
      <div class="property-address">{{ property.address }}</div>

      <!-- Property Details -->
      <div class="property-details">
        <span v-if="property.bedrooms > 0" class="detail-item">
          🛏️ {{ property.bedrooms }} bed{{ property.bedrooms > 1 ? 's' : '' }}
        </span>
        <span v-if="property.bathrooms > 0" class="detail-item">
          🚿 {{ property.bathrooms }} bath{{ property.bathrooms > 1 ? 's' : '' }}
        </span>
        <span v-if="property.sqft > 0" class="detail-item">
          📐 {{ formattedSqft }} sqft
        </span>
      </div>

      <!-- Property Features -->
      <div v-if="property.features?.length" class="property-features">
        <span
          v-for="feature in property.features.slice(0, 2)"
          :key="feature"
          class="feature-tag"
        >
          {{ feature }}
        </span>
        <span v-if="property.features.length > 2" class="feature-more">
          +{{ property.features.length - 2 }} more
        </span>
      </div>

      <!-- Listing Agent -->
      <div class="property-agent">
        <div class="agent-name">{{ property.listingAgent?.name || 'Contact MLS' }}</div>
        <div class="agent-company">{{ property.listingAgent?.company }}</div>
      </div>

      <!-- Days on Market -->
      <div v-if="property.daysOnMarket" class="property-dom">
        {{ property.daysOnMarket }} days on market
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePropertyStore } from '@/stores/propertyStore'

// Props
const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['view-details'])

// Store
const propertyStore = usePropertyStore()

// Computed
const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US').format(props.property.price)
})

const formattedSqft = computed(() => {
  return new Intl.NumberFormat('en-US').format(props.property.sqft)
})

const statusText = computed(() => {
  switch (props.property.status) {
    case 'for-sale': return 'For Sale'
    case 'for-rent': return 'For Rent'
    case 'sold': return 'Sold'
    case 'pending': return 'Pending'
    default: return 'Available'
  }
})

const isFavorite = computed(() => {
  return propertyStore.isPropertyFavorite(props.property.id)
})

// Methods
const toggleFavorite = () => {
  if (isFavorite.value) {
    propertyStore.removeFromFavorites(props.property.id)
  } else {
    propertyStore.addToFavorites(props.property.id)
  }
}

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjMDBEOUZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiPjxIb21lIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
}
</script>

<style scoped>
.property-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.property-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 8px 32px rgba(6, 182, 212, 0.2);
}

.property-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.property-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .property-photo {
  transform: scale(1.05);
}

.property-status {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(6, 182, 212, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.property-status.for-rent {
  background: rgba(34, 197, 94, 0.9);
}

.property-status.sold {
  background: rgba(239, 68, 68, 0.9);
}

.property-status.pending {
  background: rgba(251, 191, 36, 0.9);
}

.property-featured {
  position: absolute;
  top: 12px;
  right: 50px;
  background: rgba(251, 191, 36, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.property-favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.property-favorite:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.property-favorite.active {
  background: rgba(239, 68, 68, 0.9);
}

.property-content {
  padding: 20px;
}

.property-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.price-amount {
  color: #06b6d4;
  font-size: 24px;
  font-weight: 800;
}

.price-period {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.property-address {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.4;
}

.property-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.detail-item {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.property-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.feature-tag {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.feature-more {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-style: italic;
}

.property-agent {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 12px;
  margin-bottom: 8px;
}

.agent-name {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.agent-company {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-top: 2px;
}

.property-dom {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-style: italic;
}

@media (max-width: 640px) {
  .property-details {
    flex-direction: column;
    gap: 8px;
  }

  .property-features {
    gap: 4px;
  }

  .feature-tag {
    font-size: 11px;
    padding: 2px 6px;
  }
}
</style>