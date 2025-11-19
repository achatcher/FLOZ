<template>
  <div class="search-view">
    <TopBar title="Search" @toggle-menu="toggleMenu" />

    <div class="search-container">
      <!-- Search Input -->
      <div class="search-bar-wrapper">
        <div class="search-input-group">
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search establishments..."
            class="search-input"
            @input="handleSearch"
          />
          <button
            v-if="searchQuery"
            class="btn btn-clear"
            @click="clearSearch"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>
        <button class="btn btn-filter" @click="toggleFilters">
          <svg class="filter-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"/>
          </svg>
          <span class="filter-text">Filter</span>
        </button>
      </div>

      <!-- Filter Panel -->
      <transition name="slide-down">
        <div v-if="showFilters" class="filter-panel">
          <div class="filter-header">
            <h3 class="filter-title">Filter by Category</h3>
            <button
              v-if="selectedCategory"
              class="btn btn-ghost btn-sm"
              @click="selectCategory(null)"
            >
              Clear Filter
            </button>
          </div>
          <div class="filter-chips">
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-chip"
              :class="{ active: selectedCategory === category.name }"
              @click="selectCategory(category.name)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Search Results -->
      <div class="search-results">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Searching...</p>
        </div>

        <div v-else-if="searchQuery && filteredResults.length === 0" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
          </svg>
          <h3>No results found</h3>
          <p>No establishments match "{{ searchQuery }}". Try adjusting your search terms or browse by category.</p>
        </div>

        <div v-else class="results-list">
          <BusinessListItem
            v-for="business in filteredResults"
            :key="business.id"
            :business="business"
            @click="goToBusinessDetail(business.id)"
          />
        </div>
      </div>
    </div>

    <!-- Business Detail Modal -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />

    <BottomNav />

    <!-- Side Menu -->
    <transition name="slide">
      <SideMenu v-if="showSideMenu" @close="toggleMenu" @show-community-modal="showCommunityModal" />
    </transition>

    <!-- Community Website Modal -->
    <div v-if="showCommunityWebsiteModal" class="community-modal" @click.self="closeCommunityModal">
      <div class="modal-content">
        <button @click="closeCommunityModal" class="btn btn-close">
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
            <button class="btn btn-primary" @click="visitCommunityWebsite">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12S16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12S19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12S9.56 10.66 9.66 10H14.34C14.44 10.66 14.5 11.32 14.5 12S14.44 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8.03 8M5.08 16H8.03C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8Z"/>
              </svg>
              Visit Community Website
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import { useAppConfig } from '@/composables/useAppConfig'
import { debounce } from '@/utils/helpers'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'
import BusinessListItem from '@/components/Business/BusinessListItem.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

const router = useRouter()
const businessStore = useBusinessStore()
const { getCurrentBusinesses } = useAppConfig()

const searchQuery = ref('')
const selectedCategory = ref(null)
const showFilters = ref(false)
const loading = ref(false)
const categories = ref([])

// Side menu state
const showSideMenu = ref(false)
const showCommunityWebsiteModal = ref(false)

// Modal state (same as MapView)
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)

onMounted(async () => {
  // Load business data
  await businessStore.loadData()
  // Use actual business categories
  const businesses = getCurrentBusinesses.value || []

  const uniqueCategories = [...new Set(businesses.map(business => business.category))]
    .filter(Boolean)
    .sort()

  categories.value = uniqueCategories.map(categoryName => ({
    id: categoryName.toLowerCase().replace(/\s+/g, '-'),
    name: categoryName
  }))
})

const filteredResults = computed(() => {
  let results = getCurrentBusinesses.value || []

  // Apply category filter first if selected
  if (selectedCategory.value) {
    results = results.filter(business => business.category === selectedCategory.value)
  }

  // Then apply search filter if there's a query
  if (searchQuery.value && searchQuery.value.trim().length > 0) {
    const searchTerm = searchQuery.value.toLowerCase().trim()
    results = results.filter(business => {
      return (
        business.name?.toLowerCase().includes(searchTerm) ||
        business.description?.toLowerCase().includes(searchTerm) ||
        business.category?.toLowerCase().includes(searchTerm) ||
        business.subcategory?.toLowerCase().includes(searchTerm)
      )
    })
  }

  return results
})

const handleSearch = debounce(() => {
  if (searchQuery.value.length > 0) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 300)
  }
}, 300)

const clearSearch = () => {
  searchQuery.value = ''
  // Don't clear category filter - let users keep their category selection
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const selectCategory = (categoryName) => {
  if (selectedCategory.value === categoryName) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = categoryName
  }
}

const goToBusinessDetail = (businessId) => {
  // Find business from current businesses
  const businesses = getCurrentBusinesses.value || []
  const business = businesses.find(b => b.id === businessId)

  if (business) {
    selectedBusiness.value = business
    showBusinessModal.value = true
  } else {
    console.error('Business not found:', businessId)
  }
}

const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}

const toggleMenu = () => {
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
</script>

<style scoped>
.search-view {
  min-height: 100vh;
  background: var(--color-bg-primary, #ffffff);
  padding-bottom: 80px;
}

.search-container {
  padding: var(--space-6) var(--space-4);
}

.search-bar-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.search-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  gap: var(--space-3);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
  backdrop-filter: var(--backdrop-blur-base);
  height: 44px;
}

.search-input-group:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha-10);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  opacity: 0.7;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  outline: none;
  line-height: 1.4;
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-normal);
}

.btn-clear {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-secondary);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  transition: var(--transition-all);
  flex-shrink: 0;
}

.btn-clear svg {
  width: 14px;
  height: 14px;
}

.btn-clear:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: scale(1.05);
}

.btn-filter {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-weight-medium);
  backdrop-filter: var(--backdrop-blur-base);
  height: 44px;
}

.btn-filter:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-filter.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg-primary);
}

.filter-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.filter-text {
  font-size: var(--font-size-sm);
}

.filter-panel {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-lg);
  backdrop-filter: var(--backdrop-blur-base);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
}

.filter-title {
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  letter-spacing: var(--letter-spacing-wide);
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.category-chip {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-secondary);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  white-space: nowrap;
  font-family: var(--font-family-primary);
}

.category-chip:hover {
  background: var(--color-primary-alpha-10);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.category-chip.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-semibold);
  box-shadow: var(--shadow-md);
}

.category-chip:active {
  transform: translateY(0) scale(0.98);
}

.search-results {
  min-height: 400px;
}

.loading-state,
.empty-state,
.default-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16) var(--space-6);
  text-align: center;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-primary);
  margin: var(--space-4) 0;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-6);
  opacity: 0.4;
  color: var(--color-text-tertiary);
}

.empty-state h3 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
}

.empty-state p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  max-width: 400px;
  margin: 0;
}

.results-list {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Side Menu Transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Community Modal Styles */
.community-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}

.modal-content {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-full);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.modal-header {
  padding: var(--space-6) var(--space-6) var(--space-4);
  text-align: center;
  border-bottom: 1px solid var(--color-border-primary);
}

.modal-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
}

.modal-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
}

.modal-body {
  padding: var(--space-6);
}

.website-features {
  display: grid;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.feature-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.feature-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.feature-card h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.feature-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.website-actions {
  text-align: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

/* Responsive design improvements */
@media (max-width: 768px) {
  .search-container {
    padding: var(--space-4) var(--space-3);
  }

  .search-bar-wrapper {
    gap: var(--space-2);
  }

  .filter-text {
    display: none;
  }

  .filter-panel {
    padding: var(--space-4);
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .filter-chips {
    gap: var(--space-2);
  }

  .category-chip {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
  }

  .empty-state,
  .loading-state {
    padding: var(--space-12) var(--space-4);
  }

  .community-modal {
    padding: var(--space-2);
  }

  .modal-content {
    max-height: 90vh;
  }

  .modal-header,
  .modal-body {
    padding: var(--space-4);
  }

  .feature-card {
    padding: var(--space-3);
  }
}

@media (min-width: 769px) {
  .search-bar-wrapper {
    align-items: center;
  }
}
</style>
