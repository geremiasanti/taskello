require "test_helper"

class Api::V1::BoardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @other = create(:user)
    post api_v1_login_path, params: { session: { email: @user.email, password: "password" } }, as: :json
  end

  test "index returns user boards" do
    board = create(:board, creator: @user)
    get api_v1_boards_path, as: :json
    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal 1, json.size
    assert_equal board.name, json[0]["name"]
  end

  test "create board" do
    assert_difference("Board.count", 1) do
      post api_v1_boards_path, params: { board: { name: "New Board", description: "Test" } }, as: :json
    end
    assert_response :created
  end

  test "show board as member" do
    board = create(:board, creator: @user)
    get api_v1_board_path(board), as: :json
    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal board.name, json["name"]
    assert json["members"].any?
    assert json.key?("cards")
  end

  test "show board as non-member is forbidden" do
    board = create(:board, creator: @other)
    get api_v1_board_path(board), as: :json
    assert_response :forbidden
  end

  test "update board as creator" do
    board = create(:board, creator: @user)
    patch api_v1_board_path(board), params: { board: { name: "Updated" } }, as: :json
    assert_response :ok
    assert_equal "Updated", board.reload.name
  end

  test "update board as non-creator is forbidden" do
    board = create(:board, creator: @other)
    board.board_memberships.create!(user: @user)
    patch api_v1_board_path(board), params: { board: { name: "Hacked" } }, as: :json
    assert_response :forbidden
  end

  test "destroy board as creator" do
    board = create(:board, creator: @user)
    assert_difference("Board.count", -1) do
      delete api_v1_board_path(board), as: :json
    end
    assert_response :no_content
  end
end
