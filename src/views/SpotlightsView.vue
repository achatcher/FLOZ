<template>
  <div class="spotlights-view">
    <TopBar title="Announcements" :show-back="true" />

    <main class="spotlights-content">
      <!-- Hero Section -->
      <header class="hero-section">
        <h1 class="hero-title">{{ pageTitle }}</h1>
        <p class="hero-subtitle">{{ pageSubtitle }}</p>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>Loading announcements...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-section">
        <div class="error-icon">⚠️</div>
        <h3>Unable to Load Announcements</h3>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadAnnouncements">Try Again</button>
      </div>

      <!-- Announcements Content -->
      <div v-else class="announcements-section">
        <!-- Featured Announcement -->
        <section v-if="featuredAnnouncement" class="featured-announcement">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
            Featured Announcement
          </h2>
          <div class="announcement-card featured" @click="openAnnouncement(featuredAnnouncement)">
            <div class="announcement-header">
              <h3 class="announcement-title">{{ featuredAnnouncement.title }}</h3>
              <span class="announcement-date">{{ formatDate(featuredAnnouncement.date) }}</span>
            </div>
            <div class="announcement-content">
              <p class="announcement-excerpt">{{ featuredAnnouncement.content }}</p>
              <div v-if="featuredAnnouncement.category" class="announcement-category">
                {{ featuredAnnouncement.category }}
              </div>
            </div>
            <div class="click-indicator">
              <span>Click for details</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </section>

        <!-- All Announcements -->
        <section class="all-announcements">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
            </svg>
            Recent Updates
          </h2>

          <div v-if="announcements.length === 0" class="empty-state">
            <div class="empty-icon">📢</div>
            <h3>No Announcements Yet</h3>
            <p>We'll share important updates and news here as they become available.</p>
          </div>

          <div v-else class="announcements-grid">
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="announcement-card"
              @click="openAnnouncement(announcement)"
            >
              <div class="announcement-header">
                <h3 class="announcement-title">{{ announcement.title }}</h3>
                <span class="announcement-date">{{ formatDate(announcement.date) }}</span>
              </div>
              <div class="announcement-content">
                <p class="announcement-excerpt">{{ announcement.content }}</p>
                <div v-if="announcement.category" class="announcement-category">
                  {{ announcement.category }}
                </div>
              </div>
              <div class="click-indicator">
                <span>Click for details</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <!-- Community Stats -->
        <section class="community-stats">
          <h2 class="section-title">
            <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L20.29 9.12L22 10.83V6H16Z"/>
            </svg>
            Community Updates
          </h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ communityStats.totalBusinesses }}+</div>
              <div class="stat-label">Local Partners</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ communityStats.categoryCount }}</div>
              <div class="stat-label">Categories</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ communityStats.recentUpdates }}</div>
              <div class="stat-label">Recent Updates</div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <BottomNav />

    <!-- Announcement Modal -->
    <AnnouncementModal
      :announcement="selectedAnnouncement"
      :is-visible="showModal"
      @close="closeModal"
      @action="handleAnnouncementAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import AnnouncementModal from '@/components/Community/AnnouncementModal.vue'
import { useAppConfig } from '@/composables/useAppConfig'

const { initializeApp, getCurrentBusinesses, getAppInfo } = useAppConfig()

// State management
const isLoading = ref(true)
const error = ref(null)
const announcements = ref([])
const showModal = ref(false)
const selectedAnnouncement = ref({})

// Dynamic content from app configuration
const pageTitle = computed(() => {
  const info = getAppInfo.value
  return `${info?.location?.city || 'Community'} Announcements`
})

const pageSubtitle = computed(() => {
  const info = getAppInfo.value
  return `Stay connected with local events, news, and community updates in ${info?.location?.city || 'your area'}`
})

// Featured announcement (most recent)
const featuredAnnouncement = computed(() => {
  return announcements.value.length > 0 ? announcements.value[0] : null
})

// Community statistics
const communityStats = computed(() => {
  const businesses = getCurrentBusinesses.value || []
  const categories = [...new Set(businesses.map(b => b.category))].filter(Boolean)

  return {
    totalBusinesses: businesses.length,
    categoryCount: categories.length,
    recentUpdates: announcements.value.length
  }
})

// Generate dynamic community announcements based on local data
const generateCommunityAnnouncements = () => {
  const info = getAppInfo.value
  const businesses = getCurrentBusinesses.value || []
  const location = info?.location?.city || 'Greenville'
  const now = new Date()

  const communityAnnouncements = []

  // Community Events
  communityAnnouncements.push({
    id: 'farmers-market',
    title: `${location} Saturday Farmers Market`,
    content: 'Join us every Saturday morning for fresh local produce, artisanal crafts, and live music in downtown.',
    fullContent: `Every Saturday from 8:00 AM to 2:00 PM, the ${location} community comes together at Main Street Park for our weekly farmers market.\n\nFeaturing over 30 local vendors, you'll find:\n• Fresh seasonal produce from local farms\n• Artisanal breads and baked goods\n• Handcrafted soaps and candles\n• Live acoustic music\n• Local honey and preserves\n• Fresh flowers and plants\n\nBring the whole family for a morning of community connection and support for local businesses!`,
    date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: 'Community Events',
    author: `${location} Parks & Recreation`,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop',
    details: {
      location: 'Main Street Park, Downtown',
      time: 'Saturdays 8:00 AM - 2:00 PM',
      contact: 'parks@greenville.gov',
      website: 'https://greenvillesc.gov/farmers-market'
    },
    actions: [
      { label: 'Get Directions', type: 'primary', url: 'https://maps.google.com/?q=Main+Street+Park+Greenville' },
      { label: 'Vendor Information', type: 'secondary', url: 'https://greenvillesc.gov/vendor-info' }
    ],
    featured: true
  })

  // Local Business Spotlight
  if (businesses.length > 0) {
    const featuredBusiness = businesses.find(b => b.tier === 'signature') || businesses[0]
    communityAnnouncements.push({
      id: 'business-spotlight',
      title: `Business Spotlight: ${featuredBusiness.name}`,
      content: `Celebrating local excellence with ${featuredBusiness.name}, a cornerstone of our ${location} business community.`,
      fullContent: `We're proud to spotlight ${featuredBusiness.name}, one of ${location}'s premier local businesses.\n\n${featuredBusiness.name} has been serving our community with excellence and dedication. Their commitment to quality and customer service makes them a valued partner in our local business ecosystem.\n\nVisit them today to experience what makes ${location}'s business community so special!`,
      date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      category: 'Business Spotlight',
      author: 'Community Relations',
      details: {
        location: featuredBusiness.address || `${location} Area`,
        contact: featuredBusiness.phone || 'Contact directly',
        website: featuredBusiness.website
      }
    })
  }

  // Infrastructure Updates
  communityAnnouncements.push({
    id: 'road-construction',
    title: 'Main Street Beautification Project',
    content: 'Temporary traffic adjustments as we enhance our downtown area with new sidewalks and landscaping.',
    fullContent: `The ${location} Department of Public Works has begun the Main Street Beautification Project to enhance our downtown corridor.\n\nProject Details:\n• New decorative sidewalks and crosswalks\n• Enhanced street lighting\n• Native plant landscaping\n• Improved accessibility features\n• Dedicated bike lanes\n\nThe project is expected to be completed by the end of next month. We appreciate your patience as we work to make our downtown area even more beautiful and accessible.\n\nAlternate routes are available via Oak Street and Park Avenue.`,
    date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    category: 'Infrastructure',
    author: `${location} Public Works`,
    details: {
      location: 'Main Street (1st Ave to 5th Ave)',
      time: 'Daily 7:00 AM - 5:00 PM',
      contact: '(864) 467-4500'
    },
    actions: [
      { label: 'Project Updates', type: 'primary', url: 'https://greenvillesc.gov/construction-updates' }
    ]
  })

  // Community Programs
  communityAnnouncements.push({
    id: 'youth-programs',
    title: 'Fall Youth Sports Registration Open',
    content: 'Registration is now open for fall youth soccer, basketball, and swimming programs.',
    fullContent: `${location} Parks and Recreation is excited to announce registration for our fall youth sports programs!\n\nPrograms Available:\n• Youth Soccer (ages 5-12)\n• Basketball Skills Camp (ages 8-16)\n• Swimming Lessons (ages 4-adult)\n• Tennis Clinics (ages 6-14)\n\nAll programs are coached by certified instructors and focus on skill development, teamwork, and fun. Scholarships are available for families in need.\n\nRegister early as spots fill up quickly!`,
    date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    category: 'Youth Programs',
    author: `${location} Parks & Recreation`,
    details: {
      location: 'Community Center & Various Parks',
      time: 'Weekends & After School',
      contact: '(864) 467-4355',
      website: 'https://greenvillesc.gov/youth-sports'
    },
    actions: [
      { label: 'Register Now', type: 'primary', url: 'https://greenvillesc.gov/register' },
      { label: 'Schedule Info', type: 'secondary', url: 'https://greenvillesc.gov/schedules' }
    ]
  })

  // Local News
  communityAnnouncements.push({
    id: 'library-events',
    title: 'Library Fall Reading Series',
    content: 'Join us for author readings, book clubs, and literary discussions throughout the fall season.',
    fullContent: `The ${location} Public Library is hosting its annual Fall Reading Series with exciting events for all ages.\n\nUpcoming Events:\n• Author Meet & Greets every Friday at 7 PM\n• Children's Story Time - Wednesdays 10 AM\n• Adult Book Club - First Monday of each month\n• Teen Writing Workshop - Saturdays 2 PM\n• Local History Lectures - Third Thursday monthly\n\nAll events are free and open to the public. Light refreshments will be provided. The library is committed to fostering a love of reading and lifelong learning in our community.`,
    date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: 'Education & Culture',
    author: `${location} Public Library`,
    details: {
      location: '301 College Street',
      time: 'Various - see schedule',
      contact: '(864) 467-4300',
      website: 'https://greenvillelibrary.org'
    },
    actions: [
      { label: 'Event Calendar', type: 'primary', url: 'https://greenvillelibrary.org/events' }
    ]
  })

  return communityAnnouncements.sort((a, b) => b.date - a.date)
}

// Load announcements data
const loadAnnouncements = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Initialize app configuration first
    await initializeApp()

    // Generate dynamic community announcements based on current app data
    announcements.value = generateCommunityAnnouncements()

    console.log('✅ Announcements loaded successfully:', announcements.value.length)
  } catch (err) {
    error.value = `Failed to load announcements: ${err.message}`
    console.error('❌ Announcements loading error:', err)
  } finally {
    isLoading.value = false
  }
}

// Format date for display
const formatDate = (date) => {
  if (!date) return ''

  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Modal functions
const openAnnouncement = (announcement) => {
  selectedAnnouncement.value = announcement
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedAnnouncement.value = {}
}

const handleAnnouncementAction = (action) => {
  console.log('Announcement action:', action)
  // Handle custom actions if needed
}

// Initialize component
onMounted(async () => {
  await loadAnnouncements()
})
</script>

<style scoped>
/* ===== GLOBAL STYLES ===== */
.spotlights-view {
  min-height: 100vh;
  background: var(--color-bg-luxury);
  padding-bottom: 80px;
}

.spotlights-content {
  padding: 32px 20px;
  max-width: 800px;
  margin: 0 auto;
}

/* ===== HERO SECTION ===== */
.hero-section {
  text-align: center;
  margin-bottom: 48px;
}

.hero-title {
  color: var(--color-text-primary);
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.3;
  font-family: var(--font-family-heading);
}

.hero-subtitle {
  color: var(--color-text-secondary);
  font-size: 17px;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* ===== LOADING & ERROR STATES ===== */
.loading-section, .error-section {
  text-align: center;
  padding: 64px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border-primary);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-section {
  color: var(--color-text-secondary);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* ===== SECTION STYLES ===== */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
  font-family: var(--font-family-heading);
}

.section-icon {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
}

/* ===== ANNOUNCEMENTS ===== */
.featured-announcement {
  margin-bottom: 48px;
}

.all-announcements {
  margin-bottom: 48px;
}

.announcements-grid {
  display: grid;
  gap: 20px;
}

.announcement-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: 24px;
  transition: var(--transition-all);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  position: relative;
}

.announcement-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-primary);
}

.announcement-card.featured {
  background: linear-gradient(135deg, var(--color-primary-alpha-5), var(--color-bg-secondary));
  border-color: var(--color-primary-alpha-30);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.announcement-title {
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  font-family: var(--font-family-heading);
}

.announcement-date {
  color: var(--color-text-tertiary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.announcement-content {
  margin-bottom: 12px;
}

.announcement-excerpt {
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.announcement-category {
  display: inline-block;
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== CLICK INDICATOR ===== */
.click-indicator {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 12px;
  color: var(--color-text-tertiary);
  font-size: 12px;
  font-weight: 500;
  opacity: 0.7;
  transition: var(--transition-all);
}

.announcement-card:hover .click-indicator {
  opacity: 1;
  color: var(--color-primary);
}

.click-indicator svg {
  width: 14px;
  height: 14px;
  transition: var(--transition-all);
}

.announcement-card:hover .click-indicator svg {
  transform: translateX(2px);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

/* ===== COMMUNITY STATS ===== */
.community-stats {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-xl);
  padding: 24px 16px;
  text-align: center;
  transition: var(--transition-all);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-primary);
}

.stat-number {
  color: var(--color-text-primary);
  font-size: 28px;
  font-weight: 800;
  display: block;
  margin-bottom: 8px;
  font-family: var(--font-family-heading);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-all);
  text-decoration: none;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.btn-primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-primary);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 640px) {
  .spotlights-content {
    padding: 24px 16px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 22px;
  }

  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .announcement-title {
    font-size: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px 16px;
  }

  .stat-number {
    font-size: 24px;
  }
}

@media (min-width: 768px) {
  .spotlights-content {
    padding: 40px 20px;
  }

  .announcements-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}
</style>