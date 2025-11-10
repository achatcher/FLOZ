<template>
  <div class="property-listings-view">
    <TopBar title="Real Estate Listings" :show-back="true" />

    <div class="listings-content">

      <!-- Search & Filters -->
      <div class="search-section">
        <div class="search-header">
          <h2 class="search-title">Lake of the Ozarks Properties</h2>
          <p class="search-subtitle">{{ totalResults }} properties available</p>
        </div>

        <!-- Quick Filter Tabs -->
        <div class="quick-filters">
          <button
            v-for="filter in quickFilters"
            :key="filter.key"
            class="quick-filter-btn"
            :class="{ active: activeFilter === filter.key }"
            @click="setQuickFilter(filter.key)"
          >
            {{ filter.icon }} {{ filter.label }}
          </button>
        </div>

        <!-- Advanced Filters -->
        <div class="filters-section" :class="{ expanded: showFilters }">
          <button class="filters-toggle" @click="showFilters = !showFilters">
            🔍 {{ showFilters ? 'Hide' : 'Show' }} Filters
          </button>

          <div v-if="showFilters" class="filters-grid">
            <!-- Price Range -->
            <div class="filter-group">
              <label class="filter-label">Price Range</label>
              <div class="price-inputs">
                <input
                  v-model="filters.priceMin"
                  type="number"
                  placeholder="Min Price"
                  class="filter-input"
                  @input="applyFilters"
                />
                <span class="price-separator">to</span>
                <input
                  v-model="filters.priceMax"
                  type="number"
                  placeholder="Max Price"
                  class="filter-input"
                  @input="applyFilters"
                />
              </div>
            </div>

            <!-- Bedrooms -->
            <div class="filter-group">
              <label class="filter-label">Bedrooms</label>
              <select v-model="filters.bedrooms" class="filter-select" @change="applyFilters">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <!-- Bathrooms -->
            <div class="filter-group">
              <label class="filter-label">Bathrooms</label>
              <select v-model="filters.bathrooms" class="filter-select" @change="applyFilters">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <!-- Property Type -->
            <div class="filter-group">
              <label class="filter-label">Property Type</label>
              <select v-model="filters.propertyType" class="filter-select" @change="applyFilters">
                <option value="all">All Types</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <!-- Special Features -->
            <div class="filter-group">
              <label class="filter-label">Features</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input v-model="filters.waterfront" type="checkbox" @change="applyFilters" />
                  <span>Waterfront</span>
                </label>
                <label class="checkbox-item">
                  <input v-model="filters.newConstruction" type="checkbox" @change="applyFilters" />
                  <span>New Construction</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <div class="loading-spinner">🏠</div>
        <p>Loading properties...</p>
      </div>

      <!-- Properties Grid -->
      <div v-else-if="filteredProperties.length" class="properties-grid">
        <PropertyCard
          v-for="property in filteredProperties"
          :key="property.id"
          :property="property"
          @view-details="openPropertyModal"
        />
      </div>

      <!-- No Results -->
      <div v-else class="no-results">
        <div class="no-results-icon">🏡</div>
        <h3 class="no-results-title">No Properties Found</h3>
        <p class="no-results-text">
          Try adjusting your filters or check back later for new listings.
        </p>
        <button class="clear-filters-btn" @click="clearFilters">
          Clear All Filters
        </button>
      </div>

      <!-- Real Estate Businesses -->
      <div class="businesses-section">
        <h3 class="section-title">🏢 Work with Local Real Estate Professionals</h3>
        <p class="section-subtitle">Connect with experienced agents and luxury real estate specialists</p>

        <div class="businesses-grid">
          <div
            v-for="business in realEstateBusinesses"
            :key="business.id"
            class="business-card"
            @click="openBusinessModal(business)"
          >
            <div class="business-logo">
              <img
                :src="business.logo || '/images/businesses/default-business.jpg'"
                :alt="business.name"
                @error="handleBusinessImageError"
              />
            </div>
            <div class="business-info">
              <h4 class="business-name">{{ business.name }}</h4>
              <p class="business-category">{{ business.subcategory }}</p>
              <div class="business-badges">
                <span
                  v-for="badge in business.badges?.slice(0, 2)"
                  :key="badge"
                  class="business-badge"
                >
                  {{ badge }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Property Detail Modal -->
    <PropertyModal
      :property="selectedProperty"
      :is-visible="showPropertyModal"
      @close="closePropertyModal"
    />

    <!-- Business Modal -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePropertyStore } from '@/stores/propertyStore'
import { useBusinessStore } from '@/stores/businessStore'
import PropertyCard from '@/components/Property/PropertyCard.vue'
import PropertyModal from '@/components/Property/PropertyModal.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import analytics from '@/utils/analytics'

// Stores
const propertyStore = usePropertyStore()
const businessStore = useBusinessStore()

// Reactive data
const loading = ref(false)
const showFilters = ref(false)
const activeFilter = ref('all')
const selectedProperty = ref(null)
const showPropertyModal = ref(false)
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

// Filters
const filters = ref({
  priceMin: null,
  priceMax: null,
  bedrooms: null,
  bathrooms: null,
  propertyType: 'all',
  waterfront: false,
  newConstruction: false
})

// Quick filter options
const quickFilters = [
  { key: 'all', label: 'All Properties', icon: '🏠' },
  { key: 'for-sale', label: 'For Sale', icon: '🏷️' },
  { key: 'for-rent', label: 'For Rent', icon: '🔑' },
  { key: 'waterfront', label: 'Waterfront', icon: '🌊' },
  { key: 'luxury', label: 'Luxury ($500K+)', icon: '💎' }
]

// Computed
const filteredProperties = computed(() => {
  let properties = propertyStore.properties

  // Apply quick filter
  switch (activeFilter.value) {
    case 'for-sale':
      properties = properties.filter(p => p.status === 'for-sale')
      break
    case 'for-rent':
      properties = properties.filter(p => p.status === 'for-rent')
      break
    case 'waterfront':
      properties = properties.filter(p => p.waterfront)
      break
    case 'luxury':
      properties = properties.filter(p => p.price >= 500000)
      break
  }

  // Apply advanced filters
  if (filters.value.priceMin) {
    properties = properties.filter(p => p.price >= filters.value.priceMin)
  }
  if (filters.value.priceMax) {
    properties = properties.filter(p => p.price <= filters.value.priceMax)
  }
  if (filters.value.bedrooms) {
    properties = properties.filter(p => p.bedrooms >= parseInt(filters.value.bedrooms))
  }
  if (filters.value.bathrooms) {
    properties = properties.filter(p => p.bathrooms >= parseInt(filters.value.bathrooms))
  }
  if (filters.value.propertyType !== 'all') {
    properties = properties.filter(p => p.type === filters.value.propertyType)
  }
  if (filters.value.waterfront) {
    properties = properties.filter(p => p.waterfront)
  }
  if (filters.value.newConstruction) {
    properties = properties.filter(p => p.newConstruction)
  }

  return properties
})

const totalResults = computed(() => {
  return filteredProperties.value.length
})

const realEstateBusinesses = computed(() => {
  return businessStore.getBusinessesByCategory('Luxury Real Estate').slice(0, 6)
})

// Methods
const setQuickFilter = (filterKey) => {
  activeFilter.value = filterKey
  analytics.track('property_filter', { type: 'quick', filter: filterKey })
}

const applyFilters = () => {
  analytics.track('property_filter', { type: 'advanced', filters: filters.value })
}

const clearFilters = () => {
  filters.value = {
    priceMin: null,
    priceMax: null,
    bedrooms: null,
    bathrooms: null,
    propertyType: 'all',
    waterfront: false,
    newConstruction: false
  }
  activeFilter.value = 'all'
}

const openPropertyModal = (property) => {
  selectedProperty.value = property
  showPropertyModal.value = true
  analytics.track('property_view', { propertyId: property.id })
}

const closePropertyModal = () => {
  selectedProperty.value = null
  showPropertyModal.value = false
}

const openBusinessModal = (business) => {
  selectedBusiness.value = business
  showBusinessModal.value = true
  analytics.track('business_view_from_properties', { businessId: business.id })
}

const closeBusinessModal = () => {
  selectedBusiness.value = null
  showBusinessModal.value = false
}

const handleBusinessImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMWExYTJlIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZmlsbD0iIzAwRDlGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij7wn4+iPC90ZXh0Pgo8L3N2Zz4K'
}

// Lifecycle
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      propertyStore.loadPropertyData(),
      businessStore.loadData()
    ])
  } finally {
    loading.value = false
  }
})

// Track page view
analytics.track('property_listings_view')
</script>

<style scoped>
.property-listings-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding-bottom: 80px;
}

.listings-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 30px;
}

.search-header {
  text-align: center;
  margin-bottom: 24px;
}

.search-title {
  color: white;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.search-subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.quick-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.quick-filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.quick-filter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.quick-filter-btn.active {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-color: #06b6d4;
}

.filters-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
}

.filters-toggle {
  background: none;
  border: none;
  color: #06b6d4;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-separator {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.filter-input,
.filter-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  flex: 1;
}

.filter-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.loading-section {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.loading-spinner {
  font-size: 48px;
  animation: bounce 2s infinite;
  margin-bottom: 16px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 50px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.no-results-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.no-results-text {
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 24px 0;
}

.clear-filters-btn {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  transform: translateY(-2px);
}

.businesses-section {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-align: center;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0 0 30px 0;
}

.businesses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.business-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.business-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.business-logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.business-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.business-info {
  flex: 1;
}

.business-name {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.business-category {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0 0 8px 0;
}

.business-badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.business-badge {
  background: rgba(6, 182, 212, 0.2);
  color: #06b6d4;
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .listings-content {
    padding: 16px;
  }

  .quick-filters {
    justify-content: flex-start;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .properties-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .businesses-grid {
    grid-template-columns: 1fr;
  }

  .business-card {
    flex-direction: column;
    text-align: center;
  }

  .business-logo {
    width: 80px;
    height: 80px;
  }
}
</style>