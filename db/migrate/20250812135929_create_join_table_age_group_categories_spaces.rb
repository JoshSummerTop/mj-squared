class CreateJoinTableAgeGroupCategoriesSpaces < ActiveRecord::Migration[8.0]
  def change
    create_table :age_group_categories_spaces, id: false do |t|
      t.references :space, null: false, foreign_key: true
      t.references :age_group_category, null: false, foreign_key: true
    end
    add_index :age_group_categories_spaces, [:space_id, :age_group_category_id], unique: true, name: 'index_spaces_age_groups_on_space_and_age_group'
  end
end
