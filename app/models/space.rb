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
  validate :image_type

  after_create :attach_placeholder_image_if_needed

  private

  def attach_placeholder_image_if_needed
    return if image.attached?
    
    begin
      placeholder_images = ['placeholder.jpg', 'placeholder_2.jpg', 'placeholder_3.jpg']
      selected_placeholder = placeholder_images.sample
      
      placeholder_path = Rails.root.join('app', 'assets', 'images', 'placeholders', selected_placeholder)
      
      # Fallback to development path if precompiled assets aren't available
      if File.exist?(placeholder_path)
        image.attach(
          io: File.open(placeholder_path),
          filename: selected_placeholder,
          content_type: 'image/jpeg'
        )
      else
        Rails.logger.warn "Placeholder image not found: #{placeholder_path}"
      end
    rescue => e
      Rails.logger.error "Error attaching placeholder image: #{e.message}"
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
