module Api
  module V1
    class BoardMembersController < BaseController
      include BoardAuthorizable

      before_action :set_board
      before_action :authorize_creator!, only: [:destroy]

      def create
        user = User.find_by!(username: params[:username])
        membership = @board.board_memberships.create!(user: user)
        render json: { id: user.id, username: user.username, email: user.email }, status: :created
      rescue ActiveRecord::RecordInvalid
        render json: { error: "User is already a member" }, status: :unprocessable_entity
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end

      def destroy
        membership = @board.board_memberships.find_by!(user_id: params[:id])
        membership.destroy
        head :no_content
      end
    end
  end
end
