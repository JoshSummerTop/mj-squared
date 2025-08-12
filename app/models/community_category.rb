class CommunityCategory < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history]

  has_and_belongs_to_many :spaces

  before_destroy :ensure_not_in_use

  validates :slug, presence: true, uniqueness: true

  private

  def ensure_not_in_use
    if spaces.exists?
      errors.add(:base, "Cannot delete category while it is assigned to a space.")
      throw(:abort)
    end
  end
end
