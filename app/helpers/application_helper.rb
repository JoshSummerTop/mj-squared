module ApplicationHelper
  include Pagy::Frontend
  include RichComposerHelper
  
  # Check if current user can edit/delete a post
  def can_manage_post?(post)
    user_signed_in? && (post.created_by == current_user || post.space.created_by == current_user)
  end
  
  # Check if current user can edit/delete a comment
  def can_manage_comment?(comment)
    user_signed_in? && comment.user == current_user
  end
end
