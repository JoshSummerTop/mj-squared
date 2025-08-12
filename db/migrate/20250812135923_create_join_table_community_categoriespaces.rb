class CreateJoinTableCommunityCategoriespaces < ActiveRecord::Migration[8.0]
  def change
    create_table :community_categories_spaces, id: false do |t|
      t.references :space, null: false, foreign_key: true
      t.references :community_category, null: false, foreign_key: true
    end
    add_index :community_categories_spaces, [:space_id, :community_category_id], unique: true, name: 'index_spaces_community_categories_on_space_and_category'
  end
end
