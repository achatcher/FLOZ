/*
 * Events Store - Live Events Management for FLOZ App
 *
 * Handles all event-related data including live events, festivals, and entertainment.
 * Supports both manual event data and automated fetching from external sources.
 *
 * Key Features:
 * - Live event listings with real-time updates
 * - Event categories (Concerts, Festivals, Entertainment, etc.)
 * - Automated event data fetching from external APIs
 * - Event filtering by date, category, and location
 * - Event favorites and notifications
 *
 * Usage Examples:
 *
 * // In a Vue component:
 * import { useEventsStore } from '@/stores/eventsStore'
 *
 * const eventsStore = useEventsStore()
 *
 * // Get upcoming events
 * const upcomingEvents = eventsStore.getUpcomingEvents()
 *
 * // Get events by category
 * const concerts = eventsStore.getEventsByCategory('Concert')
 *
 * // Get events this weekend
 * const weekendEvents = eventsStore.getEventsThisWeekend()
 */

import { defineStore } from 'pinia'

export const useEventsStore = defineStore('events', {
  // ===== STATE DEFINITION =====
  state: () => ({
    events: [],           // All event listings
    categories: [],       // Event categories
    loading: false,       // Loading state for async operations
    lastUpdated: null,    // Timestamp of last data update
    favorites: []         // User's favorite events
  }),

  // ===== COMPUTED GETTERS =====
  getters: {
    /**
     * Gets upcoming events (next 30 days)
     */
    getUpcomingEvents: (state) => {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))

      return state.events
        .filter(event => {
          const eventDate = new Date(event.date)
          return eventDate >= now && eventDate <= thirtyDaysFromNow
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    /**
     * Gets events by category
     * @param {string} category - Event category
     */
    getEventsByCategory: (state) => (category) => {
      return state.events
        .filter(event => event.category === category)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    /**
     * Gets events happening this weekend
     */
    getEventsThisWeekend: (state) => {
      const now = new Date()
      const friday = new Date(now)
      friday.setDate(now.getDate() + (5 - now.getDay()) % 7)
      const sunday = new Date(friday)
      sunday.setDate(friday.getDate() + 2)

      return state.events
        .filter(event => {
          const eventDate = new Date(event.date)
          return eventDate >= friday && eventDate <= sunday
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    },

    /**
     * Gets today's events
     */
    getTodaysEvents: (state) => {
      const today = new Date()
      const todayString = today.toDateString()

      return state.events
        .filter(event => new Date(event.date).toDateString() === todayString)
        .sort((a, b) => a.time.localeCompare(b.time))
    },

    /**
     * Gets featured events (premium listings)
     */
    getFeaturedEvents: (state) => {
      return state.events
        .filter(event => event.featured)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5) // Top 5 featured events
    }
  },

  // ===== ACTIONS =====
  actions: {
    /**
     * Loads all events data
     */
    async loadEventsData() {
      this.loading = true
      try {
        // Load static events data first
        this.events = await this.fetchStaticEvents()
        this.categories = await this.fetchEventCategories()

        // Try to fetch live events from external sources
        try {
          const liveEvents = await this.fetchLiveEvents()
          this.events = [...this.events, ...liveEvents]
        } catch (error) {
          console.warn('Could not fetch live events:', error.message)
        }

        this.lastUpdated = new Date()
      } catch (error) {
        console.error('Error loading events data:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetches static events data (local/manual events)
     */
    async fetchStaticEvents() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      return [
        {
          id: 1,
          title: "Lake of the Ozarks Shootout",
          category: "Annual Event",
          date: "2024-08-24",
          time: "10:00 AM",
          endDate: "2024-08-25",
          location: "Captain Ron's Bar & Grill",
          address: "1000 Hurricane Deck Rd, Lake Ozark, MO",
          coordinates: { lat: 38.0756, lng: -92.6074 },
          description: "The world's largest unsanctioned boat race featuring high-speed powerboats and exciting entertainment.",
          image: "/images/events/shootout-2024.jpg",
          ticketPrice: "Free",
          website: "https://shootout.com",
          phone: "(573) 365-2020",
          featured: true,
          organizer: "Lake of the Ozarks Shootout Committee"
        },
        {
          id: 2,
          title: "Fourth of July Fireworks Spectacular",
          category: "Holiday Event",
          date: "2024-07-04",
          time: "9:30 PM",
          location: "Bagnell Dam",
          address: "Bagnell Dam Blvd, Lake Ozark, MO",
          coordinates: { lat: 38.0823, lng: -92.6074 },
          description: "Annual fireworks display over Lake of the Ozarks with live music and food vendors.",
          image: "/images/events/fireworks-2024.jpg",
          ticketPrice: "Free",
          featured: true,
          organizer: "City of Lake Ozark"
        },
        {
          id: 3,
          title: "Jazz on the Lake Concert Series",
          category: "Concert",
          date: "2024-07-15",
          time: "7:00 PM",
          endDate: "2024-08-15",
          location: "Lake Ozark Amphitheater",
          address: "918 Passover Rd, Osage Beach, MO",
          coordinates: { lat: 38.0889, lng: -92.6312 },
          description: "Weekly jazz concerts featuring local and touring musicians in an outdoor amphitheater setting.",
          image: "/images/events/jazz-concert.jpg",
          ticketPrice: "$25-45",
          website: "https://jazzonthelake.com",
          recurring: "Weekly",
          featured: false,
          organizer: "Lake Area Music Association"
        },
        {
          id: 4,
          title: "Lake Wine Festival",
          category: "Food & Wine",
          date: "2024-09-14",
          time: "2:00 PM",
          endDate: "2024-09-15",
          location: "Osage Beach City Park",
          address: "1011 KK Dr, Osage Beach, MO",
          coordinates: { lat: 38.0901, lng: -92.6234 },
          description: "Annual wine tasting festival featuring Missouri wineries, live music, and local cuisine.",
          image: "/images/events/wine-festival.jpg",
          ticketPrice: "$30-65",
          website: "https://lakewinefestival.com",
          featured: true,
          organizer: "Missouri Wine Festival Association"
        },
        {
          id: 5,
          title: "Comedy Night at the Cove",
          category: "Comedy",
          date: "2024-06-28",
          time: "8:00 PM",
          location: "The Cove Restaurant",
          address: "52 Lighthouse Rd, Lake Ozark, MO",
          coordinates: { lat: 38.0634, lng: -92.6287 },
          description: "Stand-up comedy show featuring touring comedians and local talent.",
          image: "/images/events/comedy-night.jpg",
          ticketPrice: "$20",
          phone: "(573) 365-3000",
          recurring: "Monthly",
          featured: false,
          organizer: "The Cove Entertainment"
        },
        {
          id: 6,
          title: "Bagnell Dam Strip Run",
          category: "Annual Event",
          date: "2024-05-25",
          time: "10:00 AM",
          location: "Bagnell Dam Strip",
          address: "Bagnell Dam Blvd, Lake Ozark, MO",
          coordinates: { lat: 38.0867, lng: -92.6074 },
          description: "Annual motorcycle and car cruise showcasing classic and custom vehicles.",
          image: "/images/events/strip-run.jpg",
          ticketPrice: "Free",
          featured: false,
          organizer: "Lake Area Classic Car Club"
        }
      ]
    },

    /**
     * Fetches event categories
     */
    async fetchEventCategories() {
      return [
        { id: 1, name: "Concert", icon: "🎵", color: "#E67E22" },
        { id: 2, name: "Festival", icon: "🎪", color: "#8E44AD" },
        { id: 3, name: "Annual Event", icon: "📅", color: "#3498DB" },
        { id: 4, name: "Holiday Event", icon: "🎆", color: "#E74C3C" },
        { id: 5, name: "Food & Wine", icon: "🍷", color: "#C0392B" },
        { id: 6, name: "Comedy", icon: "😂", color: "#F39C12" },
        { id: 7, name: "Sports", icon: "🏁", color: "#27AE60" },
        { id: 8, name: "Entertainment", icon: "🎭", color: "#9B59B6" }
      ]
    },

    /**
     * Fetches live events from external sources
     * Combines multiple data sources for comprehensive event listings
     */
    async fetchLiveEvents() {
      try {
        const allExternalEvents = []

        // Option 1: Eventbrite API
        try {
          const eventbriteEvents = await this.fetchEventbriteEvents()
          allExternalEvents.push(...eventbriteEvents)
          console.log(`Fetched ${eventbriteEvents.length} events from Eventbrite`)
        } catch (error) {
          console.warn('Eventbrite fetch failed:', error.message)
        }

        // Option 2: Facebook Events API (requires approval)
        try {
          const facebookEvents = await this.fetchFacebookEvents()
          allExternalEvents.push(...facebookEvents)
          console.log(`Fetched ${facebookEvents.length} events from Facebook`)
        } catch (error) {
          console.warn('Facebook fetch failed:', error.message)
        }

        // Option 3: Local venue websites scraping
        try {
          const scrapedEvents = await this.scrapeLocalVenues()
          allExternalEvents.push(...scrapedEvents)
          console.log(`Fetched ${scrapedEvents.length} events from local venues`)
        } catch (error) {
          console.warn('Local venue scraping failed:', error.message)
        }

        // Remove duplicates based on title and date
        const uniqueEvents = this.removeDuplicateEvents(allExternalEvents)

        console.log(`Total external events fetched: ${uniqueEvents.length}`)
        return uniqueEvents
      } catch (error) {
        console.warn('External event fetching failed:', error)
        return []
      }
    },

    /**
     * Removes duplicate events from external sources
     */
    removeDuplicateEvents(events) {
      const seen = new Set()
      return events.filter(event => {
        const key = `${event.title}-${event.date}-${event.location}`.toLowerCase()
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })
    },

    /**
     * Fetches events from Eventbrite API
     * Requires Eventbrite API key to be configured
     */
    async fetchEventbriteEvents() {
      try {
        const EVENTBRITE_API_KEY = import.meta.env.VITE_EVENTBRITE_API_KEY

        if (!EVENTBRITE_API_KEY) {
          console.warn('Eventbrite API key not configured')
          return []
        }

        // Search for events in Missouri (Lake of the Ozarks area)
        const response = await fetch(`https://www.eventbriteapi.com/v3/events/search/?location.address=Lake+of+the+Ozarks,+MO&location.within=50mi&expand=venue&sort_by=date`, {
          headers: {
            'Authorization': `Bearer ${EVENTBRITE_API_KEY}`
          }
        })

        if (!response.ok) {
          throw new Error(`Eventbrite API error: ${response.status}`)
        }

        const data = await response.json()
        return this.transformEventbriteData(data.events || [])
      } catch (error) {
        console.error('Error fetching Eventbrite events:', error)
        return []
      }
    },

    /**
     * Fetch events from Facebook Events API
     * Requires Facebook App and access tokens
     */
    async fetchFacebookEvents() {
      try {
        const FB_ACCESS_TOKEN = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN

        if (!FB_ACCESS_TOKEN) {
          console.warn('Facebook access token not configured')
          return []
        }

        // Popular Lake of the Ozarks venue Facebook page IDs
        const venuePages = [
          'MargaritavilleLakeOzarks', // Margaritaville
          'BackwaterJacks', // Backwater Jack's
          'ShadyGators', // Shady Gators
          'CaptainRonsBarGrill' // Captain Ron's
        ]

        const allEvents = []

        for (const pageId of venuePages) {
          try {
            const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/events?access_token=${FB_ACCESS_TOKEN}&fields=id,name,description,start_time,end_time,place,cover,ticket_uri,event_times&limit=50`)

            if (!response.ok) continue

            const data = await response.json()

            const events = data.data?.map(event => ({
              id: `facebook-${event.id}`,
              title: event.name,
              description: event.description || 'No description available',
              date: event.start_time.split('T')[0],
              time: this.formatEventTime(event.start_time, event.end_time),
              endDate: event.end_time ? event.end_time.split('T')[0] : null,
              location: event.place?.name || pageId,
              address: event.place?.location ?
                `${event.place.location.street || ''}, ${event.place.location.city || ''}, ${event.place.location.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') : null,
              category: 'Live Entertainment',
              image: event.cover?.source || '/images/events/default-event.jpg',
              website: event.ticket_uri || `https://facebook.com/events/${event.id}`,
              ticketPrice: 'See event page',
              organizer: event.place?.name || pageId,
              featured: false,
              source: 'facebook',
              coordinates: event.place?.location?.latitude && event.place?.location?.longitude ? {
                lat: parseFloat(event.place.location.latitude),
                lng: parseFloat(event.place.location.longitude)
              } : null
            })) || []

            allEvents.push(...events)
          } catch (error) {
            console.error(`Error fetching events from ${pageId}:`, error)
          }
        }

        return allEvents
      } catch (error) {
        console.error('Error fetching Facebook events:', error)
        return []
      }
    },

    /**
     * Scrape events from local venue websites
     * Uses backend scraper service to avoid CORS restrictions
     */
    async scrapeLocalVenues() {
      try {
        const SCRAPER_SERVICE_URL = import.meta.env.VITE_SCRAPER_SERVICE_URL || 'http://localhost:3001'

        // Try to fetch from backend scraper service first
        try {
          const response = await fetch(`${SCRAPER_SERVICE_URL}/api/scraped-events`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000)
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.events) {
              console.log(`✅ Fetched ${data.events.length} events from scraper service`)
              return data.events
            }
          }
        } catch (error) {
          console.warn('Backend scraper service not available:', error.message)
        }

        // Fallback to mock data if scraper service is not available
        console.log('📝 Using mock scraped events (scraper service not available)')

        return [
          {
            id: 'scraped-margaritaville-1',
            title: 'Live Music - The Lake Band',
            description: 'Join us for live music on the deck overlooking the lake',
            date: this.getDateString(3),
            time: '7:00 PM - 10:00 PM',
            location: 'Margaritaville Lake Resort',
            address: '494 Tan Tar A Dr, Osage Beach, MO 65065',
            category: 'Live Entertainment',
            image: '/images/events/live-music.jpg',
            website: 'https://margaritavilleresorts.com/lake-of-the-ozarks',
            ticketPrice: 'Free',
            organizer: 'Margaritaville Lake Resort',
            featured: false,
            source: 'scraped-mock',
            coordinates: { lat: 38.1317, lng: -92.6073 }
          },
          {
            id: 'scraped-backwater-1',
            title: 'Karaoke Night',
            description: 'Show off your singing skills at our weekly karaoke night',
            date: this.getDateString(5),
            time: '8:00 PM - 12:00 AM',
            location: 'Backwater Jack\'s',
            address: '4836 Keelboat Ct, Lake Ozark, MO 65049',
            category: 'Live Entertainment',
            image: '/images/events/karaoke.jpg',
            website: 'https://backwaterjacks.com',
            ticketPrice: 'Free',
            organizer: 'Backwater Jack\'s',
            featured: false,
            source: 'scraped-mock',
            coordinates: { lat: 38.1189, lng: -92.6356 }
          },
          {
            id: 'scraped-shady-gators-1',
            title: 'Trivia Night',
            description: 'Test your knowledge at our weekly trivia challenge',
            date: this.getDateString(7),
            time: '7:00 PM - 9:00 PM',
            location: 'Shady Gators',
            address: '4466 Osage Beach Pkwy, Osage Beach, MO 65065',
            category: 'Entertainment',
            image: '/images/events/trivia-night.jpg',
            website: 'https://shadygators.com',
            ticketPrice: 'Free',
            organizer: 'Shady Gators',
            featured: false,
            source: 'scraped-mock',
            coordinates: { lat: 38.1205, lng: -92.6345 }
          }
        ]
      } catch (error) {
        console.error('Error scraping local venues:', error)
        return []
      }
    },

    /**
     * Helper method to format event times
     */
    formatEventTime(startTime, endTime) {
      const formatTime = (timeString) => {
        const date = new Date(timeString)
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      }

      const start = formatTime(startTime)
      if (endTime) {
        const end = formatTime(endTime)
        return `${start} - ${end}`
      }
      return start
    },

    /**
     * Helper method to get date string for future dates
     */
    getDateString(daysFromNow) {
      const date = new Date()
      date.setDate(date.getDate() + daysFromNow)
      return date.toISOString().split('T')[0]
    },

    /**
     * Transforms external event data to our format
     */
    transformEventbriteData(events) {
      return events.map(event => ({
        id: `eb_${event.id}`,
        title: event.name.text,
        category: this.categorizeEvent(event.description?.text || ''),
        date: event.start.local.split('T')[0],
        time: new Date(event.start.local).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        location: event.venue?.name || 'TBA',
        address: event.venue?.address?.localized_address_display || '',
        coordinates: {
          lat: parseFloat(event.venue?.latitude || 38.0756),
          lng: parseFloat(event.venue?.longitude || -92.6074)
        },
        description: event.description?.text || '',
        image: event.logo?.url || '/images/events/default-event.jpg',
        ticketPrice: event.ticket_availability?.minimum_ticket_price?.display || 'Check Website',
        website: event.url,
        featured: false,
        organizer: event.organizer?.name || '',
        source: 'eventbrite'
      }))
    },

    /**
     * Auto-categorizes events based on title/description
     */
    categorizeEvent(text) {
      const keywords = {
        'Concert': ['concert', 'music', 'band', 'singer', 'jazz', 'rock', 'country'],
        'Festival': ['festival', 'fest', 'celebration'],
        'Food & Wine': ['wine', 'food', 'tasting', 'dining', 'restaurant'],
        'Comedy': ['comedy', 'comedian', 'stand-up', 'funny'],
        'Sports': ['race', 'tournament', 'game', 'sport'],
        'Entertainment': ['show', 'performance', 'theater', 'entertainment']
      }

      const lowercaseText = text.toLowerCase()

      for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => lowercaseText.includes(word))) {
          return category
        }
      }

      return 'Entertainment' // Default category
    },

    /**
     * Adds event to favorites
     */
    addToFavorites(eventId) {
      if (!this.favorites.includes(eventId)) {
        this.favorites.push(eventId)
      }
    },

    /**
     * Removes event from favorites
     */
    removeFromFavorites(eventId) {
      const index = this.favorites.indexOf(eventId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      }
    },

    /**
     * Checks if event is in favorites
     */
    isEventFavorite(eventId) {
      return this.favorites.includes(eventId)
    },

    /**
     * Refreshes events data
     */
    async refreshEvents() {
      await this.loadEventsData()
    }
  }
})