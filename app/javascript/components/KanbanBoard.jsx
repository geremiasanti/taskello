import React from "react"
import KanbanColumn from "./KanbanColumn"

const COLUMN_LABELS = { todo: "To Do", doing: "In Progress", done: "Done" }

export default function KanbanBoard({ columns, columnCards, board }) {
  return (
    <div className="flex-1 flex gap-4 p-4 overflow-x-auto">
      {columns.map((col) => (
        <KanbanColumn
          key={col}
          column={col}
          label={COLUMN_LABELS[col]}
          cards={columnCards(col)}
          board={board}
        />
      ))}
    </div>
  )
}
