<!--
/**
 * Wellness & Spa View - Luxury Wellness & Beauty Services
 *
 * This component displays a curated collection of premium wellness facilities
 * and beauty services serving the Greenville community. Features elegant design with
 * service-based filtering and comprehensive provider information.
 *
 * Features:
 * - Service-based facility filtering (All, Spa & Wellness, Fitness, Beauty)
 * - Tiered service listings (Signature, Premier, Curated)
 * - Detailed service information and amenities
 * - Elegant brand-consistent styling
 * - Responsive grid layout
 *
 * @component WellnessView
 * @requires useBusinessStore - For wellness facility data
 */
-->

<template>
  <div class="wellness-view">
    <!-- ===== HERO ADVERTISEMENT ===== -->
    <!-- MONETIZATION: Premium advertising space for wellness & spa businesses -->
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
              <span>Experience Luxury Wellness</span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Elegant Page Header -->
    <header class="wellness-header">
      <div class="container">
        <h1 class="page-title">Wellness & Beauty</h1>
        <p class="page-subtitle">Rejuvenating spas, expert salons, and holistic wellness centers for mind, body, and spirit</p>

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

    <!-- Wellness Facilities Section -->
    <section class="wellness-section">
      <div class="container">

        <!-- Signature Tier Facilities -->
        <div v-if="signatureFacilities.length > 0" class="tier-section">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
              Signature Wellness Experiences
            </h2>
            <p class="tier-description">Luxury wellness destinations offering exclusive treatments and premium services</p>
          </div>

          <div class="facilities-grid signature-grid">
            <article
              v-for="facility in signatureFacilities"
              :key="facility.id"
              class="facility-card signature"
              @click="viewFacilityDetails(facility)"
            >
              <div class="card-header">
                <div class="facility-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM16.24 7.76C15.07 6.59 13.54 6 12 6S8.93 6.59 7.76 7.76L9.17 9.17C10 8.34 11 8 12 8S14 8.34 14.83 9.17L16.24 7.76ZM12 17C15.87 17 19 13.87 19 10H17C17 12.76 14.76 15 12 15S7 12.76 7 10H5C5 13.87 8.13 17 12 17Z"/>
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
                <h3 class="facility-name">{{ facility.name }}</h3>
                <p class="facility-description">{{ facility.description }}</p>

                <div class="services-list">
                  <span
                    v-for="service in facility.services?.slice(0, 3)"
                    :key="service"
                    class="service-tag"
                  >
                    {{ service }}
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

        <!-- Premier Tier Facilities -->
        <div v-if="premierFacilities.length > 0" class="tier-section">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5L8.5 12L12 4L15.5 12L21 5L19 16H5Z"/>
              </svg>
              Premier Wellness Centers
            </h2>
            <p class="tier-description">Established wellness facilities with comprehensive services and expert practitioners</p>
          </div>

          <div class="facilities-grid premier-grid">
            <article
              v-for="facility in premierFacilities"
              :key="facility.id"
              class="facility-card premier"
              @click="viewFacilityDetails(facility)"
            >
              <div class="card-header">
                <div class="facility-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20Z"/>
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
                <h3 class="facility-name">{{ facility.name }}</h3>
                <p class="facility-description">{{ facility.description }}</p>

                <div class="services-list">
                  <span
                    v-for="service in facility.services?.slice(0, 3)"
                    :key="service"
                    class="service-tag"
                  >
                    {{ service }}
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

        <!-- Beauty Services Section -->
        <div v-if="beautyServices.length > 0" class="tier-section">
          <div class="tier-header">
            <h2 class="tier-title">
              <svg class="tier-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.59 10.76L11.76 11.93L13.5 10.19L14.5 11.19L13 12.69L11.19 10.88L10.05 12.02L12.81 14.78L17 10.59L21 9ZM11 16L8 13L6.18 14.82L2.81 11.45L1.39 12.87L6.18 17.66L11 16Z"/>
              </svg>
              Luxury Beauty Services
            </h2>
            <p class="tier-description">Expert hair salons and beauty specialists for the ultimate in personal grooming</p>
          </div>

          <div class="facilities-grid beauty-grid">
            <article
              v-for="service in beautyServices"
              :key="service.id"
              class="facility-card beauty"
              @click="viewFacilityDetails(service)"
            >
              <div class="card-header">
                <div class="facility-logo">
                  <svg class="logo-placeholder" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                  </svg>
                </div>
                <div class="tier-badge beauty">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                  </svg>
                  Beauty
                </div>
              </div>

              <div class="card-content">
                <h3 class="facility-name">{{ service.name }}</h3>
                <p class="facility-description">{{ service.description }}</p>

                <div class="services-list">
                  <span
                    v-for="serviceItem in service.services?.slice(0, 3)"
                    :key="serviceItem"
                    class="service-tag"
                  >
                    {{ serviceItem }}
                  </span>
                </div>

                <div class="facility-badges">
                  <span
                    v-for="badge in service.badges?.slice(0, 2)"
                    :key="badge"
                    class="badge"
                  >
                    {{ badge }}
                  </span>
                </div>
              </div>

              <div class="card-footer">
                <div class="contact-info">
                  <a :href="`tel:${service.contact.phone}`" class="phone-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
                    </svg>
                    {{ service.contact.phone }}
                  </a>
                  <a
                    v-if="service.contact.website"
                    :href="service.contact.website"
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
          <div class="modal-tier-badge" :class="selectedFacility.listing_tier">
            {{ selectedFacility.listing_tier?.charAt(0).toUpperCase() + selectedFacility.listing_tier?.slice(1) }}
          </div>
        </div>

        <div class="modal-body">
          <p class="facility-full-description">{{ selectedFacility.description }}</p>

          <div class="modal-section">
            <h4>Services</h4>
            <div class="modal-services">
              <span
                v-for="service in selectedFacility.services"
                :key="service"
                class="service-chip"
              >
                {{ service }}
              </span>
            </div>
          </div>

          <div v-if="selectedFacility.badges" class="modal-section">
            <h4>Specialties</h4>
            <div class="specialties-grid">
              <div
                v-for="specialty in selectedFacility.badges"
                :key="specialty"
                class="specialty-item"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
                {{ specialty }}
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
 * Wellness View Component Logic
 *
 * Handles the display and interaction for luxury wellness and beauty services.
 * Provides service-based filtering, tier organization, and detailed facility information.
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
const selectedFacility = ref(null)

// Service categories for filtering
const serviceCategories = [
  {
    value: 'all',
    label: 'All Services',
    icon: 'M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12'
  },
  {
    value: 'spa',
    label: 'Spa & Wellness',
    icon: 'M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM16.24 7.76C15.07 6.59 13.54 6 12 6S8.93 6.59 7.76 7.76L9.17 9.17C10 8.34 11 8 12 8S14 8.34 14.83 9.17L16.24 7.76ZM12 17C15.87 17 19 13.87 19 10H17C17 12.76 14.76 15 12 15S7 12.76 7 10H5C5 13.87 8.13 17 12 17Z'
  },
  {
    value: 'fitness',
    label: 'Fitness Centers',
    icon: 'M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z'
  },
  {
    value: 'beauty',
    label: 'Beauty & Salon',
    icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.59 10.76L11.76 11.93L13.5 10.19L14.5 11.19L13 12.69L11.19 10.88L10.05 12.02L12.81 14.78L17 10.59L21 9Z'
  }
]

// Computed properties for filtered facilities by category and tier
const wellnessFacilities = computed(() => {
  const wellness = businessStore.getBusinessesByCategory('Wellness & Fitness')

  if (selectedCategory.value === 'all') {
    return wellness
  }

  return wellness.filter(facility => {
    const subcategory = facility.subcategory?.toLowerCase()
    switch (selectedCategory.value) {
      case 'spa':
        return subcategory?.includes('spa') || subcategory?.includes('wellness')
      case 'fitness':
        return subcategory?.includes('fitness') || subcategory?.includes('gym')
      case 'beauty':
        return subcategory?.includes('salon') || subcategory?.includes('beauty')
      default:
        return true
    }
  })
})

const signatureFacilities = computed(() =>
  wellnessFacilities.value.filter(facility => facility.listing_tier === 'signature')
)

const premierFacilities = computed(() =>
  wellnessFacilities.value.filter(facility => facility.listing_tier === 'premier')
)

// Mock beauty services data - in a real app this would come from the business store
const beautyServices = computed(() => {
  return [
    {
      id: 'beauty1',
      name: 'Elements Hair Salon',
      category: 'Beauty',
      subcategory: 'Hair Salon',
      description: 'Luxury hair salon specializing in precision cuts, color, and styling for discerning clients.',
      services: ['Hair Cuts & Styling', 'Hair Color', 'Highlights & Balayage', 'Keratin Treatments', 'Bridal Services'],
      badges: ['Redken Elite Salon', 'Certified Colorists', 'Luxury Experience'],
      listing_tier: 'signature',
      contact: {
        phone: '(573) 365-7890',
        email: 'appointments@elementshairsalon.com',
        website: 'https://elementshairsalon.com'
      },
      location: {
        address: '2345 Luxury Lane',
        city: 'Lake of the Ozarks',
        state: 'MO',
        zipCode: '65049'
      }
    },
    {
      id: 'beauty2',
      name: 'Radiance Facial Studio',
      category: 'Beauty',
      subcategory: 'Facial Treatments',
      description: 'Premier facial studio offering advanced skincare treatments and anti-aging solutions.',
      services: ['European Facials', 'Microdermabrasion', 'Chemical Peels', 'LED Light Therapy', 'Dermaplane'],
      badges: ['Medical Grade Products', 'Licensed Estheticians', 'Custom Treatments'],
      listing_tier: 'premier',
      contact: {
        phone: '(573) 365-6543',
        email: 'book@radiancefacials.com',
        website: 'https://radiancefacials.com'
      },
      location: {
        address: '3456 Beauty Blvd',
        city: 'Osage Beach',
        state: 'MO',
        zipCode: '65065'
      }
    },
    {
      id: 'beauty3',
      name: 'Sanctuary Nail Studio',
      category: 'Beauty',
      subcategory: 'Nail Salon',
      description: 'Upscale nail studio offering manicures, pedicures, and nail art in a serene environment.',
      services: ['Classic Manicure', 'Spa Pedicure', 'Gel Polish', 'Nail Art', 'Paraffin Treatment'],
      badges: ['Luxury Products', 'Sanitized Equipment', 'Relaxing Atmosphere'],
      listing_tier: 'curated',
      contact: {
        phone: '(573) 365-4321',
        email: 'info@sanctuarynails.com',
        website: 'https://sanctuarynails.com'
      },
      location: {
        address: '4567 Serenity Way',
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
  e.target.src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=400&fit=crop&crop=center'
}

// Initialize data on component mount
onMounted(() => {
  if (!businessStore.initialized) {
    businessStore.loadData()
  }

  // Initialize hero ad - get Serenity Hills Spa business
  const serenitySpa = businessStore.getBusinessById(10) // Serenity Hills Spa ID
  if (serenitySpa) {
    heroAd.value = {
      ...serenitySpa,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=400&fit=crop&crop=center'
    }
  }
})
</script>

<style scoped>
/**
 * Wellness View Styles
 *
 * Elegant styling for wellness facility listings with service-based
 * visual hierarchy and sophisticated design elements.
 */

/* ===== BASE LAYOUT ===== */
.wellness-view {
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

/* ===== HEADER SECTION ===== */
.wellness-header {
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

/* ===== WELLNESS SECTION ===== */
.wellness-section {
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

/* ===== FACILITIES GRID ===== */
.facilities-grid {
  display: grid;
  gap: var(--space-6);
}

.signature-grid {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.premier-grid {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.beauty-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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

.tier-badge.beauty {
  background: var(--color-midnight);
  color: var(--color-text-primary);
  box-shadow: 0 2px 8px rgba(25, 25, 112, 0.3);
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

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.service-tag {
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

.modal-services {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.service-chip {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.specialties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-2);
}

.specialty-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.specialty-item svg {
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
  .tier-title {
    font-size: var(--font-size-xl);
  }

  .facility-name {
    font-size: var(--font-size-lg);
  }

  .specialties-grid {
    grid-template-columns: 1fr;
  }
}
</style>