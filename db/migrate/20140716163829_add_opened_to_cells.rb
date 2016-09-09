class AddOpenedToCells < ActiveRecord::Migration
  def change
    add_column :cells, :opened, :boolean
  end
end
