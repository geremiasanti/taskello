function csrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute("content") : "";
}

async function handleResponse(response) {
  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    const message =
      data.errors?.join(", ") || data.error || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": csrfToken(),
    },
    ...options,
  });

  return handleResponse(response);
}

export function getTasks(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return request(`/api/v1/tasks${query}`);
}

export function createTask(task) {
  return request("/api/v1/tasks", {
    method: "POST",
    body: JSON.stringify({ task }),
  });
}

export function updateTask(id, task) {
  return request(`/api/v1/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ task }),
  });
}

export function deleteTask(id) {
  return request(`/api/v1/tasks/${id}`, { method: "DELETE" });
}

export function getComments(taskId) {
  return request(`/api/v1/tasks/${taskId}/comments`);
}

export function createComment(taskId, comment) {
  return request(`/api/v1/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}

export function deleteComment(taskId, commentId) {
  return request(`/api/v1/tasks/${taskId}/comments/${commentId}`, {
    method: "DELETE",
  });
}

export function getTask(id) {
  return request(`/api/v1/tasks/${id}`);
}

export function getAttachments(taskId) {
  return request(`/api/v1/tasks/${taskId}/attachments`);
}

export function uploadAttachments(taskId, files) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files[]", file);
  }

  const response = fetch(`/api/v1/tasks/${taskId}/attachments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": csrfToken(),
    },
    body: formData,
  });

  return response.then(handleResponse);
}

export function deleteAttachment(taskId, attachmentId) {
  return request(`/api/v1/tasks/${taskId}/attachments/${attachmentId}`, {
    method: "DELETE",
  });
}
