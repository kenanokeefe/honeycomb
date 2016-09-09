class AddActionsToWaitlists < ActiveRecord::Migration
  def change
    add_column :waitlists, :actions, :integer
  end
end
