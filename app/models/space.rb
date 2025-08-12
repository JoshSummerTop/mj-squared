class Space < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged
  
  has_and_belongs_to_many :community_categories
  has_and_belongs_to_many :age_group_categories
  belongs_to :created_by, class_name: "User"
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  has_many :posts, dependent: :destroy
  has_one_attached :image

  validates :title, presence: true
  validates :description, presence: true
  validates :community_categories, presence: { message: "must select at least one community category" }
  validates :age_group_categories, presence: { message: "must select at least one age group" }
  validate :image_presence
  validate :image_type

  private

  def image_presence
    unless image.attached?
      errors.add(:image, "must be attached")
    end
  end

  def image_type
    return unless image.attached?
    acceptable_types = ["image/jpeg", "image/png", "image/gif"]
    unless acceptable_types.include?(image.content_type)
      errors.add(:image, "must be a JPEG, PNG, or GIF")
    end
  end
end
