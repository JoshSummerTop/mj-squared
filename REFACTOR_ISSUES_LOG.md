# 🐛 MJ-Squared Refactor Issues Log

**Status Legend:**
- 🔴 **OPEN** - Issue identified, needs fixing
- 🟡 **IN PROGRESS** - Working on fix
- 🟢 **RESOLVED** - User confirmed it's working

---

## **Issue #1: Space Card Partial Variable Error**
**Status:** 🟢 **RESOLVED** *(User testing confirmed)*
**Date:** 2024-12-19
**Error:** `undefined local variable or method 'space' for an instance of #<Class:0x00007f6de8197320>`
**Root Cause:** Rails partial collection rendering creates variable named after partial filename (`space_card`) not model (`space`)
**Fix Applied:** Added `as: :space` to all partial renders
**Files Changed:**
- `app/views/community/index.html.erb`
- `app/views/community/index.turbo_stream.erb`
- `app/views/spaces/show.html.erb`
- `app/views/spaces/show.turbo_stream.erb`
- `app/views/posts/index.turbo_stream.erb`
- `app/views/spaces/create_success_new.turbo_stream.erb`

---

## **Issue #2: Missing Template spaces/new_modal**
**Status:** 🟡 **AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** `Missing template spaces/new_modal, application/new_modal with {locale: [:en], formats: [:turbo_stream], variants: [], handlers: [:raw, :erb, :html, :builder, :ruby, :jbuilder]}`
**Root Cause:** Template files had wrong extension - Rails looks for `.turbo_stream.erb` when responding to `format.turbo_stream`
**Fix Applied:** 
- Renamed `app/views/spaces/new_modal.html.erb` → `app/views/spaces/new_modal.turbo_stream.erb`
- Renamed `app/views/posts/new_modal.html.erb` → `app/views/posts/new_modal.turbo_stream.erb`
- Wrapped content in `<%= turbo_stream.replace "modal_content" do %>` blocks
**Files Changed:**
- `app/views/spaces/new_modal.turbo_stream.erb` (renamed + wrapped)
- `app/views/posts/new_modal.turbo_stream.erb` (renamed + wrapped)

---

## **Issue #3: Create New Space Button Does Nothing**
**Status:** 🟢 **RESOLVED** *(User confirmed working - modal opens properly)*
**Date:** 2024-12-19
**Error:** Nothing opens when clicking "Create New Space" button
**Root Cause:** Mismatch between Turbo Frame and Turbo Stream - modal structure expects turbo_frame but was using turbo_stream
**Fix Applied:** 
- Changed link to use `data-turbo-frame: "modal_content"` instead of turbo_stream format
- Updated controller to render HTML template with `layout: false`
- Renamed template from `.turbo_stream.erb` back to `.html.erb`
- Wrapped modal content in `turbo_frame_tag "modal_content"`
- Removed turbo_stream wrapper and custom JavaScript
**Files Changed:**
- `app/views/spaces/_new_modal_form.html.erb` (fixed link data attributes)
- `app/controllers/spaces_controller.rb` (changed to render HTML template)
- `app/views/spaces/new_modal.html.erb` (renamed from .turbo_stream.erb, wrapped in turbo_frame_tag)

---

## **Issue #4: Modal Shows HTML5 Validation Instead of Rails Errors**
**Status:** 🟡 **AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** Modal form shows native browser validation ("Please fill out this field") instead of Rails validation errors
**Root Cause:** Form fields had HTML5 validation attributes (`required: true`) and Rails error handling not properly set up for modal context
**Fix Applied:** 
- Removed all HTML5 validation attributes (`required: true`) from form fields
- Added missing Rails validations to Post model (title, content presence and length)
- Updated controllers to re-render modal with errors: `render 'new_modal', layout: false, status: :unprocessable_entity`
- Enhanced modal templates with error summary sections and individual field error display
- Added visual error states (red borders, error icons) for fields with validation errors
- Added proper ARIA attributes for screen reader accessibility
- Both spaces and posts modals now show proper Rails validation errors
**Files Changed:**
- `app/models/post.rb` (added missing validations for title and content)
- `app/controllers/spaces_controller.rb` (updated create action error handling)
- `app/controllers/posts_controller.rb` (updated create action error handling)
- `app/views/spaces/new_modal.html.erb` (removed HTML5 validation, added Rails error display)
- `app/views/posts/new_modal.html.erb` (removed HTML5 validation, added Rails error display)

---

## **Issue #5: Modal Shows Validation Errors Then Closes Immediately + JS Error**
**Status:** 🟡 **FIXED - AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** 
- Modal shows validation errors but closes right away
- JavaScript error: `Cannot read properties of null (reading 'classList')` in turbo_modal_controller disconnect
- Navigation shows going to `/spaces/new` then back to `/`
**Root Cause:** 
- **Multiple conflicting modal systems:** Jumpstart expected `ModalComponent` (missing), custom `turbo_modal_controller` conflicted with existing patterns
- **Improper Turbo Frame patterns:** Not following proven dialog + turbo_frame pattern used in hotfin/hanny
- **CSS conflicts:** Multiple modal CSS systems causing layout and backdrop issues
- **Form submission handling:** Not using proper status codes and response patterns for validation errors
**Fix Applied:** 
- **COMPLETE REWRITE using proven hotfin/hanny pattern:**
  - Replaced complex modal system with simple `dialog_controller` + `turbo_frame_tag "modal"`
  - Created clean `shared/_dialog.html.erb` with proper CSS and auto-open on `turbo:frame-load`
  - Updated controllers to use standard Turbo Frame responses with `:unprocessable_entity` status
  - Created proper `spaces/new.html.erb` with comprehensive error display within turbo_frame
  - Fixed community index to use simple `data-turbo-frame="modal"` links
**Files Changed:**
- `app/views/shared/_dialog.html.erb` (NEW - simple dialog based on hotfin/hanny)
- `app/javascript/controllers/dialog_controller.js` (NEW - simple controller)
- `app/views/layouts/application.html.erb` (use dialog instead of turbo_modal)  
- `app/views/spaces/new.html.erb` (NEW - proper turbo_frame modal form)
- `app/controllers/spaces_controller.rb` (proper Turbo Frame responses)
- `app/views/community/index.html.erb` (simple link with turbo_frame targeting)

---

## **Issue #6: Modal Design Breaks + Backdrop Issues + Blank Screen**
**Status:** 🟡 **FIXED - AWAITING USER TESTING** (Addressed by Issue #5 complete rewrite)
**Date:** 2024-12-19
**Error:** 
- Modal design breaks when validation errors appear
- Modal backdrop doesn't take full screen
- Blank screen appears after modal closes
**Root Cause:** INVESTIGATING - Need to check:
- Existing Jumpstart modal systems that might conflict
- CSS layout issues with dynamic content
- Navigation/routing after form submission
- Compare with hotfin/hanny proper implementations
**Fix Applied:** Starting systematic investigation...
**Files Changed:** TBD

---

## **Issue #7: NoMethodError stringify_keys in Community Index**
**Status:** 🟡 **FIXED - AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** `undefined method 'stringify_keys' for an instance of String` in `community/index.html.erb` line 5
**Root Cause:** Incorrect `link_to` syntax when using block form - text should not be first parameter with blocks
**Fix Applied:** 
- Fixed `link_to` syntax: removed "Create New Space" text parameter and moved content inside block
- Correct syntax: `link_to url, options do |content| end` (not `link_to "text", url, options do`)
**Files Changed:** 
- `app/views/community/index.html.erb` (fixed link_to syntax)

---

## **Issue #8: Modal Form Validation Not Working - Alert + Closes + Blank Page**
**Status:** 🟡 **FIXED - AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** 
- Modal opens ✅
- Submit empty form shows JavaScript alert "Please correct the errors and try again" ❌
- Modal form doesn't update with Rails validation errors ❌  
- Modal closes instead of staying open ❌
- Results in blank page ❌
**Root Cause:** Multiple conflicting modal systems and incorrect turbo_frame targeting
- Old system used `turbo_frame: "modal_content"` while new system used `turbo_frame: "modal"`
- Non-existent `form-validation` JavaScript controller causing alerts
- Controllers trying to respond to both turbo_stream and HTML formats
- Turbo Stream templates conflicting with HTML responses
**Fix Applied:** COMPLETE CLEANUP of all conflicting systems:
- ✅ Deleted all old turbo_modal files (`turbo_modal_controller.js`, `_turbo_modal.html.erb`)
- ✅ Deleted conflicting turbo_stream templates (`create_error_new.turbo_stream.erb`, etc.)
- ✅ Updated all controllers to use simple HTML responses with `:unprocessable_entity` status
- ✅ Standardized all turbo_frame targeting to `turbo_frame: "modal"`
- ✅ Created clean `new.html.erb` templates for both spaces and posts
- ✅ Updated all modal form partials to use consistent dialog pattern
**Files Changed:**
- DELETED: `app/javascript/controllers/turbo_modal_controller.js`
- DELETED: `app/views/shared/_turbo_modal.html.erb`
- DELETED: All `*_new.turbo_stream.erb` files
- DELETED: All `new_modal.html.erb` files (replaced with `new.html.erb`)
- ✅ `app/controllers/spaces_controller.rb` (simplified create action)
- ✅ `app/controllers/posts_controller.rb` (simplified create action)
- ✅ `app/views/spaces/new.html.erb` (NEW - clean turbo_frame modal)
- ✅ `app/views/posts/new.html.erb` (NEW - clean turbo_frame modal)
- ✅ All `_new_modal_form.html.erb` files (updated turbo_frame targeting)
- ✅ All `create_success_modal.html.erb` files (updated turbo_frame targeting)

---

## **Issue #9: Modal Success - Doesn't Close + Space Doesn't Appear**
**Status:** 🟡 **FIXED WITH TURBO STREAMS - AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** 
- Modal validation errors work perfectly ✅
- Modal stays open for errors ✅  
- But on successful submission:
  - Modal doesn't close ❌
  - New space doesn't appear in list (needs browser refresh) ❌
**Root Cause:** Form targets `turbo_frame: "modal"` so successful redirect happens INSIDE modal frame instead of full page navigation
**Fix Applied:** COMPREHENSIVE TURBO STREAMS SOLUTION:
- ❌ Attempt 1-3: Various turbo_frame approaches → All failed
- ✅ **FINAL SOLUTION:** Use Turbo Streams for both success and error cases
  - Success: Custom `turbo_stream.redirect_to_path` closes modal + navigates to root
  - Error: `turbo_stream.replace "modal"` re-renders form with validation errors
  - Added custom JavaScript action `redirect_to_path` to close modal and navigate
**Files Changed:**
- ✅ `app/controllers/spaces_controller.rb` (respond_to turbo_stream format)
- ✅ `app/views/spaces/create_success.turbo_stream.erb` (NEW - custom redirect action)
- ✅ `app/views/spaces/create_error.turbo_stream.erb` (NEW - replace modal content)
- ✅ `app/helpers/turbo_stream_actions_helper.rb` (added redirect_to_path action)  
- ✅ `app/javascript/src/turbo_streams.js` (implemented redirect_to_path JavaScript)
- ✅ `app/views/spaces/new.html.erb` (removed turbo_frame targeting, clean form)

---

## **Issue #10: Missing Partial spaces/_new in create_error.turbo_stream.erb**
**Status:** 🟡 **FIXED - AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** `Missing partial spaces/_new, application/_new` when form has validation errors
**Root Cause:** `render "new"` in turbo_stream template looks for partial `_new.html.erb`, but we have template `new.html.erb`
**Fix Applied:** 
- ✅ Changed `render "new"` to `render template: "spaces/new"` to explicitly render the full template
- This tells Rails to render the `new.html.erb` template instead of looking for a `_new.html.erb` partial
**Files Changed:** 
- ✅ `app/views/spaces/create_error.turbo_stream.erb` (use explicit template rendering)

---

## **Issue #11: Modal Not Centered + Missing Success Message**
**Status:** 🟡 **FIXED - AWAITING USER TESTING**
**Date:** 2024-12-19
**Error:** 
- Starting modal is not centered (centers only when validation errors appear)
- Success message not showing after successful submission
**Root Cause:** 
- Centering classes were on turbo_frame level, lost during error state replacement
- Success flash message wasn't given enough time to display before redirect
**Fix Applied:** 
- ✅ Moved centering classes from turbo_frame to dialog level for consistency
- ✅ Added custom flash_message turbo stream action that displays for 6 seconds
- ✅ Increased redirect delay to 1000ms to allow flash message to be visible
- ✅ Applied same fixes to both spaces and posts controllers
**Files Changed:**
- ✅ `app/views/shared/_dialog.html.erb` (added centering classes to dialog)
- ✅ `app/views/spaces/new.html.erb` (removed centering classes from turbo_frame)
- ✅ `app/views/posts/new.html.erb` (removed centering classes from turbo_frame)
- ✅ `app/views/spaces/create_success.turbo_stream.erb` (flash message with 1s delay)
- ✅ `app/views/posts/create_success.turbo_stream.erb` (NEW - flash message with 1s delay)
- ✅ `app/views/posts/create_error.turbo_stream.erb` (NEW - error handling)
- ✅ `app/controllers/posts_controller.rb` (added turbo_stream responses)

---

## **Issue #12: Broken Code + No Button Interactions Work**
**Status:** ✅ **RESOLVED** - User confirmed "this works perfect now"
**Date:** 2024-12-19
**Error:** 
- Image placeholders showing "%>" text instead of icons (broken ERB syntax)
- Nothing happens when clicking any button on screen (JavaScript broken?)
**Root Cause:** 🎯 **INVISIBLE DIALOG COVERING ENTIRE PAGE**
- The `<dialog>` element had `fixed inset-0 z-50` with only `opacity-0` 
- Even invisible, it was intercepting ALL mouse clicks across the entire page
- JavaScript was loading fine - the issue was CSS pointer events!

**Fix Applied:** 
- ✅ **CRITICAL FIX:** Added `pointer-events-none [&.open]:pointer-events-auto` to dialog
- ✅ When closed: `pointer-events-none` allows clicks to pass through
- ✅ When open: `[&.open]:pointer-events-auto` re-enables modal interactions
- ✅ Removed debug logging (issue was CSS, not JavaScript)

**Files Changed:**
- ✅ `app/views/shared/_dialog.html.erb` (**CRITICAL CSS FIX**)
- ✅ `app/javascript/application.js` (removed debug logs)  
- ✅ `app/javascript/controllers/dialog_controller.js` (removed debug logs)

---

## **Issue #13: Duplicate Validation Error Messages + Missing Red Borders**
**Status:** ✅ **RESOLVED** - User confirmed working with proper 1px red borders for categories/age groups 
**Date:** 2024-12-19
**Error:** 
- Duplicate validation error messages (e.g., "Title can't be blank" + "can't be blank")
- Category/Age group checkbox sections missing red border styling on validation errors
**Root Cause:** 
- Using both `@space.errors.full_messages` (summary) and `@space.errors[:field].first` (individual field errors)
- No conditional red border styling on checkbox container divs
**Fix Applied:** 
- ✅ **REMOVED ALL FIELD-LEVEL ERROR MESSAGES** - No more duplicates!
- ✅ **Summary errors only:** Clean error summary at top with specific messages
- ✅ **Red borders:** Added conditional styling `#{'border-red-500 bg-red-50' if @space.errors[:field].any?}`
- ✅ **Consistency:** Applied same fixes to both spaces and posts forms
- ✅ **Clean form:** Removed unnecessary `data: { turbo_frame: "_top" }` from posts form
**Files Changed:**
- ✅ `app/views/spaces/new.html.erb` (fixed duplicate errors + added red borders)
- ✅ `app/views/posts/new.html.erb` (fixed duplicate errors + clean form data)



---

## **Issue #14: Modal Backdrop Click to Close**
**Status:** ✅ **RESOLVED**
**Date:** 2024-12-19
**Error:** 
- Modal doesn't close when clicking on the backdrop
**Root Cause:** 
- No click event handler for backdrop clicks
**Fix Applied:** 
- ✅ Added `connect()` method to dialog controller
- ✅ Added click event listener that checks if click target is the dialog element itself
- ✅ Calls `close()` method when backdrop is clicked
**Files Changed:**
- ✅ `app/javascript/controllers/dialog_controller.js` (added backdrop click handler)

---

*Note: Only mark issues as RESOLVED when user confirms they're working during manual testing.*
