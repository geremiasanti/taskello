module Api
  module V1
    class BoardsController < BaseController
      include BoardAuthorizable

      before_action :set_board, only: [:show, :update, :destroy]
      before_action :authorize_member!, only: [:show]
      before_action :authorize_creator!, only: [:update, :destroy]

      def index
        @boards = current_user.boards.includes(:creator, :members)
      end

      def show
      end

      def create
        @board = current_user.created_boards.build(board_params)
        if @board.save
          render :show, status: :created
        else
          render json: { errors: @board.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @board.update(board_params)
          render :show
        else
          render json: { errors: @board.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @board.destroy
        head :no_content
      end

      private

      def board_params
        params.require(:board).permit(:name, :description)
      end
    end
  end
end
