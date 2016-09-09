class AddEnteredToWaitlists < ActiveRecord::Migration
  def change
    add_column :waitlists, :entered, :boolean
  end
end
