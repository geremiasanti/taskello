import { useUiStore } from "../stores/uiStore"

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]')
  return meta ? meta.getAttribute("content") : ""
}

async function request(path, options = {}) {
  const { method = "GET", body, headers = {} } = options

  const config = {
    method,
    credentials: "same-origin",
    headers: {
      "X-CSRF-Token": getCsrfToken(),
      ...headers,
    },
  }

  if (body instanceof FormData) {
    config.body = body
  } else if (body) {
    config.headers["Content-Type"] = "application/json"
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`/api/v1${path}`, config)

  if (response.status === 204) return null

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const message = data.error || data.errors?.join(", ") || `Request failed (${response.status})`
    useUiStore.getState().addToast(message, "error")
    throw new Error(message)
  }

  return response.json()
}

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  upload: (path, formData) => request(path, { method: "POST", body: formData }),
}

export default api
