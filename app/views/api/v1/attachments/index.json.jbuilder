json.array! @attachments do |attachment|
  json.id attachment.id
  json.filename attachment.filename.to_s
  json.content_type attachment.content_type
  json.byte_size attachment.byte_size
  json.url rails_blob_url(attachment, only_path: true)
  json.created_at attachment.created_at
end
