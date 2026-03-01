import React, { useState, useEffect } from "react";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import TaskForm from "./TaskForm";
import * as api from "../utils/api";

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_CONFIG = {
  todo: { bg: "#eef2ff", color: "#4338ca", icon: "\u25CB" },
  in_progress: { bg: "#fffbeb", color: "#b45309", icon: "\u25D4" },
  done: { bg: "#ecfdf5", color: "#047857", icon: "\u25CF" },
};

const PRIORITY_CONFIG = {
  low: { bg: "#f1f5f9", color: "#64748b", label: "Low" },
  medium: { bg: "#dbeafe", color: "#1d4ed8", label: "Medium" },
  high: { bg: "#ffedd5", color: "#c2410c", label: "High" },
  critical: { bg: "#fee2e2", color: "#dc2626", label: "Critical" },
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: "80px",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: "560px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08)",
    maxHeight: "calc(100vh - 120px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    padding: "20px 24px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  title: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    lineHeight: 1.4,
    flex: 1,
  },
  closeBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#f1f5f9",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#64748b",
    flexShrink: 0,
    transition: "background 150ms ease",
  },
  badge: (status) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "4px 10px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      marginTop: "10px",
    };
  },
  description: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.6,
    padding: "0 24px",
    margin: "12px 0 0",
  },
  noDescription: {
    fontSize: "13px",
    color: "#cbd5e1",
    fontStyle: "italic",
    padding: "0 24px",
    margin: "12px 0 0",
  },
  actions: {
    display: "flex",
    gap: "8px",
    padding: "16px 24px",
  },
  editBtn: {
    padding: "7px 16px",
    fontSize: "13px",
    fontWeight: 600,
    background: "#f8fafc",
    color: "#334155",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 150ms ease",
  },
  divider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "0 24px",
  },
  section: {
    padding: "16px 24px 20px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  error: {
    padding: "10px 14px",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "8px",
    fontSize: "13px",
    margin: "0 24px 12px",
  },
  attachmentItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px",
    background: "#f8fafc",
    borderRadius: "8px",
    marginBottom: "6px",
  },
  attachmentName: {
    fontSize: "13px",
    color: "#334155",
    fontWeight: 500,
    textDecoration: "none",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  attachmentSize: {
    fontSize: "11px",
    color: "#94a3b8",
    flexShrink: 0,
  },
  attachmentDeleteBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
    padding: "2px 6px",
    borderRadius: "4px",
    flexShrink: 0,
    transition: "color 150ms ease",
  },
  addFileBtn: {
    padding: "7px 14px",
    fontSize: "13px",
    fontWeight: 600,
    background: "#f8fafc",
    color: "#334155",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background 150ms ease",
  },
  uploadSpinner: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "8px",
  },
  editFormWrap: {
    padding: "20px 24px",
  },
  priorityBadge: (priority) => {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "4px 10px",
      borderRadius: "8px",
      fontSize: "12px",
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      marginTop: "10px",
      marginLeft: "8px",
    };
  },
  dueDate: (overdue) => ({
    fontSize: "13px",
    color: overdue ? "#dc2626" : "#64748b",
    fontWeight: overdue ? 600 : 400,
    padding: "0 24px",
    marginTop: "8px",
  }),
};

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function TaskDetail({ task, onClose, onUpdate }) {
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    loadComments();
    loadAttachments();
  }, [task.id]);

  async function loadComments() {
    try {
      const data = await api.getComments(task.id);
      setComments(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadAttachments() {
    try {
      const data = await api.getAttachments(task.id);
      setAttachments(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUploadFiles(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    try {
      setError(null);
      setUploading(true);
      const data = await api.uploadAttachments(task.id, files);
      setAttachments(data);
      const updated = await api.getTask(task.id);
      onUpdate(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeleteAttachment(attachment) {
    try {
      setError(null);
      await api.deleteAttachment(task.id, attachment.id);
      setAttachments(attachments.filter((a) => a.id !== attachment.id));
      const updated = await api.getTask(task.id);
      onUpdate(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEdit(attrs) {
    try {
      setError(null);
      const updated = await api.updateTask(task.id, attrs);
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddComment(attrs) {
    try {
      setError(null);
      const comment = await api.createComment(task.id, attrs);
      setComments([...comments, comment]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteComment(comment) {
    try {
      setError(null);
      await api.deleteComment(task.id, comment.id);
      setComments(comments.filter((c) => c.id !== comment.id));
    } catch (err) {
      setError(err.message);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        {error && <div style={styles.error}>{error}</div>}

        {editing ? (
          <div style={styles.editFormWrap}>
            <TaskForm
              task={task}
              onSubmit={handleEdit}
              onCancel={() => setEditing(false)}
            />
          </div>
        ) : (
          <>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.title}>{task.title}</h2>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={styles.badge(task.status)}>
                    {statusCfg.icon} {STATUS_LABELS[task.status]}
                  </span>
                  {task.priority && (
                    <span style={styles.priorityBadge(task.priority)}>
                      {(PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium).label}
                    </span>
                  )}
                </div>
              </div>
              <button style={styles.closeBtn} onClick={onClose}>
                x
              </button>
            </div>
            {task.due_date && (() => {
              const overdue = new Date(task.due_date + "T00:00:00") < new Date(new Date().toDateString());
              return (
                <div style={styles.dueDate(overdue)}>
                  {overdue ? "Overdue: " : "Due: "}{task.due_date}
                </div>
              );
            })()}
            {task.description ? (
              <p style={styles.description}>{task.description}</p>
            ) : (
              <p style={styles.noDescription}>No description</p>
            )}
            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => setEditing(true)}>
                Edit
              </button>
            </div>
          </>
        )}

        <div style={styles.divider} />

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Attachments</div>
          {attachments.map((attachment) => (
            <div key={attachment.id} style={styles.attachmentItem}>
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.attachmentName}
              >
                {attachment.filename}
              </a>
              <span style={styles.attachmentSize}>
                {formatFileSize(attachment.byte_size)}
              </span>
              <button
                style={styles.attachmentDeleteBtn}
                onClick={() => handleDeleteAttachment(attachment)}
                title="Delete attachment"
              >
                x
              </button>
            </div>
          ))}
          {uploading && (
            <div style={styles.uploadSpinner}>Uploading...</div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleUploadFiles}
          />
          <button
            style={styles.addFileBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            + Add files
          </button>
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Comments</div>
          <CommentList comments={comments} onDelete={handleDeleteComment} />
          <CommentForm onSubmit={handleAddComment} />
        </div>
      </div>
    </div>
  );
}
