import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CategoryInterstitialView from '@/views/CategoryInterstitialView.vue'
import CategoryListingView from '@/views/CategoryListingView.vue'
import SubcategoryListingView from '@/views/SubcategoryListingView.vue'
import BusinessDetailView from '@/views/BusinessDetailView.vue'
import ContactView from '@/views/ContactView.vue'
import SearchView from '@/views/SearchView.vue'
import MapView from '@/views/MapView.vue'
import ShareView from '@/views/ShareView.vue'
import EventsView from '@/views/EventsView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/category/:categoryName/interstitial',
    name: 'CategoryInterstitial',
    component: CategoryInterstitialView
  },
  {
    path: '/category/:categoryName',
    name: 'CategoryListing',
    component: CategoryListingView
  },
  {
    path: '/category/:categoryName/:subcategoryName',
    name: 'SubcategoryListing',
    component: SubcategoryListingView
  },
  {
    path: '/business/:businessId',
    name: 'BusinessDetail',
    component: BusinessDetailView
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView
  },
  {
    path: '/share',
    name: 'Share',
    component: ShareView
  },
  {
    path: '/explore',
    name: 'Explore',
    component: MapView
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
