<!--
/**
 * Real Estate View - Luxury Real Estate Agencies & Agents
 *
 * This component displays a curated collection of premium real estate
 * agencies and agents serving The Hills community. Features elegant
 * design with tier-based sorting and comprehensive agency information.
 *
 * Features:
 * - Tiered agency listings (Signature, Premier, Curated)
 * - Specialized service categories
 * - Agent contact information and specialties
 * - Elegant brand-consistent styling
 * - Responsive grid layout
 *
 * @component RealEstateView
 * @requires useBusinessStore - For real estate agency data
 */
-->

<template>
  <div class="real-estate-view">
    <!-- Elegant Page Header -->
    <header class="real-estate-header">
      <div class="container">
        <h1 class="page-title">Luxury Real Estate</h1>
        <p class="page-subtitle">Premier agencies and agents serving The Hills community with distinction and expertise</p>

        <!-- Service Categories Filter -->
        <div class="service-categories">
          <button
            v-for="category in serviceCategories"
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

    <!-- Real Estate Agencies Grid -->
    <section class="agencies-section">
      <div class="container">

        <!-- Signature Tier Agencies -->
        <div v-if="signatureAgencies.length > 0" class="tier-section">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              Signature Agencies
            </h2>
            <p class="tier-description">Premier luxury real estate specialists with exclusive market access</p>
          </div>

          <div class="agencies-grid signature-grid">
            <article
              v-for="agency in signatureAgencies"
              :key="agency.id"
              class="agency-card signature"
              @click="viewAgencyDetails(agency)"
            >
              <div class="card-header">
                <div class="agency-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
                  </svg>
                </div>
                <div class="tier-badge signature">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                  Signature
                </div>
              </div>

              <div class="card-content">
                <h3 class="agency-name">{{ agency.name }}</h3>
                <p class="agency-description">{{ agency.description }}</p>

                <div class="specialties">
                  <span
                    v-for="specialty in agency.specialties?.slice(0, 3)"
                    :key="specialty"
                    class="specialty-tag"
                  >
                    {{ specialty }}
                  </span>
                </div>

                <div class="agency-badges">
                  <span
                    v-for="badge in agency.badges?.slice(0, 2)"
                    :key="badge"
                    class="badge"
                  >
                    {{ badge }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="contact-info">
                  <a :href="`tel:${agency.contact.phone}`" class="phone-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                    </svg>
                    {{ agency.contact.phone }}
                  </a>
                  <a
                    v-if="agency.contact.website"
                    :href="agency.contact.website"
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

        <!-- Premier Tier Agencies -->
        <div v-if="premierAgencies.length > 0" class="tier-section">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5L8.5 12L12 4L15.5 12L21 5L19 16H5Z"/>
              </svg>
              Premier Agencies
            </h2>
            <p class="tier-description">Established agencies with proven expertise and market knowledge</p>
          </div>

          <div class="agencies-grid premier-grid">
            <article
              v-for="agency in premierAgencies"
              :key="agency.id"
              class="agency-card premier"
              @click="viewAgencyDetails(agency)"
            >
              <div class="card-header">
                <div class="agency-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
                  </svg>
                </div>
                <div class="tier-badge premier">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16L3 5L8.5 12L12 4L15.5 12L21 5L19 16H5Z"/>
                  </svg>
                  Premier
                </div>
              </div>

              <div class="card-content">
                <h3 class="agency-name">{{ agency.name }}</h3>
                <p class="agency-description">{{ agency.description }}</p>

                <div class="specialties">
                  <span
                    v-for="specialty in agency.specialties?.slice(0, 3)"
                    :key="specialty"
                    class="specialty-tag"
                  >
                    {{ specialty }}
                  </span>
                </div>

                <div class="agency-badges">
                  <span
                    v-for="badge in agency.badges?.slice(0, 2)"
                    :key="badge"
                    class="badge"
                  >
                    {{ badge }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="contact-info">
                  <a :href="`tel:${agency.contact.phone}`" class="phone-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                    </svg>
                    {{ agency.contact.phone }}
                  </a>
                  <a
                    v-if="agency.contact.website"
                    :href="agency.contact.website"
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

        <!-- Curated Tier Agencies -->
        <div v-if="curatedAgencies.length > 0" class="tier-section">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
              </svg>
              Curated Agencies
            </h2>
            <p class="tier-description">Trusted local agencies providing personalized service</p>
          </div>

          <div class="agencies-grid curated-grid">
            <article
              v-for="agency in curatedAgencies"
              :key="agency.id"
              class="agency-card curated"
              @click="viewAgencyDetails(agency)"
            >
              <div class="card-header">
                <div class="agency-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
                  </svg>
                </div>
                <div class="tier-badge curated">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
                  </svg>
                  Curated
                </div>
              </div>

              <div class="card-content">
                <h3 class="agency-name">{{ agency.name }}</h3>
                <p class="agency-description">{{ agency.description }}</p>

                <div class="specialties">
                  <span
                    v-for="specialty in agency.specialties?.slice(0, 3)"
                    :key="specialty"
                    class="specialty-tag"
                  >
                    {{ specialty }}
                  </span>
                </div>

                <div class="agency-badges">
                  <span
                    v-for="badge in agency.badges?.slice(0, 2)"
                    :key="badge"
                    class="badge"
                  >
                    {{ badge }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="contact-info">
                  <a :href="`tel:${agency.contact.phone}`" class="phone-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                    </svg>
                    {{ agency.contact.phone }}
                  </a>
                  <a
                    v-if="agency.contact.website"
                    :href="agency.contact.website"
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

    <!-- Agency Detail Modal -->
    <div v-if="selectedAgency" class="agency-modal" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>

        <div class="modal-header">
          <h2 class="agency-title">{{ selectedAgency.name }}</h2>
          <div class="modal-tier-badge" :class="selectedAgency.listing_tier">
            {{ selectedAgency.listing_tier.charAt(0).toUpperCase() + selectedAgency.listing_tier.slice(1) }}
          </div>
        </div>

        <div class="modal-body">
          <p class="agency-full-description">{{ selectedAgency.description }}</p>

          <div class="modal-section">
            <h4>Specializations</h4>
            <div class="modal-specialties">
              <span
                v-for="specialty in selectedAgency.specialties"
                :key="specialty"
                class="specialty-chip"
              >
                {{ specialty }}
              </span>
            </div>
          </div>

          <div v-if="selectedAgency.services" class="modal-section">
            <h4>Services</h4>
            <div class="services-grid">
              <div
                v-for="service in selectedAgency.services"
                :key="service"
                class="service-item"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
                {{ service }}
              </div>
            </div>
          </div>

          <div class="modal-section">
            <h4>Contact Information</h4>
            <div class="contact-details">
              <a :href="`tel:${selectedAgency.contact.phone}`" class="contact-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                </svg>
                {{ selectedAgency.contact.phone }}
              </a>

              <a
                v-if="selectedAgency.contact.email"
                :href="`mailto:${selectedAgency.contact.email}`"
                class="contact-item"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                </svg>
                {{ selectedAgency.contact.email }}
              </a>

              <a
                v-if="selectedAgency.contact.website"
                :href="selectedAgency.contact.website"
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
 * Real Estate View Component Logic
 *
 * Handles the display and interaction for luxury real estate agencies.
 * Provides filtering, tier-based organization, and detailed agency information.
 */

import { ref, computed, onMounted } from 'vue'
import { useBusinessStore } from '@/stores/businessStore'
import BottomNav from '@/components/Navigation/BottomNav.vue'

// Store and reactive state
const businessStore = useBusinessStore()
const selectedCategory = ref('all')
const selectedAgency = ref(null)

// Service categories for filtering
const serviceCategories = [
  {
    value: 'all',
    label: 'All Services',
    icon: 'M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12'
  },
  {
    value: 'sales',
    label: 'Luxury Sales',
    icon: 'M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z'
  },
  {
    value: 'rentals',
    label: 'Vacation Rentals',
    icon: 'M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14M12.6 10C11.8 7.7 9.6 6 7 6C3.7 6 1 8.7 1 12S3.7 18 7 18C9.6 18 11.8 16.3 12.6 14H16V18H20V14H23V10H12.6Z'
  },
  {
    value: 'management',
    label: 'Property Management',
    icon: 'M12 3L2 12H5V20H19V12H22L12 3ZM12 8.75L17 13.75V18H7V13.75L12 8.75Z'
  }
]

// Computed properties for filtered agencies by tier
const realEstateAgencies = computed(() => {
  const agencies = businessStore.getBusinessesByCategory('Luxury Real Estate')

  if (selectedCategory.value === 'all') {
    return agencies
  }

  return agencies.filter(agency => {
    const subcategory = agency.subcategory?.toLowerCase()
    switch (selectedCategory.value) {
      case 'sales':
        return subcategory?.includes('sales')
      case 'rentals':
        return subcategory?.includes('rental')
      case 'management':
        return subcategory?.includes('management')
      default:
        return true
    }
  })
})

const signatureAgencies = computed(() =>
  realEstateAgencies.value.filter(agency => agency.listing_tier === 'signature')
)

const premierAgencies = computed(() =>
  realEstateAgencies.value.filter(agency => agency.listing_tier === 'premier')
)

const curatedAgencies = computed(() =>
  realEstateAgencies.value.filter(agency => agency.listing_tier === 'curated')
)

// Methods
const viewAgencyDetails = (agency) => {
  selectedAgency.value = agency
}

const closeModal = () => {
  selectedAgency.value = null
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
 * Real Estate View Styles
 *
 * Elegant styling for luxury real estate agency listings with
 * tier-based visual hierarchy and sophisticated design elements.
 */

/* ===== BASE LAYOUT ===== */
.real-estate-view {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-bottom: var(--bottom-nav-height);
}

/* ===== HEADER SECTION ===== */
.real-estate-header {
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

/* ===== SERVICE CATEGORY FILTERS ===== */
.service-categories {
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

/* ===== AGENCIES SECTION ===== */
.agencies-section {
  padding: var(--space-16) 0;
}

.container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* ===== TIER SECTIONS ===== */
.tier-section {
  margin-bottom: var(--space-16);
}

.tier-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.tier-title {
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

.tier-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.tier-description {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-base);
  max-width: 500px;
  margin: 0 auto;
}

/* ===== AGENCIES GRID ===== */
.agencies-grid {
  display: grid;
  gap: var(--space-6);
}

.signature-grid {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.premier-grid {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.curated-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

/* ===== AGENCY CARDS ===== */
.agency-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-all);
  position: relative;
  overflow: hidden;
}

.agency-card::before {
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

.agency-card:hover::before {
  transform: scaleX(1);
}

.agency-card:hover {
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

.agency-logo {
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

.tier-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  margin-top: var(--space-2);
}

.tier-badge svg {
  width: 12px;
  height: 12px;
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

.card-content {
  margin-bottom: var(--space-5);
}

.agency-name {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-tight);
}

.agency-description {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-4);
}

.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.specialty-tag {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.agency-badges {
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
.agency-modal {
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

.agency-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal-tier-badge {
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
  margin-top: var(--space-2);
}

.modal-tier-badge.signature {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px var(--color-primary-alpha-30);
}

.modal-tier-badge.premier {
  background: var(--color-platinum);
  color: var(--color-bg-primary);
  box-shadow: 0 2px 8px rgba(229, 228, 226, 0.3);
}

.modal-tier-badge.curated {
  background: var(--color-midnight);
  color: var(--color-text-primary);
  box-shadow: 0 2px 8px rgba(25, 25, 112, 0.3);
}

.modal-body {
  line-height: var(--line-height-relaxed);
}

.agency-full-description {
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

.modal-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.specialty-chip {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2);
}

.service-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.service-item svg {
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

  .service-categories {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: var(--space-2);
  }

  .category-filter {
    white-space: nowrap;
  }

  .agencies-grid {
    grid-template-columns: 1fr;
  }

  .agency-card {
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
  .tier-title {
    font-size: var(--font-size-xl);
  }

  .agency-name {
    font-size: var(--font-size-lg);
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>