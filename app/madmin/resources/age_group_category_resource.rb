class AgeGroupCategoryResource < Madmin::Resource
  menu parent: "Community", position: 4

  # Attributes
  attribute :id, form: false
  attribute :name
  attribute :slug, form: false
  attribute :created_at, form: false
  attribute :updated_at, form: false

  # Associations
  attribute :spaces, form: false
  attribute :posts, form: false

  # Customize the display name of records in the admin area
  def self.display_name(record)
    record.name
  end

  # Default sort by name
  def self.default_sort_column
    "name"
  end

  def self.default_sort_direction
    "asc"
  end

  # Add a member action to show usage count
  member_action do |category|
    spaces_count = category.spaces.count
    posts_count = category.posts.count
    
    if spaces_count > 0 || posts_count > 0
      content_tag :span, "#{spaces_count} spaces, #{posts_count} posts", class: "badge badge-primary"
    else
      content_tag :span, "Unused", class: "badge badge-secondary"
    end
  end

  # Add a note about deletion restrictions
  member_action do |category|
    content_tag :div, "⚠️ Cannot delete if assigned to spaces/posts", class: "text-xs text-red-600"
  end
end
