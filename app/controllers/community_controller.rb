class CommunityController < ApplicationController
  def index
    @categories = CommunityCategory.joins(:spaces).distinct

    selected_category_slug = params[:tab]
    selected_category = CommunityCategory.find_by(slug: selected_category_slug) if selected_category_slug.present?
    selected_age_group_slug = params[:age_group]
    selected_age_group = AgeGroupCategory.find_by(slug: selected_age_group_slug) if selected_age_group_slug.present?

    @spaces = Space.includes(:community_categories, :age_group_categories, :memberships)
    if selected_category && selected_age_group
      @spaces = @spaces.joins(:community_categories, :age_group_categories)
                       .where(community_categories: { id: selected_category.id }, age_group_categories: { id: selected_age_group.id })
    elsif selected_category
      @spaces = @spaces.joins(:community_categories)
                       .where(community_categories: { id: selected_category.id })
    elsif selected_age_group
      @spaces = @spaces.joins(:age_group_categories)
                       .where(age_group_categories: { id: selected_age_group.id })
    end
    @spaces = @spaces.order(created_at: :desc).distinct

    if selected_category
      @age_groups = AgeGroupCategory.joins(spaces: :community_categories)
                                   .where(community_categories: { id: selected_category.id })
                                   .distinct
    else
      @age_groups = AgeGroupCategory.joins(:spaces).distinct
    end

    if current_user
      @joined_spaces = current_user.spaces
      @joined_spaces = @joined_spaces.joins(:community_categories).where(community_categories: { id: selected_category.id }) if selected_category
      @joined_spaces = @joined_spaces.distinct
    else
      @joined_spaces = []
    end
  end
end

