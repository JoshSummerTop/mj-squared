class SpaceResource < Madmin::Resource
  menu parent: "Community", position: 1

  # Attributes
  attribute :id, form: false
  attribute :title
  attribute :description
  attribute :slug, form: false
  attribute :created_at, form: false
  attribute :updated_at, form: false

  # Associations
  attribute :created_by, form: false
  attribute :community_categories
  attribute :memberships, form: false
  attribute :posts, form: false

  def self.display_name(record)
    record.title
  end
end