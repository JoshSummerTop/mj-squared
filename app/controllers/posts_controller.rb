class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy, :like, :unlike]
  before_action :set_space, only: [:index, :new, :create]
  before_action :authenticate_user!, except: [:show]

  def show
    @space = @post.space
    @comments = @post.comments.includes(:user)
    @like = current_user&.likes&.find_by(post: @post) if user_signed_in?
  end

  def index
    @posts = @space.posts.includes(:created_by, :age_group_categories, :likes)
  end

  def new
    @post = @space.posts.new
  end

  def create
    @post = @space.posts.new(post_params.except(:age_group_category_ids))
    @post.created_by = current_user
    @post.age_group_category_ids = @space.age_group_category_ids
    if @post.save
      redirect_to @post, notice: 'Post created.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    # Simple authorization: only creator can edit
    redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
  end

  def update
    # Simple authorization: only creator can edit
    return redirect_to @post, alert: 'Not authorized' unless @post.created_by == current_user
    
    if @post.update(post_params.except(:age_group_category_ids))
      @post.age_group_category_ids = @post.space.age_group_category_ids
      redirect_to @post, notice: 'Post updated.'
    else
      render :edit, status: :unprocessable_entity
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
    @like = current_user.likes.find_by(post: @post)
    respond_to do |format|
      format.turbo_stream { render 'like_actions' }
      format.html { redirect_to @post }
    end
  end

  def unlike
    @post.likes.where(user: current_user).destroy_all
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

  def post_params
    params.require(:post).permit(:title, :content, :image)
  end
end

