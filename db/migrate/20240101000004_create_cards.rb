class CreateCards < ActiveRecord::Migration[7.1]
  def change
    create_table :cards do |t|
      t.string :title, null: false
      t.text :description
      t.string :column, null: false, default: "todo"
      t.integer :position, null: false, default: 0
      t.references :board, null: false, foreign_key: true
      t.references :creator, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :cards, [:board_id, :column, :position]
  end
end
