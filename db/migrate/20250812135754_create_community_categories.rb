class CreateCommunityCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :community_categories do |t|
      t.string :name, null: false
      t.string :slug, null: false

      t.timestamps
    end
    add_index :community_categories, :slug, unique: true
  end
end
