json.id @board.id
json.name @board.name
json.description @board.description
json.creator_id @board.creator_id
json.created_at @board.created_at
json.updated_at @board.updated_at

json.members @board.members do |member|
  json.id member.id
  json.username member.username
  json.email member.email
  json.avatar_url member.avatar.attached? ? rails_blob_path(member.avatar, only_path: true) : nil
end

json.cards @board.cards.includes(:labels, { participants: :avatar_attachment }, :creator).order(:column, :position) do |card|
  json.id card.id
  json.title card.title
  json.description card.description
  json.column card.column
  json.position card.position
  json.creator_id card.creator_id
  json.created_at card.created_at
  json.updated_at card.updated_at
  json.labels card.labels do |label|
    json.id label.id
    json.name label.name
    json.color label.color
  end
  json.participants card.participants do |participant|
    json.id participant.id
    json.username participant.username
    json.avatar_url participant.avatar.attached? ? rails_blob_path(participant.avatar, only_path: true) : nil
  end
end

json.labels @board.labels do |label|
  json.id label.id
  json.name label.name
  json.color label.color
end
