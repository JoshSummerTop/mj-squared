class CommunityController < ApplicationController
  def index
    @categories = CommunityCategory.all

    # Set defaults if no parameters are present
    params[:tab] = 'all' if params[:tab].blank?
    params[:age_group] = 'all' if params[:age_group].blank?

    # NEW: Clean, production-grade pagination (no more legacy code)
    @selected_category = CommunityCategory.find_by(slug: params[:tab]) if params[:tab].present? && params[:tab] != 'all'
    @selected_age_group = AgeGroupCategory.find_by(slug: params[:age_group]) if params[:age_group].present? && params[:age_group] != 'all'

    @spaces = filtered_spaces
    @pagy, @spaces = pagy(@spaces, items: 12)

    # Age groups available based on selected categories
    if @selected_category
      @age_groups = AgeGroupCategory.joins("INNER JOIN age_group_categories_spaces ags ON ags.age_group_category_id = age_group_categories.id")
                                   .joins("INNER JOIN community_categories_spaces ccs ON ccs.space_id = ags.space_id") 
                                   .where("ccs.community_category_id = ?", @selected_category.id)
                                   .distinct
    else
      @age_groups = AgeGroupCategory.all
    end

    # Joined spaces filtered by selected categories
    if current_user
      @joined_spaces = current_user.spaces.includes(:community_categories, :age_group_categories, :memberships)
      if @selected_category
        @joined_spaces = @joined_spaces.joins(:community_categories).where(community_categories: {id: @selected_category.id})
      end
      @joined_spaces = @joined_spaces.distinct
    else
      @joined_spaces = []
    end

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  private

  def filtered_spaces
    spaces = Space.includes(:community_categories, :age_group_categories, :memberships)
                  .order(created_at: :desc)

    # Apply filters using clean approach
    spaces = spaces.joins(:community_categories).where(community_categories: {id: @selected_category.id}) if @selected_category
    spaces = spaces.joins(:age_group_categories).where(age_group_categories: {id: @selected_age_group.id}) if @selected_age_group

    spaces.distinct
  end
end







