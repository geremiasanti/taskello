import { createConsumer } from "@rails/actioncable"

let consumer = null

export function getConsumer() {
  if (!consumer) consumer = createConsumer()
  return consumer
}

export function resetConsumer() {
  if (consumer) {
    consumer.disconnect()
    consumer = null
  }
}
