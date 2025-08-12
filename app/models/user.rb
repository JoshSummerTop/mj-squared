class User < ApplicationRecord
  has_prefix_id :user

  include Accounts
  include Agreements
  include Authenticatable
  include Mentions
  include Notifiable
  include Searchable
  include Theme

  has_one_attached :avatar
  has_person_name

  validates :avatar, resizable_image: true
  validates :name, presence: true

  # Community Platform Associations
  has_many :memberships, dependent: :destroy
  has_many :spaces, through: :memberships
  has_many :created_spaces, class_name: 'Space', foreign_key: 'created_by_id', dependent: :destroy
  has_many :posts, class_name: 'Post', foreign_key: 'created_by_id', dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
end
