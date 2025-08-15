module ImageHelper
  include GravatarHelper
  # Render optimized space image with proper fallbacks and lazy loading
  def space_image_tag(space, size: "400x300", css_class: "w-full h-48 object-cover rounded-lg")
    if space.image.attached?
      # Use optimized variant for better performance
      image_tag(
        space.image.variant(resize_to_fill: size.split('x').map(&:to_i), quality: 85),
        alt: space.title,
        class: css_class,
        loading: "lazy",
        onerror: "this.src='#{asset_path('placeholders/placeholder.jpg')}'"
      )
    else
      # Fallback to available placeholder images
      placeholder_images = ['placeholder.jpg', 'placeholder_2.jpg', 'placeholder_3.jpg']
      selected_placeholder = placeholder_images.sample
      
      image_tag(
        "placeholders/#{selected_placeholder}",
        alt: space.title,
        class: css_class,
        loading: "lazy"
      )
    end
  end

  # Render user avatar with optimized sizing
  def user_avatar_tag(user, size: 40, css_class: "rounded-full")
    if user.avatar.attached?
      image_tag(
        user.avatar.variant(resize_to_fill: [size, size], quality: 85),
        alt: user.name,
        class: css_class,
        loading: "lazy"
      )
    else
      # Use Gravatar as fallback
      image_tag(
        gravatar_url_for(user.email, size: size),
        alt: user.name,
        class: css_class,
        loading: "lazy"
      )
    end
  end

  # Optimized image variants for different screen sizes
  def responsive_space_image(space)
    return nil unless space.image.attached?

    {
      small: space.image.variant(resize_to_fill: [300, 200], quality: 80),
      medium: space.image.variant(resize_to_fill: [600, 400], quality: 85),
      large: space.image.variant(resize_to_fill: [1200, 800], quality: 90)
    }
  end
end
