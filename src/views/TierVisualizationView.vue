<template>
  <div class="tier-visualization-view">
    <TopBar @toggle-menu="toggleSideMenu" />

    <div class="tier-content">
      <!-- Header -->
      <div class="tier-header">
        <h1 class="tier-title">Business Advertising Tiers</h1>
        <p class="tier-subtitle">Choose the perfect tier for your business visibility</p>
      </div>

      <!-- Tier Comparison Grid -->
      <div class="tier-grid" v-if="tiers">
        <div
          v-for="(tier, key) in tiers"
          :key="key"
          class="tier-card"
          :class="`tier-${key}`"
          :style="{
            background: tier.gradient,
            boxShadow: tier.shadow,
            borderColor: tier.border
          }"
        >
          <!-- Tier Header -->
          <div class="tier-card-header">
            <div class="tier-icon">{{ tier.icon }}</div>
            <h2 class="tier-name">{{ tier.displayName }}</h2>
            <p class="tier-description">{{ tier.shortDescription }}</p>
          </div>

          <!-- Pricing -->
          <div class="tier-pricing">
            <div class="price-main">{{ tier.pricing.monthly }}</div>
            <div class="price-period">/month</div>
            <div class="price-annual">{{ tier.pricing.annually }}/year (save 17%)</div>
            <div class="price-setup">Setup: {{ tier.pricing.setup }}</div>
          </div>

          <!-- Benefits -->
          <div class="tier-benefits">
            <h4>What You Get:</h4>
            <ul>
              <li v-for="benefit in tier.benefits" :key="benefit">
                {{ benefit }}
              </li>
            </ul>
          </div>

          <!-- Ideal For -->
          <div class="tier-ideal">
            <h4>Ideal For:</h4>
            <p>{{ tier.ideal_for }}</p>
          </div>

          <!-- CTA Button -->
          <button
            class="tier-cta"
            :style="{ backgroundColor: tier.color }"
            @click="selectTier(key)"
          >
            Choose {{ tier.name }}
          </button>
        </div>
      </div>

      <!-- Feature Comparison Table -->
      <div class="feature-comparison" v-if="tiers">
        <h2>Feature Comparison</h2>
        <div class="comparison-table">
          <div class="comparison-header">
            <div class="feature-label">Features</div>
            <div class="tier-header-cell" v-for="(tier, key) in tiers" :key="key">
              <span class="tier-icon">{{ tier.icon }}</span>
              {{ tier.name }}
            </div>
          </div>

          <!-- Listing Features -->
          <div class="feature-category">
            <div class="category-title">📋 Listing Features</div>
          </div>

          <div class="feature-row">
            <div class="feature-name">Position in Category</div>
            <div class="feature-value">{{ tiers.signature.features.listing.position }}</div>
            <div class="feature-value">{{ tiers.premier.features.listing.position }}</div>
            <div class="feature-value">{{ tiers.curated.features.listing.position }}</div>
          </div>

          <div class="feature-row">
            <div class="feature-name">Card Size</div>
            <div class="feature-value">{{ tiers.signature.features.listing.size }}</div>
            <div class="feature-value">{{ tiers.premier.features.listing.size }}</div>
            <div class="feature-value">{{ tiers.curated.features.listing.size }}</div>
          </div>

          <div class="feature-row">
            <div class="feature-name">Photos Allowed</div>
            <div class="feature-value">{{ tiers.signature.features.listing.photos }}</div>
            <div class="feature-value">{{ tiers.premier.features.listing.photos }}</div>
            <div class="feature-value">{{ tiers.curated.features.listing.photos }}</div>
          </div>

          <!-- Advertising Features -->
          <div class="feature-category">
            <div class="category-title">📢 Advertising</div>
          </div>

          <div class="feature-row">
            <div class="feature-name">Interstitial Ads</div>
            <div class="feature-value success">{{ tiers.signature.features.advertising.interstitial }}</div>
            <div class="feature-value partial">{{ tiers.premier.features.advertising.interstitial }}</div>
            <div class="feature-value none">{{ tiers.curated.features.advertising.interstitial }}</div>
          </div>

          <div class="feature-row">
            <div class="feature-name">Homepage Features</div>
            <div class="feature-value success">{{ tiers.signature.features.advertising.homepage }}</div>
            <div class="feature-value partial">{{ tiers.premier.features.advertising.homepage }}</div>
            <div class="feature-value none">{{ tiers.curated.features.advertising.homepage }}</div>
          </div>

          <!-- Support Features -->
          <div class="feature-category">
            <div class="category-title">🛠️ Support</div>
          </div>

          <div class="feature-row">
            <div class="feature-name">Update Speed</div>
            <div class="feature-value success">{{ tiers.signature.features.support.updates }}</div>
            <div class="feature-value partial">{{ tiers.premier.features.support.updates }}</div>
            <div class="feature-value none">{{ tiers.curated.features.support.updates }}</div>
          </div>

          <div class="feature-row">
            <div class="feature-name">Support Type</div>
            <div class="feature-value success">{{ tiers.signature.features.support.phone }}</div>
            <div class="feature-value partial">{{ tiers.premier.features.support.email }}</div>
            <div class="feature-value none">{{ tiers.curated.features.support.email }}</div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="tier-contact">
        <h2>Ready to Get Started?</h2>
        <p>Choose your tier and boost your business visibility today!</p>
        <div class="contact-buttons">
          <button class="btn-primary" @click="contactUs">
            📞 Contact Sales Team
          </button>
          <button class="btn-secondary" @click="learnMore">
            📖 View Setup Guide
          </button>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- Side Menu -->
    <transition name="slide">
      <SideMenu v-if="showSideMenu" @close="toggleSideMenu" />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppConfig } from '@/composables/useAppConfig'
import TopBar from '@/components/Navigation/TopBar.vue'
import BottomNav from '@/components/Navigation/BottomNav.vue'
import SideMenu from '@/components/Navigation/SideMenu.vue'

const router = useRouter()
const { getAppInfo, getTierConfig, initializeApp } = useAppConfig()

const showSideMenu = ref(false)

// Get tier configuration
const tiers = ref(null)

const toggleSideMenu = () => {
  showSideMenu.value = !showSideMenu.value
}

const selectTier = (tierKey) => {
  alert(`You selected ${tierKey} tier! Contact our sales team at listings@greenvillesocial.com to get started.`)
}

const contactUs = () => {
  window.open('mailto:listings@greenvillesocial.com?subject=Business Listing Inquiry', '_blank')
}

const learnMore = () => {
  // Open business setup guide
  window.open('/BUSINESS-SETUP.md', '_blank')
}

// Initialize app and load tier configuration
onMounted(async () => {
  try {
    await initializeApp()

    // Load tier configuration from app config
    const appConfig = await fetch('/config/app-config.json')
    const config = await appConfig.json()
    tiers.value = config.tiers

    console.log('✅ Tier visualization loaded', tiers.value)
  } catch (error) {
    console.error('❌ Failed to load tier configuration:', error)
  }
})
</script>

<style scoped>
.tier-visualization-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.tier-content {
  padding: 80px 20px 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tier-header {
  text-align: center;
  margin-bottom: 48px;
}

.tier-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
}

.tier-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin: 0;
}

/* Tier Grid */
.tier-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.tier-card {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  border: 2px solid;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tier-card:hover {
  transform: translateY(-4px);
}

.tier-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
}

.tier-card-header {
  text-align: center;
  margin-bottom: 24px;
}

.tier-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.tier-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.tier-description {
  color: rgba(255,255,255,0.9);
  margin: 0;
  font-weight: 500;
}

/* Pricing */
.tier-pricing {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.price-main {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.price-period {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 8px;
}

.price-annual {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 4px;
}

.price-setup {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
}

/* Benefits */
.tier-benefits {
  margin-bottom: 24px;
}

.tier-benefits h4 {
  color: white;
  margin-bottom: 12px;
  font-weight: 600;
}

.tier-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tier-benefits li {
  color: rgba(255,255,255,0.95);
  margin-bottom: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Ideal For */
.tier-ideal {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
}

.tier-ideal h4 {
  color: white;
  margin-bottom: 8px;
  font-weight: 600;
}

.tier-ideal p {
  color: rgba(255,255,255,0.9);
  margin: 0;
  font-size: 0.9rem;
}

/* CTA Button */
.tier-cta {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.tier-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
}

/* Feature Comparison Table */
.feature-comparison {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.feature-comparison h2 {
  text-align: center;
  margin-bottom: 32px;
  color: #2c3e50;
}

.comparison-table {
  width: 100%;
}

.comparison-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.feature-label {
  font-weight: 700;
  color: #2c3e50;
}

.tier-header-cell {
  text-align: center;
  font-weight: 700;
  color: #2c3e50;
}

.tier-header-cell .tier-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.feature-category {
  margin: 24px 0 16px 0;
}

.category-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #495057;
  padding: 12px 16px;
  background: #e9ecef;
  border-radius: 8px;
}

.feature-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

.feature-name {
  font-weight: 500;
  color: #495057;
}

.feature-value {
  text-align: center;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.feature-value.success {
  background: #d4edda;
  color: #155724;
}

.feature-value.partial {
  background: #fff3cd;
  color: #856404;
}

.feature-value.none {
  background: #f8d7da;
  color: #721c24;
}

/* Contact Section */
.tier-contact {
  text-align: center;
  background: white;
  padding: 48px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.tier-contact h2 {
  margin-bottom: 16px;
  color: #2c3e50;
}

.tier-contact p {
  margin-bottom: 32px;
  color: #6c757d;
  font-size: 1.1rem;
}

.contact-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
}

.btn-secondary:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .tier-content {
    padding: 80px 16px 100px 16px;
  }

  .tier-title {
    font-size: 2rem;
  }

  .comparison-header,
  .feature-row {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .tier-header-cell,
  .feature-value {
    text-align: left;
  }

  .contact-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
}
</style>