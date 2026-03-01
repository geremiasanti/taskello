require "test_helper"

class TaskTest < ActiveSupport::TestCase
  test "requires title" do
    task = Task.new(title: nil)
    assert_not task.valid?
    assert_includes task.errors[:title], "can't be blank"
  end

  test "defaults status to todo" do
    task = Task.new(title: "Test")
    assert_equal "todo", task.status
  end

  test "validates status inclusion" do
    task = Task.new(title: "Test", status: "invalid")
    assert_not task.valid?
    assert_includes task.errors[:status], "is not included in the list"
  end

  test "allows forward status transitions" do
    task = tasks(:todo_task)
    task.status = "in_progress"
    assert task.valid?

    task.save!
    task.status = "done"
    assert task.valid?
  end

  test "rejects backward status transitions" do
    task = tasks(:done_task)
    task.status = "in_progress"
    assert_not task.valid?
    assert_includes task.errors[:status], "cannot move backward"
  end

  test "rejects backward from in_progress to todo" do
    task = tasks(:in_progress_task)
    task.status = "todo"
    assert_not task.valid?
    assert_includes task.errors[:status], "cannot move backward"
  end

  test "ordered scope returns tasks by created_at asc" do
    tasks = Task.ordered
    assert_equal tasks.to_a, tasks.sort_by(&:created_at)
  end

  test "by_status scope filters tasks" do
    todo_tasks = Task.by_status("todo")
    assert todo_tasks.all? { |t| t.status == "todo" }
    assert_equal 1, todo_tasks.count
  end

  test "validates priority inclusion" do
    %w[low medium high critical].each do |p|
      task = Task.new(title: "Test", priority: p)
      assert task.valid?, "#{p} should be valid"
    end
  end

  test "rejects invalid priority" do
    task = Task.new(title: "Test", priority: "urgent")
    assert_not task.valid?
    assert_includes task.errors[:priority], "is not included in the list"
  end

  test "defaults priority to medium" do
    task = Task.new(title: "Test")
    assert_equal "low", task.priority
  end

  test "destroys associated comments" do
    task = tasks(:todo_task)
    assert_difference("Comment.count", -task.comments.count) do
      task.destroy
    end
  end

  test "can attach files" do
    task = tasks(:todo_task)
    blob = ActiveStorage::Blob.create_and_upload!(
      io: File.open(Rails.root.join("test/fixtures/files/test.txt")),
      filename: "test.txt",
      content_type: "text/plain"
    )
    task.attachments.attach(blob)
    assert_equal 1, task.attachments.count
  end

  test "destroy purges attachments" do
    task = tasks(:todo_task)
    blob = ActiveStorage::Blob.create_and_upload!(
      io: File.open(Rails.root.join("test/fixtures/files/test.txt")),
      filename: "test.txt",
      content_type: "text/plain"
    )
    task.attachments.attach(blob)
    assert_equal 1, task.attachments.count
    assert_difference("ActiveStorage::Attachment.count", -1) do
      task.destroy
    end
  end
end
