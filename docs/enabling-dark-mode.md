# Enabling Dark Mode

## Current Status
Dark mode is currently disabled. The site is locked to light mode.
*Updated: Just disabled - theme switcher commented out and theme locked to "light" in both application and minimal layouts*

## To Re-enable Dark Mode

### 1. Update Application Layout
In `app/views/layouts/application.html.erb`, change:
```erb
data-theme-preference-value="light"
```
To:
```erb
data-theme-preference-value="<%= current_user&.theme %>"
```

And also restore the dark theme class:
```erb
<html class="<%= class_names(dark: current_user&.dark_theme?, "hotwire-native": hotwire_native_app?) %>" lang="<%= I18n.locale %>">
```

### 1b. Update Minimal Layout
In `app/views/layouts/minimal.html.erb`, make the same changes:
```erb
data-theme-preference-value="<%= current_user&.theme %>"
```
And restore:
```erb
<html class="<%= class_names(dark: current_user&.dark_theme?, "hotwire-native": hotwire_native_app?) %>" lang="<%= I18n.locale %>">
```

### 2. Uncomment Theme Switcher
In `app/views/devise/registrations/edit.html.erb`, uncomment:
```erb
<div class="form-group">
  <%= form.label :theme %>
  <%= form.select :theme, theme_options, {}, { class: "select" } %>
</div>
```

### 3. Restart Server
```bash
bin/dev
```

## Result
- Users can switch between light/dark/system themes in their profile
- Theme preferences are saved per user
- System theme follows OS preference
