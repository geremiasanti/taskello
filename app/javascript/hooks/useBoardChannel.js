import { useEffect, useRef } from "react"
import { useCardStore } from "../stores/cardStore"
import { getConsumer } from "../lib/consumer"

export default function useBoardChannel(boardId) {
  const subRef = useRef(null)

  useEffect(() => {
    if (!boardId) return

    const subscription = getConsumer().subscriptions.create(
      { channel: "BoardChannel", board_id: boardId },
      {
        received(data) {
          if (data.type === "card_update") {
            const { card, action } = data
            useCardStore.setState((state) => {
              if (action === "created") {
                if (state.cards.find((c) => c.id === card.id)) return state
                return { cards: [...state.cards, card] }
              }
              if (action === "updated" || action === "moved") {
                return { cards: state.cards.map((c) => (c.id === card.id ? card : c)) }
              }
              return state
            })
          }
          if (data.type === "board_update" && data.action === "card_deleted") {
            useCardStore.setState((state) => ({
              cards: state.cards.filter((c) => c.id !== data.card_id),
            }))
          }
          if (data.type === "comment_update" && data.action === "created") {
            window.dispatchEvent(new CustomEvent("cable:comment", { detail: data }))
          }
          if (data.type === "board_update" && data.action === "comment_deleted") {
            window.dispatchEvent(new CustomEvent("cable:comment_deleted", { detail: data }))
          }
        },
      }
    )
    subRef.current = subscription

    return () => {
      subscription.unsubscribe()
      subRef.current = null
    }
  }, [boardId])
}
