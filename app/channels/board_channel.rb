class BoardChannel < ApplicationCable::Channel
  def subscribed
    board = Board.find(params[:board_id])
    if board.members.include?(current_user)
      stream_for board
    else
      reject
    end
  end

  def self.broadcast_card_update(board, card, action)
    broadcast_to(board, {
      type: "card_update",
      action: action,
      card: {
        id: card.id,
        title: card.title,
        description: card.description,
        column: card.column,
        position: card.position,
        board_id: card.board_id,
        creator_id: card.creator_id,
        labels: card.labels.map { |l| { id: l.id, name: l.name, color: l.color } },
        participants: card.participants.map { |p| { id: p.id, username: p.username } }
      }
    })
  end

  def self.broadcast_board_update(board, action, data = {})
    broadcast_to(board, { type: "board_update", action: action, **data })
  end
end
