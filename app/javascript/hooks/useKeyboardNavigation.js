import { useEffect, useCallback } from "react"
import { useUiStore } from "../stores/uiStore"
import { useCardStore } from "../stores/cardStore"

const COLUMNS = ["todo", "doing", "done"]

const MOTION_KEYS = new Set([
  "h", "l", "j", "k", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
])

export function fireConfetti() {
  const canvas = document.createElement("canvas")
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647"
  document.body.appendChild(canvas)
  const ctx = canvas.getContext("2d")
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  // Random origin point along any edge or random spot
  const ox = Math.random() * canvas.width
  const oy = Math.random() * canvas.height
  // Random cone direction
  const coneDir = Math.random() * Math.PI * 2
  const coneSpread = 0.6 // ~35 degrees half-angle
  const colors = ["#e5534b", "#539bf5", "#57ab5a", "#d29922", "#b083f0", "#f0883e", "#f778ba", "#ff6b6b", "#ffd93d", "#6bcb77"]
  const particles = Array.from({ length: 100 }, () => {
    const angle = coneDir + (Math.random() - 0.5) * coneSpread * 2
    const speed = Math.random() * 10 + 5
    return {
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 7 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 15,
    }
  })
  let frame = 0
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const opacity = Math.max(0, 1 - frame / 80)
    particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.15
      p.vx *= 0.98
      p.rot += p.rv
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rot * Math.PI) / 180)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    })
    frame++
    if (frame < 80) requestAnimationFrame(animate)
    else canvas.remove()
  }
  requestAnimationFrame(animate)
}

export default function useKeyboardNavigation(enabled = true, { onEscapeEmpty } = {}) {
  const cursor = useUiStore((s) => s.cursor)
  const setCursor = useUiStore((s) => s.setCursor)
  const cursorActive = useUiStore((s) => s.cursorActive)
  const activateCursor = useUiStore((s) => s.activateCursor)
  const deactivateCursor = useUiStore((s) => s.deactivateCursor)
  const toggleKeyboardLegend = useUiStore((s) => s.toggleKeyboardLegend)
  const toggleLayout = useUiStore((s) => s.toggleLayout)
  const setNewCardColumn = useUiStore((s) => s.setNewCardColumn)
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

      // Tab without cursor: activate cursor (like a motion key)
      if (e.key === "Tab" && !cursorActive) {
        e.preventDefault()
        setCursor({ columnIndex: 0, cardIndex: 0 })
        return
      }

      // These work even without active cursor
      if (e.key === "v" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        toggleLayout()
        return
      }
      if (e.key === "?") {
        e.preventDefault()
        toggleKeyboardLegend()
        return
      }
      if (e.key === "n" && !cursorActive) {
        e.preventDefault()
        setNewCardColumn("todo")
        return
      }
      if (e.key === "Escape" && !cursorActive) {
        e.preventDefault()
        if (selectedCard) {
          clearSelectedCard()
        } else if (onEscapeEmpty) {
          onEscapeEmpty()
        }
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
              fireConfetti()
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
          if (cardIndex < colCards.length - 1) {
            setCursor({ columnIndex, cardIndex: cardIndex + 1 })
          } else if (layout === "email" && columnIndex < COLUMNS.length - 1) {
            // Cross to next section in email view
            for (let i = columnIndex + 1; i < COLUMNS.length; i++) {
              const nextColCards = getColumnCards(i)
              if (nextColCards.length > 0) {
                setCursor({ columnIndex: i, cardIndex: 0 })
                break
              }
            }
          }
          break
        case "k":
        case "ArrowUp":
          e.preventDefault()
          if (cardIndex > 0) {
            setCursor({ columnIndex, cardIndex: cardIndex - 1 })
          } else if (layout === "email" && columnIndex > 0) {
            // Cross to previous section in email view
            for (let i = columnIndex - 1; i >= 0; i--) {
              const prevColCards = getColumnCards(i)
              if (prevColCards.length > 0) {
                setCursor({ columnIndex: i, cardIndex: prevColCards.length - 1 })
                break
              }
            }
          }
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
          if (selectedCard) {
            clearSelectedCard()
          } else if (cursorActive) {
            deactivateCursor()
          } else if (onEscapeEmpty) {
            onEscapeEmpty()
          }
          break
        case "n": {
          e.preventDefault()
          const col = cursorActive ? COLUMNS[columnIndex] : COLUMNS[0]
          setNewCardColumn(col)
          break
        }
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
            fireConfetti()
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
  }, [cursor, cursorActive, cards, selectedCard, getFocusedCard])

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
