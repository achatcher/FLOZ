<template>
  <div class="search-view">
    <TopBar title="Search" @toggle-menu="toggleMenu" />

    <div class="search-container">
      <!-- Search Input -->
      <div class="search-bar-wrapper">
        <div class="search-input-group">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="search-input"
            @input="handleSearch"
          />
          <button 
            v-if="searchQuery" 
            class="clear-btn"
            @click="clearSearch"
          >
            ✕
          </button>
        </div>
        <button class="filter-btn" @click="toggleFilters">
          <span class="filter-icon">☰</span>
        </button>
      </div>

      <!-- Filter Panel -->
      <transition name="slide-down">
        <div v-if="showFilters" class="filter-panel">
          <h3 class="filter-title">Filter by Category</h3>
          <div class="filter-chips">
            <button
              v-for="category in categories"
              :key="category.id"
              class="filter-chip"
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
          <span class="empty-icon">🔍</span>
          <p>No results found for "{{ searchQuery }}"</p>
        </div>

        <div v-else-if="!searchQuery" class="default-state">
          <span class="default-icon">🔍</span>
          <p>Search for businesses, categories, or services</p>
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

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'
import { debounce } from '@/utils/helpers'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessListItem from '@/components/Business/BusinessListItem.vue'

const router = useRouter()
const businessStore = useBusinessStore()

const searchQuery = ref('')
const selectedCategory = ref(null)
const showFilters = ref(false)
const loading = ref(false)
const categories = ref([])

onMounted(() => {
  categories.value = businessStore.categories
})

const filteredResults = computed(() => {
  if (!searchQuery.value) return []

  let results = businessStore.searchBusinesses(searchQuery.value)

  if (selectedCategory.value) {
    results = results.filter(b => b.category === selectedCategory.value)
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
  selectedCategory.value = null
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
  router.push({
    name: 'BusinessDetail',
    params: { businessId }
  })
}

const toggleMenu = () => {
  // Emit to parent or handle menu toggle
}
</script>

<style scoped>
.search-view {
  min-height: 100vh;
  background: #000;
  padding-bottom: 80px;
}

.search-container {
  padding: 20px 15px;
}

.search-bar-wrapper {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 15px;
  gap: 10px;
}

.search-icon {
  font-size: 20px;
  opacity: 0.6;
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

.clear-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  padding: 12px 15px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-btn:active {
  background: rgba(255, 255, 255, 0.15);
}

.filter-icon {
  font-size: 20px;
}

.filter-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.filter-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip.active {
  background: var(--primary-cyan);
  border-color: var(--primary-cyan);
}

.filter-chip:active {
  transform: scale(0.98);
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
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.empty-icon,
.default-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.results-list {
  background: #111;
  border-radius: 12px;
  overflow: hidden;
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
</style>
