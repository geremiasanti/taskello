class Attachment < ApplicationRecord
  belongs_to :card
  belongs_to :user

  has_one_attached :file

  validates :attachment_type, presence: true, inclusion: { in: %w[file link] }
  validates :url, presence: true, if: -> { attachment_type == "link" }
  validates :file, presence: true, if: -> { attachment_type == "file" && !persisted? }

  private

  def file_presence
    errors.add(:file, "must be attached for file attachments") if attachment_type == "file" && !file.attached?
  end
end
