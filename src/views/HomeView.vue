<template>
  <div class="home-view">
    <TopBar @toggle-menu="toggleSideMenu" />

    <div class="home-content">
      <!-- ===== LUXURY BRAND HEADER ===== -->
      <!-- Clean luxury branding with logo and taglines -->
      <div class="luxury-brand-header">
        <div class="brand-container">
          <!-- Left: Brand Logo -->
          <div class="brand-logo">
            <img
              src="/images/green.png"
              alt="The Greenville Social Logo"
              class="gs-logo"
            />
          </div>

          <!-- Right: Brand Name and Taglines -->
          <div class="brand-content">
            <h1 class="brand-title">{{ appInfo?.name || 'Loading...' }}</h1>
            <p class="brand-subtitle">{{ appInfo?.tagline || 'Loading...' }}</p>
            <p class="brand-features">{{ appInfo?.description || 'Loading...' }}</p>
          </div>
        </div>
      </div>

      <!-- ===== CATEGORY GRID ===== -->
      <!-- Dynamic categories from configuration -->
      <div class="category-grid" v-if="categories.length > 0">
        <!-- All Categories - Dynamically sized based on featured flag -->
        <div
          v-for="category in categories"
          :key="category.id"
          :class="['category-card', category.featured ? 'large' : 'medium']"
          @click="handleCategoryClick(category.name)"
        >
          <img
            :src="category.image"
            :alt="category.name"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <div class="icon">{{ category.icon }}</div>
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <h3 class="category-name">{{ category.displayName }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- Side Menu -->
    <transition name="slide">
      <SideMenu v-if="showSideMenu" @close="toggleSideMenu" @show-community-modal="showCommunityModal" />
    </transition>

    <!-- Community Website Modal -->
    <div v-if="showCommunityWebsiteModal" class="community-modal" @click.self="closeCommunityModal">
      <div class="modal-content">
        <button @click="closeCommunityModal" class="close-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>

        <div class="modal-header">
          <h2 class="modal-title">Community Website</h2>
          <p class="modal-subtitle">Connect with the Greenville community online</p>
        </div>

        <div class="modal-body">
          <div class="website-features">
            <div class="feature-card">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              <h3>Community Events</h3>
              <p>Stay updated on exclusive neighborhood events and gatherings</p>
            </div>

            <div class="feature-card">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5Z"/>
              </svg>
              <h3>Resources & News</h3>
              <p>Access community announcements and important resources</p>
            </div>

            <div class="feature-card">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
              </svg>
              <h3>Direct Contact</h3>
              <p>Connect directly with community management and services</p>
            </div>
          </div>

          <div class="website-actions">
            <button class="btn-primary" @click="visitCommunityWebsite">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12S16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12S19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12S9.56 10.66 9.66 10H14.34C14.44 10.66 14.5 11.32 14.5 12S14.44 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8.03 8M5.08 16H8.03C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8Z"/>
              </svg>
              Visit Community Website
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BUSINESS DETAILS MODAL ===== -->
    <!-- Opens when user clicks hero banner for more information -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppConfig } from '@/composables/useAppConfig'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

const router = useRouter()
const {
  getAppInfo,
  getCategories,
  getCategoryById,
  initializeApp
} = useAppConfig()

const showSideMenu = ref(false)
const showCommunityWebsiteModal = ref(false)

// Dynamic app info
const appInfo = computed(() => getAppInfo.value)
const categories = computed(() => getCategories.value)

// Business Modal State
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

const toggleSideMenu = () => {
  showSideMenu.value = !showSideMenu.value
}

const showCommunityModal = () => {
  showCommunityWebsiteModal.value = true
}

const closeCommunityModal = () => {
  showCommunityWebsiteModal.value = false
}

const visitCommunityWebsite = () => {
  // Replace with actual community website URL
  window.open('https://thehillscommunity.com', '_blank')
  closeCommunityModal()
}

// Hero banner is now purely decorative - no click action needed

const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}

// Initialize app configuration
onMounted(async () => {
  try {
    await initializeApp()
    console.log('✅ HomeView: App configuration loaded')
  } catch (error) {
    console.error('❌ HomeView: Failed to load app configuration:', error)
  }
})

const handleCategoryClick = (categoryName) => {
  // Direct route to events page for event-related categories
  if (categoryName === 'Private Events' || categoryName === 'Wine & Spirits') {
    router.push({ name: 'Events' })
  } else if (categoryName === 'Member Perks') {
    // Show member perks modal or page
    alert('Exclusive member perks coming soon! Contact our concierge for access.')
  } else {
    // Map display names to actual business store categories
    const categoryMapping = {
      'Luxury Shopping': 'Shopping',
      'Luxury Real Estate': 'Real Estate',
      'Wellness & Spa': 'Spa',
      'Private Clubs': 'Private Clubs' // Will need to add these businesses
    }

    // Get the actual category name or use the original if no mapping exists
    const actualCategoryName = categoryMapping[categoryName] || categoryName

    // All categories go through interstitial (including Cocktail Hour)
    router.push({
      name: 'CategoryInterstitial',
      params: { categoryName: actualCategoryName }
    })
  }
}

/**
 * Handles category image loading errors by showing emoji fallbacks
 * CUSTOMIZATION: You can modify this to show different fallback behavior
 */
const handleImageError = (event) => {
  event.target.style.display = 'none'
  const placeholder = event.target.nextElementSibling
  if (placeholder && placeholder.classList.contains('category-placeholder')) {
    placeholder.style.display = 'flex'
  }
}
</script>

<!-- All styles moved to src/assets/styles/pages/home.css -->


