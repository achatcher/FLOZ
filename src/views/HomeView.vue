<template>
  <div class="home-view">
    <TopBar title="The Hills Guide" @toggle-menu="toggleSideMenu" />

    <div class="home-content">
      <!-- ===== HERO BANNER SECTION ===== -->
      <!-- CUSTOMIZATION: Replace /images/floz-hero.jpg with your branded hero image -->
      <!-- Recommended size: 800x400px or larger for sharp display on all devices -->
      <div class="hero-banner">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&crop=center"
          alt="The Hills Guide - Curated Luxury Lifestyle"
          class="hero-image"
          @error="handleImageError"
        />
        <div class="hero-overlay">
          <div class="hero-content">
            <div class="tier-badge signature">SIGNATURE</div>
            <h1 class="hero-title">The Hills Guide</h1>
            <p class="hero-subtitle">Curated luxury lifestyle for discerning residents</p>
            <div class="hero-features">
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
                <span>Exclusive Access</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L2 12H5V20H19V12H22L12 3ZM12 7.69L17 12.19V18H15V14H9V18H7V12.19L12 7.69Z"/>
                </svg>
                <span>Private Clubs</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2C5.45 2 5 2.45 5 3V4H4C2.9 4 2 4.9 2 6V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V6C22 4.9 21.1 4 20 4H19V3C19 2.45 18.55 2 18 2S17 2.45 17 3V4H7V3C7 2.45 6.55 2 6 2Z"/>
                </svg>
                <span>Fine Dining</span>
              </div>
            </div>
          </div>
        </div>
        <!-- PLACEHOLDER: Fallback uses placeholder.com - replace with your branded fallback -->
      </div>

      <!-- ===== CATEGORY GRID ===== -->
      <!-- CUSTOMIZATION: Update category images in /images/categories/ folder -->
      <!-- Each category needs: name.jpg (e.g., podcast-network.jpg) -->
      <!-- Recommended size: 400x400px for square format -->
      <div class="category-grid">
        <!-- Row 1: Two Large Cards Side by Side -->
        <div
          class="category-card large"
          @click="handleCategoryClick('Fine Dining')"
        >
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&crop=center"
            alt="Fine Dining"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.1 13.34L3.91 9.16C2.35 7.59 2.35 5.06 3.91 3.5C5.48 1.93 8.01 1.93 9.58 3.5L12 5.92L14.42 3.5C16 1.93 18.52 1.93 20.09 3.5C21.65 5.06 21.65 7.59 20.09 9.16L15.9 13.34L12 17.25L8.1 13.34Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <div class="category-subtitle">MICHELIN RECOMMENDED</div>
              <h3 class="category-name">FINE DINING</h3>
              <div class="tier-indicator signature">SIGNATURE</div>
            </div>
          </div>
        </div>

        <div
          class="category-card large"
          @click="handleCategoryClick('Cocktail Hour')"
        >
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&crop=center"
            alt="Cocktail Hour"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 7L10 12V22H14V12L19 7V5H5V7ZM7.5 9H16.5L14 11.5V20H10V11.5L7.5 9Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <div class="category-subtitle">TODAY'S SPECIALS</div>
              <h3 class="category-name">COCKTAIL HOUR</h3>
              <div class="tier-indicator premier">LIVE NOW</div>
            </div>
          </div>
        </div>

        <!-- Row 2: Three Medium Cards -->
        <div
          class="category-card medium"
          @click="handleCategoryClick('Private Clubs')"
        >
          <img
            src="https://images.unsplash.com/photo-1544642899-f024de1e4a7d?w=400&h=400&fit=crop&crop=center"
            alt="Private Clubs"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L2 12H5V20H19V12H22L12 3ZM12 7.69L17 12.19V18H15V14H9V18H7V12.19L12 7.69Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <div class="category-subtitle">MEMBERS ONLY</div>
              <h3 class="category-name">PRIVATE CLUBS</h3>
              <div class="tier-indicator premier">PREMIER</div>
            </div>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Luxury Shopping')"
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center"
            alt="Luxury Shopping"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2L2 7L12 22L22 7L18 2H6ZM6.5 4H8.5L10 7H5L6.5 4ZM11.5 4H12.5L14 7H10L11.5 4ZM15.5 4H17.5L19 7H14L15.5 4ZM4.5 9H7.5L12 18L4.5 9ZM9.5 9H14.5L12 16L9.5 9ZM16.5 9H19.5L12 18L16.5 9Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">LUXURY SHOPPING</h3>
          </div>
        </div>


        <!-- Row 3: Three Medium Cards -->
        <div
          class="category-card medium"
          @click="handleCategoryClick('Wellness & Spa')"
        >
          <img
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop&crop=center"
            alt="Wellness & Spa"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM16.24 7.76C15.07 6.59 13.54 6 12 6S8.93 6.59 7.76 7.76L9.17 9.17C10 8.34 11 8 12 8S14 8.34 14.83 9.17L16.24 7.76ZM12 17C15.87 17 19 13.87 19 10H17C17 12.76 14.76 15 12 15S7 12.76 7 10H5C5 13.87 8.13 17 12 17Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">WELLNESS & SPA</h3>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Luxury Real Estate')"
        >
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop&crop=center"
            alt="Luxury Real Estate"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">REAL ESTATE</h3>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Arts & Culture')"
        >
          <img
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center"
            alt="Arts & Culture"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C8.13 3 5 6.13 5 10C5 10.74 5.13 11.46 5.36 12.13L12 21L18.64 12.13C18.87 11.46 19 10.74 19 10C19 6.13 15.87 3 12 3ZM12 8C13.1 8 14 8.9 14 10S13.1 12 12 12 10 11.1 10 10 10.9 8 12 8Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">ARTS & CULTURE</h3>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Children')"
        >
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&crop=center"
            alt="Children"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5L12.5 7L10 5.5L4 7V9L10 7.5L12.5 9L15 7.5L21 9ZM12 8L10.5 9.5L7.91 11H16.09L13.5 9.5L12 8Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <div class="category-subtitle">FAMILY ACTIVITIES</div>
              <h3 class="category-name">CHILDREN</h3>
              <div class="tier-indicator premier">FAMILY FUN</div>
            </div>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Athletics')"
        >
          <img
            src="https://images.unsplash.com/photo-1544966503-7e22ee2c0dcc?w=400&h=400&fit=crop&crop=center"
            alt="Athletics"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2H6ZM13 3.5L18.5 9H13V3.5ZM8 12V14H16V12H8ZM8 16V18H13V16H8Z"/>
            </svg>
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <div class="category-subtitle">GOLF • PICKLEBALL</div>
              <h3 class="category-name">ATHLETICS</h3>
              <div class="tier-indicator curated">EXCLUSIVE</div>
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
          <p class="modal-subtitle">Connect with The Hills community online</p>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

const router = useRouter()
const businessStore = useBusinessStore()
const showSideMenu = ref(false)
const showCommunityWebsiteModal = ref(false)

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

const handleCategoryClick = (categoryName) => {
  // Direct route to events page for event-related categories
  if (categoryName === 'Private Events' || categoryName === 'Wine & Spirits') {
    router.push({ name: 'Events' })
  } else if (categoryName === 'Member Perks') {
    // Show member perks modal or page
    alert('Exclusive member perks coming soon! Contact our concierge for access.')
  } else {
    // All other categories go through interstitial (including Cocktail Hour)
    router.push({
      name: 'CategoryInterstitial',
      params: { categoryName }
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


