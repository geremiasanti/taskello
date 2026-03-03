class NotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end

  def self.broadcast_notification(user, notification)
    broadcast_to(user, {
      type: "notification",
      notification: {
        id: notification.id,
        notification_type: notification.notification_type,
        read: notification.read,
        actor_username: notification.actor.username,
        notifiable_type: notification.notifiable_type,
        notifiable_id: notification.notifiable_id,
        created_at: notification.created_at
      }
    })
  end
end
