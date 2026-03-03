require "test_helper"

class BoardTest < ActiveSupport::TestCase
  test "valid board" do
    board = build(:board)
    assert board.valid?
  end

  test "requires name" do
    board = build(:board, name: nil)
    assert_not board.valid?
    assert_includes board.errors[:name], "can't be blank"
  end

  test "creator is added as member after create" do
    board = create(:board)
    assert_includes board.members, board.creator
  end

  test "has many cards" do
    board = create(:board)
    card = create(:card, board: board, creator: board.creator)
    assert_includes board.cards, card
  end

  test "has many labels" do
    board = create(:board)
    label = create(:label, board: board)
    assert_includes board.labels, label
  end

  test "destroying board destroys cards" do
    board = create(:board)
    create(:card, board: board, creator: board.creator)
    assert_difference("Card.count", -1) { board.destroy }
  end
end
