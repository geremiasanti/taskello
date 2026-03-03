module Api
  module V1
    class CardParticipantsController < BaseController
      before_action :set_card

      def create
        user = User.find(params[:user_id])
        @card.card_participants.create!(user: user)

        if user != current_user
          notification = Notification.create!(
            user: user,
            actor: current_user,
            notifiable: @card,
            notification_type: "participant_added"
          )
          NotificationChannel.broadcast_notification(user, notification)
        end

        render json: { id: user.id, username: user.username }, status: :created
      rescue ActiveRecord::RecordInvalid
        render json: { error: "User is already a participant" }, status: :unprocessable_entity
      end

      def destroy
        participant = @card.card_participants.find_by!(user_id: params[:id])
        participant.destroy
        head :no_content
      end

      private

      def set_card
        @card = Card.find(params[:card_id])
        render json: { error: "Forbidden" }, status: :forbidden unless @card.board.members.include?(current_user)
      end
    end
  end
end
