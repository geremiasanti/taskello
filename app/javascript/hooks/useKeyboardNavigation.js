import { useEffect, useCallback } from "react"
import { useUiStore } from "../stores/uiStore"
import { useCardStore } from "../stores/cardStore"

const COLUMNS = ["todo", "doing", "done"]

const MOTION_KEYS = new Set([
  "h", "l", "j", "k", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab",
])

export default function useKeyboardNavigation(enabled = true) {
  const cursor = useUiStore((s) => s.cursor)
  const setCursor = useUiStore((s) => s.setCursor)
  const cursorActive = useUiStore((s) => s.cursorActive)
  const activateCursor = useUiStore((s) => s.activateCursor)
  const deactivateCursor = useUiStore((s) => s.deactivateCursor)
  const toggleKeyboardLegend = useUiStore((s) => s.toggleKeyboardLegend)
  const layout = useUiStore((s) => s.layout)
  const cards = useCardStore((s) => s.cards)
  const selectCard = useCardStore((s) => s.selectCard)
  const clearSelectedCard = useCardStore((s) => s.clearSelectedCard)
  const selectedCard = useCardStore((s) => s.selectedCard)
  const moveCard = useCardStore((s) => s.moveCard)
  const deleteCard = useCardStore((s) => s.deleteCard)

  // Deactivate cursor when entering the page
  useEffect(() => {
    deactivateCursor()
  }, [])

  const getColumnCards = useCallback(
    (colIndex) => {
      const col = COLUMNS[colIndex]
      return cards.filter((c) => c.column === col).sort((a, b) => a.position - b.position)
    },
    [cards]
  )

  const getFocusedCard = useCallback(() => {
    if (!cursorActive) return null
    const colCards = getColumnCards(cursor.columnIndex)
    return colCards[cursor.cardIndex] || null
  }, [cursor, cursorActive, getColumnCards])

  useEffect(() => {
    if (!enabled) return

    const handleKeydown = (e) => {
      const tag = e.target.tagName.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return

      // First motion key: activate cursor on first card, don't move yet
      if (!cursorActive && (MOTION_KEYS.has(e.key) || (e.ctrlKey || e.metaKey) && MOTION_KEYS.has(e.key))) {
        e.preventDefault()
        setCursor({ columnIndex: 0, cardIndex: 0 })
        return
      }

      // ? works even without active cursor
      if (e.key === "?") {
        e.preventDefault()
        toggleKeyboardLegend()
        return
      }

      // Everything below requires active cursor
      if (!cursorActive) return

      const { columnIndex, cardIndex } = cursor
      const colCards = getColumnCards(columnIndex)

      // Ctrl + motion = move card to adjacent position
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
              const targetPos = Math.min(cardIndex, targetCards.length)
              moveCard(card.id, newCol, targetPos)?.then(() => {})?.catch(() => {})
              setCursor({ columnIndex: targetColIndex, cardIndex: targetPos })
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
              const targetPos = Math.min(cardIndex, targetCards.length)
              moveCard(card.id, newCol, targetPos)?.then(() => {})?.catch(() => {})
              setCursor({ columnIndex: targetColIndex, cardIndex: targetPos })
            }
            return
          }
          case "k":
          case "ArrowUp": {
            e.preventDefault()
            if (cardIndex > 0) {
              const newPos = cardIndex - 1
              moveCard(card.id, COLUMNS[columnIndex], newPos)?.then(() => {})?.catch(() => {})
              setCursor({ columnIndex, cardIndex: newPos })
            }
            return
          }
          case "j":
          case "ArrowDown": {
            e.preventDefault()
            if (cardIndex < colCards.length - 1) {
              const newPos = cardIndex + 1
              moveCard(card.id, COLUMNS[columnIndex], newPos)?.then(() => {})?.catch(() => {})
              setCursor({ columnIndex, cardIndex: newPos })
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
          if (cursorActive) deactivateCursor()
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
            const targetColIndex = columnIndex + 1
            const newCol = COLUMNS[targetColIndex]
            const targetCards = getColumnCards(targetColIndex)
            const targetPos = Math.min(cardIndex, targetCards.length)
            moveCard(card.id, newCol, targetPos)?.then(() => {})?.catch(() => {})
            setCursor({ columnIndex: targetColIndex, cardIndex: targetPos })
          }
          break
        }
        case "M": {
          e.preventDefault()
          const card = getFocusedCard()
          if (card && columnIndex > 0) {
            const targetColIndex = columnIndex - 1
            const newCol = COLUMNS[targetColIndex]
            const targetCards = getColumnCards(targetColIndex)
            const targetPos = Math.min(cardIndex, targetCards.length)
            moveCard(card.id, newCol, targetPos)?.then(() => {})?.catch(() => {})
            setCursor({ columnIndex: targetColIndex, cardIndex: targetPos })
          }
          break
        }
      }
    }

    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [enabled, cursor, cursorActive, cards, getColumnCards, getFocusedCard])

  // Highlight focused card with DOM effect — only when cursor is active
  useEffect(() => {
    document.querySelectorAll("[data-card-id]").forEach((el) => {
      el.style.outline = ""
    })
    if (!cursorActive) return
    const card = getFocusedCard()
    if (card) {
      const el = document.querySelector(`[data-card-id="${card.id}"]`)
      if (el) {
        el.style.outline = "2px solid var(--color-focus-ring)"
        el.scrollIntoView?.({ block: "nearest" })
      }
    }
  }, [cursor, cursorActive, cards, getFocusedCard])

  // In email layout, auto-select card under cursor for detail panel
  useEffect(() => {
    if (!enabled || layout !== "email" || !cursorActive) return
    const card = getFocusedCard()
    if (card && card.id !== selectedCard?.id) {
      selectCard(card)
    }
  }, [cursor, cursorActive, layout, enabled, getFocusedCard])

  return { cursor, cursorActive, getFocusedCard }
}
