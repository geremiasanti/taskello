class CreateCardParticipants < ActiveRecord::Migration[7.1]
  def change
    create_table :card_participants do |t|
      t.references :user, null: false, foreign_key: true
      t.references :card, null: false, foreign_key: true

      t.timestamps
    end

    add_index :card_participants, [:user_id, :card_id], unique: true
  end
end
