class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy, :like, :unlike]
  before_action :set_space, only: [:new, :create]
  before_action :set_space_if_present, only: [:index]
  before_action :authenticate_user!, except: [:show, :index]

  def show
    @space = @post.space
    @comments = @post.comments.includes(:user)
    @like = current_user&.likes&.find_by(post: @post) if user_signed_in?
  end

  def index
    # Pagination for infinite scroll
    page = (params[:page] || 1).to_i
    per_page = 10
    
    if @space.present?
      # When accessed through a space (e.g., /spaces/1/posts)
      @posts = @space.posts.includes(:created_by, :age_group_categories, :likes, :space)
                     .order(created_at: :desc)
      @page_title = "Posts in #{@space.title}"
      
      # Get total for pagination
      total_posts = @posts.count
      @posts = @posts.offset((page - 1) * per_page).limit(per_page)
    else
      # When accessed directly for all community activity (e.g., /posts)
      @posts = Post.includes(:created_by, :age_group_categories, :likes, :space)
                  .order(created_at: :desc)
      @page_title = "All Community Activity"
      
      # Get total for pagination  
      total_posts = @posts.count
      @posts = @posts.offset((page - 1) * per_page).limit(per_page)
    end
    
    @current_page = page
    @has_more_pages = (page * per_page) < total_posts
  end

  def new
    @post = @space.posts.new
  end

  def create
    @post = @space.posts.new(post_params.except(:age_group_category_ids))
    @post.created_by = current_user
    @post.age_group_category_ids = @space.age_group_category_ids
    
    respond_to do |format|
      if @post.save
        format.html { redirect_to @post, notice: 'Post created.' }
        format.turbo_stream
      else
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def edit
    # Simple authorization: only creator can edit
    redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
  end

  def update
    # Simple authorization: only creator can edit
    return redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
    
    respond_to do |format|
      if @post.update(post_params.except(:age_group_category_ids))
        @post.age_group_category_ids = @post.space.age_group_category_ids
        format.html { redirect_to @post, notice: 'Post updated.' }
        format.turbo_stream
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def destroy
    # Simple authorization: only creator can delete
    return redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
    
    space = @post.space
    @post.destroy
    redirect_to space_path(space), notice: 'Post deleted.'
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


