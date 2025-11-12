<template>
  <BaseModal
    :is-visible="isVisible"
    :title="business?.name"
    :subtitle="business?.category"
    :description="business?.description"
    :hero-image="business?.heroImage || business?.logo"
    :actions="modalActions"
    @close="closeModal"
  >
    <!-- Business Details Content -->
    <template #content>
      <div v-if="business" class="business-details">

        <!-- Price Range Badge -->
        <div v-if="business.price_range || business.priceRange" class="business-price">
          <svg class="price-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z"/>
          </svg>
          <span>{{ business.price_range || business.priceRange }}</span>
        </div>

        <!-- Special Information -->
        <div v-if="business.happyHour || business.liveMusic" class="business-specials">
          <!-- Happy Hour -->
          <div v-if="business.happyHour" class="special-item">
            <svg class="special-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 7L10 12V22H14V12L19 7V5H5V7ZM7.5 9H16.5L14 11.5V20H10V11.5L7.5 9Z"/>
            </svg>
            <div class="special-content">
              <h4 class="special-title">Happy Hour</h4>
              <p class="special-time">{{ business.happyHour }}</p>
            </div>
          </div>

          <!-- Live Music -->
          <div v-if="business.liveMusic" class="special-item">
            <svg class="special-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z"/>
            </svg>
            <div class="special-content">
              <h4 class="special-title">Live Music</h4>
              <p class="special-time">{{ business.liveMusic.schedule }}</p>
              <p v-if="business.liveMusic.time" class="special-detail">{{ business.liveMusic.time }}</p>
            </div>
          </div>
        </div>

        <!-- Business Hours -->
        <div v-if="business.hours" class="business-hours">
          <h4 class="hours-title">
            <svg class="hours-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"/>
            </svg>
            Hours
          </h4>
          <div class="hours-grid">
            <div v-for="(hours, day) in business.hours" :key="day" class="hours-row">
              <span class="day-name">{{ capitalizeFirst(day) }}:</span>
              <span class="day-hours">{{ hours }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Contact Information in Additional Slot -->
    <template #additional>
      <div v-if="business?.contact" class="business-contact">
        <h3 class="contact-title">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
          </svg>
          Contact & Location
        </h3>
        <div class="contact-info">
          <p v-if="business.contact.phone" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
            </svg>
            {{ business.contact.phone }}
          </p>
          <p v-if="business.contact.email" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
            </svg>
            {{ business.contact.email }}
          </p>
          <p v-if="business.contact?.address || business.location?.address" class="contact-item">
            <svg class="contact-item-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
            </svg>
            {{ business.contact?.address || business.location?.address }}
          </p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/UI/BaseModal.vue'
import { ICONS } from '@/utils/icons'
import analytics from '@/utils/analytics'

const props = defineProps({
  business: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Track modal view when opened
watch(() => props.business && props.isVisible, (newVal) => {
  if (newVal && props.business) {
    analytics.trackBusinessView(props.business, 'modal', {
      placement: 'business_modal'
    })
  }
})

const closeModal = () => {
  emit('close')
}

// Modal Actions with white SVG icons
const modalActions = computed(() => {
  if (!props.business) return []

  const actions = []

  if (props.business.contact?.website) {
    actions.push({
      label: 'Website',
      icon: ICONS.WEBSITE,
      handler: openWebsite,
      variant: 'primary',
      tooltip: 'Visit website'
    })
  }

  if (props.business.contact?.phone) {
    actions.push({
      label: 'Call',
      icon: ICONS.PHONE,
      handler: callBusiness,
      variant: 'secondary',
      tooltip: 'Call business'
    })
  }

  if (props.business.contact?.address || props.business.location?.address) {
    actions.push({
      label: 'Directions',
      icon: ICONS.DIRECTIONS,
      handler: openMaps,
      variant: 'secondary',
      tooltip: 'Get directions'
    })
  }

  actions.push({
    label: 'Share',
    icon: ICONS.SHARE,
    handler: shareBusiness,
    variant: 'ghost',
    tooltip: 'Share business'
  })

  return actions
})

// Action Functions
const openWebsite = () => {
  if (props.business?.contact?.website) {
    analytics.trackBusinessLead(props.business, 'website', {
      placement: 'business_modal',
      website: props.business.contact.website
    })
    window.open(props.business.contact.website, '_blank')
  }
}

const callBusiness = () => {
  if (props.business?.contact?.phone) {
    analytics.trackBusinessLead(props.business, 'call', {
      placement: 'business_modal',
      phone: props.business.contact.phone
    })
    window.location.href = `tel:${props.business.contact.phone}`
  }
}

const openMaps = () => {
  const address = props.business?.contact?.address || props.business?.location?.address

  analytics.trackBusinessLead(props.business, 'directions', {
    placement: 'business_modal',
    address: address
  })

  if (address) {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  } else if (props.business?.location?.lat && props.business?.location?.lng) {
    const { lat, lng } = props.business.location
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  }
}

const shareBusiness = async () => {
  analytics.trackBusinessInteraction(props.business?.id, 'share', {
    placement: 'business_modal',
    business_name: props.business?.name
  })

  const shareData = {
    title: props.business?.name,
    text: `Check out ${props.business?.name} - ${props.business?.description}`,
    url: props.business?.contact?.website || window.location.href
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
  const text = `Check out ${props.business?.name} - ${props.business?.description}`
  const url = props.business?.contact?.website || window.location.href

  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${url}`)
    alert('Business details copied to clipboard!')
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = `${text}\n${url}`
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Business details copied to clipboard!')
  }
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
/* Business-specific styling for BaseModal content */
.business-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Price Range Badge */
.business-price {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-primary-alpha-30);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  width: fit-content;
}

.price-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Special Information Section */
.business-specials {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.special-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.special-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.special-content {
  flex: 1;
}

.special-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1);
}

.special-time {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

.special-detail {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-1) 0 0;
}

/* Business Hours Section */
.business-hours {
  padding: var(--space-4);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
}

.hours-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
}

.hours-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.hours-grid {
  display: grid;
  gap: var(--space-2);
}

.hours-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-secondary);
}

.hours-row:last-child {
  border-bottom: none;
}

.day-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.day-hours {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

/* Contact Information Section */
.business-contact {
  padding: var(--space-5);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
  margin-top: var(--space-2);
}

.contact-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4);
}

.contact-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  margin: 0;
}

.contact-item-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .business-hours,
  .business-contact {
    padding: var(--space-3);
  }

  .special-item {
    padding: var(--space-3);
  }
}
</style>