class AddDueDateAndPriorityToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :due_date, :date
    add_column :tasks, :priority, :string, default: "medium", null: false
    add_index :tasks, :priority
  end
end
