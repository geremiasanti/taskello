class User < ApplicationRecord
  has_secure_password

  has_one_attached :avatar

  has_many :board_memberships, dependent: :destroy
  has_many :boards, through: :board_memberships
  has_many :created_boards, class_name: "Board", foreign_key: :creator_id, dependent: :destroy

  has_many :card_participants, dependent: :destroy
  has_many :participating_cards, through: :card_participants, source: :card
  has_many :created_cards, class_name: "Card", foreign_key: :creator_id, dependent: :destroy

  has_many :comments, dependent: :destroy
  has_many :attachments, dependent: :destroy

  has_many :notifications, dependent: :destroy
  has_many :acted_notifications, class_name: "Notification", foreign_key: :actor_id, dependent: :destroy

  validates :username, presence: true, uniqueness: true, length: { minimum: 2, maximum: 30 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || password.present? }
end
