class CardMover
  def self.call(card, new_column, new_position)
    new(card, new_column, new_position).call
  end

  def initialize(card, new_column, new_position)
    @card = card
    @board = card.board
    @old_column = card.column
    @new_column = new_column || card.column
    @new_position = new_position
  end

  def call
    ActiveRecord::Base.transaction do
      if @old_column == @new_column
        reorder_within_column
      else
        remove_from_old_column
        insert_into_new_column
      end

      @card.update!(column: @new_column, position: @new_position)
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  private

  def reorder_within_column
    old_position = @card.position

    if @new_position > old_position
      siblings.where("position > ? AND position <= ?", old_position, @new_position)
               .update_all("position = position - 1")
    elsif @new_position < old_position
      siblings.where("position >= ? AND position < ?", @new_position, old_position)
               .update_all("position = position + 1")
    end
  end

  def remove_from_old_column
    @board.cards.where(column: @old_column)
          .where("position > ?", @card.position)
          .update_all("position = position - 1")
  end

  def insert_into_new_column
    @board.cards.where(column: @new_column)
          .where("position >= ?", @new_position)
          .where.not(id: @card.id)
          .update_all("position = position + 1")
  end

  def siblings
    @board.cards.where(column: @new_column).where.not(id: @card.id)
  end
end
