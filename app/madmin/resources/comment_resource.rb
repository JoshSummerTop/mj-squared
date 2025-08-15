class CommentResource < Madmin::Resource
  menu parent: "Community", position: 3

  # Attributes
  attribute :id, form: false
  attribute :content
  attribute :created_at, form: false
  attribute :updated_at, form: false

  # Associations
  attribute :user, form: false
  attribute :post, form: false

  # Customize the display name of records in the admin area
  def self.display_name(record)
    "#{record.user.name} on #{record.post.title}"
  end

  # Default sort by created_at descending (newest first)
  def self.default_sort_column
    "created_at"
  end

  def self.default_sort_direction
    "desc"
  end

  # Add a member action to show comment preview
  member_action do |comment|
    content_tag :div, truncate(comment.content, length: 100), class: "text-sm text-gray-600"
  end
end
