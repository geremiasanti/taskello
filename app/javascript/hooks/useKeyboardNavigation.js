import { useEffect, useCallback } from "react"
import { useUiStore } from "../stores/uiStore"
import { useCardStore } from "../stores/cardStore"

const COLUMNS = ["todo", "doing", "done"]

export default function useKeyboardNavigation(enabled = true) {
  const cursor = useUiStore((s) => s.cursor)
  const setCursor = useUiStore((s) => s.setCursor)
  const toggleKeyboardLegend = useUiStore((s) => s.toggleKeyboardLegend)
  const cards = useCardStore((s) => s.cards)
  const selectCard = useCardStore((s) => s.selectCard)
  const clearSelectedCard = useCardStore((s) => s.clearSelectedCard)
  const selectedCard = useCardStore((s) => s.selectedCard)
  const moveCard = useCardStore((s) => s.moveCard)
  const deleteCard = useCardStore((s) => s.deleteCard)

  const getColumnCards = useCallback(
    (colIndex) => {
      const col = COLUMNS[colIndex]
      return cards.filter((c) => c.column === col).sort((a, b) => a.position - b.position)
    },
    [cards]
  )

  const getFocusedCard = useCallback(() => {
    const colCards = getColumnCards(cursor.columnIndex)
    return colCards[cursor.cardIndex] || null
  }, [cursor, getColumnCards])

  useEffect(() => {
    if (!enabled) return

    const handleKeydown = (e) => {
      const tag = e.target.tagName.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return

      const { columnIndex, cardIndex } = cursor
      const colCards = getColumnCards(columnIndex)

      // Ctrl + motion = move card
      if (e.ctrlKey || e.metaKey) {
        const card = getFocusedCard()
        if (!card) return

        switch (e.key) {
          case "h":
          case "ArrowLeft": {
            e.preventDefault()
            if (columnIndex > 0) {
              const targetColIndex = columnIndex - 1
              const newCol = COLUMNS[targetColIndex]
              const targetCards = getColumnCards(targetColIndex)
              const newCardIndex = Math.min(cardIndex, targetCards.length)
              setCursor({ columnIndex: targetColIndex, cardIndex: newCardIndex })
              moveCard(card.id, newCol, targetCards.length).catch(() => {})
            }
            return
          }
          case "l":
          case "ArrowRight": {
            e.preventDefault()
            if (columnIndex < COLUMNS.length - 1) {
              const targetColIndex = columnIndex + 1
              const newCol = COLUMNS[targetColIndex]
              const targetCards = getColumnCards(targetColIndex)
              const newCardIndex = Math.min(cardIndex, targetCards.length)
              setCursor({ columnIndex: targetColIndex, cardIndex: newCardIndex })
              moveCard(card.id, newCol, targetCards.length).catch(() => {})
            }
            return
          }
          case "k":
          case "ArrowUp": {
            e.preventDefault()
            if (cardIndex > 0) {
              setCursor({ columnIndex, cardIndex: cardIndex - 1 })
              moveCard(card.id, COLUMNS[columnIndex], cardIndex - 1).catch(() => {})
            }
            return
          }
          case "j":
          case "ArrowDown": {
            e.preventDefault()
            if (cardIndex < colCards.length - 1) {
              setCursor({ columnIndex, cardIndex: cardIndex + 1 })
              moveCard(card.id, COLUMNS[columnIndex], cardIndex + 1).catch(() => {})
            }
            return
          }
        }
        return
      }

      switch (e.key) {
        // Navigation
        case "h":
        case "ArrowLeft":
          e.preventDefault()
          if (columnIndex > 0) {
            const newColCards = getColumnCards(columnIndex - 1)
            setCursor({ columnIndex: columnIndex - 1, cardIndex: Math.min(cardIndex, Math.max(0, newColCards.length - 1)) })
          }
          break
        case "l":
        case "ArrowRight":
          e.preventDefault()
          if (columnIndex < COLUMNS.length - 1) {
            const newColCards = getColumnCards(columnIndex + 1)
            setCursor({ columnIndex: columnIndex + 1, cardIndex: Math.min(cardIndex, Math.max(0, newColCards.length - 1)) })
          }
          break
        case "j":
        case "ArrowDown":
          e.preventDefault()
          if (cardIndex < colCards.length - 1) setCursor({ columnIndex, cardIndex: cardIndex + 1 })
          break
        case "k":
        case "ArrowUp":
          e.preventDefault()
          if (cardIndex > 0) setCursor({ columnIndex, cardIndex: cardIndex - 1 })
          break

        // Tab: sequential navigation
        case "Tab":
          e.preventDefault()
          if (e.shiftKey) {
            if (cardIndex > 0) {
              setCursor({ columnIndex, cardIndex: cardIndex - 1 })
            } else if (columnIndex > 0) {
              const prevColCards = getColumnCards(columnIndex - 1)
              setCursor({ columnIndex: columnIndex - 1, cardIndex: Math.max(0, prevColCards.length - 1) })
            }
          } else {
            if (cardIndex < colCards.length - 1) {
              setCursor({ columnIndex, cardIndex: cardIndex + 1 })
            } else if (columnIndex < COLUMNS.length - 1) {
              setCursor({ columnIndex: columnIndex + 1, cardIndex: 0 })
            }
          }
          break

        // Actions
        case "Enter": {
          e.preventDefault()
          const card = getFocusedCard()
          if (card) selectCard(card)
          break
        }
        case "Escape":
          e.preventDefault()
          clearSelectedCard()
          break
        case "d": {
          e.preventDefault()
          const card = getFocusedCard()
          if (card && confirm("Delete this card?")) {
            deleteCard(card.id)
          }
          break
        }
        case "m": {
          e.preventDefault()
          const card = getFocusedCard()
          if (card && columnIndex < COLUMNS.length - 1) {
            const newCol = COLUMNS[columnIndex + 1]
            const targetCards = getColumnCards(columnIndex + 1)
            moveCard(card.id, newCol, targetCards.length).catch(() => {})
          }
          break
        }
        case "M": {
          e.preventDefault()
          const card = getFocusedCard()
          if (card && columnIndex > 0) {
            const newCol = COLUMNS[columnIndex - 1]
            const targetCards = getColumnCards(columnIndex - 1)
            moveCard(card.id, newCol, targetCards.length).catch(() => {})
          }
          break
        }
        case "?":
          e.preventDefault()
          toggleKeyboardLegend()
          break
      }
    }

    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [enabled, cursor, cards, getColumnCards, getFocusedCard])

  // Highlight focused card with DOM effect
  useEffect(() => {
    document.querySelectorAll("[data-card-id]").forEach((el) => {
      el.style.outline = ""
    })
    const card = getFocusedCard()
    if (card) {
      const el = document.querySelector(`[data-card-id="${card.id}"]`)
      if (el) el.style.outline = "2px solid var(--color-focus-ring)"
    }
  }, [cursor, cards, getFocusedCard])

  return { cursor, getFocusedCard }
}
