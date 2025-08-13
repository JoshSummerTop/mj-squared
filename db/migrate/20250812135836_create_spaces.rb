class CreateSpaces < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:spaces)
      create_table :spaces do |t|
        t.string :title, null: false
        t.text :description
        t.references :created_by, null: false, foreign_key: { to_table: :users }

        t.timestamps
      end
    end
  end
end
