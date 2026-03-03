class Board < ApplicationRecord
  belongs_to :creator, class_name: "User"

  has_many :board_memberships, dependent: :destroy
  has_many :members, through: :board_memberships, source: :user
  has_many :cards, dependent: :destroy
  has_many :labels, dependent: :destroy

  validates :name, presence: true, length: { maximum: 100 }

  after_create :add_creator_as_member

  private

  def add_creator_as_member
    board_memberships.create!(user: creator)
  end
end
