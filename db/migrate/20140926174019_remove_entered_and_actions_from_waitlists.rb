class RemoveEnteredAndActionsFromWaitlists < ActiveRecord::Migration
  def change
    remove_column :waitlists, :entered, :boolean
    remove_column :waitlists, :actions, :integer
  end
end
