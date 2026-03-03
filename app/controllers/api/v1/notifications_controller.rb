module Api
  module V1
    class NotificationsController < BaseController
      def index
        notifications = current_user.notifications.includes(:actor).recent.limit(50)
        render json: notifications.map { |n|
          {
            id: n.id,
            notification_type: n.notification_type,
            read: n.read,
            actor_username: n.actor.username,
            notifiable_type: n.notifiable_type,
            notifiable_id: n.notifiable_id,
            created_at: n.created_at
          }
        }
      end

      def read
        notification = current_user.notifications.find(params[:id])
        notification.update!(read: true)
        head :no_content
      end

      def read_all
        current_user.notifications.unread.update_all(read: true)
        head :no_content
      end
    end
  end
end
