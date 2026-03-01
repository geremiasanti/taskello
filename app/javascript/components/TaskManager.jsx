import React, { useState, useEffect } from "react";
import KanbanBoard from "./KanbanBoard";
import TaskDetail from "./TaskDetail";
import * as api from "../utils/api";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #fff1f2 100%)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },
  logo: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "18px",
    fontWeight: 700,
    flexShrink: 0,
  },
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1e1b4b",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  searchWrap: {
    position: "relative",
    marginBottom: "16px",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    fontSize: "14px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "10px 12px 10px 38px",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: "10px",
    fontSize: "13px",
    background: "#fff",
    outline: "none",
    color: "#334155",
    fontFamily: "inherit",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    boxSizing: "border-box",
  },
  searchInputFocus: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
  },
  searchClear: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "#f1f5f9",
    border: "none",
    borderRadius: "6px",
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1,
  },
  error: {
    padding: "12px 16px",
    background: "#fff",
    color: "#dc2626",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "16px",
    border: "1px solid #fecaca",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 1px 3px rgba(220, 38, 38, 0.08)",
  },
  errorIcon: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#fee2e2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
    flexShrink: 0,
  },
  errorDismiss: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0 2px",
    opacity: 0.6,
  },
};

const confirmStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
  },
  dialog: {
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    maxWidth: "360px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 6px",
  },
  message: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 20px",
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
  cancelBtn: {
    padding: "8px 20px",
    background: "#fff",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  },
  deleteBtn: {
    padding: "8px 20px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
};

const STATUSES_ORDER = ["todo", "in_progress", "done"];
const COLUMN_INDEX = { todo: 0, in_progress: 1, done: 2 };

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [activeColumn, setActiveColumn] = useState(0);
  const [addFormTrigger, setAddFormTrigger] = useState(0);
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredTasks = search.trim()
    ? tasks.filter((t) => {
        const q = search.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q)
        );
      })
    : tasks;

  const grouped = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    function isTextField() {
      const el = document.activeElement;
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    }

    const NEXT_STATUS = { todo: "in_progress", in_progress: "done" };

    function handleKeyDown(e) {
      if (isTextField()) return;

      // Escape: close modal or clear highlight
      if (e.key === "Escape") {
        if (selectedTask) {
          setSelectedTask(null);
        } else {
          setHighlightedId(null);
        }
        return;
      }

      // Backspace to delete highlighted or opened task
      if (e.key === "Backspace") {
        const task = selectedTask
          || filteredTasks.find((t) => t.id === highlightedId);
        if (task) {
          e.preventDefault();
          setPendingDelete(task);
        }
        return;
      }

      // N to advance highlighted task
      if (e.key.toLowerCase() === "n" && highlightedId != null) {
        const task = filteredTasks.find((t) => t.id === highlightedId);
        const nextStatus = NEXT_STATUS[task?.status];
        if (task && nextStatus) {
          e.preventDefault();
          handleAdvance(task, nextStatus);
          setActiveColumn(COLUMN_INDEX[nextStatus]);
        }
        return;
      }

      if (selectedTask) return;

      // Left/Right to rotate prism
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveColumn((prev) => (prev + 2) % 3);
        setHighlightedId(null);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveColumn((prev) => (prev + 1) % 3);
        setHighlightedId(null);
        return;
      }

      // T/I/D to jump to column and highlight first task
      const KEY_TO_STATUS = { t: "todo", i: "in_progress", d: "done" };
      const status = KEY_TO_STATUS[e.key.toLowerCase()];

      if (status) {
        e.preventDefault();
        setActiveColumn(COLUMN_INDEX[status]);
        const col = grouped[status];
        if (col.length > 0) setHighlightedId(col[0].id);
        return;
      }

      // A to add a new task
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        setActiveColumn(0);
        setAddFormTrigger((c) => c + 1);
        return;
      }

      // ArrowUp/Down to navigate within column
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (highlightedId == null) return;
        const col =
          grouped.todo.find((t) => t.id === highlightedId) ? grouped.todo :
          grouped.in_progress.find((t) => t.id === highlightedId) ? grouped.in_progress :
          grouped.done.find((t) => t.id === highlightedId) ? grouped.done :
          null;
        if (!col) return;
        e.preventDefault();
        const idx = col.findIndex((t) => t.id === highlightedId);
        const next = e.key === "ArrowDown"
          ? Math.min(idx + 1, col.length - 1)
          : Math.max(idx - 1, 0);
        setHighlightedId(col[next].id);
        return;
      }

      // Enter to open detail
      if (e.key === "Enter" && highlightedId != null) {
        e.preventDefault();
        const task = filteredTasks.find((t) => t.id === highlightedId);
        if (task) setSelectedTask(task);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  async function loadTasks() {
    try {
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreate(attrs) {
    try {
      setError(null);
      const task = await api.createTask(attrs);
      setTasks([...tasks, task]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAdvance(task, newStatus) {
    try {
      setError(null);
      const updated = await api.updateTask(task.id, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      if (selectedTask?.id === updated.id) setSelectedTask(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(task, newStatus) {
    const previousTasks = tasks;
    setError(null);

    // Optimistic update
    setTasks(
      tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      const updated = await api.updateTask(task.id, { status: newStatus });
      setTasks((current) =>
        current.map((t) => (t.id === updated.id ? updated : t))
      );
      if (selectedTask?.id === updated.id) setSelectedTask(updated);
    } catch (err) {
      // Rollback on failure
      setTasks(previousTasks);
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    try {
      setError(null);
      await api.deleteTask(task.id);
      setTasks(tasks.filter((t) => t.id !== task.id));
      if (selectedTask?.id === task.id) setSelectedTask(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFileDrop(taskId, files) {
    try {
      setError(null);
      await api.uploadAttachments(taskId, files);
      const updated = await api.getTask(taskId);
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      if (selectedTask?.id === updated.id) setSelectedTask(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleReorder(status, reorderedColumn) {
    const otherTasks = tasks.filter((t) => t.status !== status);
    setTasks([...otherTasks, ...reorderedColumn]);
  }

  function handleTaskUpdate(updated) {
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTask(updated);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo}>K</div>
          <h1 style={styles.heading}>Task Manager</h1>
        </div>

        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>{"\u2315"}</span>
          <input
            style={{
              ...styles.searchInput,
              ...(searchFocused ? styles.searchInputFocus : {}),
            }}
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search && (
            <button style={styles.searchClear} onClick={() => setSearch("")}>
              x
            </button>
          )}
        </div>

        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>!</span>
            <span>{error}</span>
            <button style={styles.errorDismiss} onClick={() => setError(null)}>
              x
            </button>
          </div>
        )}

        <KanbanBoard
          tasks={filteredTasks}
          highlightedId={highlightedId}
          activeColumn={activeColumn}
          addFormTrigger={addFormTrigger}
          onColumnChange={setActiveColumn}
          onCreate={handleCreate}
          onSelect={setSelectedTask}
          onAdvance={handleAdvance}
          onDelete={handleDelete}
          onFileDrop={handleFileDrop}
          onReorder={handleReorder}
        />

        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleTaskUpdate}
          />
        )}

        {pendingDelete && (
          <div style={confirmStyles.overlay} onClick={() => setPendingDelete(null)}>
            <div style={confirmStyles.dialog} onClick={(e) => e.stopPropagation()}>
              <p style={confirmStyles.title}>Delete task?</p>
              <p style={confirmStyles.message}>
                "{pendingDelete.title}" will be permanently deleted.
              </p>
              <div style={confirmStyles.actions}>
                <button style={confirmStyles.cancelBtn} onClick={() => setPendingDelete(null)}>
                  Cancel
                </button>
                <button
                  style={confirmStyles.deleteBtn}
                  onClick={() => {
                    handleDelete(pendingDelete);
                    setPendingDelete(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
