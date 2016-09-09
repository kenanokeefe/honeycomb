class AddLogsToWaitlists < ActiveRecord::Migration
  def change
    add_column :waitlists, :logs, :integer
  end
end
