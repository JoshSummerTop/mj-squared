class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_comment, only: [:edit, :update, :destroy]
  before_action :authorize_comment, only: [:edit, :update, :destroy]

  def create
    @post = Post.friendly.find(params[:post_id])
    @comment = @post.comments.new(comment_params)
    @comment.user = current_user
    if @comment.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to @post, notice: 'Comment added.' }
      end
    else
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace('comment_form', partial: 'comments/form', locals: { post: @post, comment: @comment }) }
        format.html { redirect_to @post, alert: 'Could not add comment.' }
      end
    end
  end

  def edit
    respond_to do |format|
      format.turbo_stream
      format.html
    end
  end

  def update
    if @comment.update(comment_params)
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to @comment.post, notice: 'Comment updated.' }
      end
    else
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace(dom_id(@comment, :form), partial: 'comments/form', locals: { post: @comment.post, comment: @comment }) }
        format.html { redirect_to @comment.post, alert: 'Could not update comment.' }
      end
    end
  end

  def destroy
    comment_id = @comment.id
    @comment.destroy
    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to @comment.post, notice: 'Comment deleted.' }
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content)
  end

  def set_comment
    @comment = Comment.find(params[:id])
  end

  def authorize_comment
    # Simple authorization: only creator or admin can modify
    unless current_user == @comment.user || current_user.admin?
      head :forbidden
    end
  end
end







