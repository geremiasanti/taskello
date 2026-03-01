import React, { useState, useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const NEXT_STATUS = {
  todo: "in_progress",
  in_progress: "done",
};

const NEXT_LABEL = {
  todo: "Start",
  in_progress: "Complete",
};

const NEXT_ICON = {
  todo: "\u25B6",
  in_progress: "\u2713",
};

const PRIORITY_CONFIG = {
  low: { bg: "#f1f5f9", color: "#64748b", label: "Low" },
  medium: { bg: "#dbeafe", color: "#1d4ed8", label: "Medium" },
  high: { bg: "#ffedd5", color: "#c2410c", label: "High" },
  critical: { bg: "#fee2e2", color: "#dc2626", label: "Critical" },
};

const styles = {
  card: (isDragging, hovered, isDragOverlay, highlighted) => ({
    padding: "10px 12px",
    background: highlighted ? "#f5f3ff" : "#fff",
    border: highlighted
      ? "2px solid #6366f1"
      : "1px solid " + (hovered && !isDragging ? "#c7d2fe" : "#e8ecf1"),
    borderRadius: "10px",
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.4 : 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    transition: isDragOverlay ? "none" : "border-color 150ms ease, box-shadow 200ms ease, background 150ms ease",
    boxShadow: isDragOverlay
      ? "0 12px 28px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.08)"
      : highlighted
        ? "0 0 0 3px rgba(99, 102, 241, 0.12)"
        : hovered && !isDragging
          ? "0 2px 8px rgba(99, 102, 241, 0.08)"
          : "0 1px 2px rgba(0,0,0,0.03)",
    transform: isDragOverlay ? "rotate(2deg)" : undefined,
  }),
  title: {
    fontWeight: 600,
    fontSize: "13px",
    color: "#1e293b",
    lineHeight: "1.4",
  },
  description: {
    fontSize: "12px",
    color: "#94a3b8",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  actions: (visible) => ({
    display: "flex",
    gap: "4px",
    marginTop: "6px",
    opacity: visible ? 1 : 0,
    transition: "opacity 150ms ease",
    height: visible ? "auto" : 0,
    overflow: "hidden",
  }),
  advanceBtn: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 600,
    background: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "background 150ms ease",
  },
  deleteBtn: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 500,
    background: "#fff",
    color: "#94a3b8",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "auto",
    transition: "color 150ms ease, border-color 150ms ease",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    marginTop: "2px",
  },
  priorityBadge: (priority) => {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
    return {
      display: "inline-block",
      padding: "1px 7px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      lineHeight: "18px",
    };
  },
  dueDate: (overdue) => ({
    fontSize: "10px",
    color: overdue ? "#dc2626" : "#94a3b8",
    fontWeight: overdue ? 600 : 400,
  }),
  attachmentCount: {
    fontSize: "10px",
    color: "#94a3b8",
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
  },
  fileDropOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "10px",
    background: "rgba(139, 92, 246, 0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: "#7c3aed",
    pointerEvents: "none",
  },
};

export default function KanbanCard({
  task,
  highlighted,
  onSelect,
  onAdvance,
  onDelete,
  onFileDrop,
  isDragOverlay,
}) {
  const [hovered, setHovered] = useState(false);
  const [isFileHovering, setIsFileHovering] = useState(false);
  const dragCounter = useRef(0);
  const cardRef = useRef(null);
  const wasDragging = useRef(false);

  useEffect(() => {
    if (highlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlighted]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !!isDragOverlay });

  useEffect(() => {
    if (isDragging) wasDragging.current = true;
  }, [isDragging]);

  const style = {
    ...styles.card(isDragging, hovered, isDragOverlay, highlighted),
    transform: CSS.Transform.toString(transform),
    transition: isDragOverlay ? undefined : transition,
    position: "relative",
    ...(isFileHovering ? { border: "2px dashed #7c3aed", background: "#faf5ff" } : {}),
  };

  const nextStatus = NEXT_STATUS[task.status];

  function handleClick() {
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    onSelect(task);
  }

  function handleDragOver(e) {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function handleDragEnter(e) {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      setIsFileHovering(true);
    }
  }

  function handleDragLeave(e) {
    if (e.dataTransfer.types.includes("Files")) {
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsFileHovering(false);
      }
    }
  }

  function handleDrop(e) {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsFileHovering(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && onFileDrop) {
        onFileDrop(task.id, files);
      }
    }
  }

  return (
    <div
      ref={(node) => {
        cardRef.current = node;
        if (!isDragOverlay) setNodeRef(node);
      }}
      style={style}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span style={styles.title}>{task.title}</span>
      {task.description && (
        <span style={styles.description}>{task.description}</span>
      )}
      <div style={styles.meta}>
        {task.priority && (
          <span style={styles.priorityBadge(task.priority)}>
            {(PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium).label}
          </span>
        )}
        {task.attachment_count > 0 && (
          <span style={styles.attachmentCount}>
            {"\uD83D\uDCCE"} {task.attachment_count}
          </span>
        )}
        {task.due_date && (() => {
          const overdue = new Date(task.due_date + "T00:00:00") < new Date(new Date().toDateString());
          return (
            <span style={styles.dueDate(overdue)}>
              {overdue ? "Overdue: " : ""}{task.due_date}
            </span>
          );
        })()}
      </div>
      <div style={styles.actions(hovered || highlighted || isDragOverlay)}>
        {nextStatus && (
          <button
            style={styles.advanceBtn}
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(task, nextStatus);
            }}
          >
            {NEXT_ICON[task.status]} {NEXT_LABEL[task.status]}
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
      {isFileHovering && (
        <div style={styles.fileDropOverlay}>Drop to attach</div>
      )}
    </div>
  );
}
