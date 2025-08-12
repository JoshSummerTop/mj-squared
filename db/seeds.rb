# Community Platform Seed Data
# Only includes community features: spaces, posts, comments, categories

puts "🌱 Seeding Community Platform data..."

# Clean up existing community data
puts "Cleaning up existing community data..."

ActiveRecord::Base.connection.execute("DELETE FROM age_group_categories_posts")
ActiveRecord::Base.connection.execute("DELETE FROM age_group_categories_spaces") 
ActiveRecord::Base.connection.execute("DELETE FROM community_categories_spaces")

Comment.delete_all
Like.delete_all
Post.delete_all
Membership.delete_all
Space.delete_all

puts "Creating/finding test users..."
users = [
  { email: "test1@email.com", name: "Jane Doe" },
  { email: "test2@email.com", name: "John Doe" },
  { email: "test3@email.com", name: "Alex Smith" },
  { email: "test4@email.com", name: "Sam Lee" }
].map do |attrs|
  User.find_or_create_by(email: attrs[:email]) do |user|
    user.name = attrs[:name]
    user.password = "password"
    user.password_confirmation = "password"
    user.confirmed_at = Time.now
    user.accepted_terms_at = Time.now
    user.terms_of_service = true
    user.time_zone = "UTC"
  end
end

# Helper for attaching placeholder image
def attach_placeholder(record, field = :image)
  # Create a simple placeholder if community_placeholder.jpg doesn't exist
  placeholder_path = Rails.root.join("app/assets/images/community_placeholder.jpg")
  if File.exist?(placeholder_path)
    record.send(field).attach(io: File.open(placeholder_path), filename: "community_placeholder.jpg", content_type: "image/jpeg")
  else
    puts "  ⚠️  Skipping image attachment for #{record.class.name} - placeholder image not found"
  end
end

puts "Creating community categories and age groups..."
community_categories = %w[Therapies SupportGroups Activities].map { |name| CommunityCategory.find_or_create_by!(name: name) }
age_group_categories = ["Ages 3-5", "Ages 6-8", "Ages 9-12"].map { |name| AgeGroupCategory.find_or_create_by!(name: name) }

puts "Creating spaces..."
spaces = []
4.times do |n|
  community_categories.each do |cat|
    age_group_categories.each do |age_group|
      space = Space.new(
        title: "#{cat.name} Space for #{age_group.name} (#{n+1})",
        description: "A welcoming space for neurodivergent children and their families interested in #{cat.name} for #{age_group.name}. This is variation #{n+1} of this type of space.",
        community_categories: [cat],
        age_group_categories: [age_group],
        created_by: users.sample
      )
      attach_placeholder(space)
      space.save!
      spaces << space
    end
  end
end

puts "Creating memberships..."
# Create some memberships so users are joined to spaces
spaces.each do |space|
  # Join 1-3 random users to each space
  users.sample(rand(1..3)).each do |user|
    Membership.find_or_create_by(user: user, space: space)
  end
end

puts "Creating posts in spaces..."
spaces.each do |space|
  2.times do |i|
    post = Post.create!(
      title: "Post #{i+1} in #{space.title}",
      content: "This is a helpful post for families dealing with #{space.community_categories.first.name.downcase}. It contains valuable information and resources for parents and caregivers in the #{space.age_group_categories.first.name.downcase} range.",
      space: space,
      created_by: users.sample,
      age_group_categories: space.age_group_categories
    )
    
    # Add some likes to posts
    users.sample(rand(0..2)).each do |user|
      Like.find_or_create_by(user: user, post: post)
    end
    
    # Add comments to posts
    2.times do
      Comment.create!(
        content: ["Great info! Thanks for sharing.", "This is really helpful.", "My family has had similar experiences.", "Thank you for posting this resource."].sample,
        post: post,
        user: users.sample
      )
    end
  end
end

puts "✅ Community seed data created successfully!"
puts "📊 Summary:"
puts "   - #{User.where(email: ["test1@email.com", "test2@email.com", "test3@email.com", "test4@email.com"]).count} test users"
puts "   - #{CommunityCategory.count} community categories"
puts "   - #{AgeGroupCategory.count} age group categories"  
puts "   - #{Space.count} spaces"
puts "   - #{Membership.count} memberships"
puts "   - #{Post.count} posts"
puts "   - #{Comment.count} comments"
puts "   - #{Like.count} likes"
puts
puts "🚀 You can now visit /community to explore the seeded data!"

# Clear seeding flag
$seeding = false