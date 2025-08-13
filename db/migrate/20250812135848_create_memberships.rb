class CreateMemberships < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:memberships)
      create_table :memberships do |t|
        t.references :user, null: false, foreign_key: true
        t.references :space, null: false, foreign_key: true

        t.timestamps
      end
      add_index :memberships, [:user_id, :space_id], unique: true
    end
  end
end
