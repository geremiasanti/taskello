import React, { useState } from "react";

const styles = {
  item: {
    padding: "10px 12px",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    background: "#f8fafc",
    transition: "background 150ms ease",
  },
  itemHovered: {
    background: "#f1f5f9",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c7d2fe, #e9d5ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    color: "#6366f1",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  body: {
    fontSize: "13px",
    color: "#334155",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  time: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "3px",
  },
  deleteBtn: (visible) => ({
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: 500,
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    flexShrink: 0,
    opacity: visible ? 1 : 0,
    transition: "opacity 150ms ease, color 150ms ease",
  }),
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function CommentItem({ comment, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...styles.item, ...(hovered ? styles.itemHovered : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.avatar}>U</div>
      <div style={styles.content}>
        <div style={styles.body}>{comment.body}</div>
        <div style={styles.time}>{timeAgo(comment.created_at)}</div>
      </div>
      <button
        style={styles.deleteBtn(hovered)}
        onClick={() => onDelete(comment)}
      >
        Delete
      </button>
    </div>
  );
}
