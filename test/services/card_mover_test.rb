require "test_helper"

class CardMoverTest < ActiveSupport::TestCase
  setup do
    @board = create(:board)
    @user = @board.creator
  end

  test "move card within same column forward" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "todo", position: 2)

    assert CardMover.call(c1, "todo", 2)

    assert_equal 0, c2.reload.position
    assert_equal 1, c3.reload.position
    assert_equal 2, c1.reload.position
  end

  test "move card within same column backward" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "todo", position: 2)

    assert CardMover.call(c3, "todo", 0)

    assert_equal 0, c3.reload.position
    assert_equal 1, c1.reload.position
    assert_equal 2, c2.reload.position
  end

  test "move card within same column one step down" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "todo", position: 2)

    assert CardMover.call(c1, "todo", 1)

    assert_equal 1, c1.reload.position
    assert_equal 0, c2.reload.position
    assert_equal 2, c3.reload.position
  end

  test "move card within same column one step up" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "todo", position: 2)

    assert CardMover.call(c2, "todo", 0)

    assert_equal 0, c2.reload.position
    assert_equal 1, c1.reload.position
    assert_equal 2, c3.reload.position
  end

  test "move card to same position is no-op" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)

    assert CardMover.call(c1, "todo", 0)

    assert_equal 0, c1.reload.position
    assert_equal 1, c2.reload.position
  end

  test "move card to different column at beginning" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "doing", position: 0)

    assert CardMover.call(c1, "doing", 0)

    assert_equal 0, c2.reload.position
    assert_equal 0, c1.reload.position
    assert_equal "doing", c1.reload.column
    assert_equal 1, c3.reload.position
  end

  test "move card to different column at end" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "doing", position: 0)
    c4 = create(:card, board: @board, creator: @user, column: "doing", position: 1)

    assert CardMover.call(c1, "doing", 2)

    # Old column: c2 takes position 0
    assert_equal 0, c2.reload.position
    # New column: c3=0, c4=1, c1=2
    assert_equal 0, c3.reload.position
    assert_equal 1, c4.reload.position
    assert_equal 2, c1.reload.position
    assert_equal "doing", c1.reload.column
  end

  test "move card to empty column" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)

    assert CardMover.call(c1, "doing", 0)

    assert_equal 0, c2.reload.position
    assert_equal 0, c1.reload.position
    assert_equal "doing", c1.reload.column
  end

  test "move last card out of column" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)

    assert CardMover.call(c1, "doing", 0)

    assert_equal 0, c1.reload.position
    assert_equal "doing", c1.reload.column
    assert_equal 0, @board.cards.where(column: "todo").count
  end

  test "sequential moves maintain consistent positions" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "todo", position: 2)

    # Move c1 down one
    assert CardMover.call(c1, "todo", 1)
    assert_equal [c2, c1, c3].map(&:id), @board.cards.where(column: "todo").order(:position).pluck(:id)

    # Move c1 down again
    c1.reload
    assert CardMover.call(c1, "todo", 2)
    assert_equal [c2, c3, c1].map(&:id), @board.cards.where(column: "todo").order(:position).pluck(:id)

    # Move c1 to doing
    c1.reload
    assert CardMover.call(c1, "doing", 0)
    assert_equal [c2, c3].map(&:id), @board.cards.where(column: "todo").order(:position).pluck(:id)
    assert_equal [c1].map(&:id), @board.cards.where(column: "doing").order(:position).pluck(:id)
  end

  test "rapid cross-column moves maintain consistency" do
    c1 = create(:card, board: @board, creator: @user, column: "todo", position: 0)
    c2 = create(:card, board: @board, creator: @user, column: "todo", position: 1)
    c3 = create(:card, board: @board, creator: @user, column: "doing", position: 0)

    # Move c1 to doing
    assert CardMover.call(c1, "doing", 1)
    c1.reload
    assert_equal "doing", c1.column
    assert_equal 1, c1.position

    # Immediately move c1 to done
    assert CardMover.call(c1, "done", 0)
    c1.reload
    assert_equal "done", c1.column
    assert_equal 0, c1.position

    # Verify all positions are clean
    todo_positions = @board.cards.where(column: "todo").order(:position).pluck(:position)
    doing_positions = @board.cards.where(column: "doing").order(:position).pluck(:position)
    done_positions = @board.cards.where(column: "done").order(:position).pluck(:position)

    assert_equal [0], todo_positions
    assert_equal [0], doing_positions
    assert_equal [0], done_positions
  end
end
