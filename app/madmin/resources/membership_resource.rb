class MembershipResource < Madmin::Resource
  menu parent: "Community", position: 3

  # Attributes
  attribute :id, form: false
  attribute :created_at, form: false
  attribute :updated_at, form: false

  # Associations
  attribute :user
  attribute :space

  def self.display_name(record)
    "#{record.user.name} - #{record.space.title}"
  end
end
