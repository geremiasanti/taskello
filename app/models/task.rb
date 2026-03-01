class Task < ApplicationRecord
  STATUSES = %w[todo in_progress done].freeze
  STATUSES_ORDER = STATUSES.each_with_index.to_h.freeze
  PRIORITIES = %w[low medium high critical].freeze

  has_many :comments, dependent: :destroy
  has_many_attached :attachments

  validates :title, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :priority, inclusion: { in: PRIORITIES }
  validate :status_must_advance_forward, if: :status_changed?

  scope :ordered, -> { order(created_at: :asc) }
  scope :by_status, ->(status) { where(status: status) }

  private

  def status_must_advance_forward
    return unless persisted?

    old_index = STATUSES_ORDER[status_was]
    new_index = STATUSES_ORDER[status]

    return if old_index.nil? || new_index.nil?

    if new_index < old_index
      errors.add(:status, "cannot move backward")
    end
  end
end
