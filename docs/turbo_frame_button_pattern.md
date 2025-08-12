# Turbo & Hotwire UI Patterns: Best Practices for Rails

This document describes the best practices, patterns, and common pitfalls for implementing interactive UI features (like/unlike, join/leave, edit/delete, inline forms, etc.) in Rails using Turbo Frames, Turbo Streams, and Hotwire. It is based on real-world debugging and solutions from the community feature, and should be referenced for all future interactive UI work.

---

## Introduction

Turbo (part of Hotwire) enables fast, modern, interactive Rails apps with minimal custom JavaScript. However, there are important patterns and gotchas to be aware of, especially when working with:
- Turbo Frames (for partial page updates and inline forms)
- Turbo Streams (for live updates and UI changes)
- Stimulus controllers (for client-side interactivity)

This guide covers the most robust, maintainable approaches for all these scenarios.

---

## The Pattern

### 1. **Wrap the Section in a Turbo Frame**

In your main view (e.g., `show.html.erb`):

```erb
<turbo-frame id="like-section">
  <%= render partial: "posts/like_section", locals: { post: @post, like: @like } %>
</turbo-frame>
```

### 2. **Button Form Targets the Frame**

In the partial (e.g., `_like_section.html.erb`):

```erb
<div class="flex items-center gap-2">
  <% if user_signed_in? %>
    <% if like %>
      <%= button_to 'Unlike', post_like_path(post), method: :delete, data: { turbo_frame: 'like-section' }, class: 'btn btn-secondary btn-xs' %>
    <% else %>
      <%= button_to 'Like', post_like_path(post), method: :post, data: { turbo_frame: 'like-section' }, class: 'btn btn-primary btn-xs' %>
    <% end %>
  <% end %>
  <span class="text-xs text-gray-500"><%= pluralize(post.likes.count, 'like') %></span>
</div>
```

### 3. **Controller Responds with Turbo Stream**

In the controller (e.g., `LikesController`):

```ruby
def create
  @post = Post.find(params[:post_id])
  @like = @post.likes.find_or_create_by(user: current_user)
  respond_to do |format|
    format.turbo_stream { render "posts/like_section", locals: { post: @post, like: @like } }
    format.html { redirect_to @post }
  end
end

def destroy
  @post = Post.find(params[:post_id])
  @like = @post.likes.find_by(user: current_user)
  @like&.destroy
  respond_to do |format|
    format.turbo_stream { render "posts/like_section", locals: { post: @post, like: nil } }
    format.html { redirect_to @post }
  end
end
```

### 4. **Turbo Stream Template Wraps the Frame**

In `app/views/posts/like_section.turbo_stream.erb`:

```erb
<turbo-stream action="replace" target="like-section">
  <template>
    <turbo-frame id="like-section">
      <%= render partial: "posts/like_section", formats: [:html], locals: { post: post, like: like } %>
    </turbo-frame>
  </template>
</turbo-stream>
```

**Key:** The turbo stream must replace the entire frame, not just its contents, so the frame remains in the DOM for future updates.

---

## Comments: Edit/Delete Pattern & Destructive Actions

### Inline Edit/Delete for Comments
- Each comment card is wrapped in a `<turbo-frame id="comment_#{comment.id}">`.
- The "Edit" link loads the edit form into the frame.
- The edit form uses `form_with` for updates and a **`button_to` for delete** (outside the form).
- The delete button must use `button_to` (not `link_to ... method: :delete`) because Turbo does **not** process `data-method="delete"` on links—only on forms.
- The destroy action should use `format.turbo_stream` and a `destroy.turbo_stream.erb` template with `<turbo-stream action="remove" target="comment_#{@comment.id}" />`.
- After destroy, use `@comment.id` in the template (not a local), since instance variables are available.

**Example:**

_Partial:_
```erb
<turbo-frame id="comment_<%= comment.id %>">
  ...
  <%= button_to 'Delete', post_comment_path(post, comment), method: :delete, data: { turbo_confirm: 'Are you sure?', turbo_stream: true }, class: 'btn btn-danger btn-xs' %>
</turbo-frame>
```

_Controller:_
```ruby
def destroy
  @comment.destroy
  respond_to do |format|
    format.turbo_stream
    format.html { redirect_to @comment.post, notice: 'Comment deleted.' }
  end
end
```

_Turbo Stream Template:_
```erb
<turbo-stream action="remove" target="comment_<%= @comment.id %>" />
```

**Why not use `link_to ... method: :delete`?**
- Turbo does not handle `data-method` on links. Use `button_to` for destructive actions.

---

## Common Pitfalls & Debugging

### 1. **Turbo Frame Disappears After First Update**
- **Cause:** The turbo stream replaces the frame with only its contents (not the frame itself).
- **Fix:** Always wrap the partial in a `<turbo-frame>` in the turbo stream template.

### 2. **Button State Does Not Update**
- **Cause:** The partial is rendered with a stale or incorrect local variable (e.g., `like` is not set to `nil` after unlike).
- **Fix:** Pass the correct locals from the controller to the turbo stream template, and from the template to the partial. Use `locals: { post: post, like: like }` in the turbo stream template.

### 3. **Missing Partial Error**
- **Cause:** Rendering a partial from a `.turbo_stream.erb` template without specifying `formats: [:html]` causes Rails to look for a `.turbo_stream.erb` partial.
- **Fix:** In the turbo stream template, use `formats: [:html]` in the render call.

### 4. **No Turbo Stream Response / No Update**
- **Cause:** The controller does not render a turbo stream template, or the request is not a Turbo request.
- **Fix:** Ensure the controller responds with `format.turbo_stream` and the button form has `data: { turbo_frame: ... }`.

### 5. **Authentication/Redirect Issues**
- **Cause:** User is not signed in, so the request redirects to sign-in page, which Turbo cannot process as a stream.
- **Fix:** Ensure the user is authenticated for these actions.

### 6. **Destructive Actions Not Working**
- **Cause:** Using `link_to ... method: :delete` instead of `button_to` for deletes. Turbo does not process `data-method` on links.
- **Fix:** Always use `button_to` for destructive actions with Turbo.

### 7. **Instance Variables in Turbo Stream Templates**
- **Cause:** After destroy, locals passed to the template may not be available.
- **Fix:** Use instance variables (e.g., `@comment.id`) in turbo_stream templates.

---

## Debugging Steps

1. **Check the Network Tab:**
   - Is the response a `<turbo-stream>`?
   - Is the status 200?
2. **Check the Console:**
   - Any JavaScript errors?
3. **Check the DOM:**
   - Is the `<turbo-frame>` present after each update?
4. **Check the Server Logs:**
   - Any missing template or 204 errors?
5. **Check Locals:**
   - Are the correct locals or instance variables passed to the partial?
6. **Check the Generated HTML:**
   - For destructive actions, is a `<form method="post">` with a hidden `_method` field for DELETE being generated?

---

## Final Checklist for New Features

- [ ] Wrap the interactive section in a `<turbo-frame>` in the main view or partial.
- [ ] The button form targets the frame with `data: { turbo_frame: ... }`.
- [ ] Controller responds with `format.turbo_stream { render ... }` and passes correct locals.
- [ ] Turbo stream template wraps the partial in a `<turbo-frame>` and uses `formats: [:html]`.
- [ ] Always use the local variables (`like`, `membership`, etc.) in the turbo stream template, or instance variables after destroy.
- [ ] Use `button_to` for destructive actions, not `link_to ... method: :delete`.
- [ ] Test toggling the button or action multiple times to ensure the frame and state update correctly.

---

## Example Use Cases
- Like/Unlike buttons
- Join/Leave space or group
- Follow/Unfollow user
- Subscribe/Unsubscribe
- Edit/Delete comments inline

---

**Reference this document for all future interactive button features using Turbo Frames, Turbo Streams, and Hotwire.**

---

## Rules & Best Practices

- **Always place JavaScript in the Stimulus controllers directory (`app/javascript/controllers`). Never use inline scripts in views.** This ensures maintainability, reusability, and a clean separation of concerns.
- **Use `button_to` for destructive actions (delete, remove, etc.) with Turbo.**
- **Use instance variables in Turbo Stream templates after destroy.**

--- 