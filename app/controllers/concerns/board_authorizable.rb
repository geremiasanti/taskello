module BoardAuthorizable
  extend ActiveSupport::Concern

  private

  def set_board
    @board = Board.find(params[:board_id] || params[:id])
  end

  def authorize_member!
    render json: { error: "Forbidden" }, status: :forbidden unless @board.members.include?(current_user)
  end

  def authorize_creator!
    render json: { error: "Forbidden" }, status: :forbidden unless @board.creator == current_user
  end
end
