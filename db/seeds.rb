# Community Platform - Seed Data
# Simple seed data for the community platform

require_relative '../app/helpers/placeholder_helper'
include PlaceholderHelper

# Helper method for generating varied post content
def generate_post_content(space_title, post_index)
  base_content = case space_title
  when "Books to read"
    [
      { title: "Amazing book recommendations for families", content: "I wanted to share some incredible books that have really helped our family. These reads provide great insights and practical advice for everyday challenges." },
      { title: "Children's books that teach empathy", content: "Looking for book suggestions that help children understand different perspectives and build empathy. What books have worked well in your family?" },
      { title: "Adult reading for personal growth", content: "Sometimes we need books that help us grow as parents and caregivers. Here are some titles that have made a real difference in my approach." }
    ]
  when "Pets and Babies"
    [
      { title: "Introducing pets to young children", content: "We're considering getting a family pet and would love to hear about your experiences. What pets work well with children of different ages?" },
      { title: "Pet therapy benefits for families", content: "Has anyone experienced the therapeutic benefits of pets? We're exploring how animals might help with emotional regulation and social skills." },
      { title: "Caring for pets teaches responsibility", content: "Our family pet has been such a wonderful way to teach responsibility and empathy. Sharing some tips for making pet care a positive family experience." }
    ]
  when "Deal with Stigma"
    [
      { title: "Handling difficult public situations", content: "Sometimes we face challenging situations where people don't understand our family's needs. Here are some strategies that have worked for us when dealing with judgment." },
      { title: "Educating others with patience and grace", content: "We've found that gentle education often works better than defensiveness. Sharing some approaches for helping others understand and accept differences." },
      { title: "Building confidence in your family", content: "Helping our children develop resilience and self-confidence in the face of misunderstanding is so important. What strategies have worked for your family?" }
    ]
  when "Dealing with Relationships"
    [
      { title: "Strengthening family bonds through challenges", content: "Building strong family relationships takes work, but it's so worth it. Sharing some approaches that have helped our family connect better during difficult times." },
      { title: "Communication strategies that work", content: "We've learned that clear, patient communication is the foundation of strong relationships. Here are some techniques that have transformed our family dynamics." },
      { title: "Supporting each other through transitions", content: "Life transitions can be especially challenging for families. How do you help each family member feel supported and understood during times of change?" }
    ]
  when "food"
    [
      { title: "Nutritious meals everyone will eat", content: "Looking for healthy, family-friendly meal ideas that everyone will actually enjoy. Would love to hear your go-to recipes and tips for picky eaters!" },
      { title: "Meal planning strategies for busy families", content: "Between work and caregiving, meal planning can be overwhelming. Sharing some strategies that have helped us stay organized and well-fed." },
      { title: "Involving kids in cooking and meal prep", content: "Getting children involved in cooking has been such a positive experience for our family. It teaches life skills and creates wonderful bonding opportunities." }
    ]
  when "Games"
    [
      { title: "Family game night favorites", content: "We've discovered some amazing games that bring our family together. These have been great for bonding and creating lasting memories while building important skills." },
      { title: "Educational games that don't feel like learning", content: "Looking for games that are fun but also help with learning and development. What games have been hits in your family?" },
      { title: "Outdoor games and activities", content: "With nice weather approaching, we're looking for outdoor games and activities that work well for families. What are your favorites for getting everyone moving?" }
    ]
  when "Job Postings"
    [
      { title: "Flexible remote work opportunities", content: "Sharing some excellent remote work opportunities that offer flexibility for caregivers and parents. These positions understand the importance of work-life balance." },
      { title: "Career resources for caregivers", content: "Balancing career growth with caregiving responsibilities can be challenging. Here are some resources and opportunities that support working caregivers." },
      { title: "Starting a side business while caregiving", content: "Has anyone successfully started a side business while managing caregiving responsibilities? Looking for advice and inspiration from others who've done this." }
    ]
  when "Activities"
    [
      { title: "Weekend family activities that everyone enjoys", content: "Planning some fun weekend activities and looking for ideas that work well for families with diverse interests and abilities. What are your favorite things to do together?" },
      { title: "Low-cost activities for family fun", content: "Family activities don't have to be expensive to be meaningful. Sharing some budget-friendly ideas that have created wonderful memories for our family." },
      { title: "Seasonal activities and traditions", content: "We love creating seasonal traditions and activities that bring our family together. What seasonal activities does your family look forward to each year?" }
    ]
  when "Parent Guidance"
    [
      { title: "Parenting strategies that actually work", content: "Every family is different, but some parenting approaches have been game-changers for us. Sharing what's worked and hoping to learn from other families' experiences." },
      { title: "Setting boundaries with love and consistency", content: "Finding the right balance between structure and flexibility in parenting can be tricky. How do you set boundaries that work for your family?" },
      { title: "Supporting your child's unique strengths", content: "Every child has unique gifts and challenges. How do you help your child recognize and develop their individual strengths while addressing areas of growth?" }
    ]
  when "Caregiver Guidance"
    [
      { title: "Self-care strategies for busy caregivers", content: "Taking care of ourselves while caring for others is so important but often forgotten. Here are some practical self-care strategies that have helped me stay balanced." },
      { title: "Managing caregiver burnout", content: "Caregiver burnout is real and more common than we like to admit. How do you recognize the signs and what strategies have helped you recover and prevent it?" },
      { title: "Building a support network as a caregiver", content: "Having a strong support network makes such a difference in caregiving. How have you built meaningful connections with others who understand your journey?" }
    ]
  else
    [
      { title: "Welcome to our supportive community", content: "Excited to be part of this wonderful community. Looking forward to connecting with others, sharing experiences, and learning from each other's journeys." },
      { title: "Introducing myself and my family", content: "New to the community and wanted to introduce myself. Every family's story is unique, and I'm grateful for spaces like this where we can share and support each other." },
      { title: "Looking for advice and connection", content: "This community seems like such a welcoming place. I'm looking forward to both offering support to others and finding guidance for my own family's journey." }
    ]
  end
  
  base_content[post_index % base_content.length]
end

# Helper method for generating varied comment content  
def generate_comment_content(space_title, comment_index)
  base_comments = case space_title
  when "Books to read"
    [
      "Thanks for sharing these recommendations! I'm always looking for good books to add to our family library.",
      "These book suggestions look wonderful. Have you found any that work well for different age groups?",
      "Adding these to my reading list! Do you have any favorite authors who consistently write helpful content?",
      "Great recommendations! We've had success with similar books and I'd love to share a few more if you're interested.",
      "This is exactly what I was looking for. Thank you for taking the time to share these thoughtful suggestions."
    ]
  when "Pets and Babies"
    [
      "We had a great experience introducing a gentle dog to our family. Happy to share more details if you're interested!",
      "Pets have been such a positive addition to our family. The therapeutic benefits have been amazing to witness.",
      "This is something we've been considering too. What age do you think is best for introducing a family pet?",
      "Our cat has been wonderful with our children. Each family situation is different, but it's worked well for us.",
      "Thanks for sharing your experience! It's helpful to hear from other families who've navigated this successfully."
    ]
  when "Deal with Stigma"
    [
      "These strategies are so helpful. It's important to have tools for handling difficult situations with confidence and grace.",
      "Thank you for sharing these thoughtful approaches. Education and patience really do make a difference over time.",
      "I've found similar strategies helpful. Building our own family's confidence has been key to handling outside judgment.",
      "This resonates so much with our experience. It's comforting to know other families face similar challenges and find ways to thrive.",
      "Appreciate you sharing what's worked for your family. These approaches focus on the positive while addressing real challenges."
    ]
  when "Dealing with Relationships"
    [
      "Family relationships can be challenging but so rewarding. These tips look really practical and thoughtful.",
      "Communication really is the foundation of strong relationships. Thanks for sharing what's worked for your family.",
      "These strategies sound like they could help our family too. Relationships take work but it's so worth the investment.",
      "Transitions are definitely challenging for families. It's helpful to hear approaches that have worked for others.",
      "Building strong family bonds is so important. These suggestions provide a great framework to work from."
    ]
  when "food"
    [
      "Always looking for new meal ideas! Would love to try some of these suggestions with my family.",
      "Meal planning can be so overwhelming, but your strategies sound really manageable and practical.",
      "Getting kids involved in cooking has been great for our family too. It's amazing how much more willing they are to try new foods.",
      "These sound like meals that would work well for our family. Do you have any tips for dealing with very picky eaters?",
      "Thanks for sharing these ideas! It's always helpful to hear what works for other families when it comes to nutrition."
    ]
  when "Games"
    [
      "Game night sounds wonderful! We're always looking for new games that everyone can enjoy together.",
      "These game suggestions are perfect! It's great to find activities that are both fun and educational.",
      "Outdoor games are such a great way to get everyone moving and having fun. Thanks for the suggestions!",
      "Our family loves game nights too. There's something special about everyone laughing and playing together.",
      "Adding these to our game collection! It's wonderful to find activities that bring families closer together."
    ]
  when "Job Postings"
    [
      "Thanks for sharing these opportunities. Flexibility is so important for those of us balancing work and caregiving responsibilities.",
      "These career resources look really valuable. Balancing work and caregiving is always a challenge, but these seem supportive.",
      "Starting a side business while caregiving is something I've considered. Would love to hear more about others' experiences.",
      "Work-life balance is so important, especially in caregiving situations. These opportunities sound like they understand that.",
      "Appreciate you sharing these resources. It's helpful to know about employers who truly support working caregivers."
    ]
  when "Activities"
    [
      "Great ideas for weekend fun! We're always looking for activities that work well for the whole family.",
      "Budget-friendly activities are so important. Some of the best family memories come from simple, low-cost activities.",
      "Seasonal traditions are such a great way to bring families together. We love creating new traditions each year.",
      "These activity suggestions sound perfect for our family. It's wonderful to have ideas that everyone can enjoy.",
      "Thanks for sharing these ideas! Family activities that work for everyone can be challenging to find, so this is really helpful."
    ]
  when "Parent Guidance"
    [
      "These parenting strategies sound really helpful. Parenting is such a journey and it's great to learn from other families.",
      "Setting boundaries with love and consistency is so important but can be challenging. Thanks for sharing your approach.",
      "Supporting each child's unique strengths while addressing challenges is such an important balance. Great perspective!",
      "Every family's approach is different, but these strategies seem like they could work well for many situations.",
      "Parenting advice from other families who've been there is so valuable. Thanks for sharing what's worked for you."
    ]
  when "Caregiver Guidance"
    [
      "Self-care is so important but often forgotten. Thanks for the reminder and these practical suggestions!",
      "Caregiver burnout is definitely real. It's important to recognize the signs and have strategies for prevention and recovery.",
      "Building a support network as a caregiver can be challenging but it makes such a difference. Thanks for sharing your experience.",
      "These self-care strategies sound manageable and practical. It's important to remember we can't pour from an empty cup.",
      "The caregiving journey can be isolating sometimes, so it's wonderful to connect with others who understand the experience."
    ]
  else
    [
      "Welcome! This community has been such a wonderful source of support and connection.",
      "So glad you're part of our community! Looking forward to getting to know you and your family.",
      "Welcome to the group! Every family brings unique experiences and perspectives that enrich our community.",
      "This is such a supportive community. You'll find lots of understanding and helpful advice here.",
      "Welcome! It's wonderful to have new voices and perspectives joining our conversations."
    ]
  end
  
  base_comments[comment_index % base_comments.length]
end

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

puts "Creating 10 test users..."
test_users_data = [
  { name: "Sarah Johnson", email: "sarah@example.com" },
  { name: "Mike Chen", email: "mike@example.com" },
  { name: "Amanda Rodriguez", email: "amanda@example.com" },
  { name: "David Kim", email: "david@example.com" },
  { name: "Lisa Thompson", email: "lisa@example.com" },
  { name: "Carlos Martinez", email: "carlos@example.com" },
  { name: "Emily Davis", email: "emily@example.com" },
  { name: "James Wilson", email: "james@example.com" },
  { name: "Maria Garcia", email: "maria@example.com" },
  { name: "Alex Taylor", email: "alex@example.com" }
]

test_users = []
test_users_data.each do |user_data|
  user = User.find_or_initialize_by(email: user_data[:email])
  if user.new_record?
    user.name = user_data[:name]
    user.password = "password123"
    user.password_confirmation = "password123"
    user.terms_of_service = "1"
    user.save!
  end
  test_users << user
end

creator = test_users.first
puts "✅ Created/found #{test_users.count} test users"
puts "✅ Using #{creator.name} (#{creator.email}) as primary creator"

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
  
  # Random users join spaces (2-5 users per space)
  test_users.sample(rand(2..5)).each do |user|
    Membership.find_or_create_by(user: user, space: space) unless user == creator
  end
end

puts "Creating multiple posts per space..."
all_posts = []

spaces.each do |space|
  # Create 2-4 posts per space
  num_posts = rand(2..4)
  space_members = space.users.to_a
  
  num_posts.times do |i|
    # Rotate through different post creators
    post_creator = space_members.sample
    
    # Generate varied post content based on space title and post number
    post_content = generate_post_content(space.title, i)
    
    post = Post.create!(
      title: post_content[:title],
      content: post_content[:content],
      space: space,
      created_by: post_creator
    )
    
    all_posts << post
    
    # Add random likes to posts (0-3 likes per post)
    rand(0..3).times do
      like_user = space_members.sample
      Like.find_or_create_by(user: like_user, post: post) unless like_user == post_creator
    end
  end
end

puts "Creating comments on posts..."
all_posts.each do |post|
  # Create 1-5 comments per post
  num_comments = rand(1..5)
  post_space_members = post.space.users.to_a
  
  num_comments.times do |i|
    commenter = post_space_members.sample
    next if commenter == post.created_by && i == 0 # Skip first comment if same as post creator
    
    comment_content = generate_comment_content(post.space.title, i)
    
    Comment.create!(
      content: comment_content,
      post: post,
      user: commenter
    )
  end
end
puts "✅ Community Platform seed data created successfully!"
puts "📊 Summary:"
puts "   - #{User.count} test users created"
puts "   - #{CommunityCategory.count} community categories"
puts "   - #{AgeGroupCategory.count} age group categories"
puts "   - #{Space.count} community spaces"
puts "   - #{Membership.count} memberships"
puts "   - #{Post.count} discussion posts"
puts "   - #{Comment.count} comments"
puts "   - #{Like.count} likes"
puts

puts "🚀 Your community platform is ready!"
puts "🌟 Visit /community to explore the platform!"
puts

puts "Test Users Created:"
test_users.each { |u| puts "   • #{u.name} (#{u.email})" }
puts

puts "Community Categories:"
community_categories.each { |c| puts "   • #{c.name}" }
puts

puts "Space Categories:"
spaces.each { |s| puts "   • #{s.title} (#{s.posts.count} posts, #{s.memberships.count} members)" }