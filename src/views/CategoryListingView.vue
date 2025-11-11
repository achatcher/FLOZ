<template>
  <div class="category-listing-view">
    <TopBar :title="categoryName" :show-back="true" />

    <div class="listing-content">
      <!-- ===== TIER 1: HERO LISTING (SIGNATURE) ===== -->
      <!-- MONETIZATION: Premium hero placement - largest photo, most expensive tier -->
      <div v-if="heroListing" class="hero-listing">
        <div class="hero-card" @click="openBusiness(heroListing)">
          <img
            :src="getBusinessImage(heroListing)"
            :alt="heroListing.name"
            class="hero-image"
            @error="handleImageError"
          />
          <div class="hero-overlay">
            <div class="hero-content">
              <div class="tier-badge signature">SIGNATURE</div>
              <h2 class="hero-title">{{ heroListing.name }}</h2>
              <p class="hero-subtitle">{{ heroListing.description }}</p>
              <div class="hero-features">
                <span class="hero-category">{{ heroListing.subcategory || heroListing.category }}</span>
                <span class="hero-price">{{ heroListing.price_range || heroListing.priceRange }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== TIER 2: FEATURED LISTINGS (PREMIER) ===== -->
      <!-- MONETIZATION: Mid-tier advertising - medium ad space -->
      <div v-if="featuredListings.length > 0" class="featured-section">
        <h3 class="section-title">Featured Establishments</h3>
        <div class="featured-grid">
          <div
            v-for="business in featuredListings"
            :key="business.id"
            class="featured-card"
            @click="openBusiness(business)"
          >
            <img
              :src="getBusinessImage(business)"
              :alt="business.name"
              class="featured-image"
              @error="handleImageError"
            />
            <div class="featured-overlay">
              <div class="tier-badge premier">PREMIER</div>
              <h4 class="featured-title">{{ business.name }}</h4>
              <p class="featured-subtitle">{{ business.subcategory || business.category }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== TIER 3: STANDARD LISTINGS (CURATED) ===== -->
      <!-- MONETIZATION: Basic listing tier - small circle photos, single column -->
      <div v-if="standardListings.length > 0" class="standard-section">
        <h3 class="section-title">All Establishments</h3>
        <div class="standard-list">
          <div
            v-for="business in standardListings"
            :key="business.id"
            class="standard-item"
            @click="openBusiness(business)"
          >
            <div class="standard-image-wrapper">
              <img
                :src="getBusinessImage(business)"
                :alt="business.name"
                class="standard-image"
                @error="handleImageError"
              />
            </div>
            <div class="standard-content">
              <h4 class="standard-title">{{ business.name }}</h4>
              <p class="standard-subtitle">{{ business.subcategory || business.category }}</p>
              <div class="standard-meta">
                <span class="standard-price">{{ business.price_range || business.priceRange }}</span>
                <span class="tier-badge curated">CURATED</span>
              </div>
            </div>
            <div class="standard-arrow">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="businessStore.loading" class="loading-state">
        <div class="loading-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12S7.58 20 12 20 20 16.42 20 12H18C18 15.31 15.31 18 12 18S6 15.31 6 12 8.69 6 12 6Z"/>
          </svg>
        </div>
        <h3 class="loading-title">Loading...</h3>
        <p class="loading-text">Getting ready to show you the best of The Hills.</p>
      </div>

      <!-- Empty State if no businesses -->
      <div v-else-if="!heroListing && featuredListings.length === 0 && standardListings.length === 0 && !businessStore.loading" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h3 class="empty-title">Coming Soon</h3>
        <p class="empty-text">We're curating the finest establishments in this category.</p>
      </div>
    </div>
    
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
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

const router = useRouter()
const route = useRoute()
const businessStore = useBusinessStore()

const categoryName = computed(() => route.params.categoryName || 'Category')

// Business Modal
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

// ===== THREE-TIER MONETIZATION STRUCTURE =====

/**
 * TIER 1: Hero Listing (Signature)
 * Premium placement - largest photo, most expensive advertising tier
 */
const heroListing = computed(() => {
  const businesses = businessStore.getBusinessesByCategory(categoryName.value)
  return businesses.find(business =>
    business.listing_tier === 'signature' ||
    business.tier === 'signature'
  ) || null
})

/**
 * TIER 2: Featured Listings (Premier)
 * Mid-tier advertising - medium ad space, good visibility
 */
const featuredListings = computed(() => {
  const businesses = businessStore.getBusinessesByCategory(categoryName.value)
  return businesses.filter(business =>
    (business.listing_tier === 'premier' || business.tier === 'premier') &&
    business.id !== heroListing.value?.id
  )
})

/**
 * TIER 3: Standard Listings (Curated)
 * Basic listing tier - small circle photos, single column display
 */
const standardListings = computed(() => {
  const businesses = businessStore.getBusinessesByCategory(categoryName.value)
  return businesses.filter(business => {
    const isHero = business.id === heroListing.value?.id
    const isFeatured = featuredListings.value.some(featured => featured.id === business.id)
    return !isHero && !isFeatured
  })
})

onMounted(() => {
  // Special handling for Cocktail Hour - redirect to the special cocktail view
  if (categoryName.value === 'Cocktail Hour') {
    router.push({ name: 'CocktailHour' })
    return
  }
})

/**
 * Opens business modal for any tier listing
 */
const openBusiness = (business) => {
  selectedBusiness.value = business
  showBusinessModal.value = true
}

const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}

/**
 * Gets business image with fallback to placeholder
 */
const getBusinessImage = (business) => {
  if (business.logo) {
    return business.logo
  }

  // Generate image based on business category for consistency
  const categoryImages = {
    'Fine Dining': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center',
    'Private Clubs': 'https://images.unsplash.com/photo-1544642899-f024de1e4a7d?w=800&h=600&fit=crop&crop=center',
    'Cocktail Hour': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&crop=center',
    'Luxury Shopping': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center',
    'Wellness & Spa': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&crop=center',
    'Luxury Real Estate': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center',
    'Arts & Culture': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&crop=center',
    'Athletics': 'https://images.unsplash.com/photo-1544966503-7e22ee2c0dcc?w=800&h=600&fit=crop&crop=center'
  }

  return categoryImages[business.category] || categoryImages['Fine Dining']
}

/**
 * Handles image loading errors with placeholder fallback
 * CUSTOMIZATION: Replace placeholder URL with your branded fallback image
 * PLACEHOLDER: Currently uses placeholder.com - replace with CDN or local fallback
 */
const handleImageError = (e) => {
  // Use a simple data URL to avoid external request failures
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjMDBEOUZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiPkltYWdlPC90ZXh0Pgo8L3N2Zz4K'
}
</script>

<!-- All styles moved to src/assets/styles/pages/category-listing.css -->
