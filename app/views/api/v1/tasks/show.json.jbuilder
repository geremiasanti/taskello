json.extract! @task, :id, :title, :description, :status, :due_date, :priority, :created_at, :updated_at
json.attachment_count @task.attachments.size
json.attachments @task.attachments do |attachment|
  json.id attachment.id
  json.filename attachment.filename.to_s
  json.content_type attachment.content_type
  json.byte_size attachment.byte_size
  json.url rails_blob_url(attachment, only_path: true)
  json.created_at attachment.created_at
end
