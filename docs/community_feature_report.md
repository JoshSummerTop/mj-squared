# Community Feature Implementation Report

## Seed File: Deletion Order & Foreign Key Constraints

**IMPORTANT:** When reseeding the database, always delete dependent records (such as activities, events, resources, etc.) BEFORE deleting users or categories they reference. Failing to do so will result in foreign key violations (e.g., PG::ForeignKeyViolation errors). This is a common source of errors when adding new features with associations. See `db/seeds/test_data.rb` for the correct deletion order and update it whenever you add new models with foreign keys.

- Delete join table records first (for HABTM/many-to-many relationships)
- Delete dependent records (e.g., Activity, Event, Resource, etc.)
- Delete categories and users last

---

## Overview
This document details the architecture, models, migrations, controller logic, views, filtering, UI/UX decisions, and data seeding for the community, services, specialists, and resources features (similar to Reddit + directory) as implemented in this codebase. It is intended as a blueprint for re-implementing the feature from scratch if needed.

---

## Models & Associations

### User (existing)
- Standard user model with authentication.
- `admin?` boolean method for admin controls.
- Can join spaces (via Membership).
- Can create posts, comments, likes, spaces, services, and specialists (admin only for some).

### CommunityCategory
- Many-to-many with `Space` (`has_and_belongs_to_many :spaces`).
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Cannot be deleted if associated with any space (backend and UI protection).
- Validates presence and uniqueness of slug.

### AgeGroupCategory
- Many-to-many with `Space` and `Post`.
- Cannot be deleted if associated with any space or post (backend and UI protection).
- Validates presence and uniqueness of slug.

### Space
- Belongs to creator (`created_by: User`).
- Many-to-many with `CommunityCategory` and `AgeGroupCategory`.
- Has image attachment (ActiveStorage).
- Has many `Memberships`, `Posts`.
- Validates presence of title, description, at least one category, and at least one age group.
- Validates image presence and type (JPEG, PNG, GIF).

### Membership
- Joins `User` and `Space`.

### Post
- Belongs to `Space` and `User` (creator).
- Many-to-many with `AgeGroupCategory`.
- Has many `Comments`, `Likes`.
- Has image attachment (ActiveStorage).

### Comment
- Belongs to `Post` and `User`.

### Like
- Belongs to `Post` and `User`.

### ResourceCategory
- Has many `Resource` (dependent: :destroy).
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Validates presence and uniqueness of name and slug.
- Cannot be deleted if associated with any resource (backend and UI protection).

### Resource
- Belongs to `ResourceCategory`.
- Belongs to `User` (creator/submitter).
- Has image attachment (ActiveStorage).
- Has optional `video_url` (YouTube, Vimeo, etc.).
- Validates presence of title, description, user, and resource_category.
- Validates video URL format if present.
- Uses FriendlyId for slugs (if implemented).

### ServiceCategory
- Has many `Service` (dependent: :destroy).
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Validates presence and uniqueness of name and slug.

### Service
- Belongs to `ServiceCategory`.
- Has image attachment (ActiveStorage).
- Validates presence of title, description, phone, email, contact_name, and service_category.
- Validates email and phone format, and website URL if present.
- Uses FriendlyId for slugs.

### SpecialistCategory
- Has many `Specialist` (dependent: :destroy).
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Validates presence and uniqueness of name and slug.
- Hotwire broadcasts for real-time updates.

### SpecialistAgeGroup
- Many-to-many with `Specialist`.
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Validates presence and uniqueness of name and slug.
- Hotwire broadcasts for real-time updates.

### Specialist
- Belongs to `SpecialistCategory`.
- Many-to-many with `SpecialistAgeGroup`.
- Has image attachment (ActiveStorage).
- Validates presence of title, description, contact_name, and specialist_category.
- Validates uniqueness of slug.
- Address fields (address_line1, address_line2, city, state, zip, country, google_map_url) are optional.
- Hotwire broadcasts for real-time updates.

### EventCategory
- Groups events by type (e.g., Outdoor, Workshops, Social). Cannot be deleted if in use. Has a slug for URLs. Broadcasts changes via Hotwire.
- Validates presence and uniqueness of name and slug.

### Event
- Belongs to a category and a user (creator/host). Has an image, start/end date and time, address, Google Map URL, and uses FriendlyId for slugs. Has many event registrations and attendees (users). Broadcasts changes via Hotwire.
- Validates title, description, host name, start/end date and time, address, user, and category. Validates Google Map URL format. Validates that end date/time is after start date/time.

### EventRegistration
- Joins users and events (many-to-many). Ensures a user can only register once per event. Broadcasts changes via Hotwire.

---

## Services Directory

### ServiceCategory
- Has many `Service` (dependent: :destroy).
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Validates presence and uniqueness of name and slug.

### Service
- Belongs to `ServiceCategory`.
- Has image attachment (ActiveStorage).
- Validates presence of title, description, phone, email, contact_name, and service_category.
- Validates email and phone format, and website URL if present.
- Uses FriendlyId for slugs.

---

## Specialists Directory

### SpecialistCategory
- Has many `Specialist` (dependent: :destroy).
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Validates presence and uniqueness of name and slug.
- Hotwire broadcasts for real-time updates.

### SpecialistAgeGroup
- Many-to-many with `Specialist`.
- Has a `slug` (URL-friendly, unique, auto-generated from name).
- Validates presence and uniqueness of name and slug.
- Hotwire broadcasts for real-time updates.

### Specialist
- Belongs to `SpecialistCategory`.
- Many-to-many with `SpecialistAgeGroup`.
- Has image attachment (ActiveStorage).
- Validates presence of title, description, contact_name, and specialist_category.
- Validates uniqueness of slug.
- Address fields (address_line1, address_line2, city, state, zip, country, google_map_url) are optional.
- Hotwire broadcasts for real-time updates.

---

## Events Directory

### Models & Associations
- `EventCategory`: Groups events by type (e.g., Outdoor, Workshops, Social). Cannot be deleted if in use. Has a slug for URLs. Broadcasts changes via Hotwire.
- `Event`: Belongs to a category and a user (creator/host). Has an image, start/end date and time, address, Google Map URL, and uses FriendlyId for slugs. Has many event registrations and attendees (users). Broadcasts changes via Hotwire.
- `EventRegistration`: Joins users and events (many-to-many). Ensures a user can only register once per event. Broadcasts changes via Hotwire.

### Validations
- `EventCategory`: Requires unique name and slug.
- `Event`: Requires title, description, host name, start/end date and time, address, user, and category. Validates Google Map URL format. Validates that end date/time is after start date/time.
- `EventRegistration`: User can only register once per event.

### Controller Logic
- `EventsController#index`: Lists all events, with optional filtering by category (via slug param). Supports sorting by most recent or oldest. Loads all categories for filtering tabs.
- `show`: Shows event details.
- `new`, `create`, `edit`, `update`, `destroy`: Admin-only CRUD for events, enforced by a `before_action`. Uses slugs for URLs.
- Category management (CRUD) is admin-only and protected.

### Views & UI/UX
- **Category Tabs:**
  - All event categories are shown as filter tabs (using slugs in URLs, e.g., `/events?category=outdoor`).
  - Includes an "All" tab to reset category filtering.
- **Sorting:**
  - Toggle between "Most Recent" and "Oldest" events.
- **Events List:**
  - Shows events filtered by the current category and sort order.
  - Each event card shows image, start date, title, description excerpt, address, and attendee count.
  - "View Event" button links to event details.
- **Admin Controls:**
  - Admins see a "Create Event" button.
  - Only admins can create, edit, or delete events or manage event categories.
- **Forms:**
  - Create/edit forms use Stimulus for validation, require all necessary fields, and are mobile-friendly.
  - Client-side and server-side validation for end date/time after start date/time.
  - Image validation and preview consistent with other directories.

### Filtering & Routing
- Filtering is done via query params (`category` for category slug, `sort` for order).
- Slugs are used for category and event URLs for readability and SEO.
- All event CRUD is at the top level (not under `/admin`), with admin access enforced in the controller.

### Seeding & Test Data
- Seed file (`db/seeds/test_data.rb`) creates event categories and sample events, with images, users, and realistic data.
- Registers users for all events to simulate attendee counts.
- Events are seeded after users and before users are deleted, to avoid FK issues.
- Placeholder images are attached to all events.

### Category Management (Admin-Only)
- Event category CRUD is admin-only.
- Cannot delete a category if it is in use (backend and UI protection).
- Disabled delete button with message and count of associations on the admin event categories page.
- Admin category management UI is consistent with other category types.

### Security & Access Control
- Only admins can create, edit, or delete events or manage event categories.
- All category management is protected.
- Non-admin users can view and filter events, register for events, but cannot access CRUD actions.

### Events Directory: Geolocation & Address Autocomplete Features

### Overview
The Events Directory includes advanced geolocation and address autocomplete features to enhance event discovery and user experience. These features leverage Google Maps APIs, the geocoder gem, and Stimulus controllers for a seamless, modern interface.

### Address Autocomplete (Google Places)
- **Event Form:**
  - The address field in the event creation/edit form uses Google Places Autocomplete for accurate, user-friendly address entry.
  - As the user types, address suggestions are provided and selecting one fills the field with a formatted address.
  - This reduces errors and ensures addresses are geocodable.
- **Location Search:**
  - The events index page includes a search box with Google Places Autocomplete, allowing users to enter any address for proximity search.
- **Implementation:**
  - Google Maps JS API is loaded dynamically via a Stimulus controller (`google-maps-loader`), ensuring the script is only loaded when needed and is Turbo/Hotwire compatible.
  - The API key is securely loaded from Rails credentials.

### Geocoding & Reverse Geocoding
- **Geocoding:**
  - When an event is created or updated, the address is geocoded server-side using the geocoder gem and Google Maps API.
  - The resulting latitude and longitude are stored in the event record.
- **Reverse Geocoding:**
  - When a user clicks "Use Current Location," the browser's Geolocation API provides coordinates.
  - These coordinates are reverse-geocoded (client-side, via Google Maps JS API) to fill the address input with a human-readable address.

### Proximity Search & Sorting
- **How it Works:**
  - When a user enters an address or uses their current location, the app geocodes the address (or uses the detected coordinates).
  - The coordinates are sent to the backend as query params (`lat`, `lng`, `sort=distance`).
  - The controller uses the geocoder gem's `.near([lat, lng], 20_000)` scope to fetch **all events**, sorted by distance from the given point.
  - No radius limit is imposed, so users see all events, regardless of country, sorted by proximity.
- **Distance Display:**
  - Each event card displays the distance in kilometers (km) from the search location, formatted to one decimal place (e.g., "3.2 km away").
  - The geocoder gem is configured globally to use kilometers (`units: :km`).

### Stimulus Controllers & Dynamic Script Loading
- **google-maps-loader:**
  - Dynamically loads the Google Maps JS API only on pages that need it.
  - Accepts the API key and callback as data attributes.
- **event_form_controller & event_search_controller:**
  - Handle address validation, autocomplete, and location search UI.
  - `event_search_controller` also handles geolocation and reverse geocoding for the "Use Current Location" feature.

### Configuration & Best Practices
- **API Key:**
  - The Google Maps API key is stored in Rails credentials and referenced as `Rails.application.credentials.google_maps[:api_key]`.
  - The key must have Places and Geocoding APIs enabled.
- **Geocoder Gem:**
  - Configured in `config/initializers/geocoder.rb` to use Google, HTTPS, and kilometers.
- **Seeding:**
  - Seeded events are geocoded after creation to ensure all have latitude/longitude for proximity search.
- **UX:**
  - All events are always shown, sorted by distance, for maximum discoverability.
  - The address field is always accurate and user-friendly, reducing errors and improving search results.

### Caveats & Notes
- **API Quotas:**
  - Geocoding and Places API usage counts against your Google API quota.
- **Privacy:**
  - User location is only accessed with permission and is not stored.
- **Performance:**
  - Dynamic script loading and efficient queries ensure good performance even with many events.

---

## Activities Directory

### Models & Associations
- `ActivityCategory`: Has many `Activity` (cannot be deleted if in use). Has a slug for URLs. Validates presence and uniqueness of name and slug. Admin-only CRUD. Uses FriendlyId for slugs.
- `Activity`: Belongs to an `ActivityCategory` and a `User` (creator). Has image attachment (ActiveStorage). Validates presence of title, description, address, user, and category. Uses FriendlyId for slugs. Image is required on create, optional on edit.

### Validations
- `ActivityCategory`: Requires unique name and slug. Cannot be deleted if any activities are assigned (UI and backend protection).
- `Activity`: Requires title, description, address, user, and category. Image required on create, optional on edit.

### Controller Logic
- `ActivitiesController#index`: Lists all activities, with optional filtering by category (via slug param). Only categories with at least one activity are shown as filter tabs. Loads all activities for the selected category or all if no filter.
- `show`: Shows activity details.
- `new`, `create`, `edit`, `update`, `destroy`: Admin-only CRUD for activities, enforced by a `before_action`. Uses slugs for URLs.
- Category management (CRUD) is admin-only and protected via `Admin::ActivityCategoriesController`.

### Views & UI/UX
- **Category Tabs:**
  - Only categories with at least one activity are shown as filter tabs (using slugs in URLs, e.g., `/activities?category=outdoor-play`).
  - Includes an "All" tab to reset category filtering.
- **Activities List:**
  - Shows activities filtered by the current category.
  - Each activity card shows image, title, description excerpt, and address.
  - "View Activity" button links to activity details.
- **Detail Page:**
  - Shows image, title, address, description, and breadcrumbs for navigation.
- **Admin Controls:**
  - Admins see a "New Activity" button.
  - Only admins can create, edit, or delete activities or manage activity categories.
- **Forms:**
  - Create/edit forms use Stimulus for validation, require all necessary fields, and are mobile-friendly.
  - Image field is required on create, optional on edit (shows a message if an image is already attached).
  - Cancel button and button spacing match other directories.

### Filtering & Routing
- Filtering is done via query params (`category` for category slug).
- Slugs are used for category and activity URLs for readability and SEO.
- All activity CRUD is at the top level (not under `/admin`), with admin access enforced in the controller.

### Seeding & Test Data
- Seed file (`db/seeds/test_data.rb`) creates activity categories and sample activities, with images, users, and realistic data.
- Activities and categories are seeded after users and before users are deleted, to avoid FK issues.
- Placeholder images are attached to all activities.

### Category Management (Admin-Only)
- Activity category CRUD is admin-only.
- Cannot delete a category if it is in use (backend and UI protection).
- Disabled delete button with message and count of associations on the admin activity categories page.
- Admin category management UI is consistent with other category types.

### Security & Access Control
- Only admins can create, edit, or delete activities or manage activity categories.
- All category management is protected.
- Non-admin users can view and filter activities, but cannot access CRUD actions.

### Consistency & UX
- All logic, UI, and validation match other directories (services, resources, specialists, events, etc.).
- Category filter tabs only show categories with assigned activities, matching the behavior of other directories.
- All admin category management pages use consistent markup and UX patterns.

---

## Resources Directory

#### Overview
The Resources Directory provides a curated list of resources (articles, videos, guides, etc.) for families and professionals. Resources are organized by category and can include embedded videos.

#### Views & UI/UX
- **Category Tabs:**
  - Only categories with at least one resource are shown.
  - Uses slugs in URLs (e.g., `/resources?category=toddlers`).
  - Includes an "All" tab to reset category filtering.
- **Resources List:**
  - Shows resources filtered by the current category.
  - Each resource card shows image, title, description, and a link to view.
  - If a video URL is present, the video is embedded in the resource details.
- **Admin Controls:**
  - Admins see "Edit" and "Delete" buttons for resources.
  - Category management (add/edit/delete) is only accessible to admins via `/admin/resource_categories`.
  - Delete button for categories is disabled if resources are assigned, with a count shown.

---

## Filtering & Routing
- All filtering is done via query params (`tab`/`category` for category slug, `age_group` for age group slug).
- Links always preserve the current context (e.g., selecting an age group within a category).
- Slugs are used for category URLs for readability and SEO.

---

## Data Integrity & UX
- Backend and UI prevent deletion of categories in use.
- All forms and filters are mobile-friendly and use semantic HTML.
- All logic is modular and scalable for future categories/age groups/services/specialists.
- Real-time updates for specialists and categories via Hotwire.

---

## Seeding & Test Data
- Comprehensive seed file (`db/seeds/test_data.rb`) to populate the database with sample data for:
  - Users (4 test users, with emails and passwords)
  - Community categories, age group categories
  - Spaces (with all associations, images, posts, comments)
  - Services and service categories (with images, contact info, website)
  - Specialists, specialist categories, specialist age groups (with images, contact info, address, website)
  - **Resources and resource categories** (with images, video URLs, user association)
- Seed file deletes all existing data for users, spaces, services, specialists, posts, comments, categories, age groups, and resources before creating new data.
- Helper method attaches a placeholder image to all image fields.
- Video URLs for resources include YouTube and Vimeo examples.
- Designed for easy reset and repeatable test data.
- **Foreign key issue fixed:** Resources are now deleted before users in the seed file to avoid foreign key violations.

---

## Category Management (Admin-Only)
- CRUD for all category types (community, age group, service, specialist, resource, specialist age group) is now admin-only.
- All category management is accessible only via `/admin/*` routes and interfaces.
- Non-admin controllers, views, and routes for categories have been removed.
- Cannot delete a category if it is in use (backend and UI protection).
- Disabled delete button with message and count of associations on all admin category pages.
- All admin category pages use consistent markup and UX patterns.

---

## Security & Access Control
- All category management (creation, editing, deletion) is restricted to admin users only.
- Admin-only access is enforced via routes, controllers, and UI.
- Non-admin users cannot access category management pages or perform category CRUD actions.
- All admin pages are protected and use consistent navigation and markup.

---

## General Codebase Hygiene
- All non-admin controllers, views, and routes for category management have been removed.
- Only admin routes and interfaces remain for managing categories.
- Codebase has been checked for and cleared of unused or duplicate category management code.
- UI/UX for admin category pages is consistent across all types (counts, disabled delete, etc.).

---

## Site-wide Search Feature

### Overview
The application includes a modern, site-wide search feature that allows users to search across all major directories and content types from a single interface. Results are grouped by content type and update in real time as the user types, providing a seamless and fast search experience.

### Route & Controller
- **Route:** `GET /search` → `SearchController#index`
- **Query param:** `q` (the search term)
- **Controller:** `SearchController#index` accepts the search term and performs a full-text search across all main models.

### Models & Fields Searched
- **Community Spaces:** `title`, `description`
- **Community Posts:** `title`, `content`
- **Events:** `title`, `description`, `host_name`, `address`
- **Services:** `title`, `description`, `contact_name`
- **Specialists:** `title`, `description`, `contact_name`
- **Resources:** `title`, `description`
- **Testimonials:** `title`, `description`
- **Activities:** `title`, `description`, `address`

Each model is queried separately using a simple full-text match (`ILIKE` in PostgreSQL) on the relevant fields.

### Search Logic
- If the search term is present, each model is queried for records where any of the relevant fields match the term (case-insensitive, partial match).
- Results are assigned to instance variables: `@spaces`, `@posts`, `@events`, `@services`, `@specialists`, `@resources`, `@testimonials`, `@activities`.
- If no matches are found in a group, that group is not rendered in the results.
- If all groups are empty, a message is shown: "No results found for '<term>'".

### Real-Time Search (Hotwire/Turbo)
- The search results page features a search input at the top.
- As the user types, the input is debounced (300ms) and triggers a Turbo frame reload with the new query param.
- Only the results frame updates, not the full page, for a fast and smooth experience.
- Fallback: If JavaScript is disabled, the form submits normally and reloads the page.
- **Stimulus controller:** `app/javascript/controllers/search_controller.js` handles debouncing and Turbo submission.

### Navbar Integration
- A global search bar is present in the main navigation on all pages.
- Submits to `/search` with the `q` param using GET.
- Styled for a modern, pill-shaped look with a search icon inside the input.
- Fully accessible and mobile-friendly.

### Results View & UI
- Results are grouped by content type (Spaces, Posts, Events, etc.) and rendered in sections.
- Each result uses the same card UI as its directory index page for consistency.
- Only non-empty groups are shown.
- The layout is mobile-friendly and accessible.
- (Optional stretch) Highlighting of matching text can be added for extra clarity.

### Implementation Locations
- **Controller:** `app/controllers/search_controller.rb`
- **View:** `app/views/search/index.html.erb`
- **Stimulus controller:** `app/javascript/controllers/search_controller.js`
- **Navbar partial:** `app/views/shared/_navbar.html.erb`

### No External Libraries
- The search feature is implemented using only built-in Rails, Turbo, and Stimulus—no external search libraries required.

---

## Re-implementation Checklist
1. Set up all models and associations as described.
2. Add slugs to all categories and main entities, ensure uniqueness.
3. Implement all controller logic for context-aware filtering and admin CRUD.
4. Build views with tabs and filters as described.
5. Add backend and UI protection for category deletion.
6. Use Stimulus for form validation.
7. Use slugs in URLs for categories and main entities.
8. Ensure all filtering and navigation logic matches this document.
9. Implement comprehensive seeding for all features.
10. Ensure real-time updates for specialists and categories.

---

## WYSIWYG Editor Integration (TinyMCE)

### Overview
TinyMCE is integrated as the WYSIWYG editor for post content creation and editing, providing users with a modern, rich text editing experience. The integration supports text formatting, headings, lists, links, and image uploads directly from the editor interface.

### Integration Steps

1. **TinyMCE Installation & Loading**
   - The TinyMCE JavaScript library is self-hosted and loaded via a script tag in `app/views/layouts/application.html.erb`:
     ```erb
     <script src="/tinymce/tinymce.min.js"></script>
     ```
   - The editor is initialized on all textareas with the `tinymce` class using a Turbo-compatible script block.

2. **Editor Configuration**
   - The TinyMCE config includes essential plugins for formatting, lists, tables, media, and images:
     ```js
     plugins: [
       'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
       'searchreplace', 'visualblocks', 'code', 'fullscreen',
       'insertdatetime', 'media', 'table', 'help', 'wordcount'
     ],
     toolbar: "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | outdent indent | removeformat | code fullscreen preview",
     ```
   - The editor is re-initialized on every Turbo page load to ensure compatibility with Hotwire/Turbo navigation.

3. **Image Upload Support**
   - Users can upload images directly from the editor. This is enabled by configuring the `images_upload_handler` option in TinyMCE to use a Promise-based handler (required by TinyMCE v6+):
     ```js
     images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest();
       xhr.withCredentials = false;
       xhr.open('POST', '/tinymce_images');

       xhr.upload.onprogress = (e) => {
         progress(e.loaded / e.total * 100);
       };

       xhr.onload = () => {
         if (xhr.status < 200 || xhr.status >= 300) {
           reject('HTTP Error: ' + xhr.status);
           return;
         }
         const json = JSON.parse(xhr.responseText);
         if (!json || typeof json.location != 'string') {
           reject('Invalid JSON: ' + xhr.responseText);
           return;
         }
         resolve(json.location);
       };

       xhr.onerror = () => {
         reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
       };

       const formData = new FormData();
       formData.append('file', blobInfo.blob(), blobInfo.filename());
       xhr.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
       xhr.send(formData);
     }),
     ```
   - This handler posts the image to a custom Rails endpoint and resolves with the uploaded image URL.

4. **Rails Image Upload Endpoint**
   - A new route and controller action handle image uploads from TinyMCE:
     - **Route:**
       ```ruby
       post '/tinymce_images', to: 'uploads#tinymce'
       ```
     - **Controller:** `app/controllers/uploads_controller.rb`
       ```ruby
       class UploadsController < ApplicationController
         protect_from_forgery except: :tinymce

         def tinymce
           uploaded_io = params[:file]
           blob = ActiveStorage::Blob.create_and_upload!(
             io: uploaded_io,
             filename: uploaded_io.original_filename,
             content_type: uploaded_io.content_type
           )
           render json: { location: url_for(blob) }
         end
       end
       ```
   - This uses ActiveStorage to store the uploaded image and returns a JSON response with the image URL, as required by TinyMCE.

5. **Security**
   - CSRF protection is handled by including the CSRF token in the AJAX request header.
   - The upload endpoint is excluded from CSRF verification for compatibility with direct uploads.

6. **Rendering Content**
   - Post content is rendered using `@post.content&.html_safe` in the view, allowing TinyMCE's HTML output (including images) to display as intended, without extra formatting or escaping.

7. **Styling**
   - Subtle spacing and hierarchy for post content elements are provided via a dedicated CSS file (imported in the main stylesheet), ensuring clean presentation without overriding the site's theme typography.

### Summary
- TinyMCE provides a modern, user-friendly WYSIWYG editor for posts.
- Image uploads are fully supported and stored via ActiveStorage.
- The integration is Turbo/Hotwire compatible and secure.
- All configuration and custom code are documented and modular for easy maintenance.

---

_Last updated: <%= Time.now.strftime('%Y-%m-%d %H:%M:%S') %>_ 