class AddInvitedToWaitlists < ActiveRecord::Migration
  def change
    add_column :waitlists, :invited, :boolean
  end
end
