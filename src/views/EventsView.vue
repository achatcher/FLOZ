<template>
  <div class="events-view">
    <TopBar :show-back="true" />

    <!-- ===== PAGE TITLE SECTION ===== -->
    <PageHeader
      title="Live Events"
      subtitle="Discover upcoming events in Greenville"
    />

    <div class="events-content">
      <!-- Signature Event Hero Section -->
      <SignatureEvent
        :event="signatureEvent"
        @click="openEventModal"
      />

      <!-- Featured Events Section -->
      <section v-if="featuredEvents.length > 0" class="featured-events-section">
        <h2 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
          </svg>
          Featured Events
        </h2>
        <div class="featured-events-scroll">
          <div
            v-for="event in featuredEvents"
            :key="`featured-${event.id}`"
            class="featured-event-card"
            @click="openEventModal(event)"
          >
            <img
              :src="event.image"
              :alt="event.title"
              class="featured-event-image"
              @error="handleImageError"
            />
            <div class="featured-event-content">
              <div class="featured-event-category">{{ event.category }}</div>
              <h3 class="featured-event-title">{{ event.title }}</h3>
              <div class="featured-event-date">{{ formatFeaturedDate(event.date) }}</div>
              <div class="featured-event-location">{{ event.location }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Calendar & Events Section -->
      <section class="calendar-events-section">
        <h2 class="section-title">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H17V12H7V10ZM7 14H14V16H7V14Z"/>
          </svg>
          Browse Events by Date
        </h2>

        <!-- Calendar Component -->
        <div class="calendar-container">
          <div class="calendar-header">
            <button @click="previousMonth" class="month-nav-btn">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12Z"/>
              </svg>
            </button>
            <h3 class="calendar-month">{{ currentMonthName }} {{ currentYear }}</h3>
            <button @click="nextMonth" class="month-nav-btn">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12Z"/>
              </svg>
            </button>
          </div>

          <div class="calendar-grid">
            <div class="calendar-days-header">
              <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">{{ day }}</div>
            </div>
            <div class="calendar-days">
              <div
                v-for="date in calendarDates"
                :key="date.key"
                class="calendar-day"
                :class="{
                  'other-month': !date.currentMonth,
                  'has-events': date.hasEvents,
                  'selected': selectedDate && date.date === selectedDate,
                  'today': date.isToday
                }"
                @click="handleDateClick(date)"
              >
                <span class="calendar-day-number">{{ date.day }}</span>
                <div v-if="date.hasEvents" class="event-indicator"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Events List -->
        <div class="monthly-events-section">
          <h3 class="monthly-events-title">
            Events for {{ currentMonthName }} {{ currentYear }}
          </h3>
          <div v-if="currentMonthEvents.length > 0" class="monthly-events-list">
            <div v-for="(dayEvents, date) in groupedMonthlyEvents" :key="date" class="daily-events-group">
              <h4 class="daily-events-date">{{ formatDailyEventsDate(date) }}</h4>
              <div class="daily-events-items">
                <div
                  v-for="event in dayEvents"
                  :key="event.id"
                  class="compact-event-item"
                  @click="openEventModal(event)"
                >
                  <img
                    :src="event.image"
                    :alt="event.title"
                    class="compact-event-image"
                    @error="handleImageError"
                  />
                  <div class="compact-event-content">
                    <div class="compact-event-category">{{ event.category }}</div>
                    <h5 class="compact-event-title">{{ event.title }}</h5>
                    <div class="compact-event-details">
                      <span class="compact-event-time">{{ event.time }}</span>
                      <span class="compact-event-location">{{ event.location }}</span>
                    </div>
                  </div>
                  <div class="compact-event-actions">
                    <svg class="action-arrow" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-events-message">
            <svg class="no-events-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z"/>
            </svg>
            <p>No events scheduled for {{ currentMonthName }} {{ currentYear }}</p>
          </div>
        </div>
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
import EventModal from '@/components/Events/EventModal.vue'
import PageHeader from '@/components/UI/PageHeader.vue'
import SignatureEvent from '@/components/Events/SignatureEvent.vue'

const eventsStore = useEventsStore()

// Modal state
const selectedEvent = ref(null)
const showEventModal = ref(false)

// Calendar state
const currentDate = ref(new Date())
const selectedDate = ref(null)

// Event hierarchy - matching business listing pattern
const signatureEvent = computed(() => {
  // Get the highest tier/featured event as signature
  const featured = eventsStore.getFeaturedEvents
  return featured.length > 0 ? featured[0] : null
})

const featuredEvents = computed(() => {
  // Get remaining featured events (excluding signature)
  const featured = eventsStore.getFeaturedEvents
  return featured.slice(1, 4) // Show 3 featured events after signature
})

// Calendar computed properties
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).toLocaleDateString('en-US', { month: 'long' })
})

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDates = computed(() => {
  const dates = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    const dateString = date.toISOString().split('T')[0]
    const eventsForDate = eventsStore.getEventsForDate(dateString)

    dates.push({
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date: dateString,
      day: date.getDate(),
      currentMonth: date.getMonth() === currentMonth.value,
      hasEvents: eventsForDate.length > 0,
      isToday: date.getTime() === today.getTime()
    })
  }

  return dates
})

// Monthly events computed properties
const currentMonthEvents = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

  return eventsStore.events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate >= firstDay && eventDate <= lastDay
  }).sort((a, b) => new Date(a.date) - new Date(b.date))
})

const groupedMonthlyEvents = computed(() => {
  const grouped = {}

  currentMonthEvents.value.forEach(event => {
    const date = event.date
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(event)
  })

  return grouped
})

// Calendar navigation
const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

// Handle clicking on calendar dates - open event modal if date has events
const handleDateClick = (date) => {
  if (!date.currentMonth) return

  if (date.hasEvents) {
    // Get events for this date
    const eventsForDate = eventsStore.getEventsForDate(date.date)
    if (eventsForDate.length > 0) {
      // If there's only one event, open it directly
      if (eventsForDate.length === 1) {
        openEventModal(eventsForDate[0])
      } else {
        // If multiple events, open the first one (could be enhanced to show selection)
        openEventModal(eventsForDate[0])
      }
    }
  }
}

// Date formatting functions for featured and daily events

const formatFeaturedDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const formatDailyEventsDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

// Image error handler
const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&crop=center'
}

// Modal functions
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

/* ===== EVENTS VIEW STYLES ===== */

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
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-heading);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.section-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  fill: currentColor;
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

.filter-icon {
  width: 18px;
  height: 18px;
  color: inherit;
  fill: currentColor;
  flex-shrink: 0;
}

/* Events Section */
.events-section {
  margin-bottom: var(--space-8);
}

/* Events Content Layout */

/* Featured Events Section Styles */

/* Featured Events Section */
.featured-events-section {
  margin-bottom: var(--space-8);
}

.featured-event-card {
  flex: 0 0 300px;
  max-width: 300px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-all);
}

.featured-event-card:hover {
  border-color: var(--color-primary-alpha-30);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.15);
}

.featured-event-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.featured-event-content {
  padding: var(--space-4);
}

.featured-event-category {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-2);
}

.featured-event-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-snug);
  margin-bottom: var(--space-2);
}

.featured-event-date,
.featured-event-location {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-1);
}

/* Calendar Section */
.calendar-events-section {
  margin-bottom: var(--space-8);
}

.calendar-container {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.calendar-month {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
}

.month-nav-btn {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--btn-border-radius);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-all);
  color: var(--color-text-secondary);
}

.month-nav-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
}

.nav-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.calendar-grid {
  width: 100%;
}

.calendar-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-1);
  margin-bottom: var(--space-2);
}

.calendar-day-header {
  text-align: center;
  padding: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-1);
}

.calendar-day {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-all);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.calendar-day:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
}

.calendar-day.other-month {
  color: var(--color-text-muted);
}

.calendar-day.has-events {
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-primary-alpha-30);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.calendar-day.selected {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  font-weight: var(--font-weight-bold);
}

.calendar-day.today {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  font-weight: var(--font-weight-semibold);
}

.calendar-day-number {
  position: relative;
  z-index: 1;
}

.event-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--color-primary);
  border-radius: 50%;
}

/* Selected Date Events */
.selected-date-events {
  margin-bottom: var(--space-6);
}

.selected-date-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-4);
}

.compact-events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.compact-event-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-all);
}

.compact-event-item:hover {
  border-color: var(--color-primary-alpha-30);
  background: rgba(var(--color-primary-rgb), 0.05);
}

.compact-event-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.compact-event-content {
  flex: 1;
  min-width: 0;
}

.compact-event-category {
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  margin-bottom: var(--space-1);
}

.compact-event-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-1);
}

.compact-event-details {
  display: flex;
  gap: var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.compact-event-actions {
  flex-shrink: 0;
}

.action-arrow {
  width: 20px;
  height: 20px;
  color: var(--color-text-muted);
  fill: currentColor;
}

/* Monthly Events Section */
.monthly-events-section {
  margin-top: var(--space-6);
}

.monthly-events-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.monthly-events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.daily-events-group {
  border-left: 3px solid var(--color-primary);
  padding-left: var(--space-4);
  margin-bottom: var(--space-2);
}

.daily-events-date {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  margin-bottom: var(--space-3);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.daily-events-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* No Events Message */
.no-events-message {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-muted);
}

.no-events-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  fill: currentColor;
  margin: 0 auto var(--space-4);
}

.no-events-message p {
  font-size: var(--font-size-base);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .events-content {
    padding: var(--space-4) var(--space-3);
  }

  /* Mobile styles for events content */

  .featured-event-card {
    flex: 0 0 280px;
    max-width: 280px;
  }

  .calendar-container {
    padding: var(--space-4);
  }

  .calendar-month {
    font-size: var(--font-size-lg);
  }

  .compact-event-item {
    padding: var(--space-3);
  }

  .compact-event-details {
    flex-direction: column;
    gap: var(--space-1);
  }
}

@media (max-width: 480px) {

  .featured-events-scroll {
    margin-left: calc(-1 * var(--space-3));
    margin-right: calc(-1 * var(--space-3));
    padding-left: var(--space-3);
    padding-right: var(--space-3);
  }

  .featured-event-card {
    flex: 0 0 260px;
    max-width: 260px;
  }

  .calendar-days-header,
  .calendar-days {
    gap: 2px;
  }

  .calendar-day {
    font-size: var(--font-size-xs);
  }
}
</style>