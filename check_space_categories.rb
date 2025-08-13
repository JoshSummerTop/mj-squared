#!/usr/bin/env ruby

# Add the Rails environment
require_relative 'config/environment'

puts "=== SPACE CATEGORIES REPORT ==="
puts

spaces = Space.includes(:community_categories, :age_group_categories).all

spaces.each do |space|
  puts "📍 #{space.title}"
  
  puts "   Community Categories (#{space.community_categories.count}):"
  space.community_categories.each do |cat|
    puts "     - #{cat.name}"
  end
  
  puts "   Age Group Categories (#{space.age_group_categories.count}):"
  space.age_group_categories.each do |age|
    puts "     - #{age.name}"
  end
  
  puts
end

puts "=== SUMMARY ==="
puts "Total Spaces: #{Space.count}"
puts "Total Community Categories: #{CommunityCategory.count}"
puts "Total Age Group Categories: #{AgeGroupCategory.count}"
puts

# Check if any spaces have multiple community categories
multi_community_spaces = Space.joins(:community_categories).group('spaces.id').having('COUNT(community_categories.id) > 1')
puts "Spaces with multiple community categories: #{multi_community_spaces.count}"

# Check if any spaces have multiple age group categories  
multi_age_spaces = Space.joins(:age_group_categories).group('spaces.id').having('COUNT(age_group_categories.id) > 1')
puts "Spaces with multiple age group categories: #{multi_age_spaces.count}"
