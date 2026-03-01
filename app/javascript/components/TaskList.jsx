import React from "react";
import TaskItem from "./TaskItem";

const styles = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  empty: {
    padding: "24px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "14px",
  },
};

export default function TaskList({
  tasks,
  selectedTask,
  onSelect,
  onAdvance,
  onDelete,
}) {
  if (tasks.length === 0) {
    return <div style={styles.empty}>No tasks found.</div>;
  }

  return (
    <div style={styles.list}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          selected={selectedTask?.id === task.id}
          onSelect={onSelect}
          onAdvance={onAdvance}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
