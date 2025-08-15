class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy, :like, :unlike]
  before_action :set_space, only: [:new, :create]
  before_action :set_space_if_present, only: [:index]
  before_action :authenticate_user!, except: [:show, :index]

  def show
    @space = @post.space
    @comments = @post.comments.includes(:user).order(created_at: :desc)
    @like = current_user&.likes&.find_by(post: @post) if user_signed_in?
  end

  def index
    if @space.present?
      # When accessed through a space (e.g., /spaces/1/posts)
      @posts_relation = @space.posts.includes(:created_by, :age_group_categories, :likes, :space)
                                    .order(created_at: :desc)
      @page_title = "Posts in #{@space.title}"
    else
      # When accessed directly for all community activity (e.g., /posts)
      @posts_relation = Post.includes(:created_by, :age_group_categories, :likes, :space)
                           .order(created_at: :desc)
      @page_title = "All Community Activity"
    end
    
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
    
    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def new
    @post = @space.posts.new
    
    respond_to do |format|
      format.html # renders new.html.erb (for modal)
    end
  end

  def create
    @post = @space.posts.new(post_params.except(:age_group_category_ids))
    @post.created_by = current_user
    @post.age_group_category_ids = @space.age_group_category_ids
    
    respond_to do |format|
      if @post.save
        format.html { redirect_to @post, notice: 'Post created successfully.' }
        format.turbo_stream { 
          flash[:notice] = 'Post created successfully.'
          render :create_success 
        }
      else
        # Re-render the form with errors in the modal turbo_frame
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream { render :create_error, status: :unprocessable_entity }
      end
    end
  end

  def edit
    # Simple authorization: only creator can edit
    redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
    
    respond_to do |format|
      format.html { render 'edit_modal' }
    end
  end

  def update
    # Simple authorization: only creator can edit
    return redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
    
    respond_to do |format|
      if @post.update(post_params.except(:age_group_category_ids))
        @post.age_group_category_ids = @post.space.age_group_category_ids
        format.html { redirect_to @post, notice: 'Post updated successfully.' }
        format.turbo_stream { 
          flash[:notice] = 'Post updated successfully.'
          render :update_success 
        }
      else
        format.html { render 'edit_modal', status: :unprocessable_entity }
        format.turbo_stream { render :update_error, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    # Simple authorization: only creator can delete
    return redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
    
    space = @post.space
    if @post.destroy
      respond_to do |format|
        format.html { redirect_to space_path(space), notice: 'Post deleted successfully.' }
        format.turbo_stream { 
        flash[:notice] = 'Post deleted successfully.'
        render :destroy 
      }
      end
    else
      respond_to do |format|
        format.html { redirect_to @post, alert: "Failed to delete post: #{@post.errors.full_messages.join(', ')}" }
        format.turbo_stream { render :destroy_error }
      end
    end
  end

  def like
    @post.likes.find_or_create_by(user: current_user)
    @post.reload  # Reload to get updated likes count
    @like = current_user.likes.find_by(post: @post)
    respond_to do |format|
      format.turbo_stream { render 'like_actions' }
      format.html { redirect_to @post }
    end
  end

  def unlike
    @post.likes.where(user: current_user).destroy_all
    @post.reload  # Reload to get updated likes count
    @like = current_user.likes.find_by(post: @post)
    respond_to do |format|
      format.turbo_stream { render 'like_actions' }
      format.html { redirect_to @post }
    end
  end

  private

  def set_post
    @post = Post.friendly.find(params[:id])
  end

  def set_space
    @space = Space.friendly.find(params[:space_id])
  end

  def set_space_if_present
    @space = Space.friendly.find(params[:space_id]) if params[:space_id].present?
  end

  def post_params
    params.require(:post).permit(:title, :content, :image)
  end
end


