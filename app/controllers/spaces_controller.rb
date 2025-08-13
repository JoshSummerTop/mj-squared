class SpacesController < ApplicationController
  before_action :set_space, only: [:show, :edit, :update, :destroy, :join, :leave]
  before_action :authenticate_user!, except: [:show]

  def show
    # Pagination for infinite scroll (matching existing pattern)
    page = (params[:page] || 1).to_i
    per_page = 10
    
    @posts = @space.posts.includes(:created_by, :age_group_categories, :likes)
                   .order(created_at: :desc)
    
    # Get total for pagination
    total_posts = @posts.count
    @posts = @posts.offset((page - 1) * per_page).limit(per_page)
    
    @current_page = page
    @has_more_pages = (page * per_page) < total_posts
    
    @membership = current_user&.memberships&.find_by(space: @space) if user_signed_in?
  end

  def new
    @space = Space.new
  end

  def create
    @space = Space.new(space_params)
    @space.created_by = current_user
    
    respond_to do |format|
      if @space.save
        @space.age_group_category_ids = params[:space][:age_group_category_ids] if params[:space][:age_group_category_ids]
        format.html { redirect_to @space, notice: 'Space created successfully.' }
        format.turbo_stream
      else
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def edit
    # Simple authorization: only creator can edit
    redirect_to @space, alert: 'Not authorized' unless @space.created_by == current_user
  end

  def update
    # Simple authorization: only creator can edit
    return redirect_to @space, alert: 'Not authorized' unless @space.created_by == current_user
    
    respond_to do |format|
      if @space.update(space_params)
        @space.age_group_category_ids = params[:space][:age_group_category_ids] || []
        @space.community_category_ids = params[:space][:community_category_ids] || [] if params[:space].key?(:community_category_ids)
        format.html { redirect_to @space, notice: 'Space updated.' }
        format.turbo_stream
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def destroy
    # Simple authorization: only creator can delete
    return redirect_to @space, alert: 'Not authorized' unless @space.created_by == current_user
    
    @space.destroy
    redirect_to root_path, notice: 'Space deleted.'
  end

  def join
    @space.memberships.find_or_create_by(user: current_user)
    @space.reload
    current_user&.memberships&.reload # Reload just the memberships association
    @membership = current_user&.memberships&.find_by(space: @space)
    respond_to do |format|
      format.turbo_stream { render 'membership_actions' }
      format.html { redirect_to @space, notice: 'You joined this space.' }
    end
  end

  def leave
    @space.memberships.where(user: current_user).destroy_all
    @space.reload
    current_user&.memberships&.reload # Reload just the memberships association
    @membership = current_user&.memberships&.find_by(space: @space)
    respond_to do |format|
      format.turbo_stream { render 'membership_actions' }
      format.html { redirect_to @space, notice: 'You left this space.' }
    end
  end

  def index
    @spaces = Space.all
  end

  private

  def set_space
    @space = Space.friendly.find(params[:id])
  end

  def space_params
    params.require(:space).permit(:title, :description, :image, age_group_category_ids: [], community_category_ids: [])
  end
end







