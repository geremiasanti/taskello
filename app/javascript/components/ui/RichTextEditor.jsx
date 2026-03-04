import React, { useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Mention from "@tiptap/extension-mention"
import { Extension } from "@tiptap/core"

const ToolbarButton = ({ active, onClick, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`px-1.5 py-0.5 text-xs rounded cursor-pointer ${
      active
        ? "bg-[var(--color-primary)] text-[var(--color-primary-text)]"
        : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]"
    }`}
  >
    {children}
  </button>
)

function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="flex gap-0.5 px-2 py-1 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Code"
      >
        &lt;/&gt;
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        &bull;
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered list"
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
      >
        &ldquo;
      </ToolbarButton>
    </div>
  )
}

function buildMentionSuggestion(members) {
  return {
    items: ({ query }) => {
      return (members || [])
        .filter((m) => m.username.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
    },
    render: () => {
      let component = null
      let popup = null

      return {
        onStart: (props) => {
          popup = document.createElement("div")
          popup.className = "tiptap-mention-popup"
          document.body.appendChild(popup)
          component = { props, selectedIndex: 0 }
          renderPopup(popup, component)
        },
        onUpdate: (props) => {
          component.props = props
          component.selectedIndex = 0
          renderPopup(popup, component)
        },
        onKeyDown: ({ event }) => {
          if (event.key === "ArrowUp") {
            component.selectedIndex = Math.max(0, component.selectedIndex - 1)
            renderPopup(popup, component)
            return true
          }
          if (event.key === "ArrowDown") {
            component.selectedIndex = Math.min(
              component.props.items.length - 1,
              component.selectedIndex + 1
            )
            renderPopup(popup, component)
            return true
          }
          if (event.key === "Enter") {
            const item = component.props.items[component.selectedIndex]
            if (item) component.props.command({ id: item.id, label: item.username })
            return true
          }
          return false
        },
        onExit: () => {
          if (popup) popup.remove()
        },
      }
    },
  }
}

function renderPopup(el, component) {
  const { items } = component.props
  if (!items.length) {
    el.style.display = "none"
    return
  }

  const rect = window.getSelection()?.getRangeAt(0)?.getBoundingClientRect()
  if (rect) {
    el.style.position = "fixed"
    el.style.left = `${rect.left}px`
    el.style.top = `${rect.bottom + 4}px`
  }
  el.style.display = "block"

  el.innerHTML = items
    .map(
      (item, i) =>
        `<div class="tiptap-mention-item${i === component.selectedIndex ? " active" : ""}">${item.username}</div>`
    )
    .join("")
}

const RichTextEditor = forwardRef(function RichTextEditor(
  { content, onChange, onCtrlEnter, placeholder, members, toolbar = true, className = "", minHeight = "80px", autoFocus = false },
  ref
) {
  const onCtrlEnterRef = useRef(onCtrlEnter)
  onCtrlEnterRef.current = onCtrlEnter

  const extensions = [
    StarterKit,
    Placeholder.configure({ placeholder: placeholder || "Write something..." }),
  ]

  if (onCtrlEnter) {
    extensions.push(
      Extension.create({
        name: "ctrlEnterSubmit",
        addKeyboardShortcuts() {
          return {
            "Mod-Enter": () => {
              onCtrlEnterRef.current?.()
              return true
            },
          }
        },
      })
    )
  }

  if (members) {
    extensions.push(
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        suggestion: buildMentionSuggestion(members),
      })
    )
  }

  const editor = useEditor({
    extensions,
    content: content || "",
    autofocus: autoFocus ? "end" : false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  useImperativeHandle(ref, () => ({
    clear: () => editor?.commands.clearContent(),
    focus: () => editor?.commands.focus(),
    getHTML: () => editor?.getHTML() || "",
  }))

  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content || "")
    }
  }, [content])

  return (
    <div
      className={`border border-[var(--color-input-border)] rounded-md overflow-hidden bg-[var(--color-input-bg)] ${className}`}
    >
      {toolbar && <Toolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="tiptap-editor"
        style={{ minHeight }}
      />
    </div>
  )
})

export default RichTextEditor
