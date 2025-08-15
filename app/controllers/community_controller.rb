class CommunityController < ApplicationController
  def index
    @categories = CommunityCategory.all

    # Set defaults if no parameters are present
    params[:tab] = 'all' if params[:tab].blank?
    params[:age_group] = 'all' if params[:age_group].blank?

    # Clean pagination setup
    @selected_category = CommunityCategory.find_by(slug: params[:tab]) if params[:tab] != 'all'
    @selected_age_group = AgeGroupCategory.find_by(slug: params[:age_group]) if params[:age_group] != 'all'

    # Manual pagination (bypassing pagy configuration issues)
    page = (params[:page] || 1).to_i
    per_page = 10
    
    all_spaces = filtered_spaces
    total_count = all_spaces.count
    
    @spaces = all_spaces.limit(per_page).offset((page - 1) * per_page)
    
    # Create pagy-compatible object for templates
    require 'ostruct'
    @pagy = OpenStruct.new(
      page: page,
      count: total_count,
      from: (page - 1) * per_page + 1,
      to: [page * per_page, total_count].min,
      next: (page * per_page < total_count) ? page + 1 : nil
    )

    # Age groups available based on selected categories
    if @selected_category
      @age_groups = AgeGroupCategory.joins("INNER JOIN age_group_categories_spaces ags ON ags.age_group_category_id = age_group_categories.id")
                                   .joins("INNER JOIN community_categories_spaces ccs ON ccs.space_id = ags.space_id") 
                                   .where("ccs.community_category_id = ?", @selected_category.id)
                                   .select("age_group_categories.*, CASE name 
                                           WHEN 'Early Intervention (0-3)' THEN 1
                                           WHEN 'Preschool (3-5)' THEN 2
                                           WHEN 'Elementary (6-11)' THEN 3
                                           WHEN 'Middle School (12-14)' THEN 4
                                           WHEN 'High School (15-18)' THEN 5
                                           WHEN 'Young Adults (18+)' THEN 6
                                           ELSE 7
                                         END as sort_order")
                                   .distinct
                                   .order(Arel.sql("sort_order"))
    else
      @age_groups = AgeGroupCategory.all.select("age_group_categories.*, CASE name 
                                               WHEN 'Early Intervention (0-3)' THEN 1
                                               WHEN 'Preschool (3-5)' THEN 2
                                               WHEN 'Elementary (6-11)' THEN 3
                                               WHEN 'Middle School (12-14)' THEN 4
                                               WHEN 'High School (15-18)' THEN 5
                                               WHEN 'Young Adults (18+)' THEN 6
                                               ELSE 7
                                             END as sort_order")
                                   .order(Arel.sql("sort_order"))
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







