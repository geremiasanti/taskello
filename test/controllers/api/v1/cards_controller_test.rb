require "test_helper"

class Api::V1::CardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @board = create(:board, creator: @user)
    post api_v1_login_path, params: { session: { email: @user.email, password: "password" } }, as: :json
  end

  test "create card" do
    assert_difference("Card.count", 1) do
      post api_v1_cards_path, params: { card: { title: "New Card", board_id: @board.id, column: "todo" } }, as: :json
    end
    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "New Card", json["title"]
  end

  test "show card" do
    card = create(:card, board: @board, creator: @user)
    get api_v1_card_path(card), as: :json
    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal card.title, json["title"]
    assert json.key?("comments")
    assert json.key?("attachments")
  end

  test "update card" do
    card = create(:card, board: @board, creator: @user)
    patch api_v1_card_path(card), params: { card: { title: "Updated" } }, as: :json
    assert_response :ok
    assert_equal "Updated", card.reload.title
  end

  test "destroy card" do
    card = create(:card, board: @board, creator: @user)
    assert_difference("Card.count", -1) do
      delete api_v1_card_path(card), as: :json
    end
    assert_response :no_content
  end

  test "move card to different column" do
    card = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    patch move_api_v1_card_path(card), params: { card: { column: "doing", position: 0 } }, as: :json
    assert_response :ok
    assert_equal "doing", card.reload.column
  end

  test "move card within column reorders positions" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "todo", position: 2)

    patch move_api_v1_card_path(c1), params: { card: { column: "todo", position: 2 } }, as: :json
    assert_response :ok

    assert_equal 2, c1.reload.position
    assert_equal 0, c2.reload.position
    assert_equal 1, c3.reload.position
  end

  test "move card cross-column maintains positions" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "doing", position: 0)

    patch move_api_v1_card_path(c1), params: { card: { column: "doing", position: 1 } }, as: :json
    assert_response :ok

    assert_equal "doing", c1.reload.column
    assert_equal 1, c1.reload.position
    assert_equal 0, c2.reload.position # gap closed in todo
    assert_equal 0, c3.reload.position # unchanged
  end

  test "move card to end of column" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "doing", position: 0)
    c3 = create(:card, board: @board, creator: @user, column: "doing", position: 1)

    patch move_api_v1_card_path(c1), params: { card: { column: "doing", position: 2 } }, as: :json
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal "doing", json["column"]
    assert_equal 2, json["position"]
  end

  test "non-member cannot access cards" do
    other = create(:user)
    post api_v1_login_path, params: { session: { email: other.email, password: "password" } }, as: :json
    card = create(:card, board: @board, creator: @user)
    get api_v1_card_path(card), as: :json
    assert_response :forbidden
  end
end
