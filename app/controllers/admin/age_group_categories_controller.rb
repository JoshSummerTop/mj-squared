class Admin::AgeGroupCategoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin!
  before_action :set_age_group_category, only: [:edit, :update, :destroy]

  def index
    @age_group_categories = AgeGroupCategory.all
    @age_group_category = AgeGroupCategory.new
  end

  def new
    @age_group_category = AgeGroupCategory.new
  end

  def create
    @age_group_category = AgeGroupCategory.new(age_group_category_params)
    if @age_group_category.save
      redirect_to admin_age_group_categories_path, notice: 'Age group category created successfully.'
    else
      @age_group_categories = AgeGroupCategory.all
      render :index, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @age_group_category.update(age_group_category_params)
      redirect_to admin_age_group_categories_path, notice: 'Age group category updated successfully.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    if @age_group_category.spaces.any?
      redirect_to admin_age_group_categories_path, alert: "Cannot delete category with #{@age_group_category.spaces.count} assigned spaces."
    else
      @age_group_category.destroy
      redirect_to admin_age_group_categories_path, notice: 'Age group category deleted.'
    end
  end

  private

  def set_age_group_category
    @age_group_category = AgeGroupCategory.friendly.find(params[:id])
  end

  def age_group_category_params
    params.require(:age_group_category).permit(:name)
  end

  def require_admin!
    redirect_to root_path, alert: 'Admins only.' unless current_user&.admin?
  end
end
