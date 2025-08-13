class CommunityController < ApplicationController
  def index
    @categories = CommunityCategory.all

    # Set defaults if no parameters are present
    params[:tab] = 'all' if params[:tab].blank?
    params[:age_group] = 'all' if params[:age_group].blank?

    # Handle single category selection
    selected_category = CommunityCategory.find_by(slug: params[:tab]) if params[:tab].present? && params[:tab] != 'all'

    # Handle single age group selection  
    selected_age_group = AgeGroupCategory.find_by(slug: params[:age_group]) if params[:age_group].present? && params[:age_group] != 'all'

    @spaces = Space.includes(:community_categories, :age_group_categories, :memberships)
    
    # Apply filters using WHERE EXISTS to avoid association pollution
    if selected_category && selected_age_group
      @spaces = @spaces.where("EXISTS (SELECT 1 FROM community_categories_spaces WHERE space_id = spaces.id AND community_category_id = ?)", selected_category.id)
                       .where("EXISTS (SELECT 1 FROM age_group_categories_spaces WHERE space_id = spaces.id AND age_group_category_id = ?)", selected_age_group.id)
    elsif selected_category
      @spaces = @spaces.where("EXISTS (SELECT 1 FROM community_categories_spaces WHERE space_id = spaces.id AND community_category_id = ?)", selected_category.id)
    elsif selected_age_group
      @spaces = @spaces.where("EXISTS (SELECT 1 FROM age_group_categories_spaces WHERE space_id = spaces.id AND age_group_category_id = ?)", selected_age_group.id)
    end
    
    # Pagination for infinite scroll
    page = (params[:page] || 1).to_i
    per_page = 10
    
    # Apply ordering first, then get count and pagination
    @spaces = @spaces.order(created_at: :desc)
    total_spaces = @spaces.distinct.count
    
    # Apply pagination
    @spaces = @spaces.distinct.offset((page - 1) * per_page).limit(per_page)
    @current_page = page
    
    # Check if there are more pages
    @has_more_pages = (page * per_page) < total_spaces

    # Age groups available based on selected categories (simplified)
    if selected_category
      @age_groups = AgeGroupCategory.joins("INNER JOIN age_group_categories_spaces ags ON ags.age_group_category_id = age_group_categories.id")
                                   .joins("INNER JOIN community_categories_spaces ccs ON ccs.space_id = ags.space_id") 
                                   .where("ccs.community_category_id = ?", selected_category.id)
                                   .distinct
    else
      @age_groups = AgeGroupCategory.all
    end

    # Joined spaces filtered by selected categories
    if current_user
      @joined_spaces = current_user.spaces.includes(:community_categories, :age_group_categories, :memberships)
      if selected_category
        @joined_spaces = @joined_spaces.where("EXISTS (SELECT 1 FROM community_categories_spaces WHERE space_id = spaces.id AND community_category_id = ?)", selected_category.id)
      end
      @joined_spaces = @joined_spaces.distinct
    else
      @joined_spaces = []
    end
  end
end







