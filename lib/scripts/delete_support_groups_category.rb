#!/usr/bin/env ruby

# Script to delete SupportGroups category and all associated spaces
# This is a DESTRUCTIVE operation that will delete:
# - All spaces in the SupportGroups category
# - All posts in those spaces  
# - All memberships for those spaces
# - All comments on posts in those spaces
# - The SupportGroups category itself

puts "🔍 Finding SupportGroups category..."

category = CommunityCategory.find_by(name: "SupportGroups")

if category.nil?
  puts "❌ SupportGroups category not found!"
  exit 1
end

puts "✅ Found category: #{category.name} (ID: #{category.id})"

# Get all associated spaces
spaces = category.spaces.includes(:posts, :memberships, :users)
space_count = spaces.count

puts "\n📊 DELETION SUMMARY:"
puts "==================="
puts "Category: #{category.name}"
puts "Spaces to delete: #{space_count}"

if space_count > 0
  puts "\nSpaces that will be deleted:"
  spaces.each_with_index do |space, index|
    posts_count = space.posts.count
    memberships_count = space.memberships.count
    puts "  #{index + 1}. #{space.title} (#{posts_count} posts, #{memberships_count} members)"
  end
  
  total_posts = spaces.sum { |s| s.posts.count }
  total_memberships = spaces.sum { |s| s.memberships.count }
  
  puts "\n💥 TOTAL ITEMS TO DELETE:"
  puts "  - #{space_count} spaces"
  puts "  - #{total_posts} posts"
  puts "  - #{total_memberships} memberships"
  puts "  - 1 category"
else
  puts "✅ No spaces associated with this category."
end

puts "\n⚠️  WARNING: This action cannot be undone!"
print "Type 'DELETE' to confirm: "
confirmation = STDIN.gets.chomp

unless confirmation == "DELETE"
  puts "❌ Operation cancelled."
  exit 0
end

puts "\n🚀 Starting deletion process..."

begin
  ActiveRecord::Base.transaction do
    deleted_posts_count = 0
    deleted_memberships_count = 0
    
    # Delete each space (this will cascade delete posts and memberships)
    spaces.find_each do |space|
      posts_count = space.posts.count
      memberships_count = space.memberships.count
      
      puts "🗑️  Deleting space: #{space.title}..."
      puts "   - Deleting #{posts_count} posts..."
      puts "   - Deleting #{memberships_count} memberships..."
      
      deleted_posts_count += posts_count
      deleted_memberships_count += memberships_count
      
      space.destroy!
    end
    
    # Now delete the category (should work since no spaces are left)
    puts "🗑️  Deleting category: #{category.name}..."
    category.destroy!
    
    puts "\n✅ DELETION COMPLETE!"
    puts "==================="
    puts "Deleted:"
    puts "  - #{space_count} spaces"
    puts "  - #{deleted_posts_count} posts"
    puts "  - #{deleted_memberships_count} memberships"
    puts "  - 1 category (SupportGroups)"
  end
rescue => e
  puts "\n❌ ERROR during deletion: #{e.message}"
  puts "Transaction rolled back - no data was deleted."
  exit 1
end

puts "\n🎉 All done! SupportGroups category and all associated data has been permanently deleted."
