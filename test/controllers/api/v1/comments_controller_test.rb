require "test_helper"

class Api::V1::CommentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task = tasks(:todo_task)
    @comment = comments(:first_comment)
  end

  test "index returns comments for task" do
    get api_v1_task_comments_url(@task), as: :json
    assert_response :success
    data = JSON.parse(response.body)
    assert_equal @task.comments.count, data.length
  end

  test "create adds comment to task" do
    assert_difference("Comment.count") do
      post api_v1_task_comments_url(@task), params: { comment: { body: "New comment" } }, as: :json
    end
    assert_response :created
    data = JSON.parse(response.body)
    assert_equal "New comment", data["body"]
  end

  test "create fails with blank body" do
    assert_no_difference("Comment.count") do
      post api_v1_task_comments_url(@task), params: { comment: { body: "" } }, as: :json
    end
    assert_response :unprocessable_entity
  end

  test "destroy removes comment" do
    assert_difference("Comment.count", -1) do
      delete api_v1_task_comment_url(@task, @comment)
    end
    assert_response :no_content
  end
end
