# MJ-Squared

**MJ-Squared** is a modern community platform built with Ruby on Rails 8.0 and Hotwire, designed to create engaging online communities around shared interests and age-appropriate content.

## What is MJ-Squared?

MJ-Squared is a community platform that allows users to:
- **Create and join spaces** based on interests and age groups
- **Share posts** with rich text content and images
- **Engage through comments** and likes
- **Connect with like-minded people** in age-targeted communities

The platform emphasizes **safety and age-targeted content** through category and age group targeting, making it ideal for communities that need to maintain targeted boundaries.tr

## 🚀 Key Features

### **Community Spaces**
- Create themed spaces with categories (gaming, sports, education, etc.)
- Age group targeting (kids, teens, adults)
- Member management and permissions
- Real-time activity feeds

### **Content & Engagement**
- Rich text posts with image uploads
- Nested comments with real-time updates
- Like/unlike functionality
- Age-targeted content filtering

### **Modern UX**
- **Modal dialogs** for all forms (create/edit spaces, posts, comments)
- **Infinite scroll** for seamless browsing
- **Real-time updates** with Hotwire/Turbo
- **Mobile responsive** design
- **Progressive enhancement** (works without JavaScript)

## 🛠️ Technology Stack

- **Ruby on Rails 8.0** - Modern Rails framework
- **Hotwire** - Turbo and Stimulus for dynamic interactions
- **Tailwind CSS** - Utility-first styling
- **PostgreSQL** - Database
- **Active Storage** - File uploads and image handling
- **Friendly ID** - SEO-friendly URLs
- **Pagy** - High-performance pagination

## 🚀 Getting Started

### Prerequisites
- Ruby 3.4+
- Rails 8.0+
- PostgreSQL
- Node.js (for asset compilation)

### Quick Start
```bash
# Clone and navigate
git clone <repository-url>
cd mj-squared

# Install dependencies
bundle install
npm install

# Setup database
rails db:create db:migrate db:seed

# Start the server
rails server
```

Visit `http://localhost:3000` to see the application.

### Development Commands
```bash
# Run tests
rails test

# Run system tests
rails test:system

# Check code quality
rubocop
```

## 🏗️ Architecture Highlights

### **Modal System**
All forms use modal dialogs with proper validation and error handling:
- Spaces: Create/edit with category/age group selection
- Posts: Create/edit with image upload support
- Comments: Inline forms with Turbo Stream integration

### **Infinite Scroll**
- Community page: Automatic space loading
- Space pages: Automatic post loading
- Posts index: All community activity with infinite scroll

### **Real-time Features**
- Live comment updates
- Instant like/unlike feedback
- Real-time form validation
- Seamless navigation without page reloads

## 🎯 Core Models

- **Spaces** - Community areas with categories and age groups
- **Posts** - Rich content with images and text
- **Comments** - Nested discussions on posts
- **Users** - Community members with profiles
- **Categories** - Community and age group classifications

## 🧪 Testing

The application includes comprehensive testing:
- Unit tests for models and controllers
- System tests for user interactions
- Modal system testing
- Infinite scroll testing

## 🚀 Production Ready

MJ-Squared is production-ready with:
- ✅ Proven Hotwire patterns
- ✅ Comprehensive error handling
- ✅ Performance optimization
- ✅ Accessibility compliance
- ✅ Mobile responsive design
- ✅ Progressive enhancement

