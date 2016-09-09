class AddPasswordToWaitlists < ActiveRecord::Migration
  def change
    add_column :waitlists, :password, :string
  end
end
