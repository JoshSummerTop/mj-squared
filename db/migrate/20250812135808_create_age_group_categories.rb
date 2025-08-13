class CreateAgeGroupCategories < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:age_group_categories)
      create_table :age_group_categories do |t|
        t.string :name, null: false

        t.timestamps
      end
    end
  end
end
