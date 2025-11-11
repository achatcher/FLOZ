<template>
  <div class="category-listing-view">
    <TopBar title="Announcements" :show-back="true" />

    <div class="listing-content">
      <!-- ===== HERO ANNOUNCEMENT (SIGNATURE TIER) ===== -->
      <div v-if="heroAnnouncement" class="hero-listing">
        <div class="hero-card" @click="openAnnouncement(heroAnnouncement)">
          <div class="hero-image-container">
            <img
              :src="heroAnnouncement.image"
              :alt="heroAnnouncement.title"
              class="hero-image"
              @error="handleImageError"
            />
          </div>
          <div class="hero-info">
            <h2 class="hero-name">{{ heroAnnouncement.title }}</h2>
            <p class="hero-description">{{ heroAnnouncement.excerpt }}</p>
            <div class="hero-features">
              <span class="hero-category">{{ heroAnnouncement.category }}</span>
              <span class="hero-price">{{ formatDate(heroAnnouncement.publishDate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FEATURED ANNOUNCEMENTS (PREMIER TIER) ===== -->
      <div v-if="featuredAnnouncements.length > 0" class="featured-section">
        <h3 class="section-title">Featured Updates</h3>
        <div class="featured-grid">
          <div
            v-for="announcement in featuredAnnouncements"
            :key="announcement.id"
            class="featured-card"
            @click="openAnnouncement(announcement)"
          >
            <div class="featured-image-container">
              <img
                :src="announcement.image"
                :alt="announcement.title"
                class="featured-image"
                @error="handleImageError"
              />
            </div>
            <div class="featured-info">
              <h4 class="featured-name">{{ announcement.title }}</h4>
              <p class="featured-category">{{ announcement.category }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== STANDARD ANNOUNCEMENTS (CURATED TIER) ===== -->
      <div v-if="standardAnnouncements.length > 0" class="standard-section">
        <h3 class="section-title">All Announcements</h3>
        <div class="standard-list">
          <div
            v-for="announcement in standardAnnouncements"
            :key="announcement.id"
            class="standard-item"
            @click="openAnnouncement(announcement)"
          >
            <div class="standard-image-wrapper">
              <img
                :src="announcement.image"
                :alt="announcement.title"
                class="standard-image"
                @error="handleImageError"
              />
            </div>
            <div class="standard-content">
              <h4 class="standard-title">{{ announcement.title }}</h4>
              <p class="standard-subtitle">{{ announcement.category }}</p>
              <div class="standard-meta">
                <span class="standard-price">{{ formatDate(announcement.publishDate) }}</span>
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
      <div v-if="loading" class="loading-state">
        <div class="loading-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6V9L16 5L12 1V4C7.58 4 4 7.58 4 12S7.58 20 12 20 20 16.42 20 12H18C18 15.31 15.31 18 12 18S6 15.31 6 12 8.69 6 12 6Z"/>
          </svg>
        </div>
        <h3 class="loading-title">Loading...</h3>
        <p class="loading-text">Getting the latest community updates.</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!heroAnnouncement && featuredAnnouncements.length === 0 && standardAnnouncements.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
        </div>
        <h3 class="empty-title">Coming Soon</h3>
        <p class="empty-text">New community announcements will appear here.</p>
      </div>
    </div>

    <BottomNav />

    <!-- Announcement Modal -->
    <BusinessModal
      :business="selectedAnnouncement"
      :is-visible="showAnnouncementModal"
      @close="closeAnnouncementModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'
import { useBusinessStore } from '@/stores/businessStore'
import { useAppConfig } from '@/composables/useAppConfig'

// Reactive data
const announcements = ref([])
const selectedAnnouncement = ref(null)
const showAnnouncementModal = ref(false)
const loading = ref(false)

// Store and config setup
const businessStore = useBusinessStore()
const { initializeApp, getCurrentBusinesses, getConfig } = useAppConfig()

// ===== THREE-TIER ANNOUNCEMENT STRUCTURE =====

/**
 * HERO TIER: Featured announcement with largest display
 */
const heroAnnouncement = computed(() => {
  return announcements.value.find(announcement =>
    announcement.tier === 'signature' || announcement.featured
  ) || null
})

/**
 * PREMIER TIER: Featured announcements in grid layout
 */
const featuredAnnouncements = computed(() => {
  return announcements.value.filter(announcement =>
    (announcement.tier === 'premier' || announcement.priority === 'high') &&
    announcement.id !== heroAnnouncement.value?.id
  )
})

/**
 * CURATED TIER: Standard announcements in list format
 */
const standardAnnouncements = computed(() => {
  return announcements.value.filter(announcement => {
    const isHero = announcement.id === heroAnnouncement.value?.id
    const isFeatured = featuredAnnouncements.value.some(featured => featured.id === announcement.id)
    return !isHero && !isFeatured
  })
})

// Methods
const openAnnouncement = (announcement) => {
  // Transform announcement to business-like structure for modal compatibility
  selectedAnnouncement.value = {
    ...announcement,
    name: announcement.title,
    category: announcement.category,
    description: announcement.content?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || announcement.excerpt,
    contact: {
      phone: null,
      website: null,
      email: null,
      address: 'Greenville, SC'
    },
    features: {
      community_update: true
    }
  }
  showAnnouncementModal.value = true
}

const closeAnnouncementModal = () => {
  showAnnouncementModal.value = false
  selectedAnnouncement.value = null
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMkY1MjMzIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmaWxsPSIjRDRBRjM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIj5Bbm5vdW5jZW1lbnQ8L3RleHQ+Cjwvc3ZnPgo='
}
</script>

<script>
// DYNAMIC ANNOUNCEMENT LOADING FUNCTION (placeholder for future dynamic implementation)
export default {
  methods: {
    async loadAnnouncements() {
      try {
        // Initialize app configuration
        await this.$refs.initializeApp()
        await this.$refs.businessStore.loadData()

        const businesses = this.$refs.getCurrentBusinesses.value || []
        const config = this.$refs.getConfig.value || {}
        const locationName = config.location || 'Greenville'

        // Generate dynamic announcements based on available businesses and location
        const generatedAnnouncements = []

        // Create signature tier announcements from signature businesses
        const signatureBusinesses = businesses.filter(b => b.tier === 'signature').slice(0, 2)
        signatureBusinesses.forEach((business, index) => {
          generatedAnnouncements.push({
            id: `sig-${business.id}`,
            title: `Featured Partner: ${business.name}`,
            excerpt: business.description || `Discover the exceptional experience at ${business.name}, one of ${locationName}'s premier destinations.`,
            category: business.category,
            subcategory: business.subcategory || 'Featured Business',
            author: business.name,
            publishDate: new Date().toISOString().split('T')[0],
            image: business.heroImage || business.image || business.logo || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop&crop=center',
            tier: 'signature',
            featured: true,
            priority: 'high',
            price_range: business.priceRange || 'Contact for pricing',
            contact: business.contact || {},
            features: business.features ? Object.fromEntries(business.features.map(f => [f.toLowerCase().replace(/\s+/g, '_'), true])) : {},
            content: `
              <p>${business.description || `Experience the best that ${locationName} has to offer at ${business.name}.`}</p>

              ${business.features ? `<h3>Features</h3><ul>${business.features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}

              ${business.hours ? `<h3>Hours</h3><p>Visit us during our regular business hours for the best experience.</p>` : ''}

              <h3>Contact Information</h3>
              <p>For more information, please contact ${business.name} directly.</p>
            `
          })
        })

        this.announcements = generatedAnnouncements

      } catch (error) {
        console.error('Failed to load dynamic announcements:', error)
        // Fallback to empty array if dynamic loading fails
        this.announcements = []
      }
    }
  }
}
</script>

<style src="../assets/styles/pages/category-listing.css" scoped></style>