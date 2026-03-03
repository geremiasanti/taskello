import { useEffect } from "react"
import { useNotificationStore } from "../stores/notificationStore"
import { createConsumer } from "@rails/actioncable"

let consumer = null
function getConsumer() {
  if (!consumer) consumer = createConsumer()
  return consumer
}

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
