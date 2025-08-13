class AddSlugToPosts < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :slug, :string unless column_exists?(:posts, :slug)
  end
end
