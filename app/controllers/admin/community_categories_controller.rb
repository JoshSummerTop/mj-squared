class Admin::CommunityCategoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!
  before_action :set_community_category, only: [:edit, :update, :destroy]

  def index
    @community_categories = CommunityCategory.all
    @community_category = CommunityCategory.new
  end

  def new
    @community_category = CommunityCategory.new
  end

  def create
    @community_category = CommunityCategory.new(community_category_params)
    if @community_category.save
      redirect_to admin_community_categories_path, notice: 'Community category created successfully.'
    else
      @community_categories = CommunityCategory.all
      render :index, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @community_category.update(community_category_params)
      redirect_to admin_community_categories_path, notice: 'Community category updated successfully.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    if @community_category.spaces.any?
      redirect_to admin_community_categories_path, alert: "Cannot delete category with #{@community_category.spaces.count} assigned spaces."
    else
      @community_category.destroy
      redirect_to admin_community_categories_path, notice: 'Community category deleted.'
    end
  end

  private

  def set_community_category
    @community_category = CommunityCategory.friendly.find(params[:id])
  end

  def community_category_params
    params.require(:community_category).permit(:name)
  end

  def require_admin!
    redirect_to root_path, alert: 'Admins only.' unless current_user&.admin?
  end
end