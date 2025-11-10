# 🎯 **FLOZ Content Management - Super Easy Guide**

Making your FLOZ app content management **incredibly simple** - anyone can add businesses, events, and photos!

---

## 🏢 **Adding New Businesses**

### **Step 1: Find the Business Data File**
Open: `src/stores/businessStore.js`
Look for: `fetchBusinesses()` function (around line 250)

### **Step 2: Copy This Template**
```javascript
{
  id: 999, // Use next available number
  name: "Your Business Name",
  category: "Dining Out", // Must match existing category
  subcategory: "Waterfront Dining", // Must match existing subcategory
  tier: "signature", // Options: "signature", "premier", "curated"

  // BASIC INFO (Required)
  description: "Brief description of the business",
  phone: "(573) 555-0123",
  website: "https://yourbusiness.com",
  email: "info@yourbusiness.com",

  // LOCATION (Required)
  address: "123 Main St, Lake Ozark, MO 65049",
  coordinates: { lat: 38.0756, lng: -92.6074 }, // Use Google Maps

  // IMAGES (Use your own images)
  logo: "/images/businesses/your-business/logo.jpg",
  heroImage: "/images/businesses/your-business/hero.jpg", // 800x400px recommended
  gallery: [
    "/images/businesses/your-business/gallery1.jpg", // 600x400px recommended
    "/images/businesses/your-business/gallery2.jpg",
    "/images/businesses/your-business/gallery3.jpg"
  ],

  // BUSINESS HOURS (Optional)
  hours: {
    monday: "9:00 AM - 10:00 PM",
    tuesday: "9:00 AM - 10:00 PM",
    wednesday: "9:00 AM - 10:00 PM",
    thursday: "9:00 AM - 11:00 PM",
    friday: "9:00 AM - 11:00 PM",
    saturday: "8:00 AM - 11:00 PM",
    sunday: "8:00 AM - 10:00 PM"
  },

  // SPECIAL FEATURES (Optional)
  features: [
    "Waterfront Dining",
    "Live Music",
    "Happy Hour",
    "Outdoor Seating",
    "Boat Dock Available"
  ],

  // PRICING (Optional)
  priceRange: "$$", // $, $$, $$$, $$$$

  // ADVERTISEMENTS (Optional - for premium listings)
  ads: [
    {
      id: 1,
      title: "Summer Special!",
      description: "50% off appetizers during happy hour",
      image: "/images/businesses/your-business/promo1.jpg",
      link: "https://yourbusiness.com/specials",
      validUntil: "2024-08-31"
    }
  ]
}
```

### **Step 3: Add to Business List**
1. Find the `return [` line in `fetchBusinesses()`
2. Add your new business object before the closing `]`
3. Save the file - that's it! ✨

---

## 🎉 **Adding New Events**

### **Step 1: Find the Events Data File**
Open: `src/stores/eventsStore.js`
Look for: `fetchStaticEvents()` function (around line 165)

### **Step 2: Copy This Template**
```javascript
{
  id: 999, // Use next available number
  title: "Your Event Name",
  category: "Live Entertainment", // Must match existing category

  // DATE & TIME (Required)
  date: "2024-07-15", // YYYY-MM-DD format
  time: "7:00 PM",
  endDate: "2024-07-15", // Optional if multi-day

  // LOCATION (Required)
  location: "Venue Name",
  address: "123 Event St, Lake Ozark, MO 65049",
  coordinates: { lat: 38.0756, lng: -92.6074 },

  // DETAILS
  description: "Detailed description of your event. Include what makes it special!",

  // IMAGE (Use your own)
  image: "/images/events/your-event.jpg", // 800x400px recommended

  // PRICING & TICKETS
  ticketPrice: "Free", // or "$25-45" or "Contact venue"
  website: "https://eventwebsite.com",
  phone: "(573) 555-0123",

  // SPECIAL FLAGS
  featured: true, // Set to true for featured events
  recurring: "Weekly", // Optional: "Daily", "Weekly", "Monthly"

  // ORGANIZER
  organizer: "Event Organizer Name"
}
```

### **Step 3: Add to Events List**
1. Find the `return [` line in `fetchStaticEvents()`
2. Add your new event object before the closing `]`
3. Save the file - done! 🎉

---

## 📸 **Adding Photos & Images**

### **Step 1: Prepare Your Images**
**Recommended sizes:**
- **Business logos**: 200x200px (square)
- **Business hero images**: 800x400px (2:1 ratio)
- **Gallery images**: 600x400px (3:2 ratio)
- **Event images**: 800x400px (2:1 ratio)

### **Step 2: Add Images to Project**
1. Go to: `public/images/`
2. Create folders:
   - `businesses/your-business-name/`
   - `events/` (for event images)
3. Upload your images with descriptive names

### **Step 3: Reference in Code**
Use paths like: `"/images/businesses/your-business-name/photo.jpg"`

---

## 🏷️ **Categories & Subcategories**

### **Current Categories Available:**
- **Dining Out**: Waterfront Dining, Casual Dining, Fine Dining, Fast Food
- **Luxury Real Estate**: Lake Homes, Condos, Vacant Land, Rental Properties
- **Podcast Network**: Interviews, News, Entertainment
- **Luxury Services**: Boat Services, Concierge, Property Management
- **Live Entertainment**: Concerts, Shows, Nightlife
- **Events & Festivals**: Annual Events, Seasonal Events, Community Events
- **Charity & Community**: Non-profits, Community Groups, Fundraisers
- **Local Media**: News, Radio, Publications
- **West Side**: West Side specific businesses
- **LOZ Deals**: Special offers, Discounts, Packages

### **Adding New Categories:**
Edit the `fetchCategories()` function in `businessStore.js`

---

## 🎯 **Business Tier System**

### **Signature Tier** (Premium)
- **Featured placement** in listings
- **Full profile page** with gallery
- **Advertisement slots** available
- **Priority support**

### **Premier Tier** (Standard)
- **Standard listing** with basic details
- **Contact information** displayed
- **Photo gallery** (limited)

### **Curated Tier** (Basic)
- **Basic listing** with name and contact
- **Simple directory** entry

---

## ⚡ **Quick Tips**

### **For Images:**
✅ **Use high-quality photos** - they make a huge difference!
✅ **Compress images** before uploading for faster loading
✅ **Use descriptive filenames** like `logo.jpg`, `interior1.jpg`

### **For Business Info:**
✅ **Keep descriptions under 150 characters** for best display
✅ **Include keywords** that people search for
✅ **Update contact info regularly**

### **For Events:**
✅ **Use clear, exciting titles**
✅ **Include all important details** (time, location, pricing)
✅ **Set featured=true** for your most important events

---

## 🚀 **Advanced Features**

### **Advertisements System**
Want to add promotional banners? Edit the `fetchAds()` function to include:
```javascript
{
  id: 1,
  businessId: 123,
  title: "Special Promotion",
  description: "Limited time offer!",
  image: "/images/ads/promo.jpg",
  category: "Dining Out",
  position: "interstitial", // or "banner"
  validFrom: "2024-07-01",
  validUntil: "2024-07-31"
}
```

### **Seasonal Content**
Add seasonal businesses or events by updating the data files. The app automatically sorts by date and relevance.

---

## 🎉 **You're All Set!**

Your FLOZ app now has **enterprise-level content management** that's as easy as editing a simple text file. No complex backend needed - just update the data and your changes appear instantly!

**Need help?** All the data structure is clearly documented in the code with examples! 🚀