class AddSlugToSpaces < ActiveRecord::Migration[8.0]
  def change
    add_column :spaces, :slug, :string unless column_exists?(:spaces, :slug)
  end
end
