class CreateCells < ActiveRecord::Migration
  def change
    create_table :cells do |t|
      t.string :name
      t.string :data

      t.timestamps
    end
  end
end
