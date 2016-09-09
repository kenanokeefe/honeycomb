class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
      t.string :maker
      t.string :action
      t.string :cell

      t.timestamps
    end
  end
end
