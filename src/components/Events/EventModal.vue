<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="event-modal" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Event Image -->
      <div class="event-hero">
        <img
          :src="event.image"
          :alt="event.title"
          class="event-hero-image"
          @error="handleImageError"
        />
        <div v-if="event.featured" class="featured-overlay">
          ⭐ Featured Event
        </div>
      </div>

      <!-- Event Content -->
      <div class="modal-content">
        <div class="event-category-badge">{{ event.category }}</div>

        <h1 class="event-title">{{ event.title }}</h1>

        <!-- Event Details Grid -->
        <div class="event-details-grid">
          <div class="detail-item">
            <div class="detail-label">📅 Date</div>
            <div class="detail-value">
              {{ formatDate(event.date) }}
              <span v-if="event.endDate && event.endDate !== event.date">
                - {{ formatDate(event.endDate) }}
              </span>
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-label">🕐 Time</div>
            <div class="detail-value">{{ event.time }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">📍 Location</div>
            <div class="detail-value">
              <div>{{ event.location }}</div>
              <div v-if="event.address" class="detail-address">{{ event.address }}</div>
            </div>
          </div>

          <div v-if="event.ticketPrice" class="detail-item">
            <div class="detail-label">🎫 Tickets</div>
            <div class="detail-value">{{ event.ticketPrice }}</div>
          </div>

          <div v-if="event.organizer" class="detail-item">
            <div class="detail-label">👥 Organizer</div>
            <div class="detail-value">{{ event.organizer }}</div>
          </div>

          <div v-if="event.recurring" class="detail-item">
            <div class="detail-label">🔄 Frequency</div>
            <div class="detail-value">{{ event.recurring }}</div>
          </div>
        </div>

        <!-- Event Description -->
        <div class="event-description">
          <h3>About This Event</h3>
          <p>{{ event.description }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="event-actions">
          <button
            class="favorite-btn"
            :class="{ active: isFavorite }"
            @click="toggleFavorite"
          >
            {{ isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites' }}
          </button>

          <div class="action-links">
            <a
              v-if="event.website"
              :href="event.website"
              target="_blank"
              rel="noopener noreferrer"
              class="action-btn primary"
            >
              🌐 Visit Website
            </a>

            <a
              v-if="event.phone"
              :href="`tel:${event.phone}`"
              class="action-btn secondary"
            >
              📞 Call {{ formatPhone(event.phone) }}
            </a>

            <button
              v-if="event.coordinates"
              @click="openDirections"
              class="action-btn secondary"
            >
              🗺️ Get Directions
            </button>

            <button
              @click="shareEvent"
              class="action-btn secondary"
            >
              📤 Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEventsStore } from '@/stores/eventsStore'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const eventsStore = useEventsStore()

const isFavorite = computed(() => eventsStore.isEventFavorite(props.event.id))

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

const closeModal = () => {
  emit('close')
}

const toggleFavorite = () => {
  if (isFavorite.value) {
    eventsStore.removeFromFavorites(props.event.id)
  } else {
    eventsStore.addToFavorites(props.event.id)
  }
}

const openDirections = () => {
  if (props.event.coordinates) {
    const { lat, lng } = props.event.coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  } else if (props.event.address) {
    const encodedAddress = encodeURIComponent(props.event.address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  }
}

const shareEvent = async () => {
  const shareData = {
    title: props.event.title,
    text: `Check out this event: ${props.event.title} on ${formatDate(props.event.date)}`,
    url: props.event.website || window.location.href
  }

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') {
        fallbackShare()
      }
    }
  } else {
    fallbackShare()
  }
}

const fallbackShare = () => {
  const text = `Check out this event: ${props.event.title} on ${formatDate(props.event.date)}`
  const url = props.event.website || window.location.href

  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${url}`)
    alert('Event details copied to clipboard!')
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = `${text}\n${url}`
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Event details copied to clipboard!')
  }
}

const handleImageError = (e) => {
  e.target.src = '/images/events/default-event.jpg'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
  backdrop-filter: blur(5px);
}

.event-modal {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-2xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 10;
}

.close-btn {
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-all);
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.event-hero {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

.event-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-overlay {
  position: absolute;
  bottom: var(--space-4);
  left: var(--space-4);
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  font-size: var(--font-size-sm);
}

.modal-content {
  padding: var(--space-6);
}

.event-category-badge {
  display: inline-block;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-3);
}

.event-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-6);
}

.event-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  background: rgba(255, 255, 255, 0.02);
  padding: var(--space-4);
  border-radius: var(--radius-xl);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.detail-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  min-width: 80px;
  font-size: var(--font-size-sm);
}

.detail-value {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  flex: 1;
}

.detail-address {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  margin-top: var(--space-1);
}

.event-description {
  margin-bottom: var(--space-6);
}

.event-description h3 {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-3);
}

.event-description p {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-base);
}

.event-actions {
  border-top: 1px solid var(--color-border-subtle);
  padding-top: var(--space-6);
}

.favorite-btn {
  width: 100%;
  padding: var(--btn-padding-lg);
  border: 1px solid var(--color-border-muted);
  border-radius: var(--btn-border-radius);
  background: rgba(255, 255, 255, 0.02);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-all);
  margin-bottom: var(--space-4);
}

.favorite-btn:hover {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.05);
}

.favorite-btn.active {
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.05);
  color: #ff4444;
}

.action-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-3);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--btn-padding-base);
  border-radius: var(--btn-border-radius);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-all);
  border: none;
  cursor: pointer;
  gap: var(--space-2);
}

.action-btn.primary {
  background: var(--color-primary);
  color: #000;
}

.action-btn.primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-muted);
}

.action-btn.secondary:hover {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .event-modal {
    max-height: 95vh;
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
    margin: 0;
  }

  .modal-content {
    padding: var(--space-4);
  }

  .event-title {
    font-size: var(--font-size-2xl);
  }

  .event-details-grid {
    grid-template-columns: 1fr;
  }

  .action-links {
    grid-template-columns: 1fr;
  }
}
</style>