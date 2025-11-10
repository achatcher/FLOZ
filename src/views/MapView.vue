<template>
  <div class="map-view">
    <TopBar title="On the Water" @toggle-menu="toggleMenu" />

    <div class="map-container">
      <!-- Search Bar -->
      <div class="map-search-bar">
        <div class="search-input-group">
          <span class="search-icon">🔍</span>
          <input
            v-model="mapSearchQuery"
            type="text"
            placeholder="Search"
            class="search-input"
          />
        </div>
        <button class="view-toggle-btn" @click="toggleViewMode">
          <span class="toggle-icon">☰</span>
          View List
        </button>
        <button class="filter-btn-map" @click="toggleMapFilters">
          <span class="filter-icon">☰</span>
        </button>
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
    </div>

    <BottomNav />

    <!-- List View Modal -->
    <transition name="slide-up">
      <div v-if="showListView" class="list-view-modal">
        <div class="modal-header">
          <h3>Businesses on the Water</h3>
          <button class="close-modal-btn" @click="toggleViewMode">✕</button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useBusinessStore } from '@/stores/businessStore'
import { useLocationStore } from '@/stores/locationStore'
import { LAKE_CENTER, DEFAULT_ZOOM } from '@/utils/constants'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessListItem from '@/components/Business/BusinessListItem.vue'

// Mapbox access token - Replace with your actual token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN_HERE'

const router = useRouter()
const businessStore = useBusinessStore()
const locationStore = useLocationStore()

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const mapSearchQuery = ref('')
const showListView = ref(false)
const showMapFilters = ref(false)

// Get businesses with "On The Water" badge
const waterBusinesses = computed(() => {
  return businessStore.businesses.filter(b => 
    b.badges && b.badges.includes('On The Water')
  )
})

onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

const initializeMap = () => {
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [LAKE_CENTER.lng, LAKE_CENTER.lat],
    zoom: DEFAULT_ZOOM
  })

  // Add navigation controls
  map.value.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

  // Wait for map to load, then add markers
  map.value.on('load', () => {
    addBusinessMarkers()
  })
}

const addBusinessMarkers = () => {
  // Clear existing markers
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  // Add markers for all businesses with locations
  businessStore.businesses.forEach(business => {
    if (business.location && business.location.lat && business.location.lng) {
      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.backgroundImage = `url(${business.logo})`
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.borderRadius = '50%'
      el.style.border = '3px solid #06b6d4'
      el.style.backgroundSize = 'cover'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${business.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${business.category}</p>
          <button 
            onclick="window.goToBusinessFromMap(${business.id})" 
            style="
              background: #06b6d4;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              width: 100%;
              font-weight: 600;
            "
          >
            View Details
          </button>
        </div>
      `)

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([business.location.lng, business.location.lat])
        .setPopup(popup)
        .addTo(map.value)

      markers.value.push(marker)
    }
  })

  // Add global function to navigate from popup
  window.goToBusinessFromMap = (businessId) => {
    router.push({
      name: 'BusinessDetail',
      params: { businessId }
    })
  }
}

const centerOnUserLocation = async () => {
  try {
    const location = await locationStore.requestLocation()
    
    // Add user location marker
    const el = document.createElement('div')
    el.className = 'user-marker'
    el.innerHTML = '📍'
    el.style.fontSize = '32px'

    new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map.value)

    // Fly to user location
    map.value.flyTo({
      center: [location.lng, location.lat],
      zoom: 13,
      duration: 2000
    })
  } catch (error) {
    alert('Unable to get your location. Please enable location services.')
  }
}

const toggleViewMode = () => {
  showListView.value = !showListView.value
}

const toggleMapFilters = () => {
  showMapFilters.value = !showMapFilters.value
}

const selectBusiness = (business) => {
  // Close list view
  showListView.value = false
  
  // Fly to business location
  if (business.location) {
    map.value.flyTo({
      center: [business.location.lng, business.location.lat],
      zoom: 15,
      duration: 1500
    })
  }
}

const toggleMenu = () => {
  // Handle menu toggle
}
</script>

<style scoped>
.map-view {
  min-height: 100vh;
  background: var(--primary-navy);
  display: flex;
  flex-direction: column;
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
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  padding: 12px 15px;
  gap: 10px;
  backdrop-filter: blur(10px);
}

.search-icon {
  font-size: 18px;
  opacity: 0.6;
  color: white;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.view-toggle-btn {
  background: var(--primary-cyan);
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn-map {
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 12px;
  padding: 12px 15px;
  color: white;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.toggle-icon,
.filter-icon {
  font-size: 18px;
}

.map {
  width: 100%;
  height: calc(100vh - 280px);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.location-btn {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-cyan);
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
  z-index: 10;
  transition: transform 0.2s;
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
  background: #000;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #222;
}

.modal-header h3 {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-modal-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Custom marker styles are inline in JS */
</style>
