# Feature Parity Plan: test-community → mj-squared

## Overview
This document outlines the business features that need to be ported from `test-community` to `mj-squared` to achieve feature parity.

**Status:** `mj-squared` is a fresh Jumpstart install with standard features. `test-community` contains custom business logic and design.

---

## ✅ Already Present (Standard Jumpstart Features)
- User authentication & management
- Account management with multi-tenancy
- Subscriptions & billing (Pay gem)
- API tokens & authentication
- Announcements system
- Connected accounts (OAuth)
- Action Text rich content
- Active Storage file attachments
- Admin interface (Administrate)

---

## 🚧 Business Features to Port

### 1. Community Platform (Reddit-like)
**Priority:** High

**Models:**
- `Space` - Community spaces/groups
- `Post` - User posts within spaces  
- `Comment` - Comments on posts
- `Like` - Like system for posts
- `Membership` - User membership in spaces

**Features:**
- Users can create/join community spaces
- Post content with rich text and images
- Comment threads and discussions
- Like/upvote system
- Space membership management

### 2. Directory & Listings
**Priority:** High

**Models:**
- `Service` - Service listings
- `Specialist` - Professional specialist profiles
- `Resource` - Community resources
- `Testimonial` - User testimonials

**Features:**
- Service directory with categories
- Professional specialist profiles
- Resource library with categorization
- User testimonials and reviews

### 3. Events System
**Priority:** Medium

**Models:**
- `Event` - Community events
- `EventRegistration` - User event registrations
- `EventCategory` - Event categorization

**Features:**
- Event creation and management
- User registration for events
- Event categories and filtering

### 4. Activities System
**Priority:** Medium

**Models:**
- `Activity` - Community activities
- `ActivityCategory` - Activity categorization

**Features:**
- Activity listings
- Category-based organization
- Activity management

### 5. Advanced Categorization System
**Priority:** High (Core Infrastructure)

**Models:**
- `CommunityCategory` - Categories for spaces
- `AgeGroupCategory` - Age-based categorization
- `ServiceCategory` - Service categorization  
- `SpecialistCategory` - Specialist categorization
- `ResourceCategory` - Resource categorization
- `TestimonialCategory` - Testimonial categorization

**Features:**
- Complex many-to-many relationships
- Category-based filtering and organization
- Admin category management

### 6. Address & Location System
**Priority:** Low

**Models:**
- `Address` - Location data for entities

**Features:**
- Geographic location support
- Address management

---

## 🎨 Design & Theme Parity

### Current Status
- **mj-squared**: Fresh Jumpstart theme (light mode only currently)
- **test-community**: Custom design and styling

### Theme Migration Strategy
1. **Extract custom theme** from test-community
2. **Create new theme files** in mj-squared
3. **Apply globally** as default theme
4. **Maintain light-mode-only** setup as requested

---

## 📋 Implementation Phases

### Phase 1: Core Infrastructure
1. **Theme/Design Migration** (Priority 1)
2. **Category System** - Foundation for everything else
3. **Basic Models** - Space, Post, Comment, Like

### Phase 2: Community Platform
1. **Space Management** - Create, join, manage spaces
2. **Content Creation** - Posts with rich text and images
3. **Engagement** - Comments and likes

### Phase 3: Directory Features
1. **Service Listings**
2. **Specialist Profiles** 
3. **Resource Library**
4. **Testimonial System**

### Phase 4: Events & Activities
1. **Event System**
2. **Activity Management**
3. **Registration Systems**

### Phase 5: Polish & Admin
1. **Admin Interface** enhancements
2. **Advanced Filtering**
3. **Search Functionality**
4. **Performance Optimization**

---

## 📁 File Migration Strategy

### Database
- Port all migration files for custom features
- Update schema to match test-community structure
- Migrate seed data patterns

### Controllers
- Port custom controller logic
- Maintain RESTful patterns
- Integrate with Jumpstart authentication

### Views
- Extract custom view templates
- Apply consistent design system
- Maintain responsive layout patterns

### Models
- Port business logic and validations
- Maintain association patterns
- Integrate with Jumpstart concerns

---

## 🔄 Migration Checklist

### Pre-Migration
- [ ] Complete theme/design analysis
- [ ] Document custom business rules
- [ ] Identify data dependencies

### During Migration
- [ ] Create models in dependency order
- [ ] Port migrations incrementally
- [ ] Test associations and validations
- [ ] Verify admin functionality

### Post-Migration
- [ ] Seed data testing
- [ ] Integration testing
- [ ] Performance testing
- [ ] User acceptance testing

---

## 📊 Estimated Effort

| Phase | Features | Estimated Time |
|-------|----------|---------------|
| Phase 1 | Theme + Core Infrastructure | 2-3 days |
| Phase 2 | Community Platform | 3-4 days |
| Phase 3 | Directory Features | 2-3 days |
| Phase 4 | Events & Activities | 1-2 days |
| Phase 5 | Polish & Admin | 1-2 days |

**Total Estimated Time:** 9-14 days

---

## 🚀 Next Steps

1. **Start with Theme Migration** - Extract and apply custom design
2. **Set up development workflow** for incremental feature porting
3. **Begin Phase 1** implementation with category system
4. **Maintain feature branch strategy** for safe integration

---

**Note:** This plan assumes maintaining the current light-mode-only theme setup as requested. The community features are the core differentiator and should be prioritized for complete feature parity.
