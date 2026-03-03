module Api
  module V1
    class CommentsController < BaseController
      before_action :set_card

      def index
        comments = @card.comments.includes(:user).order(created_at: :asc)
        render json: comments.map { |c|
          { id: c.id, body: c.body, created_at: c.created_at, user: { id: c.user.id, username: c.user.username } }
        }
      end

      def create
        comment = @card.comments.build(comment_params.merge(user: current_user))
        if comment.save
          create_mention_notifications(comment)
          render json: {
            id: comment.id, body: comment.body, created_at: comment.created_at,
            user: { id: current_user.id, username: current_user.username }
          }, status: :created
        else
          render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        comment = @card.comments.find(params[:id])
        if comment.user == current_user
          comment.destroy
          head :no_content
        else
          render json: { error: "Forbidden" }, status: :forbidden
        end
      end

      private

      def set_card
        @card = Card.find(params[:card_id])
        render json: { error: "Forbidden" }, status: :forbidden unless @card.board.members.include?(current_user)
      end

      def comment_params
        params.require(:comment).permit(:body)
      end

      def create_mention_notifications(comment)
        usernames = comment.body.scan(/@(\w+)/).flatten.uniq
        users = User.where(username: usernames).where.not(id: current_user.id)
        users.each do |user|
          Notification.create!(
            user: user,
            actor: current_user,
            notifiable: comment,
            notification_type: "mention"
          )
        end
      end
    end
  end
end
