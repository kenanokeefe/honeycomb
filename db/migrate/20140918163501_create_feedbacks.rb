class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.string :maker
      t.text :text

      t.timestamps
    end
  end
end
