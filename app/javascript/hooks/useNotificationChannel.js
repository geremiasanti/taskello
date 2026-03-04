import { useEffect } from "react"
import { useNotificationStore } from "../stores/notificationStore"
import { getConsumer } from "../lib/consumer"

export default function useNotificationChannel(userId) {
  useEffect(() => {
    if (!userId) return

    const subscription = getConsumer().subscriptions.create(
      { channel: "NotificationChannel" },
      {
        received(data) {
          if (data.type === "notification") {
            useNotificationStore.getState().addNotification(data.notification)
          }
        },
      }
    )

    return () => subscription.unsubscribe()
  }, [userId])
}
