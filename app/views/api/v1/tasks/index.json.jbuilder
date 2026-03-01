json.array! @tasks do |task|
  json.extract! task, :id, :title, :description, :status, :due_date, :priority, :created_at, :updated_at
  json.attachment_count task.attachments.size
end
