class Comment < ApplicationRecord
  belongs_to :card
  belongs_to :user

  has_many :notifications, as: :notifiable, dependent: :destroy

  validates :body, presence: true
end
