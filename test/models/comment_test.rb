require "test_helper"

class CommentTest < ActiveSupport::TestCase
  test "requires body" do
    comment = Comment.new(task: tasks(:todo_task), body: nil)
    assert_not comment.valid?
    assert_includes comment.errors[:body], "can't be blank"
  end

  test "requires task" do
    comment = Comment.new(body: "test")
    assert_not comment.valid?
    assert_includes comment.errors[:task], "must exist"
  end

  test "valid with body and task" do
    comment = Comment.new(task: tasks(:todo_task), body: "A comment")
    assert comment.valid?
  end
end
