<template>
  <div class="business-detail-view">
    <!-- Hero Section with Back Button Overlay -->
    <div class="hero-section">
      <img 
        :src="business.heroImage || business.logo" 
        :alt="business.name"
        class="hero-image"
      />
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
      </button>
    </div>

    <!-- Business Info Section -->
    <div class="business-info">
      <h1 class="business-name">{{ business.name }}</h1>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="action-btn" @click="callBusiness">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span>Call</span>
        </button>
        
        <button class="action-btn" @click="getDirections">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>Directions</span>
        </button>
        
        <button class="action-btn" @click="shareBusiness">
          <svg class="action-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
          <span>Share</span>
        </button>
      </div>

      <!-- Additional Info/Ads Section -->
      <div v-if="business.ads" class="info-ads">
        <img 
          v-for="(ad, index) in business.ads" 
          :key="index"
          :src="ad.image" 
          :alt="ad.title"
          class="info-ad-image"
          @click="openAdLink(ad.link)"
        />
      </div>

      <!-- Business Details -->
      <div class="business-details">
        <div v-if="business.description" class="detail-section">
          <h3 class="detail-title">About</h3>
          <p class="detail-text">{{ business.description }}</p>
        </div>

        <div v-if="business.contact.address" class="detail-section">
          <h3 class="detail-title">Address</h3>
          <p class="detail-text">{{ business.contact.address }}</p>
        </div>

        <div v-if="business.hours" class="detail-section">
          <h3 class="detail-title">Hours</h3>
          <div class="hours-list">
            <div v-for="(time, day) in business.hours" :key="day" class="hour-item">
              <span class="day">{{ capitalize(day) }}</span>
              <span class="time">{{ time }}</span>
            </div>
          </div>
        </div>

        <div v-if="business.contact.website" class="detail-section">
          <button class="website-btn" @click="openWebsite">
            Visit Website
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBusinessStore } from '@/stores/businessStore'

const router = useRouter()
const route = useRoute()
const businessStore = useBusinessStore()

const businessId = ref(route.params.businessId)
const business = ref({})

onMounted(() => {
  business.value = businessStore.getBusinessById(businessId.value)
  
  // If business not found, redirect to home
  if (!business.value) {
    router.push({ name: 'Home' })
  }
})

const goBack = () => {
  router.back()
}

const callBusiness = () => {
  if (business.value.contact?.phone) {
    window.location.href = `tel:${business.value.contact.phone}`
  }
}

const getDirections = () => {
  if (business.value.location) {
    const { lat, lng } = business.value.location
    // Open in device's default maps app
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(mapsUrl, '_blank')
  }
}

const shareBusiness = async () => {
  const shareData = {
    title: business.value.name,
    text: `Check out ${business.value.name} on FLOZ!`,
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Error sharing:', err)
    }
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }
}

const openWebsite = () => {
  if (business.value.contact?.website) {
    window.open(business.value.contact.website, '_blank')
  }
}

const openAdLink = (link) => {
  if (link) {
    window.open(link, '_blank')
  }
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
.business-detail-view {
  min-height: 100vh;
  background: var(--primary-navy);
  padding-bottom: 80px;
}

.hero-section {
  position: relative;
  width: 100%;
  height: 40vh;
  min-height: 300px;
  background: white;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.back-button:active {
  transform: scale(0.95);
}

.back-icon {
  font-size: 24px;
  color: #333;
}

.business-info {
  padding: 20px;
}

.business-name {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: left;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px 10px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:active {
  transform: scale(0.98);
  background: rgba(255, 255, 255, 0.15);
}

.action-icon {
  width: 24px;
  height: 24px;
}

.action-btn span {
  font-size: 14px;
  font-weight: 600;
}

.info-ads {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.info-ad-image {
  width: 100%;
  border-radius: 15px;
  cursor: pointer;
  transition: transform 0.2s;
}

.info-ad-image:active {
  transform: scale(0.98);
}

.business-details {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detail-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.detail-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.detail-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
  line-height: 1.6;
}

.hours-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hour-item {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.8);
  font-size: 15px;
}

.day {
  font-weight: 600;
}

.website-btn {
  width: 100%;
  background: var(--primary-cyan);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.website-btn:active {
  transform: scale(0.98);
  background: #0891b2;
}

@media (min-width: 768px) {
  .business-info {
    max-width: 800px;
    margin: 0 auto;
  }
}
</style>
