json.array! @boards do |board|
  json.id board.id
  json.name board.name
  json.description board.description
  json.creator_id board.creator_id
  json.members_count board.members.size
  json.cards_count board.cards.size
  json.created_at board.created_at
  json.updated_at board.updated_at
end
