class CreateBoardMemberships < ActiveRecord::Migration[7.1]
  def change
    create_table :board_memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :board, null: false, foreign_key: true

      t.timestamps
    end

    add_index :board_memberships, [:user_id, :board_id], unique: true
  end
end
