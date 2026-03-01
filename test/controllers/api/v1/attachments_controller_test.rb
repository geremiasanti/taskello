require "test_helper"

class Api::V1::AttachmentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task = tasks(:todo_task)
    @file = fixture_file_upload("test.txt", "text/plain")
  end

  test "index returns empty array when no attachments" do
    get api_v1_task_attachments_url(@task), as: :json
    assert_response :success
    data = JSON.parse(response.body)
    assert_equal [], data
  end

  test "index returns attachments for task" do
    @task.attachments.attach(@file)
    get api_v1_task_attachments_url(@task), as: :json
    assert_response :success
    data = JSON.parse(response.body)
    assert_equal 1, data.length
    assert_equal "test.txt", data[0]["filename"]
    assert data[0]["url"].present?
    assert data[0]["byte_size"].present?
    assert data[0]["content_type"].present?
  end

  test "create attaches a single file" do
    assert_difference("ActiveStorage::Attachment.count") do
      post api_v1_task_attachments_url(@task),
        params: { files: [@file] },
        headers: { "Accept" => "application/json" }
    end
    assert_response :created
    data = JSON.parse(response.body)
    assert_equal 1, data.length
    assert_equal "test.txt", data[0]["filename"]
  end

  test "create attaches multiple files" do
    file2 = fixture_file_upload("test.txt", "text/plain")
    assert_difference("ActiveStorage::Attachment.count", 2) do
      post api_v1_task_attachments_url(@task),
        params: { files: [@file, file2] },
        headers: { "Accept" => "application/json" }
    end
    assert_response :created
    data = JSON.parse(response.body)
    assert_equal 2, data.length
  end

  test "create with no files returns 422" do
    post api_v1_task_attachments_url(@task),
      params: {},
      as: :json
    assert_response :unprocessable_entity
    data = JSON.parse(response.body)
    assert_includes data["errors"], "No files provided"
  end

  test "destroy removes attachment" do
    @task.attachments.attach(@file)
    attachment = @task.attachments.first

    assert_difference("ActiveStorage::Attachment.count", -1) do
      delete api_v1_task_attachment_url(@task, attachment)
    end
    assert_response :no_content
  end

  test "destroy with wrong task returns 404" do
    @task.attachments.attach(@file)
    attachment = @task.attachments.first
    other_task = tasks(:in_progress_task)

    delete api_v1_task_attachment_url(other_task, attachment)
    assert_response :not_found
  end
end
