<template>
  <div class="events-view">
    <TopBar title="Live Events" :show-back="true" />

    <div class="events-content">
      <!-- Featured Events Section -->
      <section v-if="featuredEvents.length > 0" class="featured-section">
        <h2 class="section-title">🌟 Featured Events</h2>
        <div class="featured-events-scroll">
          <EventCard
            v-for="event in featuredEvents"
            :key="`featured-${event.id}`"
            :event="event"
            @click="openEventModal(event)"
            class="featured-card"
          />
        </div>
      </section>

      <!-- Quick Filters -->
      <section class="quick-filters">
        <h3 class="filters-title">Quick Filters</h3>
        <div class="filter-buttons">
          <button
            v-for="filter in quickFilters"
            :key="filter.key"
            class="filter-btn"
            :class="{ active: activeFilter === filter.key }"
            @click="setActiveFilter(filter.key)"
          >
            {{ filter.icon }} {{ filter.label }}
            <span v-if="filter.count > 0" class="count-badge">{{ filter.count }}</span>
          </button>
        </div>
      </section>

      <!-- Events List -->
      <section class="events-section">
        <EventsList
          :title="getFilteredTitle()"
          :filter="activeFilter"
          ref="eventsListRef"
        />
      </section>
    </div>

    <BottomNav />

    <!-- Event Modal -->
    <EventModal
      v-if="selectedEvent"
      :event="selectedEvent"
      :is-visible="showEventModal"
      @close="closeEventModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEventsStore } from '@/stores/eventsStore'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import EventsList from '@/components/Events/EventsList.vue'
import EventCard from '@/components/Events/EventCard.vue'
import EventModal from '@/components/Events/EventModal.vue'

const eventsStore = useEventsStore()
const eventsListRef = ref(null)

const activeFilter = ref('upcoming')
const selectedEvent = ref(null)
const showEventModal = ref(false)

const featuredEvents = computed(() => eventsStore.getFeaturedEvents)

const quickFilters = computed(() => [
  {
    key: 'upcoming',
    label: 'Upcoming',
    icon: '📅',
    count: eventsStore.getUpcomingEvents.length
  },
  {
    key: 'today',
    label: 'Today',
    icon: '⚡',
    count: eventsStore.getTodaysEvents.length
  },
  {
    key: 'weekend',
    label: 'This Weekend',
    icon: '🎉',
    count: eventsStore.getEventsThisWeekend.length
  },
  {
    key: 'featured',
    label: 'Featured',
    icon: '⭐',
    count: eventsStore.getFeaturedEvents.length
  }
])

const setActiveFilter = (filterKey) => {
  activeFilter.value = filterKey
}

const getFilteredTitle = () => {
  const filterMap = {
    'upcoming': 'Upcoming Events',
    'today': "Today's Events",
    'weekend': 'Weekend Events',
    'featured': 'Featured Events'
  }
  return filterMap[activeFilter.value] || 'All Events'
}

const openEventModal = (event) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const closeEventModal = () => {
  selectedEvent.value = null
  showEventModal.value = false
}

onMounted(async () => {
  // Load events data if not already loaded
  if (eventsStore.events.length === 0) {
    await eventsStore.loadEventsData()
  }
})
</script>

<style scoped>
.events-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-bottom: var(--bottom-nav-height, 80px);
}

.events-content {
  max-width: var(--container-xl, 1200px);
  margin: 0 auto;
  padding: var(--space-6, 24px) var(--space-4, 16px);
}

/* Featured Events Section */
.featured-section {
  margin-bottom: var(--space-8, 32px);
}

.section-title {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.featured-events-scroll {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  scroll-behavior: smooth;
}

.featured-events-scroll::-webkit-scrollbar {
  height: 4px;
}

.featured-events-scroll::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
  border-radius: 2px;
}

.featured-events-scroll::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 2px;
}

.featured-card {
  flex: 0 0 300px;
  max-width: 300px;
}

/* Quick Filters Section */
.quick-filters {
  margin-bottom: var(--space-8);
}

.filters-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-4);
}

.filter-buttons {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border-muted);
  color: var(--color-text-primary);
  padding: var(--btn-padding-base);
  border-radius: var(--btn-border-radius);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  position: relative;
}

.filter-btn:hover {
  border-color: var(--color-primary-alpha-30);
  background: rgba(var(--color-primary-rgb), 0.05);
}

.filter-btn.active {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.count-badge {
  background: rgba(0, 0, 0, 0.2);
  color: inherit;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-bold);
  min-width: 20px;
  text-align: center;
}

.filter-btn.active .count-badge {
  background: rgba(0, 0, 0, 0.3);
  color: #000;
}

/* Events Section */
.events-section {
  margin-bottom: var(--space-8);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .events-content {
    padding: var(--space-4) var(--space-3);
  }

  .featured-card {
    flex: 0 0 280px;
    max-width: 280px;
  }

  .filter-buttons {
    gap: var(--space-2);
  }

  .filter-btn {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
  }

  .section-title {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .featured-events-scroll {
    margin-left: calc(-1 * var(--space-3));
    margin-right: calc(-1 * var(--space-3));
    padding-left: var(--space-3);
    padding-right: var(--space-3);
  }

  .featured-card {
    flex: 0 0 260px;
    max-width: 260px;
  }

  .filter-buttons {
    justify-content: center;
  }

  .filter-btn {
    flex: 1;
    min-width: auto;
    justify-content: center;
  }
}
</style>