<template>
  <div class="home-view">
    <TopBar title="LOZ App" @toggle-menu="toggleSideMenu" />

    <div class="home-content">
      <!-- ===== HERO BANNER SECTION ===== -->
      <!-- CUSTOMIZATION: Replace /images/floz-hero.jpg with your branded hero image -->
      <!-- Recommended size: 800x400px or larger for sharp display on all devices -->
      <div class="hero-banner">
        <img
          src="/images/floz-hero.jpg"
          alt="Your Guide to the Lake of the Ozarks"
          class="hero-image"
          @error="handleImageError"
        />
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
          @click="handleCategoryClick('Podcast Network')"
        >
          <!-- PLACEHOLDER: Replace /images/categories/podcast-network.jpg -->
          <img
            src="/images/categories/podcast-network.jpg"
            alt="Podcast Network"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <!-- Emoji fallback when image fails to load -->
          <div class="category-placeholder">
            <i class="icon">🎙️</i>
            <!-- CUSTOMIZATION: Update emoji icons for each category as needed -->
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <!-- CUSTOMIZATION: Update category subtitles and names -->
              <div class="category-subtitle">WATCH NOW!</div>
              <h3 class="category-name">PODCAST NETWORK</h3>
            </div>
          </div>
        </div>

        <div
          class="category-card large"
          @click="handleCategoryClick('Luxury Real Estate')"
        >
          <!-- PLACEHOLDER: Replace /images/categories/real-estate.jpg -->
          <img
            src="/images/categories/real-estate.jpg"
            alt="Lake Real Estate"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">🏠</i>
          </div>
          <div class="category-overlay">
            <div class="category-text">
              <div class="category-subtitle">NEW OPEN HOUSES</div>
              <h3 class="category-name">LAKE REAL ESTATE</h3>
            </div>
          </div>
        </div>

        <!-- Row 2: Three Medium Cards -->
        <div
          class="category-card medium"
          @click="handleCategoryClick('Dining Out')"
        >
          <img 
            src="/images/categories/dining.jpg" 
            alt="Dining Out"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">🍽️</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">DINING OUT</h3>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Luxury Services')"
        >
          <img 
            src="/images/categories/lake-services.jpg" 
            alt="Lake Services"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">⚓</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">LAKE SERVICES</h3>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Live Entertainment')"
        >
          <img 
            src="/images/categories/live-events.jpg" 
            alt="Live Events"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">🎸</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">LIVE EVENTS</h3>
          </div>
        </div>

        <!-- Row 3: Three Medium Cards -->
        <div
          class="category-card medium"
          @click="handleCategoryClick('Charity & Community')"
        >
          <img 
            src="/images/categories/charities.jpg" 
            alt="Charities"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">❤️</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">CHARITIES</h3>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Events & Festivals')"
        >
          <img 
            src="/images/categories/lake-fun.jpg" 
            alt="Lake Fun"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">🎉</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">LAKE FUN</h3>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('Local Media')"
        >
          <img 
            src="/images/categories/local-media.jpg" 
            alt="Local Media"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">📰</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">LOCAL MEDIA</h3>
          </div>
        </div>

        <!-- Row 4: Three Medium Cards -->
        <div
          class="category-card medium"
          @click="handleCategoryClick('West Side')"
        >
          <img 
            src="/images/categories/west-side.jpg" 
            alt="West Side"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">🏔️</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">WEST SIDE</h3>
          </div>
        </div>

        <div
          class="category-card medium coming-soon"
          @click="handleCategoryClick('Coming Soon')"
        >
          <div class="coming-soon-content">
            <div class="megaphone">📢</div>
            <div class="category-text">
              <div class="category-subtitle">COMING SOON</div>
              <h3 class="category-name">STAY TUNED!</h3>
            </div>
          </div>
        </div>

        <div
          class="category-card medium"
          @click="handleCategoryClick('LOZ Deals')"
        >
          <img 
            src="/images/categories/loz-deals.jpg" 
            alt="LOZ Deals"
            class="category-image"
            @error="(e) => handleImageError(e)"
          />
          <div class="category-placeholder">
            <i class="icon">💰</i>
          </div>
          <div class="category-overlay">
            <h3 class="category-name">LOZ DEALS</h3>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- Side Menu -->
    <transition name="slide">
      <SideMenu v-if="showSideMenu" @close="toggleSideMenu" />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'

const router = useRouter()
const showSideMenu = ref(false)

const toggleSideMenu = () => {
  showSideMenu.value = !showSideMenu.value
}

const handleCategoryClick = (categoryName) => {
  // Direct route to events page for event-related categories
  if (categoryName === 'Live Entertainment' || categoryName === 'Events & Festivals') {
    router.push({ name: 'Events' })
  } else {
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


