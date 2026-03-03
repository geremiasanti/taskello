module Api
  module V1
    class CardsController < BaseController
      before_action :set_card, only: [:show, :update, :destroy, :move]

      def show
      end

      def create
        board = Board.find(card_params[:board_id])
        unless board.members.include?(current_user)
          return render json: { error: "Forbidden" }, status: :forbidden
        end

        position = board.cards.where(column: card_params[:column] || "todo").maximum(:position).to_i + 1
        @card = board.cards.build(card_params.merge(creator: current_user, position: position))

        if @card.save
          BoardChannel.broadcast_card_update(@card.board, @card, "created")
          render :show, status: :created
        else
          render json: { errors: @card.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @card.update(card_update_params)
          BoardChannel.broadcast_card_update(@card.board, @card, "updated")
          render :show
        else
          render json: { errors: @card.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        board = @card.board
        card_id = @card.id
        @card.destroy
        BoardChannel.broadcast_board_update(board, "card_deleted", { card_id: card_id })
        head :no_content
      end

      def move
        result = CardMover.call(@card, params.dig(:card, :column), params.dig(:card, :position).to_i)
        if result
          @card.reload
          BoardChannel.broadcast_card_update(@card.board, @card, "moved")
          render :show
        else
          render json: { error: "Move failed" }, status: :unprocessable_entity
        end
      end

      private

      def set_card
        @card = Card.find(params[:id])
        board = @card.board
        render json: { error: "Forbidden" }, status: :forbidden unless board.members.include?(current_user)
      end

      def card_params
        params.require(:card).permit(:title, :description, :column, :board_id)
      end

      def card_update_params
        params.require(:card).permit(:title, :description)
      end
    end
  end
end
