<template>
  <div class="category-listing-view">
    <TopBar :title="categoryName" :show-back="true" />

    <div class="listing-content">
      <!-- ===== HERO BANNER ADVERTISEMENT ===== -->
      <!-- MONETIZATION: Premium advertising space at top of category pages -->
      <!-- PLACEHOLDER: Image loaded from business store ads data -->
      <div v-if="heroBanner" class="hero-banner">
        <img
          :src="heroBanner.image"
          :alt="heroBanner.title"
          class="hero-image"
          @click="openAdLink(heroBanner.link)"
          @error="handleImageError"
        />
        <!-- CUSTOMIZATION: Modify click behavior in openAdLink() function -->
      </div>

      <!-- ===== SUBCATEGORY NAVIGATION GRID ===== -->
      <!-- CUSTOMIZATION: Subcategory images auto-generated from names in business store -->
      <!-- Image path format: /images/subcategories/[name-with-dashes].jpg -->
      <!-- PLACEHOLDER: Fallback images handled by handleImageError() -->
      <div v-if="!businessStore.loading && subcategories && subcategories.length > 0" class="subcategory-grid">
        <div
          v-for="subcategory in subcategories"
          :key="subcategory.name"
          class="subcategory-card"
          @click="handleSubcategoryClick(subcategory.name)"
        >
          <div class="subcategory-image-wrapper">
            <img
              :src="subcategory.image"
              :alt="subcategory.name"
              class="subcategory-image"
              @error="handleImageError"
            />
            <!-- PLACEHOLDER: Add images to /images/subcategories/ folder -->
            <!-- Format: fine-dining.jpg, waterfront-dining.jpg, etc. -->
          </div>
          <h3 class="subcategory-name">{{ subcategory.name }}</h3>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="businessStore.loading" class="loading-state">
        <div class="loading-icon">⏳</div>
        <h3 class="loading-title">Loading...</h3>
        <p class="loading-text">Getting ready to show you the best of the Lake.</p>
      </div>

      <!-- Empty State if no subcategories -->
      <div v-else class="empty-state">
        <div class="empty-icon">📂</div>
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
const heroBanner = ref(null)
const subcategories = computed(() => {
  return businessStore.getSubcategoriesForCategory(categoryName.value)
})

// Business Modal
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

onMounted(() => {
  heroBanner.value = businessStore.getBannerAd(categoryName.value, 'hero')

  if (!heroBanner.value) {
    heroBanner.value = {
      image: '/images/ads/bandanas-hero.jpg',
      title: 'Featured Business',
      link: '#'
    }
  }
})

const handleSubcategoryClick = (subcategoryName) => {
  router.push({
    name: 'SubcategoryListing',
    params: { 
      categoryName: categoryName.value,
      subcategoryName: subcategoryName
    }
  })
}

const openAdLink = (link) => {
  // Check if this is a banner ad with a business_id
  if (heroBanner.value?.business_id) {
    const business = businessStore.getBusinessById(heroBanner.value.business_id)
    if (business) {
      selectedBusiness.value = business
      showBusinessModal.value = true
      return
    }
  }

  // Fallback to opening external link
  if (link && link !== '#') {
    window.open(link, '_blank')
  }
}

const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
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
