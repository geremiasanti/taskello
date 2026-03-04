json.id @card.id
json.title @card.title
json.description @card.description
json.column @card.column
json.position @card.position
json.board_id @card.board_id
json.creator_id @card.creator_id
json.created_at @card.created_at
json.updated_at @card.updated_at

json.labels @card.labels do |label|
  json.id label.id
  json.name label.name
  json.color label.color
end

json.participants @card.participants do |participant|
  json.id participant.id
  json.username participant.username
  json.avatar_url participant.avatar.attached? ? rails_blob_path(participant.avatar, only_path: true) : nil
end

json.comments @card.comments.includes(:user).order(created_at: :asc) do |comment|
  json.id comment.id
  json.body comment.body
  json.created_at comment.created_at
  json.user do
    json.id comment.user.id
    json.username comment.user.username
    json.avatar_url comment.user.avatar.attached? ? rails_blob_path(comment.user.avatar, only_path: true) : nil
  end
end

json.attachments @card.attachments.includes(:user) do |attachment|
  json.id attachment.id
  json.attachment_type attachment.attachment_type
  json.url attachment.attachment_type == "link" ? attachment.url : (attachment.file.attached? ? rails_blob_path(attachment.file, only_path: true) : nil)
  json.link_text attachment.link_text
  json.filename attachment.file.attached? ? attachment.file.filename.to_s : nil
  json.created_at attachment.created_at
  json.user do
    json.id attachment.user.id
    json.username attachment.user.username
  end
end
