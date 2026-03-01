import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

const STATUSES = ["todo", "in_progress", "done"];

const COLUMN_CONFIG = {
  todo: { label: "Todo", icon: "\u25CB", color: "#6366f1" },
  in_progress: { label: "In Progress", icon: "\u25D4", color: "#f59e0b" },
  done: { label: "Done", icon: "\u25CF", color: "#10b981" },
};

const styles = {
  scene: {
    perspective: "1200px",
    perspectiveOrigin: "50% 50%",
    marginBottom: "24px",
  },
  prism: (rotation, radius) => ({
    width: "100%",
    height: "calc(100vh - 300px)",
    minHeight: "400px",
    position: "relative",
    transformStyle: "preserve-3d",
    transform: `translateZ(${-radius}px) rotateY(${rotation}deg)`,
    transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
  }),
  face: (index, radius, isActive) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    transform: `rotateY(${index * 120}deg) translateZ(${radius}px)`,
    pointerEvents: isActive ? "auto" : "none",
  }),
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  navArrow: (enabled) => ({
    background: "none",
    border: "none",
    fontSize: "18px",
    color: enabled ? "#64748b" : "#cbd5e1",
    cursor: "pointer",
    padding: "4px 8px",
    transition: "color 150ms ease",
  }),
  navDot: (active, color) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: active ? color : "#e2e8f0",
    cursor: "pointer",
    transition: "background 200ms ease, transform 200ms ease",
    transform: active ? "scale(1.3)" : "scale(1)",
    border: "none",
    padding: 0,
  }),
  navLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
    marginLeft: "12px",
    marginRight: "12px",
    minWidth: "90px",
    textAlign: "center",
    transition: "color 200ms ease",
  },
  hint: {
    textAlign: "center",
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "8px",
  },
};

export default function KanbanBoard({
  tasks,
  highlightedId,
  activeColumn,
  addFormTrigger,
  onColumnChange,
  onCreate,
  onSelect,
  onAdvance,
  onDelete,
  onFileDrop,
  onReorder,
}) {
  const [activeTask, setActiveTask] = useState(null);
  const sceneRef = useRef(null);
  const [radius, setRadius] = useState(200);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    function updateRadius() {
      if (sceneRef.current) {
        const w = sceneRef.current.offsetWidth;
        setRadius(w / (2 * Math.tan(Math.PI / 3)));
      }
    }
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const grouped = {};
  for (const status of STATUSES) {
    grouped[status] = tasks.filter((t) => t.status === status);
  }

  function resolveTargetStatus(overId) {
    if (!overId) return null;

    const asString = String(overId);
    for (const status of STATUSES) {
      if (asString === `column-${status}`) return status;
    }

    const overTask = tasks.find((t) => t.id === overId);
    return overTask ? overTask.status : null;
  }

  function handleDragStart(event) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  }

  function handleDragEnd(event) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const targetStatus = resolveTargetStatus(over.id);
    if (!targetStatus || targetStatus !== task.status) return;

    const column = grouped[task.status];
    const oldIndex = column.findIndex((t) => t.id === active.id);
    const newIndex = column.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    const reordered = arrayMove(column, oldIndex, newIndex);
    onReorder(task.status, reordered);
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  const rotation = -activeColumn * 120;
  const currentStatus = STATUSES[activeColumn];
  const currentConfig = COLUMN_CONFIG[currentStatus];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div ref={sceneRef} style={styles.scene}>
        <div style={styles.prism(rotation, radius)}>
          {STATUSES.map((status, i) => (
            <div key={status} style={styles.face(i, radius, i === activeColumn)}>
              <KanbanColumn
                status={status}
                tasks={grouped[status]}
                highlightedId={highlightedId}
                onSelect={onSelect}
                onAdvance={onAdvance}
                onDelete={onDelete}
                onFileDrop={onFileDrop}
                onCreate={status === "todo" ? onCreate : undefined}
                addFormTrigger={status === "todo" ? addFormTrigger : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={styles.nav}>
        <button
          style={styles.navArrow(true)}
          onClick={() => onColumnChange((activeColumn + 2) % 3)}
        >
          {"\u2190"}
        </button>
        {STATUSES.map((status, i) => (
          <button
            key={status}
            style={styles.navDot(i === activeColumn, COLUMN_CONFIG[status].color)}
            onClick={() => onColumnChange(i)}
          />
        ))}
        <button
          style={styles.navArrow(true)}
          onClick={() => onColumnChange((activeColumn + 1) % 3)}
        >
          {"\u2192"}
        </button>
        <span style={{ ...styles.navLabel, color: currentConfig.color }}>
          {currentConfig.icon} {currentConfig.label}
        </span>
      </div>
      <div style={styles.hint}>
        {"\u2190 \u2192"} to rotate &middot; T I D to jump &middot; {"\u2191 \u2193"} to navigate &middot; N to advance &middot; Enter to open &middot; A to add
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            onSelect={() => {}}
            onAdvance={() => {}}
            onDelete={() => {}}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
