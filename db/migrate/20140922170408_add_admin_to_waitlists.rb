class AddAdminToWaitlists < ActiveRecord::Migration
  def change
    add_column :waitlists, :admin, :boolean
  end
end
