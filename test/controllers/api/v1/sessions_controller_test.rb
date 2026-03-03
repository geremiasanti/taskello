require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  test "signup with valid params" do
    assert_difference("User.count", 1) do
      post api_v1_signup_path, params: { user: { username: "newuser", email: "new@example.com", password: "password" } }, as: :json
    end
    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "newuser", json["username"]
    assert_equal "new@example.com", json["email"]
  end

  test "signup with invalid params" do
    post api_v1_signup_path, params: { user: { username: "", email: "bad", password: "short" } }, as: :json
    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert json["errors"].any?
  end

  test "login with valid credentials" do
    user = create(:user, email: "test@example.com", password: "password")
    post api_v1_login_path, params: { session: { email: "test@example.com", password: "password" } }, as: :json
    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal user.id, json["id"]
  end

  test "login with invalid credentials" do
    create(:user, email: "test@example.com", password: "password")
    post api_v1_login_path, params: { session: { email: "test@example.com", password: "wrong" } }, as: :json
    assert_response :unauthorized
  end

  test "logout" do
    user = create(:user)
    post api_v1_login_path, params: { session: { email: user.email, password: "password" } }, as: :json
    delete api_v1_logout_path, as: :json
    assert_response :no_content
  end

  test "me when logged in" do
    user = create(:user)
    post api_v1_login_path, params: { session: { email: user.email, password: "password" } }, as: :json
    get api_v1_me_path, as: :json
    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal user.id, json["id"]
  end

  test "me when not logged in" do
    get api_v1_me_path, as: :json
    assert_response :unauthorized
  end
end
