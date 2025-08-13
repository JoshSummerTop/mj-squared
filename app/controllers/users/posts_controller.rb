module Users
  class PostsController < ApplicationController
    before_action :authenticate_user!

    def index
      @user = current_user
      @joined_spaces = @user.spaces.distinct
      @created_spaces = Space.where(created_by: @user)
      @comments = @user.comments.includes(:post)
      @posts = Post.where(created_by: @user).includes(:space)
    end
  end
end
