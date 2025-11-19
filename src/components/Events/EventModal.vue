<template>
  <BaseModal
    :is-visible="isVisible"
    :title="event?.title"
    :description="event?.description"
    :hero-image="event?.image"
    :actions="modalActions"
    @close="closeModal"
  >
    <!-- Event Details Content -->
    <template #content>
      <div v-if="event" class="event-details">

        <!-- Ticket Price Badge -->
        <div v-if="event.ticketPrice" class="event-price">
          <svg class="price-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6C4.9 2 4 2.9 4 4V8.5C4.8 8.5 5.5 9.2 5.5 10S4.8 11.5 4 11.5V16C4 17.1 4.9 18 6 18H18C19.1 18 20 17.1 20 16V11.5C19.2 11.5 18.5 10.8 18.5 10S19.2 8.5 20 8.5V4C20 2.9 19.1 2 18 2ZM18 8.97C17.16 9.45 16.5 10.16 16.5 11S17.16 12.55 18 13.03V16H6V13.03C6.84 12.55 7.5 11.84 7.5 11S6.84 9.45 6 8.97V4H18V8.97Z"/>
          </svg>
          <span>{{ event.ticketPrice }}</span>
        </div>

        <!-- Event Date & Time -->
        <div class="event-datetime">
          <div class="datetime-item">
            <div class="datetime-content">
              <h4 class="datetime-label">Date</h4>
              <p class="datetime-value">{{ formatEventDate(event.date) }}</p>
            </div>
          </div>

          <div v-if="event.time" class="datetime-item">
            <div class="datetime-content">
              <h4 class="datetime-label">Time</h4>
              <p class="datetime-value">{{ event.time }}</p>
            </div>
          </div>
        </div>

        <!-- Event Location -->
        <div v-if="event.location" class="event-location">
          <div class="location-content">
            <h4 class="location-label">Location</h4>
            <p class="location-value">{{ event.location }}</p>
          </div>
        </div>

        <!-- Event Category -->
        <div v-if="event.category" class="event-category">
          <svg class="category-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <span class="category-label">{{ event.category }}</span>
        </div>

      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '@/components/UI/BaseModal.vue'
import { ICONS } from '@/utils/icons'

const props = defineProps({
  event: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

// Modal Actions with white SVG icons
const modalActions = computed(() => {
  if (!props.event) return []

  const actions = []

  if (props.event.website) {
    actions.push({
      label: 'Website',
      icon: ICONS.WEBSITE,
      handler: openWebsite,
      variant: 'primary',
      tooltip: 'Visit event website'
    })
  }

  if (props.event.phone) {
    actions.push({
      label: 'Call',
      icon: ICONS.PHONE,
      handler: callPhone,
      variant: 'secondary',
      tooltip: 'Call organizer'
    })
  }

  if (props.event.coordinates || props.event.address || props.event.location) {
    actions.push({
      label: 'Directions',
      icon: ICONS.DIRECTIONS,
      handler: openDirections,
      variant: 'secondary',
      tooltip: 'Get directions'
    })
  }

  actions.push({
    label: 'Share',
    icon: ICONS.SHARE,
    handler: shareEvent,
    variant: 'ghost',
    tooltip: 'Share event'
  })

  return actions
})

// Action Functions
const openWebsite = () => {
  if (props.event?.website) {
    window.open(props.event.website, '_blank')
  }
}

const callPhone = () => {
  if (props.event?.phone) {
    window.location.href = `tel:${props.event.phone}`
  }
}

const openDirections = () => {
  if (props.event?.coordinates) {
    const { lat, lng } = props.event.coordinates
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  } else if (props.event?.address) {
    const encodedAddress = encodeURIComponent(props.event.address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  } else if (props.event?.location) {
    const encodedLocation = encodeURIComponent(props.event.location)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
    window.open(url, '_blank')
  }
}

const shareEvent = async () => {
  const shareData = {
    title: props.event?.title,
    text: `Check out this event: ${props.event?.title} on ${formatEventDate(props.event?.date)}`,
    url: props.event?.website || window.location.href
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
  const text = `Check out this event: ${props.event?.title} on ${formatEventDate(props.event?.date)}`
  const url = props.event?.website || window.location.href

  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${url}`)
    alert('Event details copied to clipboard!')
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = `${text}\n${url}`
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Event details copied to clipboard!')
  }
}

const formatEventDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* Event-specific styling for BaseModal content */
.event-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Ticket Price Badge */
.event-price {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-primary-alpha-30);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.price-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Event Date & Time Section */
.event-datetime {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.datetime-item {
  display: flex;
  align-items: flex-start;
}

.datetime-content {
  flex: 1;
}

.datetime-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-1);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.datetime-value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

/* Event Location Section */
.event-location {
  display: flex;
  align-items: flex-start;
}

.location-content {
  flex: 1;
}

.location-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-1);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.location-value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  margin: 0;
  line-height: var(--line-height-relaxed);
}

/* Event Category Badge */
.event-category {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  width: fit-content;
}

.category-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.category-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Responsive Design */
@media (max-width: 768px) {
  .event-datetime {
    grid-template-columns: 1fr;
  }
}
</style>