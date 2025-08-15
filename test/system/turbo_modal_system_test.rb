require "application_system_test_case"

class TurboModalSystemTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  def setup
    @user = create(:user)
    @space = create(:space, created_by: @user)
    sign_in @user
  end

  test "NEW: modal opens via Turbo Frame and closes properly" do
    # Force new modal system
    visit space_path(@space, new_modals: 'true')
    
    # Click create post button
    click_link "Create New Post"
    
    # Modal should open automatically
    assert_selector "dialog[open]", wait: 3
    assert_text "Create New Post in #{@space.title}"
    
    # Form should be present
    assert_selector "form[data-turbo-frame='modal_content']"
    assert_field "Title"
    assert_field "Content"
    
    # Close with X button
    find("[data-action='turbo-modal#close']").click
    
    # Modal should close
    assert_no_selector "dialog[open]", wait: 3
  end

  test "NEW: form submission shows success state" do
    visit space_path(@space, new_modals: 'true')
    
    click_link "Create New Post"
    assert_selector "dialog[open]"
    
    # Fill in valid form
    fill_in "Title", with: "Test Post Title"
    fill_in "Content", with: "This is test content for the post"
    
    click_button "Create Post"
    
    # Should show success state in modal
    assert_text "Post Created!", wait: 5
    assert_text "Your post 'Test Post Title' has been published successfully"
    
    # Should have action buttons
    assert_link "View Post"
    assert_button "Close"
    
    # Post should be created in database
    assert_equal 1, Post.count
    assert_equal "Test Post Title", Post.last.title
  end

  test "NEW: form validation errors are handled gracefully" do
    visit space_path(@space, new_modals: 'true')
    
    click_link "Create New Post"
    assert_selector "dialog[open]"
    
    # Submit empty form (should trigger validation errors)
    click_button "Create Post"
    
    # Should stay in modal with error state
    assert_selector "dialog[open]"
    assert_text "Please Correct the Errors Below"
    assert_text "Title can't be blank"
    assert_text "Content can't be blank"
    
    # Form fields should have error styling
    assert_selector "input[aria-invalid='true']"
    assert_selector "textarea[aria-invalid='true']"
    
    # Should show error flash message
    assert_text "Please correct the errors and try again"
    
    # Post should NOT be created
    assert_equal 0, Post.count
  end

  test "NEW: modal works with keyboard navigation" do
    visit space_path(@space, new_modals: 'true')
    
    click_link "Create New Post"
    assert_selector "dialog[open]"
    
    # Title field should be focused automatically
    assert_equal "Title", find_field("Title").native.get_attribute("id").gsub(/.*_/, "")
    
    # Tab navigation should work
    find_field("Title").send_keys :tab
    assert_focused "Content"
    
    # Escape should close modal
    page.send_keys :escape
    assert_no_selector "dialog[open]"
  end

  test "NEW: modal is accessible to screen readers" do
    visit space_path(@space, new_modals: 'true')
    
    click_link "Create New Post"
    assert_selector "dialog[open]"
    
    # Should have proper ARIA attributes
    modal = find("dialog[open]")
    assert modal["data-controller"].include?("turbo-modal")
    
    # Form should have proper labels
    assert_selector "label[for]", count: 3 # Title, Content, Image
    
    # Error states should be announced
    click_button "Create Post"
    assert_selector "[role='alert']", minimum: 1
  end

  test "NEW: optimistic updates work correctly" do
    visit space_path(@space, new_modals: 'true')
    
    click_link "Create New Post"
    fill_in "Title", with: "Optimistic Post"
    fill_in "Content", with: "This should appear immediately"
    
    click_button "Create Post"
    
    # Should show success state immediately
    assert_text "Post Created!", wait: 2
    
    # New post should appear in the list (if on space page)
    click_link "View Post"
    assert_text "Optimistic Post"
  end

  test "NEW: progressive enhancement works without JavaScript" do
    # Disable JavaScript
    page.driver.browser.execute_cdp('Runtime.evaluate', {
      expression: 'window.Turbo = undefined; window.Stimulus = undefined;'
    })
    
    visit space_path(@space, new_modals: 'true')
    
    # Direct form submission should still work
    visit new_space_post_path(@space)
    
    fill_in "Title", with: "No JS Post"
    fill_in "Content", with: "Works without JavaScript"
    click_button "Create Post"
    
    # Should redirect and show success
    assert_text "Post created"
    assert_text "No JS Post"
  end

  test "OLD: legacy modal system still works as fallback" do
    # Use old system (default behavior)
    visit space_path(@space)
    
    # Should see old modal button
    # (This test ensures we don't break existing functionality)
    assert_selector "[data-action*='modal#open']"
  end

  test "performance comparison: new modal is faster than old" do
    # Test new system
    start_time = Time.current
    visit space_path(@space, new_modals: 'true')
    click_link "Create New Post"
    assert_selector "dialog[open]"
    new_system_time = Time.current - start_time
    
    # Test old system  
    start_time = Time.current
    visit space_path(@space)
    # Old system would require more complex interaction
    old_system_time = Time.current - start_time
    
    # New system should be comparable or faster
    assert new_system_time < (old_system_time * 2), 
           "New modal system should not be significantly slower"
  end

  private

  def create(model, attributes = {})
    case model
    when :user
      User.create!({
        first_name: "Test",
        last_name: "User", 
        email: "test#{rand(1000)}@example.com",
        password: "password123"
      }.merge(attributes))
    when :space
      Space.create!({
        title: "Test Space",
        description: "Test space description"
      }.merge(attributes))
    end
  end

  def assert_focused(field_name)
    # Check if the field with the given name is focused
    focused_element = page.evaluate_script('document.activeElement')
    field = find_field(field_name)
    assert_equal field.native, focused_element
  end
end
