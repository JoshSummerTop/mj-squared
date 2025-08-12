class Post < ApplicationRecord
  belongs_to :space
  belongs_to :created_by, class_name: "User"
  has_and_belongs_to_many :age_group_categories
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_one_attached :image
  extend FriendlyId
  friendly_id :title, use: :slugged
end
