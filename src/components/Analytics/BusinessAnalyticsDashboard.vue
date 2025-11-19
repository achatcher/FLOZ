<template>
  <div class="analytics-dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">
        <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7Z"/>
        </svg>
        Business Analytics Dashboard
      </h2>
      <p class="dashboard-subtitle">Track your business performance and leads</p>
    </div>

    <!-- Business Selection -->
    <div class="business-selector">
      <label for="business-select" class="selector-label">Select Business:</label>
      <select
        id="business-select"
        v-model="selectedBusinessId"
        class="business-select"
        @change="loadBusinessAnalytics"
      >
        <option value="">Choose a business...</option>
        <option
          v-for="business in businesses"
          :key="business.id"
          :value="business.id"
        >
          {{ business.name }}
        </option>
      </select>
    </div>

    <!-- Analytics Content -->
    <div v-if="selectedBusinessId && analyticsData" class="analytics-content">

      <!-- Key Metrics Cards -->
      <div class="metrics-grid">
        <div class="metric-card impressions">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7 17 9.24 17 12 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ analyticsData.impressions.toLocaleString() }}</div>
            <div class="metric-label">Total Impressions</div>
          </div>
        </div>

        <div class="metric-card leads">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4C18.21 4 20 5.79 20 8S18.21 12 16 12H12V10H16C17.1 10 18 9.1 18 8S17.1 6 16 6H12V4H16ZM10 6H6C4.9 6 4 6.9 4 8S4.9 10 6 10H10V12H6C3.79 12 2 10.21 2 8S3.79 4 6 4H10V6ZM8 9H16V7H8V9ZM18 16V14H16V16H14V18H16V20H18V18H20V16H18Z"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ analyticsData.totalLeads.toLocaleString() }}</div>
            <div class="metric-label">Total Leads</div>
            <div class="metric-change" :class="analyticsData.leadsChange > 0 ? 'positive' : 'negative'">
              {{ analyticsData.leadsChange > 0 ? '+' : '' }}{{ analyticsData.leadsChange }}% this week
            </div>
          </div>
        </div>

        <div class="metric-card conversion">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3C9.23 3 6.19 5.95 6 9.66L4.08 7.74L2.66 9.16L6.5 13L10.34 9.16L8.92 7.74L7.5 9.16C7.19 6.84 9.61 5 12.5 5C15.19 5 17.5 7.14 17.5 10S15.19 15 12.5 15H8V17H12.5C16.09 17 19 14.09 19 10.5S16.09 4 12.5 4H13Z"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ analyticsData.conversionRate }}%</div>
            <div class="metric-label">Conversion Rate</div>
          </div>
        </div>

        <div class="metric-card revenue">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-value">${{ analyticsData.estimatedValue.toLocaleString() }}</div>
            <div class="metric-label">Estimated Lead Value</div>
          </div>
        </div>
      </div>

      <!-- Lead Types Breakdown -->
      <div class="section">
        <h3 class="section-title">Lead Types Breakdown</h3>
        <div class="lead-types-grid">
          <div
            v-for="leadType in analyticsData.leadTypes"
            :key="leadType.type"
            class="lead-type-card"
          >
            <div class="lead-type-header">
              <span class="lead-type-name">{{ formatLeadType(leadType.type) }}</span>
              <span class="lead-type-count">{{ leadType.count }}</span>
            </div>
            <div class="lead-type-bar">
              <div
                class="lead-type-fill"
                :style="{ width: `${leadType.percentage}%` }"
              ></div>
            </div>
            <div class="lead-type-stats">
              <span class="lead-type-percentage">{{ leadType.percentage }}%</span>
              <span class="lead-type-value">${{ leadType.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Placement Performance -->
      <div class="section">
        <h3 class="section-title">Placement Performance</h3>
        <div class="placement-grid">
          <div
            v-for="placement in analyticsData.placements"
            :key="placement.name"
            class="placement-card"
            :class="placement.tier"
          >
            <div class="placement-header">
              <h4 class="placement-name">{{ formatPlacement(placement.name) }}</h4>
              <span class="placement-tier">{{ placement.tier?.toUpperCase() || 'STANDARD' }}</span>
            </div>
            <div class="placement-stats">
              <div class="stat">
                <span class="stat-label">Impressions</span>
                <span class="stat-value">{{ placement.impressions?.toLocaleString() || '0' }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Clicks</span>
                <span class="stat-value">{{ placement.clicks?.toLocaleString() || '0' }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">CTR</span>
                <span class="stat-value">{{ placement.ctr || '0' }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="section">
        <h3 class="section-title">Recent Activity</h3>
        <div class="activity-list">
          <div
            v-for="activity in analyticsData.recentActivity"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon" :class="activity.type">
              <svg v-if="activity.type === 'call'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"/>
              </svg>
              <svg v-else-if="activity.type === 'directions'" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5S21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7 17 9.24 17 12 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12S10.34 15 12 15 15 13.66 15 12 13.66 9 12 9Z"/>
              </svg>
            </div>
            <div class="activity-content">
              <div class="activity-text">{{ activity.description }}</div>
              <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
            </div>
            <div class="activity-value">${{ activity.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="selectedBusinessId && !analyticsData" class="empty-state loading">
      <div class="loading-spinner"></div>
      <p>Loading analytics data...</p>
    </div>

    <div v-else class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7Z"/>
      </svg>
      <h3>Welcome to Your Analytics Dashboard</h3>
      <p>Select a business above to view detailed analytics and performance metrics.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppConfig } from '@/composables/useAppConfig'
import analytics from '@/utils/analytics'

const { getCurrentBusinesses, initializeApp } = useAppConfig()
const selectedBusinessId = ref('')
const analyticsData = ref(null)
const isLoading = ref(false)

// Get all businesses for selection
const businesses = computed(() => {
  return getCurrentBusinesses.value || []
})

// Load analytics data for selected business
const loadBusinessAnalytics = async () => {
  if (!selectedBusinessId.value) {
    analyticsData.value = null
    return
  }

  isLoading.value = true

  try {
    // In a real app, this would fetch from your analytics API
    // For demo purposes, we'll generate realistic sample data
    const business = businesses.value.find(b => b.id === selectedBusinessId.value)
    if (!business) return

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Generate realistic analytics data based on business tier
    const baseMetrics = generateBusinessMetrics(business)
    analyticsData.value = baseMetrics

    // Track dashboard view
    analytics.track('analytics_dashboard_view', {
      business_id: selectedBusinessId.value,
      business_name: business.name,
      business_tier: business.tier
    })

  } catch (error) {
    console.error('Failed to load analytics:', error)
    analytics.trackError(error, { context: 'analytics_dashboard' })
  } finally {
    isLoading.value = false
  }
}

// Generate realistic business metrics based on tier
const generateBusinessMetrics = (business) => {
  const tier = business.tier || 'standard'
  const multipliers = {
    signature: { impressions: 5000, leads: 100, conversion: 8 },
    premier: { impressions: 2500, leads: 60, conversion: 6 },
    standard: { impressions: 1000, leads: 25, conversion: 4 }
  }

  const base = multipliers[tier] || multipliers.standard
  const impressions = base.impressions + Math.floor(Math.random() * base.impressions * 0.5)
  const totalLeads = base.leads + Math.floor(Math.random() * base.leads * 0.3)
  const conversionRate = (base.conversion + Math.random() * 2).toFixed(1)

  // Lead types with realistic distribution
  const leadTypes = [
    { type: 'call', count: Math.floor(totalLeads * 0.4), value: 10 },
    { type: 'directions', count: Math.floor(totalLeads * 0.35), value: 8 },
    { type: 'website', count: Math.floor(totalLeads * 0.15), value: 5 },
    { type: 'modal_view', count: Math.floor(totalLeads * 0.1), value: 2 }
  ].map(lead => ({
    ...lead,
    percentage: ((lead.count / totalLeads) * 100).toFixed(1),
    value: lead.count * lead.value
  }))

  // Placement performance based on tier
  const placements = [
    {
      name: 'hero',
      tier: tier,
      impressions: tier === 'signature' ? Math.floor(impressions * 0.3) : 0,
      clicks: tier === 'signature' ? Math.floor(totalLeads * 0.4) : 0
    },
    {
      name: 'search_results',
      tier: tier,
      impressions: Math.floor(impressions * 0.4),
      clicks: Math.floor(totalLeads * 0.4)
    },
    {
      name: 'category_listing',
      tier: tier,
      impressions: Math.floor(impressions * 0.3),
      clicks: Math.floor(totalLeads * 0.2)
    }
  ].map(p => ({
    ...p,
    ctr: p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) : '0.00'
  }))

  // Recent activity
  const activityTypes = ['call', 'directions', 'website', 'modal_view']
  const recentActivity = Array.from({ length: 8 }, (_, i) => {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    return {
      id: i,
      type: type,
      description: `User ${type === 'call' ? 'called' : type === 'directions' ? 'got directions to' : type === 'website' ? 'visited website for' : 'viewed'} ${business.name}`,
      timestamp: Date.now() - (i * 3600000), // Hours ago
      value: leadTypes.find(l => l.type === type)?.value || 1
    }
  })

  return {
    impressions,
    totalLeads,
    conversionRate: parseFloat(conversionRate),
    leadsChange: Math.floor(Math.random() * 40) - 20, // -20% to +20%
    estimatedValue: leadTypes.reduce((sum, lead) => sum + lead.value, 0),
    leadTypes,
    placements: placements.filter(p => p.impressions > 0),
    recentActivity
  }
}

// Utility functions
const formatLeadType = (type) => {
  const types = {
    call: 'Phone Calls',
    directions: 'Direction Requests',
    website: 'Website Visits',
    modal_view: 'Detail Views',
    hero_click: 'Hero Ad Clicks'
  }
  return types[type] || type
}

const formatPlacement = (placement) => {
  const placements = {
    hero: 'Hero Advertisement',
    search_results: 'Search Results',
    category_listing: 'Category Listings',
    happy_hour: 'Happy Hour Section',
    business_modal: 'Business Modal'
  }
  return placements[placement] || placement
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)

  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

onMounted(async () => {
  await initializeApp()

  // Track dashboard access
  analytics.pageView('/analytics-dashboard', 'Business Analytics Dashboard')
})
</script>

<style scoped>
.analytics-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
  background: var(--color-bg-primary);
  min-height: 100vh;
}

/* Dashboard Header */
.dashboard-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.dashboard-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  font-family: var(--font-family-heading);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
}

.title-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary);
}

.dashboard-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Business Selector */
.business-selector {
  margin-bottom: var(--space-8);
  text-align: center;
}

.selector-label {
  display: block;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.business-select {
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  min-width: 300px;
  cursor: pointer;
  transition: var(--transition-all);
}

.business-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha-20);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.metric-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  border: 1px solid var(--color-border-primary);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: var(--transition-all);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.impressions .metric-icon { background: var(--color-primary); }
.leads .metric-icon { background: var(--color-success); }
.conversion .metric-icon { background: var(--color-warning); }
.revenue .metric-icon { background: var(--color-info); }

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
}

.metric-change {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  margin-top: var(--space-1);
}

.metric-change.positive { color: var(--color-success); }
.metric-change.negative { color: var(--color-error); }

/* Sections */
.section {
  margin-bottom: var(--space-8);
}

.section-title {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-6);
}

/* Lead Types Grid */
.lead-types-grid {
  display: grid;
  gap: var(--space-4);
}

.lead-type-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  border: 1px solid var(--color-border-primary);
}

.lead-type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.lead-type-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.lead-type-count {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.lead-type-bar {
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-3);
  overflow: hidden;
}

.lead-type-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  transition: width 0.6s ease;
}

.lead-type-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lead-type-percentage {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.lead-type-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

/* Placement Grid */
.placement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.placement-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  border: 2px solid var(--color-border-primary);
  transition: var(--transition-all);
}

.placement-card.signature {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px var(--color-primary-alpha-20);
}

.placement-card.premier {
  border-color: var(--color-success);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
}

.placement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.placement-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.placement-tier {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}

.placement-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

.stat-value {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--color-border-primary);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.activity-icon.call { background: var(--color-success); }
.activity-icon.directions { background: var(--color-primary); }
.activity-icon.website { background: var(--color-info); }
.activity-icon.modal_view { background: var(--color-warning); }

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.activity-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.activity-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.empty-state.loading {
  padding: var(--space-8);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-primary);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-4);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
}

.empty-state p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-dashboard {
    padding: var(--space-4);
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .placement-grid {
    grid-template-columns: 1fr;
  }

  .business-select {
    min-width: 100%;
  }

  .dashboard-title {
    font-size: var(--font-size-2xl);
    flex-direction: column;
    gap: var(--space-2);
  }

  .metric-card {
    flex-direction: column;
    text-align: center;
  }

  .placement-stats {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>