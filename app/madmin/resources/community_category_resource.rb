class CommunityCategoryResource < Madmin::Resource
  menu parent: "Community", position: 1

  # Attributes
  attribute :id, form: false
  attribute :name
  attribute :slug, form: false
  attribute :created_at, form: false
  attribute :updated_at, form: false

  # Associations
  attribute :spaces, form: false

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

  # Add a member action to show spaces count
  member_action do |category|
    if category.spaces.any?
      content_tag :span, pluralize(category.spaces.count, 'space'), class: "badge badge-primary"
    else
      content_tag :span, "No spaces", class: "badge badge-secondary"
    end
  end

  # Override destroy to prevent deletion if spaces are assigned
  def destroy
    if record.spaces.exists?
      redirect_to madmin_community_categories_path, alert: "Cannot delete category while it is assigned to spaces."
    else
      super
    end
  end
end
