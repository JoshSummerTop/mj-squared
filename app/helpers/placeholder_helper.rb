module PlaceholderHelper
  # Available placeholder images
  PLACEHOLDER_IMAGES = [
    "placeholder.jpg",
    "placeholder_2.jpg", 
    "placeholder_3.jpg"
  ].freeze

  # Map space categories to placeholder images (cycling through the 3 available)
  SPACE_PLACEHOLDER_MAP = {
    "Books to read" => "placeholder.jpg",
    "Pets and Babies" => "placeholder_2.jpg",
    "Deal with Stigma" => "placeholder_3.jpg",
    "Dealing with Relationships" => "placeholder.jpg",
    "food" => "placeholder_2.jpg",
    "Games" => "placeholder_3.jpg",
    "Job Postings" => "placeholder.jpg",
    "Activities" => "placeholder_2.jpg",
    "Parent Guidance" => "placeholder_3.jpg",
    "Caregiver Guidance" => "placeholder.jpg"
  }.freeze

  def attach_placeholder(record, category_name)
    filename = SPACE_PLACEHOLDER_MAP[category_name] || get_default_placeholder
    path = Rails.root.join("app/assets/images/placeholders/#{filename}")

    if File.exist?(path)
      record.image.attach(io: File.open(path), filename: filename, content_type: "image/jpeg")
      puts "  ✅ Attached #{filename} to #{record.class.name}"
    else
      puts "  ⚠️  Skipping image attachment for #{record.class.name} - placeholder image '#{filename}' not found"
    end
  end

  def get_default_placeholder
    # Returns a random placeholder image for spaces without uploaded images
    PLACEHOLDER_IMAGES.sample
  end

  def verify_placeholders
    missing_files = []
    PLACEHOLDER_IMAGES.each do |filename|
      path = Rails.root.join("app/assets/images/placeholders/#{filename}")
      missing_files << filename unless File.exist?(path)
    end

    if missing_files.empty?
      puts "✅ All placeholder images found"
    else
      puts "❌ Missing placeholder images: #{missing_files.join(', ')}"
    end
  end
end
