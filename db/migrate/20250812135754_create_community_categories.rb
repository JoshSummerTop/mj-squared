class CreateCommunityCategories < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:community_categories)
      create_table :community_categories do |t|
        t.string :name
        t.string :slug

        t.timestamps
      end
      add_index :community_categories, :slug, unique: true
    end
  end
end
