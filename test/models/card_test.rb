require "test_helper"

class CardTest < ActiveSupport::TestCase
  test "valid card" do
    card = build(:card)
    assert card.valid?
  end

  test "requires title" do
    card = build(:card, title: nil)
    assert_not card.valid?
    assert_includes card.errors[:title], "can't be blank"
  end

  test "requires valid column" do
    card = build(:card, column: "invalid")
    assert_not card.valid?
    assert_includes card.errors[:column], "is not included in the list"
  end

  test "allows todo, doing, done columns" do
    %w[todo doing done].each do |col|
      card = build(:card, column: col)
      assert card.valid?, "#{col} should be valid"
    end
  end

  test "creator is added as participant after create" do
    card = create(:card)
    assert_includes card.participants, card.creator
  end

  test "has many labels through card_labels" do
    board = create(:board)
    card = create(:card, board: board, creator: board.creator)
    label = create(:label, board: board)
    card.labels << label
    assert_includes card.labels, label
  end

  test "has many comments" do
    card = create(:card)
    comment = create(:comment, card: card, user: card.creator)
    assert_includes card.comments, comment
  end
end
