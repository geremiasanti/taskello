import React from "react";

const STATUS_COLORS = {
  todo: { bg: "#f3f4f6", color: "#374151" },
  in_progress: { bg: "#dbeafe", color: "#1d4ed8" },
  done: { bg: "#dcfce7", color: "#15803d" },
};

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const NEXT_STATUS = {
  todo: "in_progress",
  in_progress: "done",
};

const styles = {
  item: (selected) => ({
    padding: "12px 16px",
    border: selected ? "2px solid #3b82f6" : "1px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: selected ? "#eff6ff" : "#fff",
  }),
  left: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  title: {
    fontWeight: 600,
    fontSize: "15px",
    color: "#111827",
  },
  description: {
    fontSize: "13px",
    color: "#6b7280",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: "12px",
  },
  badge: (status) => ({
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    background: STATUS_COLORS[status]?.bg || "#f3f4f6",
    color: STATUS_COLORS[status]?.color || "#374151",
  }),
  advanceBtn: {
    padding: "4px 10px",
    fontSize: "12px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  deleteBtn: {
    padding: "4px 10px",
    fontSize: "12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default function TaskItem({
  task,
  selected,
  onSelect,
  onAdvance,
  onDelete,
}) {
  const nextStatus = NEXT_STATUS[task.status];

  return (
    <div style={styles.item(selected)} onClick={() => onSelect(task)}>
      <div style={styles.left}>
        <span style={styles.title}>{task.title}</span>
        {task.description && (
          <span style={styles.description}>{task.description}</span>
        )}
      </div>
      <div style={styles.right}>
        <span style={styles.badge(task.status)}>
          {STATUS_LABELS[task.status]}
        </span>
        {nextStatus && (
          <button
            style={styles.advanceBtn}
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(task, nextStatus);
            }}
          >
            → {STATUS_LABELS[nextStatus]}
          </button>
        )}
        <button
          style={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
