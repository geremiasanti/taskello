class Label < ApplicationRecord
  belongs_to :board

  has_many :card_labels, dependent: :destroy
  has_many :cards, through: :card_labels

  validates :name, presence: true, length: { maximum: 50 }
  validates :color, presence: true

  PALETTE = %w[#e5534b #f0883e #d29922 #57ab5a #39d353 #539bf5 #b083f0 #f778ba].freeze

  def self.next_color(board)
    count = board.labels.count
    PALETTE[count % PALETTE.length]
  end
end
