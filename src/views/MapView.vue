<template>
  <div class="map-view">
    <TopBar :show-back="true" @toggle-menu="toggleMenu" />

    <!-- ===== PAGE TITLE SECTION ===== -->
    <div class="page-title-section">
      <h1 class="page-title">Concierge Map</h1>
      <p class="page-subtitle">Explore Greenville businesses near you</p>
    </div>

    <div class="map-container">
      <!-- Search Bar -->
      <div class="map-search-bar">
        <div class="search-input-group">
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <input
            v-model="mapSearchQuery"
            type="text"
            placeholder="Search luxury establishments..."
            class="search-input"
          />
        </div>
        <button class="view-toggle-btn" @click="toggleViewMode">
          <svg class="toggle-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"/>
          </svg>
          View List
        </button>
        <button class="filter-btn-map" @click="toggleCategorySort">
          <svg class="filter-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"/>
          </svg>
          Sort
        </button>
      </div>

      <!-- Category Sort Filter -->
      <div v-if="showCategorySort" class="category-filter-section">
        <div class="category-filter-header">
          <h3>Sort by Category</h3>
          <button class="clear-filter-btn" @click="clearCategoryFilter">
            All Categories
          </button>
        </div>
        <div class="category-chips">
          <button
            v-for="category in availableCategories"
            :key="category"
            class="category-chip"
            :class="{ active: selectedCategory === category }"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Map -->
      <div ref="mapContainer" class="map"></div>

      <!-- Location Button -->
      <button class="location-btn" @click="centerOnUserLocation">
        <svg class="location-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
        Show Current Location
      </button>

      <!-- Search Results List -->
      <div v-if="mapSearchQuery.trim() && waterBusinesses.length > 0" class="search-results-section">
        <h3 class="search-results-title">
          {{ waterBusinesses.length }} result{{ waterBusinesses.length !== 1 ? 's' : '' }} for "{{ mapSearchQuery }}"
        </h3>
        <div class="search-results-list">
          <div
            v-for="business in waterBusinesses"
            :key="business.id"
            class="search-result-item"
            @click="selectBusiness(business)"
          >
            <div class="result-content">
              <h4 class="result-name">{{ business.name }}</h4>
              <p class="result-category">{{ business.category }}</p>
              <p class="result-description" v-if="business.description">
                {{ business.description.length > 100 ? business.description.substring(0, 100) + '...' : business.description }}
              </p>
              <div class="result-meta">
                <span class="result-subcategory" v-if="business.subcategory">{{ business.subcategory }}</span>
                <span class="result-price" v-if="business.price_range || business.priceRange">{{ business.price_range || business.priceRange }}</span>
              </div>
            </div>
            <div class="result-action">
              <svg class="chevron-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="mapSearchQuery.trim() && waterBusinesses.length === 0" class="no-results-section">
        <div class="no-results-content">
          <svg class="no-results-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <h3>No results found</h3>
          <p>Try adjusting your search terms or browse all establishments on the map.</p>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- List View Modal -->
    <transition name="slide-up">
      <div v-if="showListView" class="list-view-modal">
        <div class="modal-header">
          <h3>Local Establishments</h3>
          <button class="close-modal-btn" @click="toggleViewMode">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <BusinessListItem
            v-for="business in waterBusinesses"
            :key="business.id"
            :business="business"
            @click="selectBusiness(business)"
          />
        </div>
      </div>
    </transition>

    <!-- Business Modal -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useBusinessStore } from '@/stores/businessStore'
import { useLocationStore } from '@/stores/locationStore'
import { useAppConfig } from '@/composables/useAppConfig'
import { GREENVILLE_CENTER, DEFAULT_ZOOM } from '@/utils/constants'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessListItem from '@/components/Business/BusinessListItem.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const router = useRouter()
const businessStore = useBusinessStore()
const locationStore = useLocationStore()
const { initializeApp, getCurrentBusinesses } = useAppConfig()

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const mapSearchQuery = ref('')
const showListView = ref(false)
const showCategorySort = ref(false)
const selectedCategory = ref('')

// Business Modal
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

// Get all businesses for display with search and category filtering
const waterBusinesses = computed(() => {
  const allBusinesses = getCurrentBusinesses.value || []
  let filteredBusinesses = allBusinesses.filter(business =>
    business.location && business.location.lat && business.location.lng
  )

  // Apply category filter if selected
  if (selectedCategory.value) {
    filteredBusinesses = filteredBusinesses.filter(business =>
      business.category === selectedCategory.value
    )
  }

  // Apply search filter if search query exists
  if (mapSearchQuery.value.trim()) {
    const query = mapSearchQuery.value.toLowerCase()
    filteredBusinesses = filteredBusinesses.filter(business =>
      business.name.toLowerCase().includes(query) ||
      business.category.toLowerCase().includes(query) ||
      (business.subcategory && business.subcategory.toLowerCase().includes(query)) ||
      (business.description && business.description.toLowerCase().includes(query))
    )
  }

  return filteredBusinesses
})

// Get available categories from businesses
const availableCategories = computed(() => {
  const allBusinesses = getCurrentBusinesses.value || []
  const categories = [...new Set(allBusinesses.map(business => business.category))]
  return categories.sort()
})

// Watch for search and category changes and update markers
watch([mapSearchQuery, selectedCategory], () => {
  addBusinessMarkers()
})

onMounted(async () => {
  // Initialize the app to load dynamic configuration
  try {
    await initializeApp()
    console.log('✅ App initialized for MapView')
  } catch (error) {
    console.error('❌ Failed to initialize app for MapView:', error)
  }

  initializeMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

const initializeMap = () => {
  map.value = L.map(mapContainer.value).setView([GREENVILLE_CENTER.lat, GREENVILLE_CENTER.lng], DEFAULT_ZOOM)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value)

  // Add markers immediately
  addBusinessMarkers()
}

const addBusinessMarkers = () => {
  // Clear existing markers
  markers.value.forEach(marker => map.value.removeLayer(marker))
  markers.value = []

  // Add markers for filtered businesses with locations
  waterBusinesses.value.forEach(business => {
    if (business.location && business.location.lat && business.location.lng) {
      // Create custom gold marker icon
      const goldIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: var(--color-primary);
            border: 3px solid #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 16px;
          ">
            💎
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; font-family: Arial, sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1E3521;">${business.name}</h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #2F5233;">${business.category}</p>
          <button
            onclick="window.goToBusinessFromMap(${business.id}); return false;"
            style="
              background: #D4AF37;
              color: #1E3521;
              border: none;
              padding: 10px 16px;
              border-radius: 8px;
              cursor: pointer;
              width: 100%;
              font-weight: 600;
              font-size: 14px;
              transition: all 0.2s ease;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            "
            onmouseover="this.style.background='#E5C247'; this.style.transform='translateY(-1px)'"
            onmouseout="this.style.background='#D4AF37'; this.style.transform='translateY(0)'"
          >
            View Details
          </button>
        </div>
      `

      // Create marker
      const marker = L.marker([business.location.lat, business.location.lng], { icon: goldIcon })
        .addTo(map.value)
        .bindPopup(popupContent)

      markers.value.push(marker)
    }
  })

  // Add global function to navigate from popup
  window.goToBusinessFromMap = (businessId) => {
    console.log('🔍 Map popup clicked - Business ID:', businessId)
    console.log('🏪 Available businesses count:', businessStore.businesses.length)
    console.log('🔍 All business IDs:', businessStore.businesses.map(b => b.id))

    // Check if business exists
    const business = businessStore.getBusinessById(businessId)
    console.log('📋 Business found:', business)

    if (!business) {
      console.error('❌ Business not found for ID:', businessId)
      console.error('Available businesses:', businessStore.businesses)
      alert(`Business not found for ID: ${businessId}`)
      return
    }

    try {
      console.log('✅ Opening business modal for:', business.name)
      selectedBusiness.value = business
      showBusinessModal.value = true
      console.log('✅ Modal state set:', { selectedBusiness: selectedBusiness.value, showBusinessModal: showBusinessModal.value })
    } catch (error) {
      console.error('❌ Modal error:', error)
      alert('Failed to open business details: ' + error.message)
    }
  }
}

const centerOnUserLocation = async () => {
  try {
    const location = await locationStore.requestLocation()

    // Create user location marker icon
    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #007bff;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    // Add user location marker
    L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(map.value)
      .bindPopup('Your Location')

    // Fly to user location
    map.value.flyTo([location.lat, location.lng], 15, {
      duration: 2
    })
  } catch (error) {
    alert('Unable to get your location. Please enable location services.')
  }
}

const toggleViewMode = () => {
  showListView.value = !showListView.value
}

const toggleCategorySort = () => {
  showCategorySort.value = !showCategorySort.value
}

const selectCategory = (category) => {
  selectedCategory.value = category
  showCategorySort.value = false
}

const clearCategoryFilter = () => {
  selectedCategory.value = ''
  showCategorySort.value = false
}

const selectBusiness = (business) => {
  console.log('🔍 Search result clicked - Business:', business.name, 'ID:', business.id)

  // Close list view
  showListView.value = false

  // Open business modal instead of navigating
  selectedBusiness.value = business
  showBusinessModal.value = true

  console.log('✅ Modal opened for:', business.name)
}

const toggleMenu = () => {
  // Handle menu toggle
}

const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}
</script>

<style scoped>
.map-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
}

/* ===== PAGE TITLE SECTION ===== */

.page-title-section {
  background: var(--color-bg-luxury);
  border-bottom: 2px solid var(--color-primary-alpha-10);
  padding: var(--space-6) var(--space-4);
  text-align: center;
}

.page-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

.map-container {
  flex: 1;
  position: relative;
  padding: 20px 15px 100px;
}

.map-search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  position: relative;
  z-index: 10;
}

.search-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  gap: var(--space-2);
  backdrop-filter: var(--backdrop-blur-base);
}

.search-icon {
  width: 18px;
  height: 18px;
  opacity: 0.6;
  color: var(--color-primary);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  outline: none;
  font-family: var(--font-family-primary);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.view-toggle-btn {
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-5);
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: var(--transition-all);
  font-family: var(--font-family-primary);
}

.view-toggle-btn:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-primary);
}

.filter-btn-map {
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  transition: var(--transition-all);
  font-family: var(--font-family-primary);
}

.filter-btn-map:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-primary);
}

.toggle-icon,
.filter-icon {
  width: 18px;
  height: 18px;
}

/* Category Filter Section */
.category-filter-section {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.category-filter-header h3 {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.clear-filter-btn {
  background: none;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-all);
}

.clear-filter-btn:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.category-chip {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  white-space: nowrap;
}

.category-chip:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.category-chip.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-semibold);
}

.map {
  width: 100%;
  height: 60vh;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.location-btn {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  box-shadow: var(--shadow-primary-lg);
  z-index: 10;
  transition: var(--transition-all);
  font-family: var(--font-family-primary);
}

.location-btn:active {
  transform: translateX(-50%) scale(0.98);
}

.location-icon {
  width: 20px;
  height: 20px;
}

/* List View Modal */
.list-view-modal {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-top-left-radius: var(--radius-2xl);
  border-top-right-radius: var(--radius-2xl);
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #222;
}

.modal-header h3 {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.close-modal-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.close-modal-btn svg {
  width: 18px;
  height: 18px;
}

.close-modal-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--color-primary-light);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

/* Slide up transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Search Results Section */
.search-results-section {
  margin-top: var(--space-6);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
  overflow: hidden;
}

.search-results-title {
  padding: var(--space-4);
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border-primary);
}

.search-results-list {
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: var(--space-4);
  cursor: pointer;
  transition: var(--transition-all);
  border-bottom: 1px solid var(--color-border-secondary);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: var(--color-bg-tertiary);
}

.search-result-item:active {
  transform: scale(0.98);
}

.result-content {
  flex: 1;
}

.result-name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.result-category {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--space-2);
}

.result-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--space-2);
}

.result-meta {
  display: flex;
  gap: var(--space-3);
}

.result-subcategory {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.result-price {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.result-action {
  margin-left: var(--space-3);
}

.chevron-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  opacity: 0.6;
  transition: var(--transition-fast);
}

.search-result-item:hover .chevron-icon {
  opacity: 1;
  transform: translateX(2px);
}

/* No Results Section */
.no-results-section {
  margin-top: var(--space-6);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
  padding: var(--space-8);
}

.no-results-content {
  text-align: center;
  color: var(--color-text-secondary);
}

.no-results-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-4);
  opacity: 0.5;
  color: var(--color-text-tertiary);
}

.no-results-content h3 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
}

.no-results-content p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

/* Responsive styles for page title */
@media (min-width: 640px) {
  .page-title-section {
    padding: var(--space-8) var(--space-6);
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 1024px) {
  .page-title-section {
    padding: var(--space-10) var(--space-8);
  }

  .page-title {
    font-size: var(--font-size-4xl);
  }

  .page-subtitle {
    font-size: var(--font-size-lg);
  }
}

/* Custom marker styles are inline in JS */
</style>
