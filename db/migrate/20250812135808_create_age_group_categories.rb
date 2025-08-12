class CreateAgeGroupCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :age_group_categories do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end
