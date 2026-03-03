class Card < ApplicationRecord
  belongs_to :board
  belongs_to :creator, class_name: "User"

  has_many :card_participants, dependent: :destroy
  has_many :participants, through: :card_participants, source: :user
  has_many :card_labels, dependent: :destroy
  has_many :labels, through: :card_labels
  has_many :comments, dependent: :destroy
  has_many :attachments, dependent: :destroy

  validates :title, presence: true, length: { maximum: 255 }
  validates :column, presence: true, inclusion: { in: %w[todo doing done] }
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  after_create :add_creator_as_participant

  private

  def add_creator_as_participant
    card_participants.create!(user: creator)
  end
end
