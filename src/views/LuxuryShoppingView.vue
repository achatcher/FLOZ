<!--
/**
 * Luxury Shopping View - Premium Shopping & Boutiques
 *
 * This component displays a curated collection of luxury boutiques, jewelry stores,
 * and premium shopping destinations serving the Greenville community. Features elegant design
 * with category-based filtering and comprehensive store information.
 *
 * Features:
 * - Category-based store filtering (All, Jewelry, Fashion, Art, Antiques)
 * - Tiered store listings (Signature, Premier, Curated)
 * - Detailed store information and services
 * - Elegant brand-consistent styling
 * - Responsive grid layout
 *
 * @component LuxuryShoppingView
 * @requires useBusinessStore - For luxury shopping store data
 */
-->

<template>
  <div class="luxury-shopping-view">
    <!-- ===== HERO ADVERTISEMENT ===== -->
    <!-- MONETIZATION: Premium advertising space for luxury shopping businesses -->
    <div v-if="heroAd" class="hero-ad-section">
      <div class="hero-ad-card" @click="openBusinessModal(heroAd)">
        <img
          :src="heroAd.image"
          :alt="heroAd.name"
          class="hero-ad-image"
          @error="handleImageError"
        />
        <div class="hero-ad-overlay">
          <div class="hero-ad-content">
            <div class="tier-badge signature">FEATURED PARTNER</div>
            <h2 class="hero-ad-title">{{ heroAd.name }}</h2>
            <p class="hero-ad-subtitle">{{ heroAd.description }}</p>
            <div class="hero-ad-features">
              <span class="hero-ad-category">{{ heroAd.subcategory }}</span>
              <span class="hero-ad-price">{{ heroAd.price_range || heroAd.priceRange }}</span>
            </div>
            <div class="hero-ad-cta">
              <span>Discover Luxury Collections</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Elegant Page Header -->
    <header class="shopping-header">
      <div class="container">
        <h1 class="page-title">Luxury Shopping</h1>
        <p class="page-subtitle">Exquisite boutiques, premier jewelry stores, and exclusive collections for discerning tastes</p>

        <!-- Shopping Categories Filter -->
        <div class="shopping-categories">
          <button
            v-for="category in shoppingCategories"
            :key="category.value"
            :class="['category-filter', { active: selectedCategory === category.value }]"
            @click="selectedCategory = category.value"
          >
            <svg class="category-icon" viewBox="0 0 24 24" fill="currentColor">
              <path :d="category.icon"/>
            </svg>
            <span>{{ category.label }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Luxury Shopping Section -->
    <section class="shopping-section">
      <div class="container">

        <!-- Signature Tier Stores -->
        <div v-if="signatureStores.length > 0" class="tier-section signature-tier">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              Signature Collections
            </h2>
            <div class="tier-badge signature">SIGNATURE</div>
          </div>
          <div class="stores-grid signature-grid">
            <div
              v-for="store in signatureStores"
              :key="store.id"
              class="store-card signature-card"
              @click="viewStoreDetails(store)"
            >
              <div class="store-image-wrapper">
                <img :src="store.image" :alt="store.name" class="store-image" />
              </div>
              <div class="store-content">
                <h3 class="store-name">{{ store.name }}</h3>
                <p class="store-category">{{ store.category }}</p>
                <p class="store-description">{{ store.description }}</p>
                <div class="store-features">
                  <span v-for="feature in store.features.slice(0, 3)" :key="feature" class="feature-tag">
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Premier Tier Stores -->
        <div v-if="premierStores.length > 0" class="tier-section premier-tier">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2L2 7L12 22L22 7L18 2H6ZM6.5 4H8.5L10 7H5L6.5 4ZM11.5 4H12.5L14 7H10L11.5 4ZM15.5 4H17.5L19 7H14L15.5 4Z"/>
              </svg>
              Premier Boutiques
            </h2>
            <div class="tier-badge premier">PREMIER</div>
          </div>
          <div class="stores-grid premier-grid">
            <div
              v-for="store in premierStores"
              :key="store.id"
              class="store-card premier-card"
              @click="viewStoreDetails(store)"
            >
              <div class="store-image-wrapper">
                <img :src="store.image" :alt="store.name" class="store-image" />
              </div>
              <div class="store-content">
                <h3 class="store-name">{{ store.name }}</h3>
                <p class="store-category">{{ store.category }}</p>
                <p class="store-description">{{ store.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Curated Tier Stores -->
        <div v-if="curatedStores.length > 0" class="tier-section curated-tier">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5Z"/>
              </svg>
              Curated Selection
            </h2>
            <div class="tier-badge curated">CURATED</div>
          </div>
          <div class="stores-list curated-list">
            <div
              v-for="store in curatedStores"
              :key="store.id"
              class="store-item curated-item"
              @click="viewStoreDetails(store)"
            >
              <div class="store-image-wrapper">
                <img :src="store.image" :alt="store.name" class="store-image" />
              </div>
              <div class="store-content">
                <h3 class="store-name">{{ store.name }}</h3>
                <p class="store-category">{{ store.category }}</p>
              </div>
              <div class="store-action">
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Store Details Modal -->
    <div v-if="selectedStore" class="store-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>

        <div class="modal-header">
          <img :src="selectedStore.image" :alt="selectedStore.name" class="modal-image" />
          <div class="modal-info">
            <h2 class="modal-title">{{ selectedStore.name }}</h2>
            <p class="modal-category">{{ selectedStore.category }}</p>
            <div class="modal-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-text">Premium Experience</span>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <p class="modal-description">{{ selectedStore.description }}</p>
          <div class="modal-features">
            <h4>Services & Specialties:</h4>
            <ul>
              <li v-for="feature in selectedStore.features" :key="feature">{{ feature }}</li>
            </ul>
          </div>
          <div class="modal-contact">
            <h4>Visit Our Store:</h4>
            <p>{{ selectedStore.address }}</p>
            <a :href="`tel:${selectedStore.phone}`" class="phone-link">{{ selectedStore.phone }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNav />

    <!-- Business Modal -->
    <BusinessModal
      :business="selectedBusiness"
      :is-visible="showBusinessModal"
      @close="closeBusinessModal"
    />
  </div>
</template>

<script setup>
/**
 * Luxury Shopping View Component Logic
 *
 * Handles the display and interaction for luxury shopping stores and boutiques.
 * Provides category-based filtering, tier organization, and detailed store information.
 */

import { ref, computed, onMounted } from 'vue'
import { useBusinessStore } from '@/stores/businessStore'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import BusinessModal from '@/components/Business/BusinessModal.vue'

// Store and reactive state
const businessStore = useBusinessStore()
const selectedCategory = ref('all')

// Hero Ad and Business Modal state
const heroAd = ref(null)
const selectedBusiness = ref(null)
const showBusinessModal = ref(false)
const selectedStore = ref(null)

// Shopping categories for filtering
const shoppingCategories = [
  {
    value: 'all',
    label: 'All Stores',
    icon: 'M19 7H16V6A4 4 0 0 0 8 6V7H5A1 1 0 0 0 4 8V19A3 3 0 0 0 7 22H17A3 3 0 0 0 20 19V8A1 1 0 0 0 19 7ZM10 6A2 2 0 0 1 14 6V7H10V6ZM18 19A1 1 0 0 1 17 20H7A1 1 0 0 1 6 19V9H8V10A1 1 0 0 0 10 10A1 1 0 0 0 10 10V9H14V10A1 1 0 0 0 16 10A1 1 0 0 0 16 10V9H18V19Z'
  },
  {
    value: 'jewelry',
    label: 'Jewelry',
    icon: 'M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z'
  },
  {
    value: 'fashion',
    label: 'Fashion',
    icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5L12.5 7L10 5.5L4 7V9L10 7.5L12.5 9L15 7.5L21 9ZM12 8L10.5 9.5L7.91 11H16.09L13.5 9.5L12 8Z'
  },
  {
    value: 'art',
    label: 'Art & Antiques',
    icon: 'M12 3C8.13 3 5 6.13 5 10C5 10.74 5.13 11.46 5.36 12.13L12 21L18.64 12.13C18.87 11.46 19 10.74 19 10C19 6.13 15.87 3 12 3ZM12 8C13.1 8 14 8.9 14 10S13.1 12 12 12 10 11.1 10 10 10.9 8 12 8Z'
  }
]

// Dynamic luxury shopping data from business store
const luxuryStores = computed(() => {
  return businessStore.getBusinessesByCategory('Shopping') || []
})

// Legacy mock data (will be removed once business store is fully populated)
const mockLuxuryStores = ref([
  {
    id: 1,
    name: "Cartier Boutique",
    category: "Fine Jewelry",
    tier: "signature",
    description: "Prestigious jewelry and watch boutique featuring the latest Cartier collections. Personal shopping appointments available with exclusive member previews.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    address: "450 Luxury Lane",
    phone: "(555) 456-7890",
    features: ["Personal Shopping", "Private Appointments", "Concierge Service", "Luxury Brands", "Expert Consultation"]
  },
  {
    id: 2,
    name: "Hermès Boutique",
    category: "Luxury Fashion",
    tier: "signature",
    description: "Iconic French luxury house offering leather goods, ready-to-wear, perfumes, watches, and home furnishings.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    address: "500 Fashion Avenue",
    phone: "(555) 567-8901",
    features: ["Leather Goods", "Custom Orders", "Silk Scarves", "Ready-to-Wear", "Home Collection"]
  },
  {
    id: 3,
    name: "Tiffany & Co.",
    category: "Fine Jewelry",
    tier: "premier",
    description: "American luxury jewelry and specialty retailer known for diamond and sterling silver jewelry.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    address: "300 Diamond District",
    phone: "(555) 678-9012",
    features: ["Diamond Jewelry", "Sterling Silver", "Engagement Rings", "Custom Design"]
  },
  {
    id: 4,
    name: "Chanel Boutique",
    category: "Luxury Fashion",
    tier: "premier",
    description: "French luxury fashion house specializing in women's ready-to-wear, luxury goods, and fashion accessories.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    address: "200 Couture Street",
    phone: "(555) 789-0123",
    features: ["Ready-to-Wear", "Handbags", "Fragrance", "Beauty", "Fine Jewelry"]
  },
  {
    id: 5,
    name: "Sotheby's Gallery",
    category: "Fine Art",
    tier: "curated",
    description: "World-renowned auction house and art gallery featuring fine art, antiques, and collectibles.",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    address: "100 Art Plaza",
    phone: "(555) 890-1234",
    features: ["Fine Art", "Antiques", "Auction Services", "Art Advisory", "Private Sales"]
  }
])

// Computed properties for tier filtering
const filteredStores = computed(() => {
  const stores = luxuryStores.value.length > 0 ? luxuryStores.value : mockLuxuryStores.value
  if (selectedCategory.value === 'all') {
    return stores
  }
  return stores.filter(store =>
    store.category.toLowerCase().includes(selectedCategory.value.toLowerCase())
  )
})

const signatureStores = computed(() => {
  return filteredStores.value.filter(store => store.tier === 'signature')
})

const premierStores = computed(() => {
  return filteredStores.value.filter(store => store.tier === 'premier')
})

const curatedStores = computed(() => {
  return filteredStores.value.filter(store => store.tier === 'curated')
})

// Store interaction functions
const viewStoreDetails = (store) => {
  selectedStore.value = store
}

const closeModal = () => {
  selectedStore.value = null
}

// ===== HERO AD FUNCTIONS =====

/**
 * Opens the business modal for the clicked hero ad
 */
const openBusinessModal = (business) => {
  selectedBusiness.value = business
  showBusinessModal.value = true
}

/**
 * Closes the business modal
 */
const closeBusinessModal = () => {
  showBusinessModal.value = false
  selectedBusiness.value = null
}

/**
 * Handles image loading errors with fallback
 */
const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop&crop=center'
}

// Initialize data on component mount
onMounted(() => {
  if (!businessStore.initialized) {
    businessStore.loadData()
  }

  // Initialize hero ad dynamically - get signature tier business from Shopping category
  const shoppingBusinesses = businessStore.getBusinessesByCategory('Shopping') || []
  const featuredBusiness = shoppingBusinesses.find(b => b.tier === 'signature') ||
                          shoppingBusinesses.find(b => b.tier === 'premier') ||
                          shoppingBusinesses[0] // fallback to first business in category

  if (featuredBusiness) {
    heroAd.value = {
      ...featuredBusiness,
      image: featuredBusiness.heroImage || featuredBusiness.logo || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop&crop=center'
    }
  }
})
</script>

<style scoped>
/**
 * Luxury Shopping View Styles
 *
 * Elegant styling for luxury shopping store listings with category-based
 * visual hierarchy and sophisticated design elements.
 */

/* ===== BASE LAYOUT ===== */
.luxury-shopping-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-bottom: var(--bottom-nav-height);
}

/* ===== HERO ADVERTISEMENT SECTION ===== */

.hero-ad-section {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.hero-ad-card {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-primary-lg);
  transition: var(--transition-all);
  border: 3px solid #FFD700;
  background: var(--color-bg-secondary);
}

.hero-ad-card:active {
  transform: scale(0.98);
}

.hero-ad-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.hero-ad-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  padding: var(--space-5) var(--space-4) var(--space-4);
}

.hero-ad-content {
  color: white;
}

.hero-ad-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-heading);
  margin: var(--space-2) 0 var(--space-1);
  line-height: var(--line-height-tight);
}

.hero-ad-subtitle {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin: 0 0 var(--space-3);
  line-height: var(--line-height-relaxed);
}

.hero-ad-features {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-3);
}

.hero-ad-category {
  color: var(--color-primary);
}

.hero-ad-price {
  opacity: 0.8;
}

.hero-ad-cta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.hero-ad-cta svg {
  width: 16px;
  height: 16px;
}

.tier-badge {
  display: inline-block;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  margin-top: var(--space-2);
}

.tier-badge.signature {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px var(--color-primary-alpha-30);
}

.tier-badge.premier {
  background: var(--color-platinum);
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px rgba(229, 228, 226, 0.3);
}

.tier-badge.curated {
  background: var(--color-midnight);
  color: var(--color-text-primary);
  box-shadow: 0 2px 8px rgba(25, 25, 112, 0.3);
}

/* ===== HEADER SECTION ===== */
.shopping-header {
  background: var(--color-bg-luxury);
  padding: var(--space-16) 0 var(--space-12);
  text-align: center;
  border-bottom: 1px solid var(--color-border-primary);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-3);
  font-family: var(--font-family-heading);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: var(--line-height-relaxed);
}

/* ===== CATEGORY FILTERS ===== */
.shopping-categories {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-top: var(--space-6);
}

.category-filter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
}

.category-filter:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.category-filter.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-bg-primary);
}

.category-icon {
  width: 18px;
  height: 18px;
}

/* ===== STORES SECTION ===== */
.shopping-section {
  padding: var(--space-16) 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.tier-section {
  margin-bottom: var(--space-16);
}

.tier-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-8);
}

.tier-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  font-family: var(--font-family-heading);
}

.tier-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

/* ===== STORE CARDS ===== */
.stores-grid {
  display: grid;
  gap: var(--space-6);
}

.signature-grid {
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
}

.premier-grid {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.store-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-md);
}

.store-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-primary-lg);
  border-color: var(--color-primary);
}

.signature-card {
  border: 2px solid #FFD700;
}

.premier-card {
  border: 2px solid #C0C0C0;
}

.store-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.store-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-slow);
}

.store-card:hover .store-image {
  transform: scale(1.05);
}

.store-content {
  padding: var(--space-5);
}

.store-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  font-family: var(--font-family-heading);
}

.store-category {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-3);
}

.store-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-4);
}

.store-features {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.feature-tag {
  padding: var(--space-1) var(--space-3);
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* ===== CURATED STORES LIST ===== */
.stores-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.store-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-all);
}

.store-item:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-primary);
}

.curated-item {
  border: 2px solid #CD7F32;
}

.store-item .store-image-wrapper {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.store-item .store-content {
  flex: 1;
  padding: 0;
}

.store-item .store-name {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-1);
}

.store-action {
  color: var(--color-text-tertiary);
}

.arrow-icon {
  width: 20px;
  height: 20px;
}

/* ===== MODAL STYLES ===== */
.store-modal {
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
}

.modal-content {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-2xl);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.modal-header {
  position: relative;
}

.modal-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.modal-info {
  padding: var(--space-5);
  background: linear-gradient(to bottom, transparent, var(--color-bg-secondary));
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  font-family: var(--font-family-heading);
}

.modal-category {
  font-size: var(--font-size-base);
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}

.modal-rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stars {
  color: #FFD700;
  font-size: var(--font-size-lg);
}

.rating-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.modal-body {
  padding: var(--space-5);
}

.modal-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-5);
}

.modal-features h4,
.modal-contact h4 {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-3);
}

.modal-features ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2);
}

.modal-features li {
  color: var(--color-text-secondary);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-border-primary);
}

.modal-contact {
  margin-top: var(--space-5);
}

.modal-contact p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.phone-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
}

.phone-link:hover {
  text-decoration: underline;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .shopping-categories {
    gap: var(--space-2);
  }

  .category-filter {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }

  .signature-grid,
  .premier-grid {
    grid-template-columns: 1fr;
  }

  .tier-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .store-item {
    flex-direction: column;
    text-align: center;
  }

  .store-item .store-image-wrapper {
    width: 100%;
    height: 150px;
  }
}
</style>