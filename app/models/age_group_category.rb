class AgeGroupCategory < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  has_and_belongs_to_many :spaces
  has_and_belongs_to_many :posts

  before_destroy :ensure_not_in_use

  private

  def ensure_not_in_use
    if spaces.exists? || posts.exists?
      errors.add(:base, "Cannot delete age group while it is assigned to a space or post.")
      throw(:abort)
    end
  end
end
