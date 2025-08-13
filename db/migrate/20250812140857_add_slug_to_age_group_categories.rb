class AddSlugToAgeGroupCategories < ActiveRecord::Migration[8.0]
  def change
    add_column :age_group_categories, :slug, :string unless column_exists?(:age_group_categories, :slug)
  end
end
