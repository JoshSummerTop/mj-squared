class Post < ApplicationRecord
  belongs_to :space
  belongs_to :created_by, class_name: "User"
  has_and_belongs_to_many :age_group_categories
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_one_attached :image
  
  # Validations for proper Rails error handling
  validates :title, presence: true, length: { minimum: 3, maximum: 255 }
  validates :content, presence: true, length: { minimum: 10, maximum: 10000 }
  validates :created_by, presence: true
  validates :space, presence: true
  
  extend FriendlyId
  friendly_id :title, use: :slugged
end
