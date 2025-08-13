class PostResource < Madmin::Resource
  menu parent: "Community", position: 2

  # Attributes
  attribute :id, form: false
  attribute :title
  attribute :content
  attribute :created_at, form: false
  attribute :updated_at, form: false

  # Associations
  attribute :user, form: false
  attribute :space, form: false
  attribute :comments, form: false

  def self.display_name(record)
    record.title
  end
end
