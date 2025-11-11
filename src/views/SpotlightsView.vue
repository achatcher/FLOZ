<template>
  <div class="spotlights-view">
    <TopBar title="Announcements" :show-back="true" />

    <!-- Elegant Header -->
    <header class="spotlights-header">
      <div class="container">
        <h1 class="page-title">Community Announcements</h1>
        <p class="page-subtitle">Important updates and exclusive opportunities for our residents</p>
      </div>
    </header>

    <!-- Featured Spotlight -->
    <section class="featured-spotlight" v-if="featuredSpotlight">
      <div class="container">
        <article class="spotlight-hero">
          <div class="hero-image">
            <img :src="featuredSpotlight.image" :alt="featuredSpotlight.title" />
            <div class="hero-overlay">
              <span class="spotlight-category">{{ featuredSpotlight.category }}</span>
              <h2 class="hero-title">{{ featuredSpotlight.title }}</h2>
              <p class="hero-excerpt">{{ featuredSpotlight.excerpt }}</p>
              <button @click="openSpotlight(featuredSpotlight)" class="btn-read-more">
                View Details
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Spotlight Grid -->
    <section class="spotlights-grid">
      <div class="container">
        <div class="grid">
          <article
            v-for="spotlight in regularSpotlights"
            :key="spotlight.id"
            class="spotlight-card"
            @click="openSpotlight(spotlight)"
          >
            <div class="card-image">
              <img :src="spotlight.image" :alt="spotlight.title" />
              <div class="card-overlay">
                <span class="spotlight-category">{{ spotlight.category }}</span>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ spotlight.title }}</h3>
              <p class="card-excerpt">{{ spotlight.excerpt }}</p>
              <div class="card-meta">
                <span class="author">By {{ spotlight.author }}</span>
                <span class="date">{{ formatDate(spotlight.publishDate) }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Spotlight Modal -->
    <div v-if="selectedSpotlight" class="spotlight-modal" @click.self="closeSpotlight">
      <div class="modal-content">
        <button @click="closeSpotlight" class="close-btn">&times;</button>
        <article class="spotlight-full">
          <header class="article-header">
            <img :src="selectedSpotlight.image" :alt="selectedSpotlight.title" class="article-image" />
            <div class="article-meta">
              <span class="article-category">{{ selectedSpotlight.category }}</span>
              <h1 class="article-title">{{ selectedSpotlight.title }}</h1>
              <p class="article-byline">
                By {{ selectedSpotlight.author }} • {{ formatDate(selectedSpotlight.publishDate) }}
              </p>
            </div>
          </header>
          <div class="article-content">
            <div v-html="selectedSpotlight.content"></div>
          </div>
        </article>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'

// Reactive data
const spotlights = ref([])
const selectedSpotlight = ref(null)

// Computed properties
const featuredSpotlight = computed(() =>
  spotlights.value.find(spotlight => spotlight.featured)
)

const regularSpotlights = computed(() =>
  spotlights.value.filter(spotlight => !spotlight.featured)
)

// Methods
const openSpotlight = (spotlight) => {
  selectedSpotlight.value = spotlight
}

const closeSpotlight = () => {
  selectedSpotlight.value = null
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadSpotlights = () => {
  // Mock data for community announcements
  spotlights.value = [
    {
      id: 1,
      title: "New Private Golf Club Opening - Exclusive Member Preview",
      excerpt: "Heritage Hills Golf & Country Club announces its grand opening with exclusive membership opportunities for community residents.",
      category: "Recreation",
      author: "Hills Management",
      publishDate: "2024-11-10",
      image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=400&fit=crop&crop=center",
      featured: false,
      content: `
        <p>We are thrilled to announce the grand opening of Heritage Hills Golf & Country Club, a world-class 18-hole championship golf course designed by renowned architect Tom Fazio.</p>

        <h3>Exclusive Membership Opportunities</h3>
        <p>As a valued member of The Hills community, you are invited to our exclusive membership preview event on November 20th, 2024. This invitation-only event will feature:</p>

        <ul>
          <li>Private course tour with Head Golf Professional Michael Thompson</li>
          <li>Complimentary round of golf with cart</li>
          <li>Champagne reception at the clubhouse</li>
          <li>Special founding member pricing (limited time)</li>
        </ul>

        <h3>World-Class Amenities</h3>
        <p>The club features a fully equipped pro shop, driving range, putting greens, and our signature clubhouse restaurant offering farm-to-table dining with panoramic course views.</p>

        <p>To RSVP for the preview event or learn about membership options, please contact our membership director at (555) 123-GOLF or visit the clubhouse reception desk.</p>
      `
    },
    {
      id: 2,
      title: "Pickleball Courts Now Open - Tournament Series Announced",
      excerpt: "Four regulation pickleball courts are now available for resident use, with weekly tournaments starting December 1st.",
      category: "Athletics",
      author: "Recreation Committee",
      publishDate: "2024-11-05",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop&crop=center",
      featured: false,
      content: `
        <p>Our new state-of-the-art pickleball facility is officially open for all residents. The facility features four regulation courts with professional-grade surfaces and lighting for evening play.</p>

        <p>Join our weekly tournament series beginning December 1st. Registration is now open at the clubhouse or online through the resident portal.</p>
      `
    },
    {
      id: 3,
      title: "Holiday Season Security & Access Updates",
      excerpt: "Important information about guest policies and security protocols during the holiday season.",
      category: "Security",
      author: "Security Office",
      publishDate: "2024-11-03",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop&crop=center",
      featured: false,
      content: `
        <p>As we approach the holiday season, please note updated protocols for guest access and deliveries. All guests must be pre-registered through the resident portal or by calling the security office at (555) 123-SAFE.</p>

        <p>Package delivery hours remain 8 AM - 6 PM daily. For after-hours deliveries, please coordinate with our concierge service.</p>
      `
    },
    {
      id: 4,
      title: "Exclusive Wine Tasting Event - December 15th",
      excerpt: "Join us for an intimate wine tasting featuring rare vintages from Bordeaux, hosted by Master Sommelier Catherine Wells.",
      category: "Events",
      author: "Events Committee",
      publishDate: "2024-10-28",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=400&fit=crop&crop=center",
      featured: true,
      content: `
        <p>Mark your calendars for an exceptional evening of wine appreciation on December 15th at 7 PM in the private dining room.</p>

        <p>Master Sommelier Catherine Wells will guide guests through a curated selection of rare Bordeaux vintages, sharing insights into terroir, vintage characteristics, and proper aging techniques.</p>

        <p>Limited to 24 residents. RSVP required by December 10th. Contact the concierge to reserve your spot.</p>
      `
    }
  ]
}

// Lifecycle
onMounted(() => {
  loadSpotlights()
})
</script>

<style scoped>
.spotlights-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding-bottom: var(--bottom-nav-height);
}

/* Header Styling */
.spotlights-header {
  padding: var(--space-16) 0 var(--space-12);
  background: var(--color-bg-luxury);
  text-align: center;
}

.page-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-4);
  letter-spacing: var(--letter-spacing-tight);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-style: italic;
  max-width: 600px;
  margin: 0 auto;
}

/* Featured Spotlight */
.featured-spotlight {
  margin-bottom: var(--space-16);
}

.spotlight-hero {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.hero-image {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: var(--space-10);
  color: white;
}

.spotlight-category {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-bg-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-4);
}

.hero-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-4);
  line-height: var(--line-height-tight);
}

.hero-excerpt {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-6);
  opacity: 0.9;
}

.btn-read-more {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-all);
  font-size: var(--font-size-base);
}

.btn-read-more:hover {
  background: var(--color-primary-light);
  transform: translateY(-2px);
}

/* Spotlight Grid */
.spotlights-grid {
  padding: var(--space-16) 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-8);
}

.spotlight-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-all);
  box-shadow: var(--shadow-base);
}

.spotlight-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-slow);
}

.spotlight-card:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  pointer-events: none;
}

.card-content {
  padding: var(--space-6);
}

.card-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-tight);
}

.card-excerpt {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-4);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.author {
  font-weight: var(--font-weight-medium);
}

/* Modal Styling */
.spotlight-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
}

.modal-content {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: var(--font-size-xl);
  cursor: pointer;
  z-index: 1;
  transition: var(--transition-all);
}

.close-btn:hover {
  background: var(--color-primary-light);
}

.article-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.article-meta {
  padding: var(--space-8);
}

.article-category {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-bg-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  margin-bottom: var(--space-4);
}

.article-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-tight);
}

.article-byline {
  color: var(--color-text-tertiary);
  font-style: italic;
}

.article-content {
  padding: 0 var(--space-8) var(--space-8);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.article-content h3 {
  font-family: var(--font-family-heading);
  color: var(--color-primary);
  margin-top: var(--space-8);
  margin-bottom: var(--space-4);
}

.article-content p {
  margin-bottom: var(--space-4);
}

/* Container */
.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .hero-overlay {
    padding: var(--space-6);
  }
}
</style>