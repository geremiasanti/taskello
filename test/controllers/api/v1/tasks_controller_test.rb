require "test_helper"

class Api::V1::TasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task = tasks(:todo_task)
  end

  test "index returns all tasks" do
    get api_v1_tasks_url, as: :json
    assert_response :success
    data = JSON.parse(response.body)
    assert_equal Task.count, data.length
  end

  test "index filters by status" do
    get api_v1_tasks_url, params: { status: "todo" }, as: :json
    assert_response :success
    data = JSON.parse(response.body)
    assert data.all? { |t| t["status"] == "todo" }
  end

  test "show returns a task" do
    get api_v1_task_url(@task), as: :json
    assert_response :success
    data = JSON.parse(response.body)
    assert_equal @task.title, data["title"]
  end

  test "show returns 404 for missing task" do
    get api_v1_task_url(id: 0), as: :json
    assert_response :not_found
  end

  test "create succeeds with valid params" do
    assert_difference("Task.count") do
      post api_v1_tasks_url, params: { task: { title: "New task", description: "Details" } }, as: :json
    end
    assert_response :created
    data = JSON.parse(response.body)
    assert_equal "New task", data["title"]
    assert_equal "todo", data["status"]
    assert_equal "low", data["priority"]
    assert_nil data["due_date"]
  end

  test "create with priority and due_date" do
    assert_difference("Task.count") do
      post api_v1_tasks_url, params: { task: { title: "Urgent", priority: "critical", due_date: "2026-04-01" } }, as: :json
    end
    assert_response :created
    data = JSON.parse(response.body)
    assert_equal "critical", data["priority"]
    assert_equal "2026-04-01", data["due_date"]
  end

  test "create fails with missing title" do
    assert_no_difference("Task.count") do
      post api_v1_tasks_url, params: { task: { title: "" } }, as: :json
    end
    assert_response :unprocessable_entity
  end

  test "update succeeds" do
    patch api_v1_task_url(@task), params: { task: { title: "Updated" } }, as: :json
    assert_response :success
    assert_equal "Updated", @task.reload.title
  end

  test "update priority and due_date" do
    patch api_v1_task_url(@task), params: { task: { priority: "critical", due_date: "2026-06-15" } }, as: :json
    assert_response :success
    data = JSON.parse(response.body)
    assert_equal "critical", data["priority"]
    assert_equal "2026-06-15", data["due_date"]
  end

  test "update can advance status forward" do
    patch api_v1_task_url(@task), params: { task: { status: "in_progress" } }, as: :json
    assert_response :success
    assert_equal "in_progress", @task.reload.status
  end

  test "update rejects backward status" do
    task = tasks(:done_task)
    patch api_v1_task_url(task), params: { task: { status: "todo" } }, as: :json
    assert_response :unprocessable_entity
  end

  test "destroy removes task" do
    assert_difference("Task.count", -1) do
      delete api_v1_task_url(@task)
    end
    assert_response :no_content
  end
end
