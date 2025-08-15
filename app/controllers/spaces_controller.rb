class SpacesController < ApplicationController
  before_action :set_space, only: [:show, :edit, :update, :destroy, :join, :leave]
  before_action :authenticate_user!, except: [:show]

  def show
    @posts_relation = @space.posts.includes(:created_by, :age_group_categories, :likes)
                                  .order(created_at: :desc)
    
    # Manual pagination (bypassing pagy configuration issues)
    page = (params[:page] || 1).to_i
    per_page = 10
    total_count = @posts_relation.count
    
    @posts = @posts_relation.limit(per_page).offset((page - 1) * per_page)
    
    # Create pagy-compatible object for templates
    require 'ostruct'
    @pagy = OpenStruct.new(
      page: page,
      count: total_count,
      from: (page - 1) * per_page + 1,
      to: [page * per_page, total_count].min,
      next: (page * per_page < total_count) ? page + 1 : nil
    )
    
    @membership = current_user&.memberships&.find_by(space: @space) if user_signed_in?
    
    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def new
    @space = Space.new
    
    respond_to do |format|
      format.html # renders new.html.erb (for modal)
    end
  end

  def create
    @space = Space.new(space_params)
    @space.created_by = current_user
    
    respond_to do |format|
      if @space.save
        @space.age_group_category_ids = params[:space][:age_group_category_ids] if params[:space][:age_group_category_ids]
        # Add creator as member automatically 
        @space.memberships.create!(user: current_user)
        
        format.html { redirect_to root_path, notice: 'Space created successfully.' }
        format.turbo_stream { render :create_success }
      else
        # Re-render the form with errors in the modal turbo_frame
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream { render :create_error, status: :unprocessable_entity }
      end
    end
  end

  def edit
    # Simple authorization: only creator can edit
    redirect_to @space, alert: 'Not authorized' unless @space.created_by == current_user
    
    respond_to do |format|
      format.html { render 'edit_modal' }
    end
  end

  def update
    # Simple authorization: only creator can edit
    return redirect_to @space, alert: 'Not authorized' unless @space.created_by == current_user
    
    respond_to do |format|
      if @space.update(space_params)
        @space.age_group_category_ids = params[:space][:age_group_category_ids] || []
        @space.community_category_ids = params[:space][:community_category_ids] || [] if params[:space].key?(:community_category_ids)
        format.html { redirect_to @space, notice: 'Space updated.' }
        format.turbo_stream { render :update_success }
      else
        format.html { render 'edit_modal', status: :unprocessable_entity }
        format.turbo_stream { render :update_error, status: :unprocessable_entity }
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







