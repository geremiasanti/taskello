import React, { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";

const COLUMN_CONFIG = {
  todo: {
    label: "Todo",
    icon: "\u25CB",
    accent: "#6366f1",
    countBg: "#eef2ff",
    countColor: "#4338ca",
  },
  in_progress: {
    label: "In Progress",
    icon: "\u25D4",
    accent: "#f59e0b",
    countBg: "#fffbeb",
    countColor: "#b45309",
  },
  done: {
    label: "Done",
    icon: "\u25CF",
    accent: "#10b981",
    countBg: "#ecfdf5",
    countColor: "#047857",
  },
};

const styles = {
  column: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
    border: "1px solid rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },
  header: {
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid #f1f5f9",
  },
  icon: (status) => ({
    fontSize: "12px",
    color: COLUMN_CONFIG[status]?.accent || "#6b7280",
  }),
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
    letterSpacing: "0.01em",
  },
  count: (status) => ({
    fontSize: "11px",
    fontWeight: 600,
    padding: "1px 7px",
    borderRadius: "10px",
    background: COLUMN_CONFIG[status]?.countBg || "#f1f5f9",
    color: COLUMN_CONFIG[status]?.countColor || "#64748b",
    marginLeft: "auto",
  }),
  body: (isOver) => ({
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
    overflowY: "auto",
    background: isOver ? "rgba(99, 102, 241, 0.03)" : "transparent",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    transition: "background 200ms ease",
  }),
  addBtn: {
    padding: "8px 10px",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#94a3b8",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "background 150ms ease, color 150ms ease",
  },
  addBtnHover: {
    background: "#f8fafc",
    color: "#64748b",
  },
  inlineForm: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "10px",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  inlineInput: {
    padding: "9px 11px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "inherit",
  },
  inlineInputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },
  inlineTextarea: {
    padding: "9px 11px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    resize: "vertical",
    minHeight: "52px",
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    fontFamily: "inherit",
  },
  inlineActions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  inlineSubmit: {
    padding: "7px 14px",
    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    transition: "opacity 150ms ease",
  },
  inlineCancel: {
    padding: "7px 10px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    color: "#94a3b8",
    fontWeight: 500,
    transition: "color 150ms ease",
  },
};

export default function KanbanColumn({
  status,
  tasks,
  highlightedId,
  onSelect,
  onAdvance,
  onDelete,
  onFileDrop,
  onCreate,
  addFormTrigger,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}` });
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addBtnHovered, setAddBtnHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const titleRef = useRef(null);

  const taskIds = tasks.map((t) => t.id);
  const config = COLUMN_CONFIG[status];

  useEffect(() => {
    if (adding && titleRef.current) titleRef.current.focus();
  }, [adding]);

  useEffect(() => {
    if (addFormTrigger && onCreate) setAdding(true);
  }, [addFormTrigger]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
    if (titleRef.current) titleRef.current.focus();
  }

  function handleCancel() {
    setAdding(false);
    setTitle("");
    setDescription("");
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") handleCancel();
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div style={styles.column}>
      <div style={styles.header}>
        <span style={styles.icon(status)}>{config?.icon}</span>
        <span style={styles.label}>{config?.label}</span>
        <span style={styles.count(status)}>{tasks.length}</span>
      </div>
      <div ref={setNodeRef} style={styles.body(isOver)}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              highlighted={task.id === highlightedId}
              onSelect={onSelect}
              onAdvance={onAdvance}
              onDelete={onDelete}
              onFileDrop={onFileDrop}
            />
          ))}
        </SortableContext>

        {onCreate && !adding && (
          <button
            style={{
              ...styles.addBtn,
              ...(addBtnHovered ? styles.addBtnHover : {}),
            }}
            onMouseEnter={() => setAddBtnHovered(true)}
            onMouseLeave={() => setAddBtnHovered(false)}
            onClick={() => setAdding(true)}
          >
            + Add a card
          </button>
        )}

        {onCreate && adding && (
          <form style={styles.inlineForm} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <input
              ref={titleRef}
              style={{
                ...styles.inlineInput,
                ...(focusedField === "title" ? styles.inlineInputFocus : {}),
              }}
              type="text"
              placeholder="Enter a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setFocusedField("title")}
              onBlur={() => setFocusedField(null)}
            />
            <textarea
              style={{
                ...styles.inlineTextarea,
                ...(focusedField === "desc" ? styles.inlineInputFocus : {}),
              }}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocusedField("desc")}
              onBlur={() => setFocusedField(null)}
            />
            <div style={styles.inlineActions}>
              <button type="submit" style={styles.inlineSubmit}>
                Add card
              </button>
              <button type="button" style={styles.inlineCancel} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
