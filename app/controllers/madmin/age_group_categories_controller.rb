module Madmin
  class AgeGroupCategoriesController < Madmin::ResourceController
    def destroy
      @record = resource.model.find(params[:id])
      
      if @record.spaces.exists? || @record.posts.exists?
        redirect_to madmin_age_group_categories_path, alert: "Cannot delete age group while it is assigned to spaces or posts."
      else
        @record.destroy
        redirect_to madmin_age_group_categories_path, notice: "Age group category deleted successfully."
      end
    end
  end
end
