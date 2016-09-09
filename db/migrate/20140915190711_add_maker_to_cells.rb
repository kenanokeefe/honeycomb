class AddMakerToCells < ActiveRecord::Migration
  def change
    add_column :cells, :maker, :string
  end
end
