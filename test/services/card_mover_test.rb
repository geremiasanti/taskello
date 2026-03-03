require "test_helper"

class CardMoverTest < ActiveSupport::TestCase
  setup do
    @board = create(:board)
    @user = @board.creator
  end

  test "move card within same column" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "todo", position: 2)

    assert CardMover.call(c1, "todo", 2)

    assert_equal 0, c2.reload.position
    assert_equal 1, c3.reload.position
    assert_equal 2, c1.reload.position
  end

  test "move card to different column" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "doing", position: 0)

    assert CardMover.call(c1, "doing", 0)

    assert_equal 0, c2.reload.position
    assert_equal 0, c1.reload.position
    assert_equal "doing", c1.reload.column
    assert_equal 1, c3.reload.position
  end
end
