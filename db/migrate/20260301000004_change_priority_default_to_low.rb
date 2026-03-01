class ChangePriorityDefaultToLow < ActiveRecord::Migration[7.1]
  def change
    change_column_default :tasks, :priority, from: "medium", to: "low"
  end
end
