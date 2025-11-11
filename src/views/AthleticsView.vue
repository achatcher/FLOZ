<!--
/**
 * Athletics View - Premier Golf & Pickleball Facilities
 *
 * This component displays a curated collection of elite athletic facilities
 * serving The Hills community. Features elegant design with sport-based
 * filtering and comprehensive facility information.
 *
 * Features:
 * - Sport-based facility filtering (Golf, Pickleball, Tennis)
 * - Tiered facility listings (Championship, Resort, Club)
 * - Facility details with amenities and contact information
 * - Elegant brand-consistent styling
 * - Responsive grid layout
 *
 * @component AthleticsView
 * @requires useBusinessStore - For athletic facility data
 */
-->

<template>
  <div class="athletics-view">
    <!-- Elegant Page Header -->
    <header class="athletics-header">
      <div class="container">
        <h1 class="page-title">Athletic Excellence</h1>
        <p class="page-subtitle">Championship golf courses and exclusive pickleball courts for discerning athletes</p>

        <!-- Sport Categories Filter -->
        <div class="sport-categories">
          <button
            v-for="category in sportCategories"
            :key="category.value"
            :class="['category-filter', { active: selectedSport === category.value }]"
            @click="selectedSport = category.value"
          >
            <svg class="category-icon" viewBox="0 0 24 24" fill="currentColor">
              <path :d="category.icon"/>
            </svg>
            <span>{{ category.label }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Athletic Facilities Section -->
    <section class="facilities-section">
      <div class="container">

        <!-- Golf Courses -->
        <div v-if="golfFacilities.length > 0 && (selectedSport === 'all' || selectedSport === 'golf')" class="sport-section">
          <div class="sport-header">
            <h2 class="sport-title">
              <svg class="sport-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM11 7V13L16.25 16.15L17 14.92L12.5 12.25V7H11Z"/>
              </svg>
              Championship Golf Courses
            </h2>
            <p class="sport-description">World-class golf facilities designed by renowned architects</p>
          </div>

          <div class="facilities-grid">
            <article
              v-for="facility in golfFacilities"
              :key="facility.id"
              class="facility-card golf"
              @click="viewFacilityDetails(facility)"
            >
              <div class="card-header">
                <div class="facility-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z"/>
                  </svg>
                </div>
                <div class="facility-type-badge golf">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                  Golf
                </div>
              </div>

              <div class="card-content">
                <h3 class="facility-name">{{ facility.name }}</h3>
                <p class="facility-description">{{ facility.description }}</p>

                <div class="amenities-list">
                  <span
                    v-for="amenity in facility.amenities?.slice(0, 3)"
                    :key="amenity"
                    class="amenity-tag"
                  >
                    {{ amenity }}
                  </span>
                </div>

                <div class="facility-badges">
                  <span
                    v-for="badge in facility.badges?.slice(0, 2)"
                    :key="badge"
                    class="badge"
                  >
                    {{ badge }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="contact-info">
                  <a :href="`tel:${facility.contact.phone}`" class="phone-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                    </svg>
                    {{ facility.contact.phone }}
                  </a>
                  <a
                    v-if="facility.contact.website"
                    :href="facility.contact.website"
                    target="_blank"
                    class="website-link"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12S16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12S19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12S9.56 10.66 9.66 10H14.34C14.44 10.66 14.5 11.32 14.5 12S14.44 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8.03 8M5.08 16H8.03C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8Z"/>
                    </svg>
                    Visit Website
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Pickleball Courts -->
        <div v-if="pickleballFacilities.length > 0 && (selectedSport === 'all' || selectedSport === 'pickleball')" class="sport-section">
          <div class="sport-header">
            <h2 class="sport-title">
              <svg class="sport-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 9H15V15H9V9ZM11 11V13H13V11H11ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
              </svg>
              Elite Pickleball Courts
            </h2>
            <p class="sport-description">Premium pickleball facilities with professional-grade courts</p>
          </div>

          <div class="facilities-grid">
            <article
              v-for="facility in pickleballFacilities"
              :key="facility.id"
              class="facility-card pickleball"
              @click="viewFacilityDetails(facility)"
            >
              <div class="card-header">
                <div class="facility-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 9H15V15H9V9ZM11 11V13H13V11H11Z"/>
                  </svg>
                </div>
                <div class="facility-type-badge pickleball">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 9H15V15H9V9ZM11 11V13H13V11H11ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"/>
                  </svg>
                  Pickleball
                </div>
              </div>

              <div class="card-content">
                <h3 class="facility-name">{{ facility.name }}</h3>
                <p class="facility-description">{{ facility.description }}</p>

                <div class="amenities-list">
                  <span
                    v-for="amenity in facility.amenities?.slice(0, 3)"
                    :key="amenity"
                    class="amenity-tag"
                  >
                    {{ amenity }}
                  </span>
                </div>

                <div class="facility-badges">
                  <span
                    v-for="badge in facility.badges?.slice(0, 2)"
                    :key="badge"
                    class="badge"
                  >
                    {{ badge }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="contact-info">
                  <a :href="`tel:${facility.contact.phone}`" class="phone-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                    </svg>
                    {{ facility.contact.phone }}
                  </a>
                  <a
                    v-if="facility.contact.website"
                    :href="facility.contact.website"
                    target="_blank"
                    class="website-link"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12S16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12S19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12S9.56 10.66 9.66 10H14.34C14.44 10.66 14.5 11.32 14.5 12S14.44 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8.03 8M5.08 16H8.03C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8Z"/>
                    </svg>
                    Visit Website
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>

      </div>
    </section>

    <!-- Facility Detail Modal -->
    <div v-if="selectedFacility" class="facility-modal" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>

        <div class="modal-header">
          <h2 class="facility-title">{{ selectedFacility.name }}</h2>
          <div class="modal-type-badge" :class="getFacilityType(selectedFacility)">
            {{ getFacilityTypeLabel(selectedFacility) }}
          </div>
        </div>

        <div class="modal-body">
          <p class="facility-full-description">{{ selectedFacility.description }}</p>

          <div class="modal-section">
            <h4>Amenities</h4>
            <div class="modal-amenities">
              <span
                v-for="amenity in selectedFacility.amenities"
                :key="amenity"
                class="amenity-chip"
              >
                {{ amenity }}
              </span>
            </div>
          </div>

          <div v-if="selectedFacility.badges" class="modal-section">
            <h4>Features</h4>
            <div class="features-grid">
              <div
                v-for="feature in selectedFacility.badges"
                :key="feature"
                class="feature-item"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
                {{ feature }}
              </div>
            </div>
          </div>

          <div class="modal-section">
            <h4>Contact Information</h4>
            <div class="contact-details">
              <a :href="`tel:${selectedFacility.contact.phone}`" class="contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                </svg>
                {{ selectedFacility.contact.phone }}
              </a>

              <a
                v-if="selectedFacility.contact.email"
                :href="`mailto:${selectedFacility.contact.email}`"
                class="contact-item"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                </svg>
                {{ selectedFacility.contact.email }}
              </a>

              <a
                v-if="selectedFacility.contact.website"
                :href="selectedFacility.contact.website"
                target="_blank"
                class="contact-item"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.36 14C16.44 13.34 16.5 12.68 16.5 12S16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12S19.9 13.36 19.74 14M14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12S9.56 10.66 9.66 10H14.34C14.44 10.66 14.5 11.32 14.5 12S14.44 13.34 14.34 14M12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.91C13.5 17.43 12.83 18.76 12 19.96M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8.03 8M5.08 16H8.03C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8Z"/>
                </svg>
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
/**
 * Athletics View Component Logic
 *
 * Handles the display and interaction for elite athletic facilities.
 * Provides sport-based filtering and comprehensive facility information.
 */

import { ref, computed, onMounted } from 'vue'
import { useBusinessStore } from '@/stores/businessStore'
import BottomNav from '@/components/Navigation/BottomNav.vue'

// Store and reactive state
const businessStore = useBusinessStore()
const selectedSport = ref('all')
const selectedFacility = ref(null)

// Sport categories for filtering
const sportCategories = [
  {
    value: 'all',
    label: 'All Sports',
    icon: 'M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12'
  },
  {
    value: 'golf',
    label: 'Golf',
    icon: 'M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z'
  },
  {
    value: 'pickleball',
    label: 'Pickleball',
    icon: 'M9 9H15V15H9V9ZM11 11V13H13V11H11ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z'
  }
]

// Computed properties for filtering facilities by sport type
const golfFacilities = computed(() => {
  return businessStore.getBusinessesByCategory('Golf & Country Clubs')
})

// Mock pickleball facilities data - in a real app this would come from the business store
const pickleballFacilities = computed(() => {
  return [
    {
      id: 'pb1',
      name: 'Hills Country Club Pickleball Courts',
      category: 'Pickleball',
      subcategory: 'Premium Courts',
      description: 'Eight championship-grade pickleball courts with professional lighting and premium surfacing.',
      amenities: ['8 Courts', 'Professional Lighting', 'Pro Shop', 'Lessons Available', 'Tournament Hosting'],
      badges: ['USA Pickleball Certified', 'Tournament Venue', 'Professional Instruction'],
      listing_tier: 'signature',
      contact: {
        phone: '(573) 365-8521',
        email: 'pickleball@hillscc.com',
        website: 'https://hillscountryclub.com/pickleball'
      },
      location: {
        address: '1234 Club Drive',
        city: 'Lake of the Ozarks',
        state: 'MO',
        zipCode: '65049'
      }
    },
    {
      id: 'pb2',
      name: 'Lakeside Racquet & Pickleball Club',
      category: 'Pickleball',
      subcategory: 'Indoor/Outdoor Courts',
      description: 'Premier pickleball facility featuring both indoor and outdoor courts with lake views.',
      amenities: ['6 Outdoor Courts', '4 Indoor Courts', 'Climate Control', 'Pro Shop', 'Coaching'],
      badges: ['Year-Round Play', 'Lake Views', 'Professional Coaching'],
      listing_tier: 'premier',
      contact: {
        phone: '(573) 365-9876',
        email: 'info@lakesideracquet.com',
        website: 'https://lakesideracquet.com'
      },
      location: {
        address: '5678 Lakefront Blvd',
        city: 'Osage Beach',
        state: 'MO',
        zipCode: '65065'
      }
    },
    {
      id: 'pb3',
      name: 'Pinnacle Pickleball Academy',
      category: 'Pickleball',
      subcategory: 'Training Facility',
      description: 'Elite training facility dedicated to advancing pickleball skills for players of all levels.',
      amenities: ['4 Courts', 'Video Analysis', 'Fitness Center', 'Equipment Rental', 'Private Lessons'],
      badges: ['USAPA Certified Instructors', 'Performance Training', 'All Skill Levels'],
      listing_tier: 'curated',
      contact: {
        phone: '(573) 365-5432',
        email: 'academy@pinnaclepickleball.com',
        website: 'https://pinnaclepickleball.com'
      },
      location: {
        address: '9012 Sports Center Way',
        city: 'Camdenton',
        state: 'MO',
        zipCode: '65020'
      }
    }
  ]
})

// Methods
const viewFacilityDetails = (facility) => {
  selectedFacility.value = facility
}

const closeModal = () => {
  selectedFacility.value = null
}

const getFacilityType = (facility) => {
  if (facility.category === 'Golf & Country Clubs') return 'golf'
  if (facility.category === 'Pickleball') return 'pickleball'
  return 'general'
}

const getFacilityTypeLabel = (facility) => {
  if (facility.category === 'Golf & Country Clubs') return 'Golf Course'
  if (facility.category === 'Pickleball') return 'Pickleball Facility'
  return 'Athletic Facility'
}

// Initialize data on component mount
onMounted(() => {
  if (!businessStore.initialized) {
    businessStore.loadData()
  }
})
</script>

<style scoped>
/**
 * Athletics View Styles
 *
 * Elegant styling for athletic facility listings with sport-based
 * visual hierarchy and sophisticated design elements.
 */

/* ===== BASE LAYOUT ===== */
.athletics-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-bottom: var(--bottom-nav-height);
}

/* ===== HEADER SECTION ===== */
.athletics-header {
  background: var(--color-bg-luxury);
  padding: var(--space-16) 0 var(--space-12);
  text-align: center;
  border-bottom: 1px solid var(--color-border-primary);
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
  margin: 0 auto var(--space-8);
  line-height: var(--line-height-relaxed);
}

/* ===== SPORT CATEGORY FILTERS ===== */
.sport-categories {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.category-filter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-all);
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
}

.category-filter:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary-alpha-30);
}

.category-filter.active {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border-color: var(--color-primary);
}

.category-icon {
  width: 16px;
  height: 16px;
}

/* ===== FACILITIES SECTION ===== */
.facilities-section {
  padding: var(--space-16) 0;
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* ===== SPORT SECTIONS ===== */
.sport-section {
  margin-bottom: var(--space-16);
}

.sport-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.sport-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.sport-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.sport-description {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-base);
  max-width: 500px;
  margin: 0 auto;
}

/* ===== FACILITIES GRID ===== */
.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-6);
}

/* ===== FACILITY CARDS ===== */
.facility-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-all);
  position: relative;
  overflow: hidden;
}

.facility-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: var(--transition-all);
}

.facility-card:hover::before {
  transform: scaleX(1);
}

.facility-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-primary-lg);
  border-color: var(--color-primary-alpha-30);
}

/* ===== CARD CONTENT ===== */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.facility-logo {
  width: 48px;
  height: 48px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.facility-type-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.facility-type-badge svg {
  width: 12px;
  height: 12px;
}

.facility-type-badge.golf {
  background: var(--color-success);
  color: var(--color-bg-primary);
}

.facility-type-badge.pickleball {
  background: var(--color-warning);
  color: var(--color-bg-primary);
}

.card-content {
  margin-bottom: var(--space-5);
}

.facility-name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-tight);
}

.facility-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-4);
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.amenity-tag {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.facility-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.badge {
  background: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.card-footer {
  border-top: 1px solid var(--color-border-secondary);
  padding-top: var(--space-4);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.phone-link,
.website-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: var(--transition-all);
}

.phone-link:hover,
.website-link:hover {
  color: var(--color-primary);
}

.phone-link svg,
.website-link svg {
  width: 14px;
  height: 14px;
}

/* ===== MODAL STYLES ===== */
.facility-modal {
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
  padding: var(--space-8);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: var(--color-bg-tertiary);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-all);
}

.close-btn:hover {
  background: var(--color-primary);
}

.close-btn svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-primary);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
  padding-right: var(--space-10);
}

.facility-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-type-badge {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.modal-type-badge.golf {
  background: var(--color-success);
  color: var(--color-bg-primary);
}

.modal-type-badge.pickleball {
  background: var(--color-warning);
  color: var(--color-bg-primary);
}

.modal-body {
  line-height: var(--line-height-relaxed);
}

.facility-full-description {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  font-size: var(--font-size-base);
}

.modal-section {
  margin-bottom: var(--space-6);
}

.modal-section h4 {
  font-family: var(--font-family-heading);
  color: var(--color-primary);
  margin-bottom: var(--space-3);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.modal-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.amenity-chip {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.feature-item svg {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-all);
}

.contact-item:hover {
  color: var(--color-primary);
}

.contact-item svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
  }

  .sport-categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--space-2);
  }

  .category-filter {
    white-space: nowrap;
  }

  .facilities-grid {
    grid-template-columns: 1fr;
  }

  .facility-card {
    padding: var(--space-4);
  }

  .card-header {
    flex-direction: column;
    gap: var(--space-3);
  }

  .modal-content {
    padding: var(--space-6);
  }

  .modal-header {
    flex-direction: column;
    gap: var(--space-2);
    align-items: flex-start;
  }

  .contact-info {
    flex-direction: column;
    gap: var(--space-3);
  }
}

@media (max-width: 480px) {
  .sport-title {
    font-size: var(--font-size-xl);
  }

  .facility-name {
    font-size: var(--font-size-lg);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>