# Community Platform - Seed Data
# Simple seed data for the community platform

require_relative '../app/helpers/placeholder_helper'
include PlaceholderHelper

puts "🌱 Seeding Community Platform..."

puts "Cleaning up existing community data..."
# Clear all junction tables first
ActiveRecord::Base.connection.execute('DELETE FROM age_group_categories_posts') rescue nil
ActiveRecord::Base.connection.execute('DELETE FROM community_categories_spaces') rescue nil
ActiveRecord::Base.connection.execute('DELETE FROM age_group_categories_spaces') rescue nil

# Delete dependent records first
Comment.delete_all if defined?(Comment)
Like.delete_all if defined?(Like)
Post.delete_all
Membership.delete_all
Space.delete_all
CommunityCategory.delete_all
AgeGroupCategory.delete_all

puts "Finding User 1 as the creator..."
creator = User.first
unless creator
  puts "❌ No users found. Please create at least one user first."
  exit
end
puts "✅ Using #{creator.name} (#{creator.email}) as creator"

# Verify placeholder images exist
verify_placeholders

puts "Creating 3 community categories..."
community_categories_data = [
  { name: "Parents", description: "Resources and support for parents" },
  { name: "Caregivers", description: "Support and resources for caregivers" },
  { name: "Testimonials", description: "Success stories and testimonials from our community" }
]

community_categories = community_categories_data.map do |cat_data|
  CommunityCategory.find_or_create_by!(name: cat_data[:name])
end

puts "Creating age group categories..."
age_groups_data = [
  { name: "Early Intervention (0-3)", description: "Birth to 3 years old" },
  { name: "Preschool (3-5)", description: "Preschool aged children" },
  { name: "Elementary (6-11)", description: "Elementary school aged" },
  { name: "Middle School (12-14)", description: "Middle school and pre-teen years" },
  { name: "High School (15-18)", description: "High school and transition planning" },
  { name: "Young Adults (18+)", description: "Post-graduation and adult services" }
]

age_group_categories = age_groups_data.map do |age_data|
  AgeGroupCategory.find_or_create_by!(name: age_data[:name])
end

puts "Creating 10 community spaces..."
space_categories_data = [
  {
    title: "Books to read",
    description: "Book recommendations and reading discussions for families",
    category: "Parents"
  },
  {
    title: "Pets and Babies", 
    description: "Pet care and baby care resources for families",
    category: "Parents"
  },
  {
    title: "Deal with Stigma",
    description: "Strategies for overcoming stigma and building understanding", 
    category: "Parents"
  },
  {
    title: "Dealing with Relationships",
    description: "Relationship advice and family dynamics support",
    category: "Parents"
  },
  {
    title: "food",
    description: "Nutrition, recipes, and meal planning resources",
    category: "Caregivers"
  },
  {
    title: "Games",
    description: "Fun games and activities for families",
    category: "Caregivers" 
  },
  {
    title: "Job Postings",
    description: "Employment opportunities and career resources",
    category: "Caregivers"
  },
  {
    title: "Activities",
    description: "Family activities and community events",
    category: "Caregivers"
  },
  {
    title: "Parent Guidance",
    description: "Guidance and support specifically for parents",
    category: "Parents"
  },
  {
    title: "Caregiver Guidance", 
    description: "Resources and support for professional caregivers",
    category: "Caregivers"
  }
]

spaces = []
space_categories_data.each do |space_data|
  # Find the community category
  community_category = community_categories.find { |cat| cat.name == space_data[:category] }
  
  # Create space
  space = Space.new(
    title: space_data[:title],
    description: space_data[:description],
    created_by: creator,
    community_categories: [community_category],
    age_group_categories: age_group_categories.sample(2) # Random 2 age groups
  )
  
  # Attach placeholder image based on space title
  attach_placeholder(space, space_data[:title])
  space.save!
  spaces << space
  
  # Creator joins their own space
  Membership.find_or_create_by(user: creator, space: space)
end

puts "Creating one post per space..."
spaces.each do |space|
  # Generate post content based on space title
  post_content = case space.title
  when "Books to read"
    { title: "Amazing book recommendations", content: "I wanted to share some incredible books that have really helped our family. These reads provide great insights and practical advice." }
  when "Pets and Babies"
    { title: "Introducing pets to children", content: "We're considering getting a family pet and would love to hear about your experiences. What pets work well with children?" }
  when "Deal with Stigma"
    { title: "Handling challenging situations", content: "Sometimes we face difficult situations where people don't understand our family's needs. Here are some strategies that have worked for us." }
  when "Dealing with Relationships"
    { title: "Strengthening family bonds", content: "Building strong family relationships takes work, but it's so worth it. Sharing some approaches that have helped our family connect better." }
  when "food"
    { title: "Nutritious meal ideas", content: "Looking for healthy, family-friendly meal ideas that everyone will actually eat. Would love to hear your go-to recipes and tips!" }
  when "Games"
    { title: "Fun family game night ideas", content: "We've discovered some amazing games that bring our family together. These have been great for bonding and creating lasting memories." }
  when "Job Postings"
    { title: "Remote work opportunities", content: "Sharing some excellent remote work opportunities that offer flexibility for caregivers and parents. These positions understand work-life balance." }
  when "Activities"
    { title: "Weekend family activities", content: "Planning some fun weekend activities and looking for ideas that work well for families. What are your favorite things to do together?" }
  when "Parent Guidance"
    { title: "Parenting strategies that work", content: "Every family is different, but some parenting approaches have been game-changers for us. Sharing what's worked and hoping to learn from others." }
  when "Caregiver Guidance"
    { title: "Self-care for caregivers", content: "Taking care of ourselves while caring for others is so important. Here are some self-care strategies that have helped me stay balanced and energized." }
  else
    { title: "Welcome to our community", content: "Excited to be part of this supportive community. Looking forward to connecting with others and sharing experiences." }
  end
  
  post = Post.create!(
    title: post_content[:title],
    content: post_content[:content],
    space: space,
    created_by: creator
  )
  
  # Create one comment per post
  comment_content = case space.title
  when "Books to read"
    "Thanks for sharing these recommendations! I'm always looking for good books to add to our family library."
  when "Pets and Babies"
    "We had a great experience introducing a gentle dog to our family. Happy to share more details if you're interested!"
  when "Deal with Stigma"
    "These strategies are so helpful. It's important to have tools for handling difficult situations with confidence."
  when "Dealing with Relationships"
    "Family relationships can be challenging but so rewarding. These tips look really practical and thoughtful."
  when "food"
    "Always looking for new meal ideas! Would love to try some of these suggestions with my family."
  when "Games"
    "Game night sounds wonderful! We're always looking for new games that everyone can enjoy together."
  when "Job Postings"
    "Thanks for sharing these opportunities. Flexibility is so important for those of us balancing work and caregiving."
  when "Activities"
    "Great ideas for weekend fun! We're always looking for activities that work well for the whole family."
  when "Parent Guidance"
    "These strategies sound really helpful. Parenting is such a journey and it's great to learn from other families."
  when "Caregiver Guidance"
    "Self-care is so important but often forgotten. Thanks for the reminder and these practical suggestions!"
  else
    "Welcome! This community has been such a wonderful source of support and connection."
  end
  
  Comment.create!(
    content: comment_content,
    post: post,
    user: creator
  )
end

puts "✅ Community Platform seed data created successfully!"
puts "📊 Summary:"
puts "   - #{User.count} user (using existing User 1)"
puts "   - #{CommunityCategory.count} community categories"
puts "   - #{AgeGroupCategory.count} age group categories"
puts "   - #{Space.count} community spaces"
puts "   - #{Membership.count} memberships"
puts "   - #{Post.count} discussion posts"
puts "   - #{Comment.count} comments"
puts

puts "🚀 Your community platform is ready!"
puts "🌟 Visit /community to explore the platform!"
puts

puts "Community Categories:"
community_categories.each { |c| puts "   • #{c.name}" }
puts

puts "Space Categories:"
spaces.each { |s| puts "   • #{s.title}" }