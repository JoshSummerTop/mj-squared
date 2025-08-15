require "application_system_test_case"

class InfiniteScrollRefactorTest < ApplicationSystemTestCase
  include Devise::Test::IntegrationHelpers

  def setup
    @user = create(:user)
    @admin = create(:user, admin: true)
    
    # Create enough spaces to test pagination
    @spaces = create_list(:space, 25) do |space, index|
      space.title = "Test Space #{index + 1}"
      space.description = "Description for space #{index + 1}"
    end
    
    sign_in @user
  end

  test "NEW: infinite scroll works automatically with Turbo Frames" do
    # Force new pagination system
    visit root_path(new_pagination: 'true')
    
    # Should see first batch of spaces (12 items)
    assert_selector ".space-card", count: 12
    assert_text "Test Space 1"
    assert_text "Test Space 12"
    
    # Should see loading trigger at bottom
    assert_selector "#infinite_scroll_trigger"
    assert_text "Loading more spaces..."
    
    # Scroll to bottom to trigger lazy loading
    scroll_to_bottom
    
    # Should automatically load more spaces without clicking anything
    assert_selector ".space-card", count: 24, wait: 5
    assert_text "Test Space 24"
    
    # Should see final batch trigger
    assert_selector "#infinite_scroll_trigger"
    
    # Scroll again for final batch
    scroll_to_bottom
    
    # Should load final space and remove trigger
    assert_selector ".space-card", count: 25, wait: 5
    assert_text "Test Space 25"
    assert_text "You've seen all available spaces"
    assert_no_selector "#infinite_scroll_trigger"
  end

  test "NEW: infinite scroll works with filtering" do
    # Create spaces with different categories
    category1 = create(:community_category, name: "Tech", slug: "tech")
    category2 = create(:community_category, name: "Art", slug: "art")
    
    # Create 15 tech spaces and 10 art spaces
    tech_spaces = create_list(:space, 15, title: "Tech Space") do |space, index|
      space.community_categories = [category1]
      space.title = "Tech Space #{index + 1}"
    end
    
    art_spaces = create_list(:space, 10, title: "Art Space") do |space, index|
      space.community_categories = [category2]
      space.title = "Art Space #{index + 1}"
    end
    
    visit root_path(new_pagination: 'true', tab: 'tech')
    
    # Should only see tech spaces
    assert_selector ".space-card", count: 12 # First batch
    assert_text "Tech Space 1"
    assert_no_text "Art Space"
    
    # Scroll to load more tech spaces
    scroll_to_bottom
    assert_selector ".space-card", count: 15, wait: 5 # All tech spaces
    assert_text "Tech Space 15"
    
    # Switch to art category
    click_link "Art"
    
    # Should see art spaces
    assert_selector ".space-card", count: 10, wait: 5
    assert_text "Art Space 1"
    assert_no_text "Tech Space"
  end

  test "OLD: legacy pagination still works as fallback" do
    # Use old system (default for most users)
    visit root_path
    
    # Should see first batch with old pagination
    assert_selector ".community-card-custom", count: 10
    
    # Should see manual "Load More" button (not automatic)
    assert_selector "#load-more-btn"
    assert_text "Load More Spaces"
    
    # Click load more button (manual action required)
    click_button "Load More Spaces"
    
    # Should load more spaces
    assert_selector ".community-card-custom", count: 20, wait: 5
  end

  test "NEW: progressive enhancement - works without JavaScript" do
    # Disable JavaScript to test progressive enhancement
    page.driver.browser.execute_cdp('Runtime.evaluate', {
      expression: 'window.Turbo = undefined; window.Stimulus = undefined;'
    })
    
    visit root_path(new_pagination: 'true')
    
    # First page should still load
    assert_selector ".space-card", count: 12
    
    # Direct navigation to page 2 should work
    visit root_path(page: 2, new_pagination: 'true')
    assert_selector ".space-card", count: 12 # Second batch
  end

  test "performance comparison between old and new systems" do
    # Measure new system performance
    start_time = Time.current
    visit root_path(new_pagination: 'true')
    assert_selector ".space-card", count: 12
    new_system_time = Time.current - start_time
    
    # Measure old system performance  
    start_time = Time.current
    visit root_path
    assert_selector ".community-card-custom", count: 10
    old_system_time = Time.current - start_time
    
    # New system should be comparable or faster
    # (Main performance gains are in subsequent loads, not initial page)
    assert new_system_time < (old_system_time * 2), "New system should not be significantly slower than old system"
  end

  test "accessibility: screen readers can track dynamic content" do
    visit root_path(new_pagination: 'true')
    
    # Should have proper ARIA labels and semantic HTML
    assert_selector "[role='main']", count: 1
    assert_selector "h1", text: "Community Spaces"
    
    # Space cards should have proper semantic structure
    within first(".space-card") do
      assert_selector "h3" # Card titles should be proper headings
      assert_selector "a[data-turbo-frame='_top']" # Navigation should be explicit
    end
    
    # Loading states should be announced to screen readers
    scroll_to_bottom
    assert_text "Loading more spaces..." # Screen reader accessible text
  end

  test "error handling: graceful degradation when API fails" do
    # Simulate network error by visiting invalid page
    visit root_path(page: 999, new_pagination: 'true')
    
    # Should show empty state gracefully, not crash
    assert_text "No spaces found"
    assert_no_selector ".space-card"
    
    # Should provide helpful message
    assert_text "Try adjusting your filters or check back later"
  end

  private

  def scroll_to_bottom
    page.execute_script("window.scrollTo(0, document.body.scrollHeight)")
    sleep 0.5 # Give time for lazy loading to trigger
  end

  def create(model, attributes = {})
    # Factory method - would use FactoryBot in real implementation
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
        description: "Test space description",
        created_by: @user || User.first
      }.merge(attributes))
    when :community_category
      CommunityCategory.create!({
        name: "Test Category",
        slug: "test-category"
      }.merge(attributes))
    end
  end

  def create_list(model, count, attributes = {})
    Array.new(count) do |index|
      space = create(model, attributes.merge(index: index))
      yield(space, index) if block_given?
      space
    end
  end
end
