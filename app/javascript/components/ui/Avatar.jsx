import React from "react"

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
}

export default function Avatar({ user, size = "md", className = "" }) {
  const initials = (user?.username || "?")[0].toUpperCase()
  const colors = ["#e5534b", "#f0883e", "#d29922", "#57ab5a", "#539bf5", "#b083f0", "#f778ba"]
  const bgColor = colors[(user?.id || 0) % colors.length]

  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.username}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-medium text-white ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={user?.username}
    >
      {initials}
    </div>
  )
}
