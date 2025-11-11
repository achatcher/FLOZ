<template>
  <div class="config-test-view">
    <div class="test-header">
      <h1>Dynamic Configuration Test</h1>
      <p>Testing the dynamic configuration system</p>
    </div>

    <div class="test-section">
      <h2>App Configuration</h2>
      <div v-if="isLoading" class="loading">Loading app configuration...</div>
      <div v-else-if="error" class="error">Error: {{ error }}</div>
      <div v-else class="config-display">
        <div class="config-item">
          <strong>App Name:</strong> {{ appInfo?.name || 'Not loaded' }}
        </div>
        <div class="config-item">
          <strong>Tagline:</strong> {{ appInfo?.tagline || 'Not loaded' }}
        </div>
        <div class="config-item">
          <strong>Current Location:</strong> {{ currentLocation || 'Not set' }}
        </div>
        <div class="config-item">
          <strong>Categories:</strong> {{ categories.length }} loaded
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>Location Switching Test</h2>
      <div class="location-buttons">
        <button
          @click="switchToLocation('greenville')"
          :class="{ active: currentLocation === 'greenville' }"
          :disabled="isLoading"
        >
          Greenville
        </button>
        <button
          @click="switchToLocation('charleston')"
          :class="{ active: currentLocation === 'charleston' }"
          :disabled="isLoading"
        >
          Charleston
        </button>
      </div>
    </div>

    <div class="test-section">
      <h2>Current Location Data</h2>
      <div class="data-display">
        <div class="data-item">
          <strong>Businesses:</strong> {{ businesses.length }}
          <ul v-if="businesses.length > 0">
            <li v-for="business in businesses.slice(0, 3)" :key="business.id">
              {{ business.name }} ({{ business.tier }})
            </li>
            <li v-if="businesses.length > 3">...and {{ businesses.length - 3 }} more</li>
          </ul>
        </div>
        <div class="data-item">
          <strong>Events:</strong> {{ events.length }}
          <ul v-if="events.length > 0">
            <li v-for="event in events.slice(0, 3)" :key="event.id">
              {{ event.name }} ({{ event.date }})
            </li>
            <li v-if="events.length > 3">...and {{ events.length - 3 }} more</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h2>Dynamic Store Test</h2>
      <div class="store-test">
        <button @click="testDynamicStores" :disabled="isLoading">
          Test Dynamic Stores
        </button>
        <div v-if="storeTestResults" class="test-results">
          <h3>Store Test Results:</h3>
          <pre>{{ storeTestResults }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppConfig } from '@/composables/useAppConfig'
import { useDynamicBusinessStore } from '@/stores/dynamicBusinessStore'
import { useDynamicEventsStore } from '@/stores/dynamicEventsStore'

const {
  getAppInfo,
  getCategories,
  getCurrentBusinesses,
  getCurrentEvents,
  currentLocation,
  isLoading,
  error,
  setLocation,
  initializeApp
} = useAppConfig()

const businessStore = useDynamicBusinessStore()
const eventsStore = useDynamicEventsStore()

const storeTestResults = ref(null)

// Computed properties
const appInfo = computed(() => getAppInfo.value)
const categories = computed(() => getCategories.value)
const businesses = computed(() => getCurrentBusinesses.value)
const events = computed(() => getCurrentEvents.value)

// Methods
const switchToLocation = async (location) => {
  try {
    console.log(`🔄 Switching to ${location}...`)
    await setLocation(location)
    console.log(`✅ Successfully switched to ${location}`)

    // Also switch the stores
    await businessStore.switchLocation(location)
    await eventsStore.switchLocation(location)

  } catch (err) {
    console.error(`❌ Failed to switch to ${location}:`, err)
  }
}

const testDynamicStores = async () => {
  try {
    console.log('🧪 Testing dynamic stores...')

    // Initialize stores if not already done
    if (!businessStore.initialized) {
      await businessStore.loadData()
    }
    if (!eventsStore.initialized) {
      await eventsStore.loadEventsData()
    }

    // Test business store methods
    const allBusinesses = businessStore.businesses
    const diningBusinesses = businessStore.getBusinessesByCategory('Dining')
    const featuredBusinesses = businessStore.getFeaturedBusinesses

    // Test events store methods
    const allEvents = eventsStore.events
    const upcomingEvents = eventsStore.getUpcomingEvents

    const results = {
      location: currentLocation.value,
      businessStore: {
        totalBusinesses: allBusinesses.length,
        diningBusinesses: diningBusinesses.length,
        featuredBusinesses: featuredBusinesses.length,
        sampleBusiness: allBusinesses[0]?.name || 'None'
      },
      eventsStore: {
        totalEvents: allEvents.length,
        upcomingEvents: upcomingEvents.length,
        sampleEvent: allEvents[0]?.name || 'None'
      }
    }

    storeTestResults.value = JSON.stringify(results, null, 2)
    console.log('✅ Store test completed:', results)

  } catch (err) {
    console.error('❌ Store test failed:', err)
    storeTestResults.value = `Error: ${err.message}`
  }
}

// Initialize on mount
onMounted(async () => {
  try {
    console.log('🚀 Initializing configuration test...')
    await initializeApp()
    console.log('✅ Configuration test initialized')
  } catch (err) {
    console.error('❌ Configuration test failed:', err)
  }
})
</script>

<style scoped>
.config-test-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-header {
  text-align: center;
  margin-bottom: 40px;
}

.test-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.test-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e1e8ed;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-section h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.4em;
}

.loading, .error {
  padding: 12px;
  border-radius: 4px;
  font-weight: 500;
}

.loading {
  background: #e3f2fd;
  color: #1565c0;
}

.error {
  background: #ffebee;
  color: #c62828;
}

.config-display, .data-display {
  display: grid;
  gap: 12px;
}

.config-item, .data-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.config-item strong, .data-item strong {
  color: #495057;
}

.location-buttons {
  display: flex;
  gap: 12px;
}

.location-buttons button {
  padding: 12px 24px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.location-buttons button:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

.location-buttons button.active {
  background: #007bff;
  color: white;
}

.location-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.data-item ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.data-item li {
  margin-bottom: 4px;
  color: #6c757d;
}

.store-test button {
  padding: 12px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.store-test button:hover:not(:disabled) {
  background: #218838;
}

.store-test button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.test-results {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}

.test-results h3 {
  margin-top: 0;
  color: #495057;
}

.test-results pre {
  background: white;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9em;
  color: #495057;
}
</style>