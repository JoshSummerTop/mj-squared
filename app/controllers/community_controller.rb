class CommunityController < ApplicationController
  def index
    @categories = CommunityCategory.joins(:spaces).distinct

    # Set defaults if no parameters are present
    params[:tab] = 'all' if params[:tab].blank?
    params[:age_group] = 'all' if params[:age_group].blank?

    # Handle single category selection
    selected_category = CommunityCategory.find_by(slug: params[:tab]) if params[:tab].present? && params[:tab] != 'all'

    # Handle single age group selection  
    selected_age_group = AgeGroupCategory.find_by(slug: params[:age_group]) if params[:age_group].present? && params[:age_group] != 'all'

    @spaces = Space.includes(:community_categories, :age_group_categories, :memberships)
    
    # Apply filters based on selections
    if selected_category && selected_age_group
      @spaces = @spaces.joins(:community_categories, :age_group_categories)
                       .where(community_categories: { id: selected_category.id })
                       .where(age_group_categories: { id: selected_age_group.id })
    elsif selected_category
      @spaces = @spaces.joins(:community_categories)
                       .where(community_categories: { id: selected_category.id })
    elsif selected_age_group
      @spaces = @spaces.joins(:age_group_categories)
                       .where(age_group_categories: { id: selected_age_group.id })
    end
    @spaces = @spaces.order(created_at: :desc).distinct

    # Age groups available based on selected categories
    if selected_category
      @age_groups = AgeGroupCategory.joins(spaces: :community_categories)
                                   .where(community_categories: { id: selected_category.id })
                                   .distinct
    else
      @age_groups = AgeGroupCategory.joins(:spaces).distinct
    end

    # Joined spaces filtered by selected categories
    if current_user
      @joined_spaces = current_user.spaces
      if selected_category
        @joined_spaces = @joined_spaces.joins(:community_categories)
                                      .where(community_categories: { id: selected_category.id })
      end
      @joined_spaces = @joined_spaces.distinct
    else
      @joined_spaces = []
    end
  end
end







