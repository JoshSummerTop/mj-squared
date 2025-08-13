class CreateJoinTableAgeGroupCategoriesPosts < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:age_group_categories_posts)
      create_table :age_group_categories_posts, id: false do |t|
        t.references :post, null: false, foreign_key: true
        t.references :age_group_category, null: false, foreign_key: true
      end
      add_index :age_group_categories_posts, [:post_id, :age_group_category_id], unique: true, name: 'index_posts_age_groups_on_post_and_age_group'
    end
  end
end
